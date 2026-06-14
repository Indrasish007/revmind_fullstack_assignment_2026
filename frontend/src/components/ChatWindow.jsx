import React, { useEffect, useRef } from 'react';
import { Sparkles, HelpCircle, TrendingUp, Users, DollarSign, Layers } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

/**
 * Scrollable Chat Window displaying messages, welcome screen, and typing indicator
 * @param {object} props
 * @param {array} props.messages - List of chat message objects
 * @param {boolean} props.isLoading - Whether the API is fetching
 * @param {string|null} props.error - Current error message, if any
 */
export default function ChatWindow({ messages, isLoading, error }) {
  const bottomRef = useRef(null);

  // Auto-scroll on new messages or loading state transitions
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 w-full overflow-y-auto px-1 pr-2 mb-4 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
      
      {isEmpty ? (
        /* Welcome / Empty State Screen */
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-2xl mx-auto h-full">
          <div className="p-4 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 rounded-3xl shadow-xl shadow-indigo-950/20 mb-6 flex items-center justify-center animate-pulse">
            <Sparkles className="w-10 h-10 text-indigo-400" />
          </div>
          
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            NovaBite Sales Assistant
          </h2>
          <p className="text-xs md:text-sm font-semibold text-slate-400 mt-2.5 max-w-md">
            Ask natural language questions about NovaBite sales metrics, categories, margins, channels, or sales reps, and get answers generated directly from the database.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-10 text-left">
            <div className="p-4 bg-slate-900/20 border border-slate-800/60 rounded-2xl flex gap-3">
              <DollarSign className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Revenue & Trends</h4>
                <p className="text-[10px] text-slate-500 font-medium mt-1">Calculate revenues, compare quarters, or analyze growth rates.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/20 border border-slate-800/60 rounded-2xl flex gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Profitability</h4>
                <p className="text-[10px] text-slate-500 font-medium mt-1">Determine gross profit margins for specific categories or items.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/20 border border-slate-800/60 rounded-2xl flex gap-3">
              <Users className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Sales Representatives</h4>
                <p className="text-[10px] text-slate-500 font-medium mt-1">Find top-performing sales representatives by volume or revenue.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/20 border border-slate-800/60 rounded-2xl flex gap-3">
              <Layers className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Distribution Channels</h4>
                <p className="text-[10px] text-slate-500 font-medium mt-1">Compare channels like E-Commerce, Modern Trade, and DTC.</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 mt-8 text-[11px] font-bold text-slate-500">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Select a starter question below or type your own to get started.</span>
          </div>
        </div>
      ) : (
        /* Conversation Stream */
        <div className="flex flex-col gap-3 py-2">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {/* Typing Indicator */}
          {isLoading && <TypingIndicator />}
          
          {/* Error Banner inside chat log */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 my-2 text-rose-400 text-xs md:text-sm text-left shadow-lg">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}
        </div>
      )}
      
      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
