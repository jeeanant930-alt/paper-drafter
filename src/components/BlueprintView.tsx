import React from 'react';
import { BarChart3, AlertTriangle, CheckCircle2, BookOpen, Layers } from 'lucide-react';
import { QuestionPaper } from '../types';
import { calculateTotalMarks, generateBlueprintMatrix } from '../utils/paperUtils';

interface BlueprintViewProps {
  paper: QuestionPaper;
  onOpenPaper: () => void;
}

export const BlueprintView: React.FC<BlueprintViewProps> = ({ paper, onOpenPaper }) => {
  const matrix = generateBlueprintMatrix(paper);
  const totalCalculated = calculateTotalMarks(paper);
  const targetMarks = paper.examDetails.maxMarks;
  const isMarksBalanced = totalCalculated === targetMarks;

  // Calculate totals per question type column
  const totals = matrix.reduce(
    (acc, row) => ({
      mcq: acc.mcq + row.mcqMarks,
      vsa: acc.vsa + row.vsaMarks,
      sa: acc.sa + row.saMarks,
      la: acc.la + row.laMarks,
      case: acc.case + row.caseMarks,
      total: acc.total + row.totalMarks,
      questions: acc.questions + row.questionCount,
    }),
    { mcq: 0, vsa: 0, sa: 0, la: 0, case: 0, total: 0, questions: 0 }
  );

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Blueprint Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>{paper.examDetails.board}</span>
            <span aria-hidden="true">·</span>
            <span>{paper.examDetails.grade}</span>
            <span aria-hidden="true">·</span>
            <span>{paper.examDetails.subject}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
            Curriculum Blueprint & Weightage Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Chapter-wise and typology-wise marks allotment for &ldquo;{paper.title}&rdquo;
          </p>
        </div>

        <button
          onClick={onOpenPaper}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors shrink-0"
        >
          <span>Return to Question Paper</span>
        </button>
      </div>

      {/* Marks Balance Status */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
          isMarksBalanced ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isMarksBalanced ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <div>
            <div className="font-bold">
              {isMarksBalanced ? 'Perfect Marks Equilibrium' : 'Marks Imbalance Detected'}
            </div>
            <div className="text-[11px] opacity-90 mt-0.5">
              Current Blueprint Total: <span className="font-mono font-bold">{totalCalculated}</span> Marks (Target:{' '}
              <span className="font-mono font-bold">{targetMarks}</span> Marks)
              {!isMarksBalanced &&
                ` — Please adjust question marks in the paper editor to match ${targetMarks} marks exactly.`}
            </div>
          </div>
        </div>

        <div className="font-mono font-bold text-xs bg-white/80 px-2.5 py-1 rounded border border-current">
          {totalCalculated} / {targetMarks} M
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Chapter / Syllabus Unit</th>
                <th className="py-3 px-3 text-center">Objective / MCQ (1M)</th>
                <th className="py-3 px-3 text-center">VSA (2M)</th>
                <th className="py-3 px-3 text-center">SA (3M)</th>
                <th className="py-3 px-3 text-center">LA (5M)</th>
                <th className="py-3 px-3 text-center">Case Study (4M)</th>
                <th className="py-3 px-3 text-center">Q. Count</th>
                <th className="py-3 px-4 text-right">Total Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900 font-serif">
                    {row.chapter}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600">
                    {row.mcqMarks > 0 ? `${row.mcqMarks} M` : '—'}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600">
                    {row.vsaMarks > 0 ? `${row.vsaMarks} M` : '—'}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600">
                    {row.saMarks > 0 ? `${row.saMarks} M` : '—'}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600">
                    {row.laMarks > 0 ? `${row.laMarks} M` : '—'}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600">
                    {row.caseMarks > 0 ? `${row.caseMarks} M` : '—'}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-medium text-slate-700">
                    {row.questionCount}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 bg-slate-50/30">
                    {row.totalMarks} Marks
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100/80 border-t-2 border-slate-300 font-bold text-slate-900 text-xs">
                <td className="py-3 px-4 uppercase tracking-wider font-sans">
                  Total Paper Weightage
                </td>
                <td className="py-3 px-3 text-center font-mono">{totals.mcq} M</td>
                <td className="py-3 px-3 text-center font-mono">{totals.vsa} M</td>
                <td className="py-3 px-3 text-center font-mono">{totals.sa} M</td>
                <td className="py-3 px-3 text-center font-mono">{totals.la} M</td>
                <td className="py-3 px-3 text-center font-mono">{totals.case} M</td>
                <td className="py-3 px-3 text-center font-mono">{totals.questions} Qs</td>
                <td className="py-3 px-4 text-right font-mono text-blue-900 text-sm">
                  {totals.total} Marks
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
