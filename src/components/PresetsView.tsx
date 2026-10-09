import React from 'react';
import { BookOpen, Sparkles, Check, ArrowRight, FileText } from 'lucide-react';
import { SAMPLE_PAPERS } from '../data/samplePapers';
import { QuestionPaper } from '../types';

interface PresetsViewProps {
  onLoadPreset: (preset: QuestionPaper) => void;
}

export const PresetsView: React.FC<PresetsViewProps> = ({ onLoadPreset }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 font-serif">
          Curriculum Board Presets & Ready Templates
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Load verified examination papers designed according to standard board weightage guidelines.
          You can customize every section, question, or marks allotment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAMPLE_PAPERS.map((preset) => {
          const qCount = preset.sections.reduce((acc, s) => acc + s.questions.length, 0);

          return (
            <div
              key={preset.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-blue-900">{preset.examDetails.board}</span>
                  <span aria-hidden="true">·</span>
                  <span>{preset.examDetails.grade}</span>
                  <span aria-hidden="true">·</span>
                  <span>{preset.examDetails.subject}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
                  {preset.title}
                </h3>
                <p className="text-xs text-slate-600 mb-3">{preset.examDetails.examName}</p>

                <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Duration:</span>
                    <span className="font-medium text-slate-900">{preset.examDetails.durationFormatted}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Maximum Marks:</span>
                    <span className="font-bold text-blue-900">{preset.examDetails.maxMarks} Marks</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Questions Count:</span>
                    <span className="font-medium text-slate-900">{qCount} Questions across {preset.sections.length} Sections</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Answer Key & Rubrics:</span>
                    <span className="text-emerald-700 font-medium">Included & Verified</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Ready to edit & print</span>
                <button
                  onClick={() => onLoadPreset(preset)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
                >
                  <span>Load Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
