export type QuestionType =
  | 'mcq'
  | 'fill_blank'
  | 'true_false'
  | 'assertion_reason'
  | 'vsa' // Very Short Answer (1-2 marks)
  | 'sa'  // Short Answer (3 marks)
  | 'la'  // Long Answer (4-5 marks)
  | 'case_based'; // Case / Source-based question (4-5 marks with subparts)

export interface SubQuestion {
  id: string;
  label: string; // e.g. "(i)", "(ii)", "(a)"
  text: string;
  marks: number;
  answer?: string;
}

export interface Question {
  id: string;
  questionNumber: number;
  type: QuestionType;
  text: string;
  chapter?: string;
  options?: string[]; // 4 options for MCQ
  assertion?: string; // For Assertion-Reason
  reason?: string;    // For Assertion-Reason
  subQuestions?: SubQuestion[]; // For Case-Based questions
  marks: number;
  answer: string;
  markingScheme?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface Section {
  id: string;
  name: string; // e.g. "SECTION A", "SECTION B"
  description?: string; // e.g. "Objective Type Questions (1 Mark each)"
  questions: Question[];
}

export interface ExamDetails {
  schoolName: string;
  examName: string;
  grade: string;
  board: string;
  subject: string;
  session?: string;
  durationFormatted: string;
  maxMarks: number;
  generalInstructions: string[];
  setLabel?: string; // "Set A", "Set B", "Set C" or ""
}

export interface QuestionPaper {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  examDetails: ExamDetails;
  sections: Section[];
  includeAnswerKey: boolean;
  includeMarkingScheme: boolean;
  notes?: string;
}

export interface PaperFormData {
  schoolName: string;
  grade: string;
  board: string;
  subject: string;
  customSubject?: string;
  examType: string;
  customExamType?: string;
  chapters: string[];
  currentChapterInput: string;
  totalMarks: number;
  customMarks?: number;
  duration: string;
  customDuration?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  selectedQuestionTypes: QuestionType[];
  questionCounts: Partial<Record<QuestionType, number>>;
  includeAnswerKey: boolean;
  includeMarkingScheme: boolean;
  additionalInstructions: string;
}

export interface BlueprintMatrixItem {
  chapter: string;
  mcqMarks: number;
  vsaMarks: number;
  saMarks: number;
  laMarks: number;
  caseMarks: number;
  totalMarks: number;
  questionCount: number;
}
