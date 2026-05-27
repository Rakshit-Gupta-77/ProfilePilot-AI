import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const MESSAGES = [
  'Reading your resume…',
  'Checking impact and quantification…',
  'Scoring clarity & writing quality…',
  'Looking at ATS keywords…',
  'Drafting rewrite suggestions…',
  'Almost there…',
];

const LoadingState = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <div className="relative">
        <div
          className="h-20 w-20 rounded-full border-2 border-slate-800 border-t-cyan-500 animate-spin-slow"
        />
        <Sparkles
          size={26}
          className="absolute inset-0 m-auto text-cyan-400 animate-soft-pulse"
          strokeWidth={1.6}
        />
      </div>
      <p
        key={idx}
        className="text-base sm:text-lg font-light uppercase tracking-widest text-slate-400 animate-soft-pulse"
      >
        {MESSAGES[idx]}
      </p>
    </div>
  );
};

export default LoadingState;
