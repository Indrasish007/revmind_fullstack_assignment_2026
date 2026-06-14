import React from 'react';
import { User, Sparkles } from 'lucide-react';

/**
 * Renders individual chat messages with formatted paragraphs/lists.
 * @param {object} props
 * @param {object} props.message
 * @param {string} props.message.role - 'user' | 'assistant'
 * @param {string} props.message.content - Message text
 * @param {string} props.message.timestamp - Iso date string
 */
export default function MessageBubble({ message }) {
  const { role, content, timestamp } = message;
  const isUser = role === 'user';

  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  // Helper to parse line breaks and basic markdown list structures
  const renderMessageContent = (text) => {
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        return (
          <li key={index} className="ml-5 list-disc my-1 text-slate-300 font-medium text-xs md:text-sm">
            {trimmedLine.replace(/^[\*\-]\s+/, '')}
          </li>
        );
      }
      return (
        <p key={index} className="my-1.5 leading-relaxed text-xs md:text-sm break-words">
          {line}
        </p>
      );
    });
  };

  return (
    <div className={`flex items-start gap-3 w-full py-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      
      {/* Avatar Icon */}
      {isUser ? (
        <div className="w-8 h-8 rounded-xl border border-slate-700 bg-slate-800 flex items-center justify-center shrink-0 shadow-lg shadow-black/10 select-none">
          <User className="w-4 h-4 text-slate-300" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-xl border border-indigo-500/25 bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-950/20 select-none">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Bubble Panel */}
      <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[70%]">
        <div 
          className={`px-4 py-3 rounded-2xl border ${
            isUser 
              ? 'bg-indigo-600/90 border-indigo-500/30 text-white rounded-tr-none shadow-md shadow-indigo-950/10' 
              : 'glass-panel border-slate-800/80 bg-slate-900/40 text-slate-100 rounded-tl-none shadow-md shadow-black/10'
          }`}
        >
          {isUser ? (
            <p className="text-xs md:text-sm font-medium leading-relaxed break-words">{content}</p>
          ) : (
            <div className="text-slate-100 font-medium text-left">
              {renderMessageContent(content)}
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <span className={`text-[9px] font-bold text-slate-500 px-1.5 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(timestamp)}
        </span>
      </div>

    </div>
  );
}
