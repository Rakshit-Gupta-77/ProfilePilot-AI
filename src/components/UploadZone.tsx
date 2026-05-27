import { useRef, useState } from 'react';
import { UploadCloud, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { extractTextFromPdf } from '../lib/pdfExtract';

interface UploadZoneProps {
  onSubmit: (resumeText: string, jobTitle: string) => void;
  isProcessing: boolean;
}

type Mode = 'upload' | 'paste';

const MAX_CHARS = 30_000;
const MIN_CHARS = 100;

const UploadZone = ({ onSubmit, isProcessing }: UploadZoneProps) => {
  const [mode, setMode] = useState<Mode>('upload');
  const [text, setText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported. Use the "Paste text" tab for other formats.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('PDF is too large (max 10 MB).');
      return;
    }

    setFileName(file.name);
    setIsExtracting(true);
    try {
      const extracted = await extractTextFromPdf(file);
      setText(extracted.slice(0, MAX_CHARS));
    } catch (err) {
      const code = err instanceof Error ? err.message : 'PDF_INVALID';
      if (code === 'PDF_NO_TEXT') {
        setError(
          "Couldn't extract text — this looks like a scanned/image PDF. Switch to \"Paste text\" instead.",
        );
      } else {
        setError("That doesn't look like a valid PDF. Try a different file.");
      }
      setFileName(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = () => {
    setError(null);
    const trimmed = text.trim();
    if (trimmed.length < MIN_CHARS) {
      setError(`Need at least ${MIN_CHARS} characters of resume text.`);
      return;
    }
    onSubmit(trimmed, jobTitle.trim());
  };

  const charCount = text.length;
  const overLimit = charCount > MAX_CHARS;
  const canSubmit = charCount >= MIN_CHARS && !overLimit && !isProcessing && !isExtracting;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Mode tabs */}
      <div className="flex gap-2 mb-6 p-1 rounded-full border border-slate-700 bg-slate-800/50 w-fit mx-auto shadow-sm">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-5 py-2 rounded-full text-sm uppercase tracking-widest font-medium transition-colors ${
            mode === 'upload'
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Upload PDF
        </button>
        <button
          type="button"
          onClick={() => setMode('paste')}
          className={`px-5 py-2 rounded-full text-sm uppercase tracking-widest font-medium transition-colors ${
            mode === 'paste'
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Paste text
        </button>
      </div>

      {/* Dropzone / textarea */}
      {mode === 'upload' ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`w-full rounded-[32px] border-2 border-dashed p-10 sm:p-14 transition-all ${
            isDragging
              ? 'border-cyan-500 bg-cyan-950/20'
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800 shadow-sm'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <div className="flex flex-col items-center gap-4 text-center">
            {fileName ? (
              <>
                <FileText size={48} className="text-slate-400" strokeWidth={1.4} />
                <div className="flex flex-col gap-1">
                  <span className="text-base sm:text-lg font-medium text-slate-200 break-all">
                    {fileName}
                  </span>
                  {isExtracting ? (
                    <span className="text-sm text-slate-500 animate-soft-pulse">
                      Extracting text…
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">
                      {charCount.toLocaleString()} characters extracted · click to replace
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <UploadCloud size={48} className="text-slate-500" strokeWidth={1.4} />
                <div className="flex flex-col gap-1">
                  <span className="text-base sm:text-lg font-medium text-slate-300">
                    Drop your resume PDF here, or click to browse
                  </span>
                  <span className="text-sm text-slate-500">
                    PDF only · max 10 MB · text is never stored
                  </span>
                </div>
              </>
            )}
          </div>
        </button>
      ) : (
        <div className="w-full rounded-[32px] border border-slate-700 bg-slate-800 overflow-hidden shadow-sm">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your full resume text here…"
            className="w-full h-64 p-5 sm:p-6 bg-transparent text-slate-200 font-light placeholder:text-slate-500 resize-none focus:outline-none text-sm sm:text-base leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
          <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-slate-700 text-xs text-slate-500 uppercase tracking-widest">
            <span>{charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} chars</span>
            <span>{charCount < MIN_CHARS ? `${MIN_CHARS - charCount} more needed` : 'Ready'}</span>
          </div>
        </div>
      )}

      {/* Job Title Input */}
      <div className="mt-6 flex justify-center">
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Target Job Title (e.g., Senior Frontend Engineer)"
          className="w-full max-w-md rounded-full border border-slate-700 bg-slate-800/50 px-6 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-sm transition-all"
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle size={20} className="shrink-0 mt-0.5" strokeWidth={1.6} />
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="inline-flex items-center gap-3 rounded-full px-10 py-4 text-sm sm:text-base font-medium uppercase tracking-widest text-slate-900 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 bg-cyan-400 hover:bg-cyan-300 shadow-md"
        >
          <Sparkles size={18} strokeWidth={1.8} />
          {isProcessing ? 'Reviewing…' : 'Review my resume'}
        </button>
      </div>
    </div>
  );
};

export default UploadZone;
