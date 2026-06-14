import React, { useState } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

const SUGGESTIONS = [
  "Which region had the highest net revenue in Q1 2024?",
  "Compare E-Commerce vs Modern Trade net revenue.",
  "What is the gross profit margin for the Snacks category?",
  "Which sales rep closed the most units in 2025?",
  "What was the best performing product in the West region?"
];

/**
 * Chat Input Component with suggestions
 * @param {object} props
 * @param {function} props.onSendMessage - Handler to submit a message
 * @param {boolean} props.isLoading - Whether the API is loading
 */
export default function ChatInput({ onSendMessage, isLoading }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleSuggestionClick = (suggestion) => {
    if (isLoading) return;
    onSendMessage(suggestion);
  };

  return (
    <div className="w-full flex flex-col gap-3.5 mt-auto">
      {/* Suggestions Chips */}
      <div className="w-full overflow-x-auto pb-1 scrollbar-none">
        <div className="flex gap-2 min-w-max px-1">
          {SUGGESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSuggestionClick(q)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition duration-200 cursor-pointer ${
                isLoading
                  ? 'opacity-40 cursor-not-allowed border-slate-800 bg-slate-900/10 text-slate-500'
                  : 'border-slate-800/80 bg-slate-900/30 text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/30'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
          placeholder={isLoading ? "NovaBite AI is compiling insights..." : "Ask the Sales Assistant a business question..."}
          className="w-full pl-5 pr-24 py-3.5 bg-slate-900/40 border border-slate-800/90 rounded-2xl text-slate-100 text-xs md:text-sm font-semibold shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition duration-300 placeholder-slate-500 disabled:opacity-60 disabled:cursor-not-allowed"
        />
        
        <div className="absolute right-2.5 flex items-center gap-1.5">
          {/* Desktop Enter hint */}
          <span className="hidden sm:flex items-center gap-0.5 text-[9px] font-bold text-slate-600 bg-slate-950/50 border border-slate-800/80 px-1.5 py-0.5 rounded-md">
            Enter
            <CornerDownLeft className="w-2.5 h-2.5" />
          </span>

          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`p-2 rounded-xl flex items-center justify-center transition duration-200 cursor-pointer ${
              !text.trim() || isLoading
                ? 'bg-slate-950/20 border border-slate-900 text-slate-600 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-md shadow-indigo-900/20'
            }`}
            title="Send Query"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
