import React, { useState } from 'react';
import {
  FileText,
  Search,
  Calendar,
  Layers,
  Copy,
  Trash2,
  Edit3,
  ExternalLink,
  BookOpen,
  Check,
  Download,
} from 'lucide-react';
import { QuestionPaper } from '../types';
import { ExportMenu } from './ExportMenu';

interface SavedPapersViewProps {
  papers: QuestionPaper[];
  onSelectPaper: (paper: QuestionPaper) => void;
  onDuplicatePaper: (paper: QuestionPaper) => void;
  onRenamePaper: (paperId: string, newTitle: string) => void;
  onDeletePaper: (paperId: string) => void;
  onNotification?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const SavedPapersView: React.FC<SavedPapersViewProps> = ({
  papers,
  onSelectPaper,
  onDuplicatePaper,
  onRenamePaper,
  onDeletePaper,
  onNotification,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');

  const filteredPapers = papers.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.examDetails.subject.toLowerCase().includes(q) ||
      p.examDetails.grade.toLowerCase().includes(q) ||
      p.examDetails.board.toLowerCase().includes(q) ||
      p.examDetails.examName.toLowerCase().includes(q)
    );
  });

  const startRename = (paper: QuestionPaper) => {
    setEditingId(paper.id);
    setRenameInput(paper.title);
  };

  const handleSaveRename = (paperId: string) => {
    if (renameInput.trim()) {
      onRenamePaper(paperId, renameInput.trim());
      onNotification?.('Paper title updated', 'success');
    }
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Search & Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-serif">Saved Question Papers</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Access, duplicate, edit, or export your examination papers library
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by subject, class, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Papers Grid */}
      {filteredPapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPapers.map((paper) => {
            const questionCount = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);
            const isEditing = editingId === paper.id;

            return (
              <div
                key={paper.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top metadata unboxed */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <span>{paper.examDetails.board}</span>
                    <span aria-hidden="true">·</span>
                    <span>{paper.examDetails.grade}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-700">{paper.examDetails.subject}</span>
                  </div>

                  {/* Title or Rename Input */}
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 my-1">
                      <input
                        type="text"
                        value={renameInput}
                        onChange={(e) => setRenameInput(e.target.value)}
                        className="flex-1 text-xs font-semibold rounded border border-blue-400 px-2 py-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(paper.id);
                        }}
                      />
                      <button
                        onClick={() => handleSaveRename(paper.id)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-sm font-bold text-slate-900 font-serif leading-snug line-clamp-2">
                      {paper.title}
                    </h3>
                  )}

                  {/* Subtitle Exam Info */}
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                    {paper.examDetails.examName}
                  </p>

                  {/* Quantitative specs */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-sans">
                    <span className="font-mono font-medium">
                      {paper.examDetails.maxMarks} Marks ({paper.examDetails.durationFormatted})
                    </span>
                    <span className="text-slate-500">{questionCount} Questions</span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                  <button
                    onClick={() => onSelectPaper(paper)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-medium hover:bg-blue-800 transition-colors shadow-xs"
                  >
                    <span>Open Paper</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startRename(paper)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Rename Paper"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDuplicatePaper(paper)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Duplicate Paper"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeletePaper(paper.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Paper"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 mb-1">No Saved Papers Found</h3>
          <p className="text-xs text-slate-500 mb-4">
            {searchQuery
              ? 'No papers matched your search term.'
              : 'You have not saved any examination papers yet. Create a new paper or load a preset template to start!'}
          </p>
        </div>
      )}
    </div>
  );
};
