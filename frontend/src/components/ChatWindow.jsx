import React, { useEffect, useRef } from 'react';
import { Sparkles, HelpCircle, TrendingUp, Users, DollarSign, Layers, AlertTriangle, RotateCw, X } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const STARTER_QUESTIONS = [
  "Which region had the highest net revenue in Q1 2024?",
  "Compare E-Commerce vs Modern Trade net revenue.",
  "What is the gross profit margin for the Snacks category?",
  "Which sales rep closed the most units in 2025?",
  "What was the best performing product in the West region?"
];

/**
 * Scrollable Chat Window displaying messages, welcome screen, and typing indicator
 * @param {object} props
 * @param {array} props.messages - List of chat message objects
 * @param {boolean} props.isLoading - Whether the API is fetching
 * @param {object|null} props.error - Current structured error object, if any
 * @param {function} props.onRetry - Handler to retry the request
 * @param {function} props.onDismiss - Handler to dismiss the error
 * @param {function} props.onSendMessage - Handler to send a starter question
 */
export default function ChatWindow({ messages, isLoading, error, onRetry, onDismiss, onSendMessage }) {
  const scrollContainerRef = useRef(null);

  // Auto-scroll on new messages or loading state transitions
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading, error]);

  const isEmpty = messages.length === 0;

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 min-h-0 w-full overflow-y-auto px-1 pr-2 mb-4 text-left"
    >
      
      {isEmpty ? (
        /* Welcome / Empty State Screen */
        <div className="flex flex-col items-center justify-center py-6 md:py-12 px-4 text-center max-w-2xl mx-auto h-full">
          <div className="p-4 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 rounded-3xl shadow-xl shadow-indigo-950/20 mb-5 flex items-center justify-center animate-pulse">
            <Sparkles className="w-10 h-10 text-indigo-400" />
          </div>
          
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            NovaBite Sales Assistant
          </h2>
          <p className="text-xs md:text-sm font-semibold text-slate-400 mt-2 max-w-md">
            Ask natural language questions about NovaBite sales metrics, categories, margins, channels, or sales reps, and get answers generated directly from the database.
          </p>

          {/* Quick Action Suggested Questions Chips in Empty State */}
          <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-xl">
            {STARTER_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSendMessage && onSendMessage(q)}
                className="px-3 py-1.5 rounded-xl border border-slate-800/80 bg-slate-900/20 hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/30 text-[10px] sm:text-[11px] font-bold text-slate-400 transition cursor-pointer text-left duration-200"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-8 text-left border-t border-slate-900/60 pt-8">
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
        </div>
      ) : (
        /* Conversation Stream */
        <div className="flex flex-col gap-3 py-2">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {/* Skeleton response & Typing Indicator */}
          {isLoading && <TypingIndicator />}
          
          {/* Polished Error Card */}
          {error && (
            <div className="bg-rose-950/20 border border-rose-500/25 rounded-2xl p-4.5 my-3 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start gap-3.5 text-left animate-fade-in relative overflow-hidden">
              <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                  {error.type === 'rate_limit' ? 'Rate Limit Exceeded' : error.type === 'network' ? 'Connection Failed' : 'Service Error'}
                </h4>
                <p className="text-xs font-semibold text-slate-300 mt-1 leading-relaxed">
                  {error.message}
                </p>
                
                {error.type === 'rate_limit' && (
                  <ul className="list-disc ml-4 mt-2 text-[10px] text-slate-400 font-semibold space-y-1">
                    <li>Please wait a few minutes before trying again.</li>
                    <li>Try asking a different or simpler question.</li>
                    <li>Contact the system administrator if the issue persists.</li>
                  </ul>
                )}
                
                <div className="flex items-center gap-2 mt-3.5">
                  {onRetry && (
                    <button
                      type="button"
                      onClick={onRetry}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-600/20 hover:bg-indigo-600/35 hover:border-indigo-500/50 active:bg-indigo-600/50 text-indigo-300 text-[10px] font-bold transition cursor-pointer"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Retry Request</span>
                    </button>
                  )}
                  {onDismiss && (
                    <button
                      type="button"
                      onClick={onDismiss}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-slate-300 text-[10px] font-bold transition cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      <span>Dismiss</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
