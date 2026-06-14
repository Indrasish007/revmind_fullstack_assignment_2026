import React from 'react';

/**
 * Animated Typing Indicator for Chat Loading State
 */
export default function TypingIndicator() {
  return (
    <div className="flex justify-start items-center gap-3 py-1">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-xl border border-indigo-500/25 bg-indigo-500/10 flex items-center justify-center text-[15px] shrink-0 shadow-lg shadow-indigo-950/20 select-none">
        🤖
      </div>
      
      {/* Typing Bubble */}
      <div className="glass-panel px-4.5 py-3 rounded-2xl rounded-tl-none border border-slate-800/80 bg-slate-900/40 flex items-center gap-1.5 shadow-md shadow-black/10">
        <span className="w-2 h-2 rounded-full bg-indigo-400/80 animate-bounce duration-300" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-indigo-400/80 animate-bounce duration-300" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-indigo-400/80 animate-bounce duration-300" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
