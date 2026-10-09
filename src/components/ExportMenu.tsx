import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  FileDown,
  Printer,
  Copy,
  Check,
  FileText,
  ChevronDown,
  KeyRound,
  FileCheck2,
} from 'lucide-react';
import { QuestionPaper } from '../types';
import {
  downloadAsPdf,
  downloadAsDocx,
  downloadAsText,
  copyToClipboard,
  formatPaperAsText,
  printPaperDocument,
} from '../utils/exportUtils';

interface ExportMenuProps {
  paper: QuestionPaper;
  onNotification?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ paper, onNotification }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyPaper = async () => {
    const text = formatPaperAsText(paper, { includeQuestions: true, includeAnswers: false });
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedType('paper');
      setTimeout(() => setCopiedType(null), 2000);
      onNotification?.('Question paper copied to clipboard!', 'success');
    }
  };

  const handleCopyAnswerKey = async () => {
    const text = formatPaperAsText(paper, { includeQuestions: false, includeAnswers: true });
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedType('answers');
      setTimeout(() => setCopiedType(null), 2000);
      onNotification?.('Answer key copied to clipboard!', 'success');
    }
  };

  const handlePdfBoth = () => {
    downloadAsPdf(paper, { includeQuestions: true, includeAnswers: true });
    setIsOpen(false);
    onNotification?.('Downloaded PDF (Paper + Answer Key)', 'success');
  };

  const handlePdfPaperOnly = () => {
    downloadAsPdf(paper, { includeQuestions: true, includeAnswers: false }, '_Paper_Only');
    setIsOpen(false);
    onNotification?.('Downloaded PDF (Question Paper Only)', 'success');
  };

  const handlePdfAnswerKeyOnly = () => {
    downloadAsPdf(paper, { includeQuestions: false, includeAnswers: true }, '_Answer_Key');
    setIsOpen(false);
    onNotification?.('Downloaded PDF (Answer Key Only)', 'success');
  };

  const handleDocxBoth = async () => {
    await downloadAsDocx(paper, { includeQuestions: true, includeAnswers: true });
    setIsOpen(false);
    onNotification?.('Downloaded Word (.docx) document', 'success');
  };

  const handleDocxPaperOnly = async () => {
    await downloadAsDocx(paper, { includeQuestions: true, includeAnswers: false }, '_Paper_Only');
    setIsOpen(false);
    onNotification?.('Downloaded Word (.docx) paper', 'success');
  };

  const handleDocxAnswerKeyOnly = async () => {
    await downloadAsDocx(paper, { includeQuestions: false, includeAnswers: true }, '_Answer_Key');
    setIsOpen(false);
    onNotification?.('Downloaded Word (.docx) answer key', 'success');
  };

  const handleTxtDownload = () => {
    downloadAsText(paper, { includeQuestions: true, includeAnswers: true });
    setIsOpen(false);
    onNotification?.('Downloaded plain text (.txt) file', 'success');
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-between gap-2 px-3.5 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-medium hover:bg-blue-800 transition-colors shadow-xs"
        >
          <FileDown className="w-4 h-4 text-blue-200" />
          <span>Export Document</span>
          <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-blue-300" />
        </button>

        <button
          onClick={printPaperDocument}
          className="p-1.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
          title="Print Question Paper"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">Print</span>
        </button>

        <button
          onClick={handleCopyPaper}
          className="p-1.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
          title="Copy Question Paper to Clipboard"
        >
          {copiedType === 'paper' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span className="hidden sm:inline">{copiedType === 'paper' ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg bg-white shadow-lg border border-slate-200 py-1.5 z-50 focus:outline-none">
          <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            PDF Export Options
          </div>
          <button
            onClick={handlePdfBoth}
            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2.5 transition-colors"
          >
            <FileText className="w-4 h-4 text-red-600 shrink-0" />
            <div>
              <div className="font-medium">Download PDF (Full Document)</div>
              <div className="text-[10px] text-slate-500">Includes question paper & answer key</div>
            </div>
          </button>
          <button
            onClick={handlePdfPaperOnly}
            className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2.5 transition-colors"
          >
            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Download PDF (Question Paper Only)</span>
          </button>
          <button
            onClick={handlePdfAnswerKeyOnly}
            className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2.5 transition-colors"
          >
            <KeyRound className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Download PDF (Answer Key Only)</span>
          </button>

          <div className="px-3 py-1.5 border-t border-b border-slate-100 mt-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Microsoft Word (.docx)
          </div>
          <button
            onClick={handleDocxBoth}
            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2.5 transition-colors"
          >
            <FileCheck2 className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <div className="font-medium">Download Word .docx (Full)</div>
              <div className="text-[10px] text-slate-500">Fully editable formatted Word document</div>
            </div>
          </button>
          <button
            onClick={handleDocxPaperOnly}
            className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2.5 transition-colors"
          >
            <FileCheck2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Download Word .docx (Paper Only)</span>
          </button>
          <button
            onClick={handleDocxAnswerKeyOnly}
            className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2.5 transition-colors"
          >
            <KeyRound className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Download Word .docx (Answer Key Only)</span>
          </button>

          <div className="px-3 py-1.5 border-t border-b border-slate-100 mt-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Other Formats
          </div>
          <button
            onClick={handleTxtDownload}
            className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2.5 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Download Plain Text (.txt)</span>
          </button>
          <button
            onClick={handleCopyAnswerKey}
            className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2.5 transition-colors"
          >
            <Copy className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Copy Answer Key to Clipboard</span>
          </button>
        </div>
      )}
    </div>
  );
};
