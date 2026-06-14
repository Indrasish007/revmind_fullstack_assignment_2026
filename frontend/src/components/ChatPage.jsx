import React, { useState, useEffect } from 'react';
import { Sparkles, Trash2, ShieldQuestion, X } from 'lucide-react';
import { apiService } from '../services/api';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';

const LOCAL_STORAGE_KEY = 'novabite_chat_history';

/**
 * Chat Page Container matching the Dashboard design
 */
export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  // 1. Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load chat history from localStorage:", e);
    }
  }, []);

  // 2. Persist chat history changes to localStorage
  const saveHistory = (updatedMessages) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMessages));
    } catch (e) {
      console.error("Failed to save chat history to localStorage:", e);
    }
  };

  // Toast notifier helper
  const showToast = (message, type = 'error') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // 3. Clear Chat history
  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the conversation history?")) {
      setMessages([]);
      setError(null);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (e) {
        console.error("Failed to delete chat history from localStorage:", e);
      }
    }
  };

  // 4. Send Message Handler
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    if (isLoading) {
      showToast("Please wait for the assistant to finish responding.", "info");
      return;
    }

    setError(null);
    setIsLoading(true);

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveHistory(updatedMessages);

    try {
      // API call to POST /api/chat
      const response = await apiService.sendChatMessage(text);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: response.timestamp || new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveHistory(finalMessages);
      
    } catch (err) {
      console.error("Detailed Chat Error:", err);
      
      const errMsg = err.message || "";
      let userFriendlyMsg = "Something went wrong while processing your request. Please try again.";
      let errorType = "server"; // 'rate_limit' | 'network' | 'server'
      
      const isRateLimit = /rate[-_ ]?limit|429|limit exceeded|tokens|rpm|tpm/i.test(errMsg);
      const isNetwork = /failed to fetch|network|connection|dns|load resource/i.test(errMsg) || errMsg === "Failed to fetch";
      
      if (isRateLimit) {
        userFriendlyMsg = "AI Assistant is temporarily unavailable due to API usage limits. Please try again in a few minutes.";
        errorType = "rate_limit";
      } else if (isNetwork) {
        userFriendlyMsg = "Unable to connect to the AI service. Please check your connection and try again.";
        errorType = "network";
      }
      
      const structuredError = {
        type: errorType,
        message: userFriendlyMsg,
        rawMessage: errMsg
      };
      
      setError(structuredError);
      showToast(userFriendlyMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-4 md:py-6 flex flex-col h-[calc(100vh-140px)] min-h-[550px] max-h-[850px] text-left">
      
      {/* Toast Notifications Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-slate-900/90 border border-slate-800/80 shadow-2xl backdrop-blur-md px-4 py-3 rounded-xl flex items-center justify-between gap-3 text-xs font-semibold text-slate-100 animate-slide-in relative overflow-hidden"
          >
            {/* Left accent color bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              toast.type === 'error' ? 'bg-rose-500' : 'bg-indigo-500'
            }`} />
            
            <span className="pl-1.5 text-slate-200">{toast.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Sub-Header */}
      <header className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-6 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/25 rounded-xl flex items-center justify-center">
            <ShieldQuestion className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">Sales Assistant Chat</h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Ask questions about products, performance, or regions</p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleClearChat}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 hover:border-rose-500/35 active:bg-rose-500/25 text-rose-400 text-xs font-bold transition duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Clear Conversation History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        )}
      </header>

      {/* Main Glass Panel Wrapper for Window and Input */}
      <div className="flex-1 min-h-0 glass-card p-4 md:p-6 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col overflow-hidden bg-slate-900/10 backdrop-blur-md relative">
        {/* Decorative corner background glows */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-radial from-indigo-500/5 via-transparent to-transparent -ml-16 -mt-16 pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-radial from-cyan-500/5 via-transparent to-transparent -mr-16 -mb-16 pointer-events-none rounded-full" />
        
        <ChatWindow 
          messages={messages} 
          isLoading={isLoading} 
          error={error} 
          onRetry={handleRetry}
          onDismiss={handleDismissError}
          onSendMessage={handleSendMessage}
        />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

    </div>
  );
}
