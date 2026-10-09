import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Clock,
  BookOpen,
  Settings,
  Plus,
  X,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { PaperFormData, QuestionType } from '../types';

interface PaperGeneratorFormProps {
  onGenerate: (data: PaperFormData) => Promise<void>;
  isLoading: boolean;
  loadingStepText?: string;
}

const DEFAULT_SUBJECT_CHAPTERS: Record<string, string[]> = {
  Science: [
    'Chemical Reactions and Equations',
    'Acids, Bases and Salts',
    'Life Processes',
    'Control and Coordination',
    'Light - Reflection and Refraction',
    'Electricity',
    'Magnetic Effects of Electric Current',
  ],
  Mathematics: [
    'Real Numbers',
    'Polynomials',
    'Pair of Linear Equations',
    'Quadratic Equations',
    'Arithmetic Progressions',
    'Triangles',
    'Introduction to Trigonometry',
    'Statistics',
    'Probability',
  ],
  English: [
    'Reading Comprehension',
    'Formal Letter Writing',
    'Analytical Paragraph Writing',
    'Grammar & Error Correction',
    'A Letter to God',
    'Nelson Mandela: Long Walk to Freedom',
    'Two Stories about Flying',
  ],
  'Social Science': [
    'The Rise of Nationalism in Europe',
    'Nationalism in India',
    'Resources and Development',
    'Power Sharing',
    'Federalism',
    'Development (Economics)',
    'Sectors of the Indian Economy',
  ],
  'Computer Science': [
    'Python Programming Fundamentals',
    'Functions and Recursion',
    'Data File Handling',
    'Computer Networks',
    'SQL and Database Management',
    'Cyber Safety & Ethics',
  ],
};

const ALL_QUESTION_TYPES: { type: QuestionType; label: string; defaultMarks: number; desc: string }[] = [
  { type: 'mcq', label: 'Multiple Choice (MCQ)', defaultMarks: 1, desc: '4 options with 1 correct' },
  { type: 'assertion_reason', label: 'Assertion - Reason', defaultMarks: 1, desc: 'Statement & reasoning logic' },
  { type: 'fill_blank', label: 'Fill in the Blanks', defaultMarks: 1, desc: 'Direct recall blanks' },
  { type: 'true_false', label: 'True / False', defaultMarks: 1, desc: 'Conceptual validity' },
  { type: 'vsa', label: 'Very Short Answer (VSA)', defaultMarks: 2, desc: 'Brief 30-50 word answers' },
  { type: 'sa', label: 'Short Answer (SA)', defaultMarks: 3, desc: '50-80 word explanations/numericals' },
  { type: 'la', label: 'Long Answer (LA)', defaultMarks: 5, desc: '80-120 word comprehensive answers' },
  { type: 'case_based', label: 'Case-Based / Data', defaultMarks: 4, desc: 'Context passage with sub-questions' },
];

export const PaperGeneratorForm: React.FC<PaperGeneratorFormProps> = ({
  onGenerate,
  isLoading,
  loadingStepText,
}) => {
  const [formData, setFormData] = useState<PaperFormData>({
    schoolName: '',
    grade: 'Class 10',
    board: 'CBSE',
    subject: 'Science',
    examType: 'Half-Yearly',
    chapters: ['Chemical Reactions and Equations', 'Life Processes', 'Light - Reflection and Refraction'],
    currentChapterInput: '',
    totalMarks: 80,
    duration: '3 Hours',
    difficulty: 'Mixed',
    selectedQuestionTypes: ['mcq', 'assertion_reason', 'vsa', 'sa', 'la', 'case_based'],
    questionCounts: {},
    includeAnswerKey: true,
    includeMarkingScheme: true,
    additionalInstructions: '',
  });

  const [useCustomMarks, setUseCustomMarks] = useState(false);
  const [useCustomDuration, setUseCustomDuration] = useState(false);
  const [useCustomSubject, setUseCustomSubject] = useState(false);
  const [useCustomExamType, setUseCustomExamType] = useState(false);
  const [distributionMode, setDistributionMode] = useState<'auto' | 'custom'>('auto');

  const handleAddChapter = () => {
    const val = formData.currentChapterInput.trim();
    if (val && !formData.chapters.includes(val)) {
      setFormData({
        ...formData,
        chapters: [...formData.chapters, val],
        currentChapterInput: '',
      });
    }
  };

  const handleRemoveChapter = (chapterToRemove: string) => {
    setFormData({
      ...formData,
      chapters: formData.chapters.filter((c) => c !== chapterToRemove),
    });
  };

  const handleAddSuggestedChapter = (ch: string) => {
    if (!formData.chapters.includes(ch)) {
      setFormData({
        ...formData,
        chapters: [...formData.chapters, ch],
      });
    }
  };

  const handleToggleQuestionType = (qType: QuestionType) => {
    const exists = formData.selectedQuestionTypes.includes(qType);
    let updated: QuestionType[];
    if (exists) {
      if (formData.selectedQuestionTypes.length === 1) return; // Keep at least one
      updated = formData.selectedQuestionTypes.filter((t) => t !== qType);
    } else {
      updated = [...formData.selectedQuestionTypes, qType];
    }
    setFormData({ ...formData, selectedQuestionTypes: updated });
  };

  const handleQuestionCountChange = (qType: QuestionType, count: number) => {
    setFormData({
      ...formData,
      questionCounts: {
        ...formData.questionCounts,
        [qType]: Math.max(0, count),
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onGenerate(formData);
  };

  const suggestedChapters = DEFAULT_SUBJECT_CHAPTERS[formData.subject] || [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Form Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-900" />
          <span>Paper Specifications</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure curriculum board, syllabus chapters, marks, and examination parameters
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-5">
        {/* Academic Details Section */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Academic Details</span>
            <span className="text-[11px] text-slate-400 font-normal">Board & Grade</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Grade / Class */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Class / Grade <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-300 py-2 px-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Board */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Board / Syllabus <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.board}
                onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-300 py-2 px-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="CBSE">CBSE (Central Board)</option>
                <option value="ICSE">ICSE / ISC</option>
                <option value="State Board">State Board</option>
                <option value="Cambridge / IGCSE">Cambridge / IGCSE</option>
                <option value="General / Other">General / Other Board</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Subject */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              {!useCustomSubject ? (
                <div className="space-y-1">
                  <select
                    value={formData.subject}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setUseCustomSubject(true);
                      } else {
                        setFormData({ ...formData, subject: e.target.value });
                      }
                    }}
                    className="w-full text-xs rounded-lg border border-slate-300 py-2 px-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="Science">Science (General)</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Social Science">Social Science</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science / IT</option>
                    <option value="custom">Other / Custom Subject...</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={formData.customSubject || ''}
                    placeholder="Enter subject name..."
                    onChange={(e) =>
                      setFormData({ ...formData, customSubject: e.target.value, subject: e.target.value })
                    }
                    className="flex-1 text-xs rounded-lg border border-slate-300 py-2 px-2.5 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomSubject(false);
                      setFormData({ ...formData, subject: 'Science' });
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 p-2"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Exam Type */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Exam Type</label>
              {!useCustomExamType ? (
                <select
                  value={formData.examType}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setUseCustomExamType(true);
                    } else {
                      setFormData({ ...formData, examType: e.target.value });
                    }
                  }}
                  className="w-full text-xs rounded-lg border border-slate-300 py-2 px-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="Unit Test">Unit Test</option>
                  <option value="Monthly Test">Monthly Assessment</option>
                  <option value="Periodic Test - I">Periodic Test - I</option>
                  <option value="Half-Yearly">Half-Yearly Examination</option>
                  <option value="Pre-Board Examination">Pre-Board Examination</option>
                  <option value="Annual Examination">Annual Examination</option>
                  <option value="Practice Paper">Practice / Revision Paper</option>
                  <option value="custom">Custom Exam Title...</option>
                </select>
              ) : (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={formData.customExamType || ''}
                    placeholder="e.g. Model Prelim Test 2026"
                    onChange={(e) =>
                      setFormData({ ...formData, customExamType: e.target.value, examType: e.target.value })
                    }
                    className="flex-1 text-xs rounded-lg border border-slate-300 py-2 px-2.5 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomExamType(false);
                      setFormData({ ...formData, examType: 'Half-Yearly' });
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 p-2"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* School Name (Optional) */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              School / Institution Name <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. DELHI PUBLIC SCHOOL, R.K. PURAM"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-300 py-2 px-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Chapters Section */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Syllabus & Target Chapters
            </label>
            <span className="text-[11px] text-slate-500">
              {formData.chapters.length} chapter{formData.chapters.length !== 1 ? 's' : ''} added
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type chapter name and press Enter..."
              value={formData.currentChapterInput}
              onChange={(e) => setFormData({ ...formData, currentChapterInput: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddChapter();
                }
              }}
              className="flex-1 text-xs rounded-lg border border-slate-300 py-2 px-2.5 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddChapter}
              className="px-3 py-2 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Chapters Tags List */}
          {formData.chapters.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.chapters.map((ch) => (
                <span
                  key={ch}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-900 border border-blue-100 text-[11px] font-medium"
                >
                  <span>{ch}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChapter(ch)}
                    className="hover:text-red-600 p-0.5 rounded transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-amber-700 bg-amber-50/70 p-2 rounded border border-amber-200/60">
              No chapters specified. The AI will generate questions from the overall standard curriculum.
            </p>
          )}

          {/* Quick Suggestions */}
          {suggestedChapters.length > 0 && (
            <div className="pt-1">
              <span className="text-[11px] text-slate-500 block mb-1">Suggested for {formData.subject}:</span>
              <div className="flex flex-wrap gap-1">
                {suggestedChapters
                  .filter((ch) => !formData.chapters.includes(ch))
                  .slice(0, 4)
                  .map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => handleAddSuggestedChapter(ch)}
                      className="text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-2.5 h-2.5" /> {ch}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Exam Parameters (Marks, Duration, Difficulty) */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Exam Parameters
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Total Marks */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Total Marks</label>
              {!useCustomMarks ? (
                <select
                  value={formData.totalMarks}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setUseCustomMarks(true);
                    } else {
                      setFormData({ ...formData, totalMarks: Number(e.target.value) });
                    }
                  }}
                  className="w-full text-xs rounded-lg border border-slate-300 py-2 px-2.5 focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value={10}>10 Marks (Class Quiz)</option>
                  <option value={20}>20 Marks (Periodic Assessment)</option>
                  <option value={25}>25 Marks (Unit Test)</option>
                  <option value={30}>30 Marks (Monthly Test)</option>
                  <option value={40}>40 Marks (Mid-Term)</option>
                  <option value={50}>50 Marks (Terminal)</option>
                  <option value={70}>70 Marks (Theory Senior)</option>
                  <option value={80}>80 Marks (Board Standard)</option>
                  <option value={100}>100 Marks (Full Paper)</option>
                  <option value="custom">Custom Marks...</option>
                </select>
              ) : (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="5"
                    max="200"
                    placeholder="Marks"
                    value={formData.customMarks || formData.totalMarks}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customMarks: Number(e.target.value),
                        totalMarks: Number(e.target.value),
                      })
                    }
                    className="w-full text-xs rounded-lg border border-slate-300 py-2 px-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomMarks(false);
                      setFormData({ ...formData, totalMarks: 80 });
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 p-1"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Exam Duration</label>
              {!useCustomDuration ? (
                <select
                  value={formData.duration}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setUseCustomDuration(true);
                    } else {
                      setFormData({ ...formData, duration: e.target.value });
                    }
                  }}
                  className="w-full text-xs rounded-lg border border-slate-300 py-2 px-2.5 focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="30 Minutes">30 Minutes</option>
                  <option value="45 Minutes">45 Minutes</option>
                  <option value="1 Hour">1 Hour</option>
                  <option value="1.5 Hours">1 Hour 30 Mins</option>
                  <option value="2 Hours">2 Hours</option>
                  <option value="2.5 Hours">2 Hours 30 Mins</option>
                  <option value="3 Hours">3 Hours</option>
                  <option value="custom">Custom Time...</option>
                </select>
              ) : (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="e.g. 1 Hr 15 Mins"
                    value={formData.customDuration || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customDuration: e.target.value,
                        duration: e.target.value,
                      })
                    }
                    className="w-full text-xs rounded-lg border border-slate-300 py-2 px-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomDuration(false);
                      setFormData({ ...formData, duration: '3 Hours' });
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 p-1"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Difficulty Level</label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' | 'Mixed' })
                }
                className="w-full text-xs rounded-lg border border-slate-300 py-2 px-2.5 focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Mixed">Mixed (Standard Board 40-40-20)</option>
                <option value="Easy">Easy (Foundation / Basic)</option>
                <option value="Medium">Medium (Balanced)</option>
                <option value="Hard">Hard (HOTS / Olympiad Style)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Question Types & Distribution */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Question Types & Sections
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
              <button
                type="button"
                onClick={() => setDistributionMode('auto')}
                className={`px-2 py-0.5 rounded ${
                  distributionMode === 'auto' ? 'bg-white text-slate-900 font-medium shadow-xs' : 'text-slate-600'
                }`}
              >
                Auto Board Weightage
              </button>
              <button
                type="button"
                onClick={() => setDistributionMode('custom')}
                className={`px-2 py-0.5 rounded ${
                  distributionMode === 'custom' ? 'bg-white text-slate-900 font-medium shadow-xs' : 'text-slate-600'
                }`}
              >
                Custom Counts
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ALL_QUESTION_TYPES.map(({ type, label, desc, defaultMarks }) => {
              const isSelected = formData.selectedQuestionTypes.includes(type);
              const customCount = formData.questionCounts[type];

              return (
                <div
                  key={type}
                  className={`p-2.5 rounded-lg border transition-colors flex items-start justify-between gap-2 ${
                    isSelected ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50/40 border-slate-200 opacity-70'
                  }`}
                >
                  <label className="flex items-start gap-2 cursor-pointer flex-1 select-none">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleQuestionType(type)}
                      className="mt-0.5 rounded text-blue-900 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-xs font-medium text-slate-900">{label}</div>
                      <div className="text-[10px] text-slate-500">{desc}</div>
                    </div>
                  </label>

                  {distributionMode === 'custom' && isSelected && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={customCount || ''}
                        placeholder="Auto"
                        onChange={(e) => handleQuestionCountChange(type, Number(e.target.value))}
                        className="w-12 text-xs rounded border border-slate-300 py-0.5 px-1 text-center bg-white"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Answer Key & Marking Scheme Toggles */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Output Controls
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={formData.includeAnswerKey}
                onChange={(e) => setFormData({ ...formData, includeAnswerKey: e.target.checked })}
                className="rounded text-blue-900 focus:ring-blue-500"
              />
              <div>
                <span className="text-xs font-medium text-slate-900 block">Include Model Answer Key</span>
                <span className="text-[10px] text-slate-500 block">Complete solutions for all questions</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={formData.includeMarkingScheme}
                onChange={(e) => setFormData({ ...formData, includeMarkingScheme: e.target.checked })}
                className="rounded text-blue-900 focus:ring-blue-500"
              />
              <div>
                <span className="text-xs font-medium text-slate-900 block">Include Marking Scheme</span>
                <span className="text-[10px] text-slate-500 block">Point-by-point rubric for teacher evaluation</span>
              </div>
            </label>
          </div>
        </div>

        {/* Additional Special Instructions */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Special Instructions / Teacher Focus <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={formData.additionalInstructions}
            onChange={(e) => setFormData({ ...formData, additionalInstructions: e.target.value })}
            placeholder="e.g. Include at least 2 numerical problems on electric power; emphasize diagram-based biology questions; no questions from deleted syllabus topics."
            className="w-full text-xs rounded-lg border border-slate-300 p-2 focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
          />
        </div>

        {/* Submit Action */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 text-white font-medium rounded-lg text-xs sm:text-sm transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{loadingStepText || 'Drafting Examination Paper with Gemini...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Generate Question Paper ({formData.totalMarks} Marks)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
