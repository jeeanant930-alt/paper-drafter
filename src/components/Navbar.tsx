import React from 'react';
import { BookOpen, FileText, Bookmark, BarChart3, Plus, Sparkles, Printer } from 'lucide-react';

interface NavbarProps {
  activeTab: 'builder' | 'saved' | 'blueprint' | 'presets';
  setActiveTab: (tab: 'builder' | 'saved' | 'blueprint' | 'presets') => void;
  savedCount: number;
  onNewPaper: () => void;
  onPrint?: () => void;
  hasActivePaper: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onNewPaper,
  onPrint,
  hasActivePaper,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('builder')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <FileText className="w-5 h-5 text-blue-100" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 font-serif">
                  AI Paper Drafter
                </span>
                <span className="block text-[11px] font-medium text-slate-500 tracking-wide uppercase">
                  Exam & Assessment Studio
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'builder'
                  ? 'bg-blue-50 text-blue-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Question Paper
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'bg-blue-50 text-blue-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Saved Papers</span>
              {savedCount > 0 && (
                <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-mono">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('blueprint')}
              className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'blueprint'
                  ? 'bg-blue-50 text-blue-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Blueprint Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('presets')}
              className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'bg-blue-50 text-blue-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Board Templates</span>
            </button>
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {hasActivePaper && onPrint && (
              <button
                onClick={onPrint}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                title="Print Paper directly"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            )}

            <button
              onClick={onNewPaper}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Paper</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('builder')}
            className={`py-1 px-2.5 rounded ${activeTab === 'builder' ? 'text-blue-900 font-semibold' : 'text-slate-600'}`}
          >
            Draft Paper
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`py-1 px-2.5 rounded ${activeTab === 'saved' ? 'text-blue-900 font-semibold' : 'text-slate-600'}`}
          >
            Saved ({savedCount})
          </button>
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`py-1 px-2.5 rounded ${activeTab === 'blueprint' ? 'text-blue-900 font-semibold' : 'text-slate-600'}`}
          >
            Blueprint
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`py-1 px-2.5 rounded ${activeTab === 'presets' ? 'text-blue-900 font-semibold' : 'text-slate-600'}`}
          >
            Templates
          </button>
        </div>
      </div>
    </header>
  );
};
