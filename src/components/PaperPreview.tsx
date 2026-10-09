import React, { useState } from 'react';
import {
  FileText,
  KeyRound,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Plus,
  Shuffle,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  Sliders,
  Settings2,
} from 'lucide-react';
import { QuestionPaper, Question, Section } from '../types';
import { calculateTotalMarks, generatePaperSet } from '../utils/paperUtils';
import { ExportMenu } from './ExportMenu';
import { QuestionEditorModal } from './QuestionEditorModal';

interface PaperPreviewProps {
  paper: QuestionPaper;
  onUpdatePaper: (updated: QuestionPaper) => void;
  onRegenerateEntirePaper: () => void;
  onRegenerateSingleQuestion: (question: Question) => Promise<void>;
  isRegeneratingSingle?: boolean;
  onNotification?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const PaperPreview: React.FC<PaperPreviewProps> = ({
  paper,
  onUpdatePaper,
  onRegenerateEntirePaper,
  onRegenerateSingleQuestion,
  isRegeneratingSingle = false,
  onNotification,
}) => {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(paper.includeAnswerKey);
  const [showMarkingScheme, setShowMarkingScheme] = useState(paper.includeMarkingScheme);
  const [activeSet, setActiveSet] = useState<'Original' | 'Set A' | 'Set B' | 'Set C'>('Original');

  const totalCalculated = calculateTotalMarks(paper);
  const targetMarks = paper.examDetails.maxMarks;
  const isMarksBalanced = totalCalculated === targetMarks;

  // Question editing handlers
  const handleSaveQuestion = (updatedQ: Question) => {
    const updatedSections = paper.sections.map((sec) => ({
      ...sec,
      questions: sec.questions.map((q) => (q.id === updatedQ.id ? updatedQ : q)),
    }));
    onUpdatePaper({
      ...paper,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    });
    onNotification?.(`Updated question Q.${updatedQ.questionNumber}`, 'info');
  };

  const handleDeleteQuestion = (questionId: string) => {
    let renumberedSections = paper.sections.map((sec) => ({
      ...sec,
      questions: sec.questions.filter((q) => q.id !== questionId),
    }));

    // Continuous renumbering
    let num = 1;
    renumberedSections = renumberedSections.map((sec) => ({
      ...sec,
      questions: sec.questions.map((q) => ({
        ...q,
        questionNumber: num++,
      })),
    }));

    onUpdatePaper({
      ...paper,
      sections: renumberedSections,
      updatedAt: new Date().toISOString(),
    });
    onNotification?.('Question removed from paper', 'info');
  };

  const handleMoveQuestion = (sectionId: string, qIndex: number, direction: 'up' | 'down') => {
    const targetSecIndex = paper.sections.findIndex((s) => s.id === sectionId);
    if (targetSecIndex === -1) return;

    const section = paper.sections[targetSecIndex];
    const newQuestions = [...section.questions];

    if (direction === 'up' && qIndex > 0) {
      [newQuestions[qIndex], newQuestions[qIndex - 1]] = [newQuestions[qIndex - 1], newQuestions[qIndex]];
    } else if (direction === 'down' && qIndex < newQuestions.length - 1) {
      [newQuestions[qIndex], newQuestions[qIndex + 1]] = [newQuestions[qIndex + 1], newQuestions[qIndex]];
    } else {
      return;
    }

    const updatedSections = [...paper.sections];
    updatedSections[targetSecIndex] = { ...section, questions: newQuestions };

    // Continuous renumbering
    let num = 1;
    const finalSections = updatedSections.map((sec) => ({
      ...sec,
      questions: sec.questions.map((q) => ({
        ...q,
        questionNumber: num++,
      })),
    }));

    onUpdatePaper({
      ...paper,
      sections: finalSections,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddQuestionToSection = (sectionId: string) => {
    const targetSecIndex = paper.sections.findIndex((s) => s.id === sectionId);
    if (targetSecIndex === -1) return;

    const totalQuestionsCount = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      questionNumber: totalQuestionsCount + 1,
      type: 'sa',
      chapter: paper.examDetails.subject,
      text: 'Click "Edit" to customize this new question statement.',
      marks: 2,
      answer: 'Model answer for this question.',
      markingScheme: '1 mark for correct definition, 1 mark for explanation.',
      difficulty: 'Medium',
    };

    const updatedSections = [...paper.sections];
    updatedSections[targetSecIndex] = {
      ...updatedSections[targetSecIndex],
      questions: [...updatedSections[targetSecIndex].questions, newQuestion],
    };

    onUpdatePaper({
      ...paper,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    });
    setEditingQuestion(newQuestion);
  };

  const handleShuffleSet = (set: 'Set A' | 'Set B' | 'Set C') => {
    setActiveSet(set);
    const shuffled = generatePaperSet(paper, set);
    onUpdatePaper(shuffled);
    onNotification?.(`Switched to ${set} (Questions randomized)`, 'success');
  };

  const handleAddSection = () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const currentCount = paper.sections.length;
    const secLetter = letters[currentCount] || `SEC-${currentCount + 1}`;
    const newSection: Section = {
      id: `sec-${Date.now()}`,
      name: `SECTION ${secLetter}`,
      description: 'Additional Assessment Section',
      questions: [],
    };

    onUpdatePaper({
      ...paper,
      sections: [...paper.sections, newSection],
    });
    onNotification?.(`Added Section ${secLetter}`, 'info');
  };

  const handleDeleteSection = (sectionId: string) => {
    if (paper.sections.length <= 1) {
      onNotification?.('Cannot delete the only section in the paper', 'error');
      return;
    }
    const filtered = paper.sections.filter((s) => s.id !== sectionId);
    onUpdatePaper({
      ...paper,
      sections: filtered,
    });
    onNotification?.('Section removed', 'info');
  };

  return (
    <div className="space-y-4">
      {/* Paper Control Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center flex-wrap gap-2">
          {/* Paper Sets Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <span className="text-[11px] font-semibold text-slate-500 px-1.5 flex items-center gap-1">
              <Shuffle className="w-3 h-3" /> Set:
            </span>
            {(['Set A', 'Set B', 'Set C'] as const).map((set) => (
              <button
                key={set}
                onClick={() => handleShuffleSet(set)}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                  activeSet === set ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {set}
              </button>
            ))}
          </div>

          {/* Toggle Answer Key */}
          <button
            onClick={() => setShowAnswerKey(!showAnswerKey)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
              showAnswerKey
                ? 'bg-blue-50 text-blue-900 border-blue-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showAnswerKey ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Answer Key</span>
          </button>

          {/* Toggle Marking Scheme */}
          <button
            onClick={() => setShowMarkingScheme(!showMarkingScheme)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
              showMarkingScheme
                ? 'bg-blue-50 text-blue-900 border-blue-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Marking Scheme</span>
          </button>
        </div>

        {/* Export & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRegenerateEntirePaper}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Regenerate whole paper with new AI questions"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          <ExportMenu paper={paper} onNotification={onNotification} />
        </div>
      </div>

      {/* Marks Summary Strip */}
      <div
        className={`px-4 py-2.5 rounded-lg border flex items-center justify-between text-xs transition-colors ${
          isMarksBalanced ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-2">
          {isMarksBalanced ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>
            <strong>Marks Audit:</strong> Current Total:{' '}
            <span className="font-mono font-bold">{totalCalculated}</span> / Target:{' '}
            <span className="font-mono font-bold">{targetMarks}</span> Marks
            {!isMarksBalanced && (
              <span className="ml-2 font-normal text-amber-800">
                (Difference: {totalCalculated - targetMarks > 0 ? `+${totalCalculated - targetMarks}` : totalCalculated - targetMarks} marks)
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500 text-[11px]">
            {paper.sections.reduce((acc, s) => acc + s.questions.length, 0)} Total Questions
          </span>
          <button
            onClick={handleAddSection}
            className="text-xs font-medium text-blue-900 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add Section
          </button>
        </div>
      </div>

      {/* Realistic Examination Paper Sheet */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6 sm:p-10 font-serif text-slate-900 print:shadow-none print:border-none print:p-0 print:m-0">
        {/* Roll Number Box (Traditional Board Format) */}
        <div className="flex justify-between items-start mb-4 text-xs font-sans text-slate-600 print:mb-2">
          <div className="border border-slate-300 px-3 py-1 bg-slate-50 text-[11px] font-mono">
            {paper.examDetails.setLabel ? `CODE: ${paper.examDetails.setLabel.toUpperCase()}` : 'CODE: SET-A'}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Roll No.</span>
            <div className="flex border border-slate-400">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-5 h-6 border-r border-slate-400 last:border-r-0 bg-white" />
              ))}
            </div>
          </div>
        </div>

        {/* Paper Header Block */}
        <div className="text-center border-b-2 border-slate-900 pb-4 mb-5 print:pb-3">
          {paper.examDetails.schoolName ? (
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-slate-950 font-serif">
              {paper.examDetails.schoolName}
            </h1>
          ) : (
            <div className="text-xs text-slate-400 italic mb-1 font-sans">
              [Click to specify School / Institution Name]
            </div>
          )}

          <h2 className="text-base sm:text-lg font-semibold uppercase tracking-wide text-slate-900 mt-1">
            {paper.examDetails.examName}
            {paper.examDetails.session ? ` (${paper.examDetails.session})` : ''}
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs sm:text-sm font-sans font-medium text-slate-800 mt-2">
            <span>
              <strong>CLASS:</strong> {paper.examDetails.grade}
            </span>
            <span>·</span>
            <span>
              <strong>BOARD:</strong> {paper.examDetails.board}
            </span>
            <span>·</span>
            <span>
              <strong>SUBJECT:</strong> {paper.examDetails.subject.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm font-sans font-bold text-slate-900 mt-3 pt-2 border-t border-slate-300">
            <span>Time Allowed: {paper.examDetails.durationFormatted}</span>
            {paper.examDetails.setLabel && (
              <span className="text-blue-900 uppercase">[{paper.examDetails.setLabel}]</span>
            )}
            <span>Maximum Marks: {paper.examDetails.maxMarks}</span>
          </div>
        </div>

        {/* General Instructions */}
        {paper.examDetails.generalInstructions && paper.examDetails.generalInstructions.length > 0 && (
          <div className="mb-6 p-3.5 bg-slate-50/80 rounded-lg border border-slate-200 text-xs font-sans print:bg-transparent print:border-none print:p-0">
            <h4 className="font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center justify-between">
              <span>General Instructions:</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-700 leading-relaxed">
              {paper.examDetails.generalInstructions.map((inst, i) => (
                <li key={i} className="pl-1">
                  {inst}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Examination Sections */}
        <div className="space-y-8">
          {paper.sections.map((section, sIndex) => {
            const sectionTotalMarks = section.questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);

            return (
              <section key={section.id} className="relative group/section">
                {/* Section Header */}
                <div className="text-center mb-4 pb-1 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex-1 text-center">
                    <h3 className="text-sm sm:text-base font-bold uppercase tracking-widest text-slate-900 font-sans">
                      {section.name}
                    </h3>
                    {section.description && (
                      <p className="text-xs italic text-slate-600 mt-0.5 font-sans">
                        {section.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 print:hidden">
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {sectionTotalMarks} Marks
                    </span>
                    <button
                      onClick={() => handleAddQuestionToSection(section.id)}
                      className="p-1 text-blue-900 hover:bg-blue-50 rounded text-xs flex items-center gap-1 font-sans"
                      title="Add Question to this section"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Add Q</span>
                    </button>
                    {paper.sections.length > 1 && (
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Section Questions */}
                <div className="space-y-4">
                  {section.questions.map((question, qIndex) => (
                    <div
                      key={question.id}
                      className="relative pl-2 pr-2 py-1.5 rounded-lg hover:bg-slate-50/70 transition-colors group/question border border-transparent hover:border-slate-200 print:hover:bg-transparent print:border-none print:p-0 print:m-0"
                    >
                      {/* Question Content Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-slate-900 shrink-0 font-sans text-xs sm:text-sm">
                              Q.{question.questionNumber}
                            </span>
                            <div className="flex-1 text-xs sm:text-sm leading-relaxed text-slate-900">
                              <p className="font-serif whitespace-pre-line">{question.text}</p>

                              {/* Assertion - Reason Statements */}
                              {question.type === 'assertion_reason' && (
                                <div className="mt-2 space-y-1 pl-4 text-xs font-sans text-slate-800 bg-slate-50/50 p-2 rounded">
                                  {question.assertion && (
                                    <p>
                                      <strong>Assertion (A):</strong> {question.assertion}
                                    </p>
                                  )}
                                  {question.reason && (
                                    <p>
                                      <strong>Reason (R):</strong> {question.reason}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* MCQ Options */}
                              {question.options && question.options.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-2.5 pl-4 font-sans text-xs">
                                  {question.options.map((opt, optIdx) => (
                                    <div key={optIdx} className="flex items-start gap-1.5">
                                      <span className="font-bold text-slate-700">
                                        ({String.fromCharCode(97 + optIdx)})
                                      </span>
                                      <span className="text-slate-800">{opt}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Case-Based Sub-Questions */}
                              {question.subQuestions && question.subQuestions.length > 0 && (
                                <div className="mt-3 pl-4 space-y-2 font-sans text-xs border-l-2 border-slate-200">
                                  {question.subQuestions.map((sq) => (
                                    <div key={sq.id} className="flex items-start justify-between gap-2">
                                      <div>
                                        <span className="font-bold text-slate-800 mr-1.5">{sq.label}</span>
                                        <span className="text-slate-900">{sq.text}</span>
                                      </div>
                                      <span className="font-mono text-[11px] text-slate-600 font-bold shrink-0">
                                        [{sq.marks}]
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Marks Allotted Tag */}
                        <div className="shrink-0 flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-700 bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200/80 print:bg-transparent print:border-none">
                            [{question.marks}]
                          </span>

                          {/* Hover Actions Bar (Hidden on print) */}
                          <div className="opacity-0 group-hover/question:opacity-100 flex items-center gap-1 transition-opacity print:hidden">
                            <button
                              onClick={() => handleMoveQuestion(section.id, qIndex, 'up')}
                              disabled={qIndex === 0}
                              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded disabled:opacity-30"
                              title="Move Question Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveQuestion(section.id, qIndex, 'down')}
                              disabled={qIndex === section.questions.length - 1}
                              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded disabled:opacity-30"
                              title="Move Question Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onRegenerateSingleQuestion(question)}
                              disabled={isRegeneratingSingle}
                              className="p-1 text-blue-800 hover:text-blue-950 hover:bg-blue-100 rounded"
                              title="AI: Regenerate this specific question"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingQuestion(question)}
                              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded"
                              title="Edit Question"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Delete Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Paper End Mark */}
        <div className="text-center my-8 text-xs font-sans text-slate-500 font-semibold tracking-widest uppercase">
          *** END OF QUESTION PAPER ***
        </div>

        {/* Answer Key & Marking Scheme (Included or toggled) */}
        {showAnswerKey && (
          <div className="mt-12 pt-8 border-t-2 border-dashed border-slate-300 print:break-before-page">
            <div className="text-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-blue-950 font-serif">
                ANSWER KEY & MARKING SCHEME
              </h2>
              <p className="text-xs font-sans text-slate-500 mt-0.5">
                Model Solutions for {paper.examDetails.subject} - {paper.examDetails.grade}
              </p>
            </div>

            <div className="space-y-6">
              {paper.sections.map((section) => (
                <div key={section.id} className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded font-sans">
                    {section.name} - Solutions
                  </h4>

                  <div className="space-y-2.5">
                    {section.questions.map((q) => (
                      <div
                        key={q.id}
                        className="p-3 rounded-lg bg-slate-50/60 border border-slate-200 text-xs font-sans space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-900">Q.{q.questionNumber}:</span>
                          <span className="font-mono text-slate-500 text-[11px]">[{q.marks} Mark]</span>
                        </div>
                        <div className="text-slate-800 whitespace-pre-line leading-relaxed font-mono text-[11px]">
                          <strong>Answer:</strong> {q.answer || 'Detailed solution pending'}
                        </div>

                        {showMarkingScheme && q.markingScheme && (
                          <div className="text-slate-600 bg-white p-2 rounded border border-slate-200/80 text-[11px] italic">
                            <span className="font-semibold font-sans not-italic text-slate-700">
                              Marking Scheme:
                            </span>{' '}
                            {q.markingScheme}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Question Editor Modal */}
      {editingQuestion && (
        <QuestionEditorModal
          question={editingQuestion}
          isOpen={!!editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSave={handleSaveQuestion}
          onRegenerateSingle={onRegenerateSingleQuestion}
          isRegenerating={isRegeneratingSingle}
        />
      )}
    </div>
  );
};
