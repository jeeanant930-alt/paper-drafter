import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, Check, RefreshCw } from 'lucide-react';
import { Question, QuestionType, SubQuestion } from '../types';

interface QuestionEditorModalProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedQuestion: Question) => void;
  onRegenerateSingle?: (question: Question) => Promise<void>;
  isRegenerating?: boolean;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  question,
  isOpen,
  onClose,
  onSave,
  onRegenerateSingle,
  isRegenerating = false,
}) => {
  const [formData, setFormData] = useState<Question>({ ...question });

  if (!isOpen) return null;

  const handleTypeChange = (newType: QuestionType) => {
    let updated = { ...formData, type: newType };
    if (newType === 'mcq' && (!updated.options || updated.options.length === 0)) {
      updated.options = ['Option A', 'Option B', 'Option C', 'Option D'];
    }
    if (newType === 'assertion_reason') {
      updated.assertion = updated.assertion || 'State assertion statement here.';
      updated.reason = updated.reason || 'State reasoning statement here.';
      updated.options = [
        'Both (A) and (R) are true and (R) is the correct explanation of (A).',
        'Both (A) and (R) are true but (R) is NOT the correct explanation of (A).',
        '(A) is true but (R) is false.',
        '(A) is false but (R) is true.',
      ];
    }
    if (newType === 'case_based' && (!updated.subQuestions || updated.subQuestions.length === 0)) {
      updated.subQuestions = [
        { id: 'sq-1', label: '(i)', text: 'First sub-question based on the passage', marks: 1, answer: '' },
        { id: 'sq-2', label: '(ii)', text: 'Second sub-question based on the passage', marks: 1, answer: '' },
        { id: 'sq-3', label: '(iii)', text: 'Third conceptual sub-question', marks: 2, answer: '' },
      ];
    }
    setFormData(updated);
  };

  const handleOptionChange = (idx: number, val: string) => {
    const opts = [...(formData.options || [])];
    opts[idx] = val;
    setFormData({ ...formData, options: opts });
  };

  const handleAddOption = () => {
    const opts = [...(formData.options || [])];
    opts.push(`Option ${String.fromCharCode(65 + opts.length)}`);
    setFormData({ ...formData, options: opts });
  };

  const handleRemoveOption = (idx: number) => {
    const opts = (formData.options || []).filter((_, i) => i !== idx);
    setFormData({ ...formData, options: opts });
  };

  const handleSubQuestionChange = (idx: number, field: keyof SubQuestion, val: any) => {
    const subs = [...(formData.subQuestions || [])];
    subs[idx] = { ...subs[idx], [field]: val };
    setFormData({ ...formData, subQuestions: subs });
  };

  const handleAddSubQuestion = () => {
    const subs = [...(formData.subQuestions || [])];
    const newId = `sq-${Date.now()}`;
    const labels = ['(i)', '(ii)', '(iii)', '(iv)', '(v)'];
    subs.push({
      id: newId,
      label: labels[subs.length] || `(${subs.length + 1})`,
      text: 'New sub-question text',
      marks: 1,
      answer: '',
    });
    setFormData({ ...formData, subQuestions: subs });
  };

  const handleRemoveSubQuestion = (idx: number) => {
    const subs = (formData.subQuestions || []).filter((_, i) => i !== idx);
    setFormData({ ...formData, subQuestions: subs });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Edit Question Q.{formData.questionNumber}
            </h3>
            <p className="text-xs text-slate-500">
              Customize wording, answer keys, marks, and format
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onRegenerateSingle && (
              <button
                type="button"
                onClick={() => onRegenerateSingle(formData)}
                disabled={isRegenerating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>{isRegenerating ? 'Regenerating...' : 'AI Rephrase'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Question Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
                className="w-full text-xs rounded-lg border border-slate-300 py-1.5 px-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="mcq">Multiple Choice (MCQ)</option>
                <option value="vsa">Very Short Answer (VSA)</option>
                <option value="sa">Short Answer (SA)</option>
                <option value="la">Long Answer (LA)</option>
                <option value="assertion_reason">Assertion - Reason</option>
                <option value="case_based">Case-Based / Data</option>
                <option value="fill_blank">Fill in the Blanks</option>
                <option value="true_false">True / False</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Marks</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) || 1 })}
                className="w-full text-xs rounded-lg border border-slate-300 py-1.5 px-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Chapter / Topic</label>
              <input
                type="text"
                value={formData.chapter || ''}
                placeholder="e.g. Life Processes"
                onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-300 py-1.5 px-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Question Text {formData.type === 'case_based' && '(Stimulus Passage)'}
            </label>
            <textarea
              rows={3}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter examination question statement..."
            />
          </div>

          {/* Assertion - Reason Inputs */}
          {formData.type === 'assertion_reason' && (
            <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assertion (A):</label>
                <input
                  type="text"
                  value={formData.assertion || ''}
                  onChange={(e) => setFormData({ ...formData, assertion: e.target.value })}
                  className="w-full text-xs rounded-md border border-slate-300 py-1 px-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason (R):</label>
                <input
                  type="text"
                  value={formData.reason || ''}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full text-xs rounded-md border border-slate-300 py-1 px-2"
                />
              </div>
            </div>
          )}

          {/* MCQ Options */}
          {(formData.type === 'mcq' || formData.type === 'assertion_reason') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Answer Options</label>
                {formData.type === 'mcq' && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-xs text-blue-800 hover:text-blue-900 font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Option
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                {formData.options?.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 text-xs font-mono font-bold text-slate-500">
                      ({String.fromCharCode(65 + idx)})
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      className="flex-1 text-xs rounded-md border border-slate-300 py-1 px-2"
                    />
                    {formData.type === 'mcq' && (formData.options?.length || 0) > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub Questions for Case-Based */}
          {formData.type === 'case_based' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Sub-Questions</label>
                <button
                  type="button"
                  onClick={handleAddSubQuestion}
                  className="text-xs text-blue-800 hover:text-blue-900 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Sub-Question
                </button>
              </div>
              <div className="space-y-2">
                {formData.subQuestions?.map((sq, idx) => (
                  <div key={sq.id || idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sq.label}
                        onChange={(e) => handleSubQuestionChange(idx, 'label', e.target.value)}
                        className="w-12 text-xs font-bold rounded border border-slate-300 py-0.5 px-1.5 text-center"
                      />
                      <input
                        type="text"
                        value={sq.text}
                        onChange={(e) => handleSubQuestionChange(idx, 'text', e.target.value)}
                        className="flex-1 text-xs rounded border border-slate-300 py-1 px-2"
                        placeholder="Sub-question question text"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-slate-500">Marks:</span>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={sq.marks}
                          onChange={(e) => handleSubQuestionChange(idx, 'marks', Number(e.target.value) || 1)}
                          className="w-12 text-xs rounded border border-slate-300 py-0.5 px-1 text-center"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubQuestion(idx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={sq.answer || ''}
                        onChange={(e) => handleSubQuestionChange(idx, 'answer', e.target.value)}
                        className="w-full text-[11px] rounded border border-slate-200 bg-white py-1 px-2 text-slate-600"
                        placeholder="Answer / Key for this sub-part..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Model Answer */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Model Answer / Solution
            </label>
            <textarea
              rows={2}
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-slate-800"
              placeholder="Correct option or model solution with working..."
            />
          </div>

          {/* Marking Scheme */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Marking Scheme / Step-Wise Rubric
            </label>
            <textarea
              rows={2}
              value={formData.markingScheme || ''}
              onChange={(e) => setFormData({ ...formData, markingScheme: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700"
              placeholder="e.g. 1 mark for formula, 1 mark for substitution, 1 mark for answer with units."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(formData);
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Question</span>
          </button>
        </div>
      </div>
    </div>
  );
};
