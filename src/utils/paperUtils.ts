import { QuestionPaper, Question, Section, BlueprintMatrixItem } from '../types';

/**
 * Recalculate total marks across all questions in the paper
 */
export function calculateTotalMarks(paper: QuestionPaper): number {
  return paper.sections.reduce((total, section) => {
    return total + section.questions.reduce((secTotal, q) => secTotal + (Number(q.marks) || 0), 0);
  }, 0);
}

/**
 * Renumber all questions continuously from 1 to N across all sections
 */
export function renumberQuestions(sections: Section[]): Section[] {
  let currentNum = 1;
  return sections.map((sec) => ({
    ...sec,
    questions: sec.questions.map((q) => ({
      ...q,
      questionNumber: currentNum++,
    })),
  }));
}

/**
 * Create shuffled versions of the paper for Set A, Set B, Set C
 */
export function generatePaperSet(basePaper: QuestionPaper, setLabel: 'Set A' | 'Set B' | 'Set C'): QuestionPaper {
  if (setLabel === 'Set A') {
    return {
      ...basePaper,
      id: `${basePaper.id}-set-a`,
      title: `${basePaper.title} (${setLabel})`,
      updatedAt: new Date().toISOString(),
      examDetails: {
        ...basePaper.examDetails,
        setLabel: 'Set A',
      },
    };
  }

  // Deterministic seed / shuffle for Set B and Set C
  const shuffledSections = basePaper.sections.map((section) => {
    const questions = [...section.questions];

    // Fisher-Yates shuffle variation
    if (setLabel === 'Set B') {
      // Reverse order or alternate
      for (let i = questions.length - 1; i > 0; i--) {
        const j = (i * 3 + 1) % (i + 1);
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
    } else if (setLabel === 'Set C') {
      for (let i = questions.length - 1; i > 0; i--) {
        const j = (i * 7 + 2) % (i + 1);
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
    }

    return {
      ...section,
      questions,
    };
  });

  const renumbered = renumberQuestions(shuffledSections);

  return {
    ...basePaper,
    id: `${basePaper.id}-${setLabel.toLowerCase().replace(' ', '-')}`,
    title: `${basePaper.title} (${setLabel})`,
    updatedAt: new Date().toISOString(),
    examDetails: {
      ...basePaper.examDetails,
      setLabel,
    },
    sections: renumbered,
  };
}

/**
 * Generate Blueprint Analysis Matrix (Marks distribution by chapter & question type)
 */
export function generateBlueprintMatrix(paper: QuestionPaper): BlueprintMatrixItem[] {
  const chapterMap: Record<string, BlueprintMatrixItem> = {};

  paper.sections.forEach((section) => {
    section.questions.forEach((q) => {
      const chapter = q.chapter || 'General / Unspecified';
      if (!chapterMap[chapter]) {
        chapterMap[chapter] = {
          chapter,
          mcqMarks: 0,
          vsaMarks: 0,
          saMarks: 0,
          laMarks: 0,
          caseMarks: 0,
          totalMarks: 0,
          questionCount: 0,
        };
      }

      const m = Number(q.marks) || 0;
      chapterMap[chapter].totalMarks += m;
      chapterMap[chapter].questionCount += 1;

      switch (q.type) {
        case 'mcq':
        case 'true_false':
        case 'fill_blank':
        case 'assertion_reason':
          chapterMap[chapter].mcqMarks += m;
          break;
        case 'vsa':
          chapterMap[chapter].vsaMarks += m;
          break;
        case 'sa':
          chapterMap[chapter].saMarks += m;
          break;
        case 'la':
          chapterMap[chapter].laMarks += m;
          break;
        case 'case_based':
          chapterMap[chapter].caseMarks += m;
          break;
        default:
          chapterMap[chapter].saMarks += m;
      }
    });
  });

  return Object.values(chapterMap).sort((a, b) => b.totalMarks - a.totalMarks);
}

/**
 * Storage helpers for saved papers in localStorage
 */
const STORAGE_KEY = 'ai_paper_drafter_saved_papers_v1';

export function loadSavedPapers(): QuestionPaper[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved papers from localStorage', e);
    return [];
  }
}

export function savePaperToStorage(paper: QuestionPaper): void {
  try {
    const existing = loadSavedPapers();
    const index = existing.findIndex((p) => p.id === paper.id);
    let updated: QuestionPaper[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...paper, updatedAt: new Date().toISOString() };
    } else {
      updated = [paper, ...existing];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save paper', e);
  }
}

export function deletePaperFromStorage(paperId: string): QuestionPaper[] {
  try {
    const existing = loadSavedPapers();
    const updated = existing.filter((p) => p.id !== paperId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete paper', e);
    return [];
  }
}
