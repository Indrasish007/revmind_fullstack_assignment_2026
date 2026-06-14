import { useState } from 'react';
import { Sparkles, LayoutDashboard, MessageSquare } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ChatPage from './components/ChatPage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Sticky Global Top Header */}
      <nav className="w-full bg-slate-950/85 border-b border-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-md shadow-black/10 shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-2.5 select-none">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center border border-indigo-400/25 shadow-md shadow-indigo-950/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm md:text-base font-black tracking-tight text-white block">NovaBite Insights</span>
            </div>
          </div>

          {/* Nav Navigation Tabs */}
          <div className="flex items-center bg-slate-900/50 border border-slate-800/80 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold tracking-wide transition duration-200 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold tracking-wide transition duration-200 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Sales Assistant</span>
            </button>
          </div>

        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'dashboard' ? <Dashboard /> : <ChatPage />}
      </main>
      
    </div>
  );
}

export default App;
