import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  FileText,
  SlidersHorizontal,
  Eye,
  Plus,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { PaperGeneratorForm } from './components/PaperGeneratorForm';
import { PaperPreview } from './components/PaperPreview';
import { SavedPapersView } from './components/SavedPapersView';
import { BlueprintView } from './components/BlueprintView';
import { PresetsView } from './components/PresetsView';
import { QuestionPaper, Question, PaperFormData } from './types';
import { SAMPLE_PAPERS } from './data/samplePapers';
import {
  loadSavedPapers,
  savePaperToStorage,
  deletePaperFromStorage,
  calculateTotalMarks,
} from './utils/paperUtils';
import { printPaperDocument } from './utils/exportUtils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'builder' | 'saved' | 'blueprint' | 'presets'>('builder');
  const [mobileBuilderView, setMobileBuilderView] = useState<'form' | 'preview'>('preview');

  // Papers state
  const [savedPapers, setSavedPapers] = useState<QuestionPaper[]>([]);
  const [activePaper, setActivePaper] = useState<QuestionPaper>(SAMPLE_PAPERS[0]);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState('Drafting examination paper...');
  const [isRegeneratingSingle, setIsRegeneratingSingle] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Initialize saved papers
  useEffect(() => {
    const existing = loadSavedPapers();
    if (existing.length > 0) {
      setSavedPapers(existing);
      setActivePaper(existing[0]);
    } else {
      // Seed with sample papers
      SAMPLE_PAPERS.forEach((sp) => savePaperToStorage(sp));
      setSavedPapers(SAMPLE_PAPERS);
      setActivePaper(SAMPLE_PAPERS[0]);
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Generate Paper API call
  const handleGeneratePaper = async (formData: PaperFormData) => {
    setIsLoading(true);
    setLoadingStepText('Aligning syllabus chapters and board format...');

    const stepTimer1 = setTimeout(() => {
      setLoadingStepText('Drafting conceptual, analytical & application questions...');
    }, 2000);

    const stepTimer2 = setTimeout(() => {
      setLoadingStepText('Validating exact marks distribution & model solutions...');
    }, 4500);

    try {
      const response = await fetch('/api/generate-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: formData.schoolName,
          grade: formData.grade,
          board: formData.board,
          subject: formData.subject,
          examType: formData.examType,
          chapters: formData.chapters,
          totalMarks: formData.totalMarks,
          duration: formData.duration,
          difficulty: formData.difficulty,
          questionTypes: formData.selectedQuestionTypes,
          questionCounts: formData.questionCounts,
          includeAnswerKey: formData.includeAnswerKey,
          includeMarkingScheme: formData.includeMarkingScheme,
          additionalInstructions: formData.additionalInstructions,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with error status ${response.status}`);
      }

      const generatedData = await response.json();

      // Ensure proper formatting of received data into QuestionPaper structure
      const newPaper: QuestionPaper = {
        id: `paper-${Date.now()}`,
        title: `${formData.grade} ${formData.subject} - ${formData.examType} (${formData.totalMarks} Marks)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        examDetails: {
          schoolName: generatedData.examDetails?.schoolName || formData.schoolName || 'DELHI PUBLIC SCHOOL',
          examName: generatedData.examDetails?.examName || formData.examType,
          grade: generatedData.examDetails?.grade || formData.grade,
          board: generatedData.examDetails?.board || formData.board,
          subject: generatedData.examDetails?.subject || formData.subject,
          session: generatedData.examDetails?.session || '2025 - 2026',
          durationFormatted: generatedData.examDetails?.durationFormatted || formData.duration,
          maxMarks: Number(generatedData.examDetails?.maxMarks) || formData.totalMarks,
          generalInstructions:
            generatedData.examDetails?.generalInstructions || [
              'All questions are compulsory.',
              'Marks allotted are indicated against each question.',
              'Write answers neatly and legibly.',
            ],
          setLabel: 'Set A',
        },
        sections: (generatedData.sections || []).map((sec: any, sIdx: number) => ({
          id: sec.id || `sec-${sIdx}`,
          name: sec.name || `SECTION ${String.fromCharCode(65 + sIdx)}`,
          description: sec.description || '',
          questions: (sec.questions || []).map((q: any, qIdx: number) => ({
            id: q.id || `q-${sIdx}-${qIdx}`,
            questionNumber: Number(q.questionNumber) || qIdx + 1,
            type: q.type || 'sa',
            text: q.text || '',
            chapter: q.chapter || formData.subject,
            options: q.options,
            assertion: q.assertion,
            reason: q.reason,
            subQuestions: q.subQuestions,
            marks: Number(q.marks) || 1,
            answer: q.answer || '',
            markingScheme: q.markingScheme || '',
            difficulty: q.difficulty || 'Medium',
          })),
        })),
        includeAnswerKey: formData.includeAnswerKey,
        includeMarkingScheme: formData.includeMarkingScheme,
      };

      // Save to storage
      savePaperToStorage(newPaper);
      setSavedPapers(loadSavedPapers());
      setActivePaper(newPaper);
      setActiveTab('builder');
      setMobileBuilderView('preview');

      showNotification('Examination paper generated successfully!', 'success');

      // Scroll to paper preview
      if (previewContainerRef.current) {
        previewContainerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error('Generation failure: ', err);
      showNotification(err.message || 'Failed to generate question paper. Please check connection and retry.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate single question API call
  const handleRegenerateSingleQuestion = async (targetQuestion: Question) => {
    setIsRegeneratingSingle(true);
    try {
      const response = await fetch('/api/regenerate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: activePaper.examDetails.grade,
          board: activePaper.examDetails.board,
          subject: activePaper.examDetails.subject,
          chapter: targetQuestion.chapter || activePaper.examDetails.subject,
          type: targetQuestion.type,
          marks: targetQuestion.marks,
          difficulty: targetQuestion.difficulty || 'Medium',
          currentText: targetQuestion.text,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate replacement question');
      }

      const newQ = await response.json();

      const updatedQuestion: Question = {
        ...targetQuestion,
        text: newQ.text || targetQuestion.text,
        chapter: newQ.chapter || targetQuestion.chapter,
        options: newQ.options || targetQuestion.options,
        assertion: newQ.assertion || targetQuestion.assertion,
        reason: newQ.reason || targetQuestion.reason,
        answer: newQ.answer || targetQuestion.answer,
        markingScheme: newQ.markingScheme || targetQuestion.markingScheme,
        difficulty: newQ.difficulty || targetQuestion.difficulty,
      };

      const updatedSections = activePaper.sections.map((sec) => ({
        ...sec,
        questions: sec.questions.map((q) => (q.id === targetQuestion.id ? updatedQuestion : q)),
      }));

      const updatedPaper = {
        ...activePaper,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
      };

      setActivePaper(updatedPaper);
      savePaperToStorage(updatedPaper);
      setSavedPapers(loadSavedPapers());
      showNotification(`Replaced Q.${targetQuestion.questionNumber} with new question`, 'success');
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Failed to regenerate question', 'error');
    } finally {
      setIsRegeneratingSingle(false);
    }
  };

  // Update paper in state and storage
  const handleUpdatePaper = (updated: QuestionPaper) => {
    setActivePaper(updated);
    savePaperToStorage(updated);
    setSavedPapers(loadSavedPapers());
  };

  // Duplicate paper
  const handleDuplicatePaper = (paperToDupe: QuestionPaper) => {
    const copy: QuestionPaper = {
      ...paperToDupe,
      id: `paper-${Date.now()}`,
      title: `${paperToDupe.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    savePaperToStorage(copy);
    const updated = loadSavedPapers();
    setSavedPapers(updated);
    setActivePaper(copy);
    setActiveTab('builder');
    showNotification('Paper duplicated successfully', 'success');
  };

  // Rename paper
  const handleRenamePaper = (paperId: string, newTitle: string) => {
    const target = savedPapers.find((p) => p.id === paperId);
    if (!target) return;
    const updated = { ...target, title: newTitle, updatedAt: new Date().toISOString() };
    savePaperToStorage(updated);
    setSavedPapers(loadSavedPapers());
    if (activePaper.id === paperId) {
      setActivePaper(updated);
    }
  };

  // Delete paper
  const handleDeletePaper = (paperId: string) => {
    const remaining = deletePaperFromStorage(paperId);
    setSavedPapers(remaining);
    if (activePaper.id === paperId) {
      if (remaining.length > 0) {
        setActivePaper(remaining[0]);
      } else {
        setActivePaper(SAMPLE_PAPERS[0]);
      }
    }
    showNotification('Paper deleted from library', 'info');
  };

  // Load Preset
  const handleLoadPreset = (preset: QuestionPaper) => {
    const copy: QuestionPaper = {
      ...preset,
      id: `paper-${Date.now()}`,
      title: `${preset.title} (Custom)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    savePaperToStorage(copy);
    setSavedPapers(loadSavedPapers());
    setActivePaper(copy);
    setActiveTab('builder');
    setMobileBuilderView('preview');
    showNotification(`Loaded template: ${preset.title}`, 'success');
  };

  // Start new blank paper
  const handleNewPaper = () => {
    setActiveTab('builder');
    setMobileBuilderView('form');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-18 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-lg text-xs font-medium border ${
              notification.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-800'
                : notification.type === 'error'
                ? 'bg-red-900 text-white border-red-800'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />}
            {notification.type === 'info' && <Info className="w-4 h-4 text-blue-300 shrink-0" />}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 p-0.5 text-white/70 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedPapers.length}
        onNewPaper={handleNewPaper}
        onPrint={printPaperDocument}
        hasActivePaper={!!activePaper}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'builder' && (
          <div className="space-y-4">
            {/* Mobile View Toggle Bar */}
            <div className="lg:hidden flex items-center justify-center p-1 bg-white rounded-lg border border-slate-200 shadow-xs mb-3">
              <button
                onClick={() => setMobileBuilderView('form')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                  mobileBuilderView === 'form'
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Paper Settings</span>
              </button>
              <button
                onClick={() => setMobileBuilderView('preview')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                  mobileBuilderView === 'preview'
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Document Preview</span>
              </button>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Form Deck (Left Column) */}
              <div
                className={`lg:col-span-5 ${
                  mobileBuilderView === 'form' ? 'block' : 'hidden lg:block'
                }`}
              >
                <PaperGeneratorForm
                  onGenerate={handleGeneratePaper}
                  isLoading={isLoading}
                  loadingStepText={loadingStepText}
                />
              </div>

              {/* Paper Preview & Document Editor (Right Column) */}
              <div
                ref={previewContainerRef}
                className={`lg:col-span-7 paper-print-container ${
                  mobileBuilderView === 'preview' ? 'block' : 'hidden lg:block'
                }`}
              >
                <PaperPreview
                  paper={activePaper}
                  onUpdatePaper={handleUpdatePaper}
                  onRegenerateEntirePaper={() => {
                    handleGeneratePaper({
                      schoolName: activePaper.examDetails.schoolName,
                      grade: activePaper.examDetails.grade,
                      board: activePaper.examDetails.board,
                      subject: activePaper.examDetails.subject,
                      examType: activePaper.examDetails.examName,
                      chapters: [],
                      currentChapterInput: '',
                      totalMarks: activePaper.examDetails.maxMarks,
                      duration: activePaper.examDetails.durationFormatted,
                      difficulty: 'Mixed',
                      selectedQuestionTypes: ['mcq', 'vsa', 'sa', 'la'],
                      questionCounts: {},
                      includeAnswerKey: activePaper.includeAnswerKey,
                      includeMarkingScheme: activePaper.includeMarkingScheme,
                      additionalInstructions: '',
                    });
                  }}
                  onRegenerateSingleQuestion={handleRegenerateSingleQuestion}
                  isRegeneratingSingle={isRegeneratingSingle}
                  onNotification={showNotification}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <SavedPapersView
            papers={savedPapers}
            onSelectPaper={(p) => {
              setActivePaper(p);
              setActiveTab('builder');
              setMobileBuilderView('preview');
            }}
            onDuplicatePaper={handleDuplicatePaper}
            onRenamePaper={handleRenamePaper}
            onDeletePaper={handleDeletePaper}
            onNotification={showNotification}
          />
        )}

        {activeTab === 'blueprint' && (
          <BlueprintView
            paper={activePaper}
            onOpenPaper={() => {
              setActiveTab('builder');
              setMobileBuilderView('preview');
            }}
          />
        )}

        {activeTab === 'presets' && <PresetsView onLoadPreset={handleLoadPreset} />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 font-sans print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 font-serif">AI Paper Drafter</span>
            <span>·</span>
            <span>CBSE · ICSE · State Board Curriculum Assessment Engine</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Designed for Educators, Schools & Examination Boards
          </div>
        </div>
      </footer>
    </div>
  );
}
