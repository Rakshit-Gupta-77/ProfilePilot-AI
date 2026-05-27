import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import type { ReviewResult, CategoryScores } from '../lib/types';

interface ResultViewProps {
  result: ReviewResult;
  resumeText: string;
  onReset: () => void;
}

const CATEGORY_LABELS: Record<keyof CategoryScores, string> = {
  clarity: 'Clarity',
  impact: 'Impact',
  atsCompatibility: 'ATS',
  structure: 'Structure',
};

const scoreColor = (score: number): string => {
  if (score >= 80) return '#4ade80'; // green
  if (score >= 60) return '#facc15'; // yellow
  if (score >= 40) return '#fb923c'; // orange
  return '#f87171'; // red
};

const scoreLabel = (score: number): string => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Strong';
  if (score >= 55) return 'Decent';
  if (score >= 40) return 'Needs work';
  return 'Weak';
};

const ResultView = ({ result, resumeText, onReset }: ResultViewProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-10 sm:gap-14">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Review another
        </button>
        <span className="text-xs uppercase tracking-widest text-slate-500">
          {resumeText.length.toLocaleString()} chars analysed
        </span>
      </div>

      {/* Hero score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center flex flex-col items-center gap-4 sm:gap-6"
      >
        <span className="text-xs sm:text-sm uppercase tracking-widest text-slate-400">
          Overall Score
        </span>
        <div className="flex flex-col items-center">
          <span
            className="score-gradient font-black leading-none"
            style={{ fontSize: 'clamp(6rem, 22vw, 18rem)' }}
          >
            {result.overallScore}
          </span>
          <span
            className="font-medium uppercase tracking-widest mt-2"
            style={{ color: scoreColor(result.overallScore) }}
          >
            {scoreLabel(result.overallScore)}
          </span>
        </div>
        <p
          className="max-w-2xl font-light text-slate-300 leading-relaxed"
          style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}
        >
          {result.summary}
        </p>
        {result.roleRelevance && (
          <div className="max-w-2xl mt-4 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-50 text-sm sm:text-base leading-relaxed text-left">
            <span className="block font-semibold uppercase tracking-widest text-xs mb-1 text-cyan-400">Role Relevance</span>
            {result.roleRelevance}
          </div>
        )}
      </motion.div>

      {/* Category bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
      >
        {(Object.keys(CATEGORY_LABELS) as Array<keyof CategoryScores>).map(
          (key) => {
            const score = result.categoryScores[key];
            return (
              <div
                key={key}
                className="rounded-3xl border border-slate-700 bg-slate-800/50 p-5 sm:p-6 flex flex-col gap-3"
              >
                <span className="text-xs uppercase tracking-widest text-slate-400">
                  {CATEGORY_LABELS[key]}
                </span>
                <span
                  className="text-3xl sm:text-4xl font-black"
                  style={{ color: scoreColor(score) }}
                >
                  {score}
                  <span className="text-base text-slate-500 font-light">
                    /100
                  </span>
                </span>
                <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: scoreColor(score) }}
                  />
                </div>
              </div>
            );
          },
        )}
      </motion.div>

      {/* Strengths + Weaknesses two-column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8 flex flex-col gap-5"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={22} className="text-emerald-400" strokeWidth={1.6} />
            <h3 className="text-lg sm:text-xl font-medium uppercase tracking-widest text-slate-100">
              Strengths
            </h3>
          </div>
          <ul className="flex flex-col gap-4">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex gap-3 text-slate-300 leading-relaxed">
                <span className="text-emerald-400/60 font-medium shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8 flex flex-col gap-5"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={22} className="text-amber-400" strokeWidth={1.6} />
            <h3 className="text-lg sm:text-xl font-medium uppercase tracking-widest text-slate-100">
              Weaknesses
            </h3>
          </div>
          <ul className="flex flex-col gap-4">
            {result.weaknesses.map((w, i) => (
              <li key={i} className="flex gap-3 text-slate-300 leading-relaxed">
                <span className="text-amber-400/60 font-medium shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>

      {/* Missing sections */}
      {result.missingSections && result.missingSections.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="rounded-3xl border border-slate-700 bg-slate-800/50 p-6 sm:p-8 flex flex-col gap-4"
        >
          <h3 className="text-lg sm:text-xl font-medium uppercase tracking-widest text-slate-100">
            Missing sections
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missingSections.map((m, i) => (
              <span
                key={i}
                className="px-4 py-1.5 rounded-full border border-slate-700 text-sm text-slate-300 bg-slate-800"
              >
                {m}
              </span>
            ))}
          </div>
        </motion.section>
      )}

      {/* Rewrites */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center gap-3">
          <Sparkles size={22} className="text-cyan-400" strokeWidth={1.6} />
          <h3 className="text-lg sm:text-xl font-medium uppercase tracking-widest text-slate-100">
            Suggested rewrites
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          {result.rewrites.map((r, i) => (
            <article
              key={i}
              className="rounded-3xl border border-slate-700 bg-slate-800/50 p-5 sm:p-6 md:p-7 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-slate-400">
                  Rewrite {i + 1}
                </span>
                <span className="text-xs uppercase tracking-widest text-slate-500">
                  · {r.reason}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-5 items-stretch">
                <div className="rounded-2xl bg-slate-900 border border-amber-500/20 p-4 sm:p-5">
                  <span className="text-xs uppercase tracking-widest text-amber-400/80 block mb-2">
                    Original
                  </span>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed line-through decoration-amber-500/40">
                    {r.original}
                  </p>
                </div>

                <div className="hidden md:flex items-center justify-center">
                  <ChevronRight size={22} className="text-slate-500" strokeWidth={1.6} />
                </div>

                <div className="rounded-2xl bg-slate-900 border border-emerald-500/20 p-4 sm:p-5">
                  <span className="text-xs uppercase tracking-widest text-emerald-400/80 block mb-2">
                    Suggested
                  </span>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                    {r.suggested}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </motion.section>

      {/* Footer CTA */}
      <div className="flex justify-center pt-4 pb-12">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-3 rounded-full border-2 border-slate-600 px-10 py-4 text-sm sm:text-base font-medium uppercase tracking-widest text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={18} strokeWidth={1.8} />
          Review another resume
        </button>
      </div>
    </div>
  );
};

export default ResultView;
