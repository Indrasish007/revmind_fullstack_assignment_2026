import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

/**
 * Animated Typing Indicator & Skeleton Response Placeholder
 */
export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 w-full py-3 animate-pulse">
      {/* AI Avatar */}
      <div className="w-8 h-8 rounded-xl border border-indigo-500/25 bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-950/20 select-none">
        <Sparkles className="w-4 h-4 text-white animate-spin duration-[3000ms]" />
      </div>

      {/* Skeleton Bubble Panel */}
      <div className="flex flex-col gap-2.5 w-full max-w-[85%] sm:max-w-[70%] text-left">
        <div className="glass-panel p-4 rounded-2xl rounded-tl-none border border-slate-800/80 bg-slate-900/40 text-slate-400 shadow-md shadow-black/10 flex flex-col gap-3">
          
          {/* Status Message */}
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing sales data...</span>
          </div>

          {/* Skeleton lines */}
          <div className="flex flex-col gap-2">
            <div className="h-3 w-11/12 bg-slate-800/80 rounded-md"></div>
            <div className="h-3 w-4/5 bg-slate-800/70 rounded-md"></div>
            <div className="h-3 w-2/3 bg-slate-800/60 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
