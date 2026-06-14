import { useState } from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  FileText, 
  Settings, 
  User, 
  Menu, 
  X,
  Building
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import ChatPage from './components/ChatPage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Unified tab switcher that closes mobile drawer
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-indigo-500 selection:text-white">
      
      {/* 1. Dynamic Background System (Glows & Grids) */}
      <div className="fixed inset-0 grid-overlay z-0 pointer-events-none" />
      <div className="fixed top-[10%] left-[15%] w-[40vw] h-[40vw] bg-indigo-500/10 rounded-full blur-[130px] animate-float-1 z-0 pointer-events-none" />
      <div className="fixed bottom-[15%] right-[10%] w-[35vw] h-[35vw] bg-purple-500/10 rounded-full blur-[130px] animate-float-2 z-0 pointer-events-none" />
      <div className="fixed top-[45%] right-[25%] w-[25vw] h-[25vw] bg-cyan-500/8 rounded-full blur-[120px] animate-float-3 z-0 pointer-events-none" />

      {/* 2. Sticky Top Navigation Bar */}
      <nav className="w-full bg-slate-950/80 border-b border-slate-900/50 backdrop-blur-md sticky top-0 z-50 shadow-md shadow-black/10 shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 select-none shrink-0">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center border border-indigo-400/20 shadow-md shadow-indigo-950/20">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-white leading-none">NovaBite</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Insights</span>
            </div>
          </div>

          {/* Desktop Tab Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-950/50 border border-slate-900 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold tracking-wide transition duration-200 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-900/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => handleTabChange('chat')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold tracking-wide transition duration-200 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-900/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </button>
            <button
              onClick={() => handleTabChange('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold tracking-wide transition duration-200 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-900/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => handleTabChange('reports')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold tracking-wide transition duration-200 cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-900/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Reports</span>
            </button>
            <button
              onClick={() => handleTabChange('settings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold tracking-wide transition duration-200 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-900/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>

          {/* User profile & Mobile Menu controls */}
          <div className="flex items-center gap-4 shrink-0">
            {/* User Profile Info Card */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-900/20 border border-slate-800/80 rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/35 flex items-center justify-center text-xs font-bold text-indigo-400 select-none">
                JD
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-white leading-none">John Doe</span>
                <span className="text-[9px] font-semibold text-slate-500 mt-0.5">Sales Manager</span>
              </div>
            </div>

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/70 text-slate-300 transition cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>

        </div>
      </nav>

      {/* 3. Mobile Navigation Drawer Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-slate-950/95 border-b border-slate-900 backdrop-blur-lg z-40 p-4 flex flex-col gap-2 shadow-2xl animate-fade-in">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => handleTabChange('chat')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Assistant</span>
          </button>
          <button
            onClick={() => handleTabChange('analytics')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => handleTabChange('reports')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
              activeTab === 'reports' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Reports</span>
          </button>
          <button
            onClick={() => handleTabChange('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      )}

      {/* 4. Active Page Main Content (Render z-10 above glows) */}
      <main className="flex-1 flex flex-col z-10 relative">
        {/* Render mock panels for non-chat/dashboard tabs */}
        {activeTab === 'dashboard' && <Dashboard filter="all" />}
        {activeTab === 'chat' && <ChatPage />}
        {activeTab === 'analytics' && <Dashboard filter="analytics" />}
        
        {/* Reports tab mock */}
        {activeTab === 'reports' && (
          <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
            <div className="glass-card p-8 md:p-12 rounded-2xl border border-slate-800/80 shadow-2xl flex flex-col items-center max-w-md bg-slate-900/10 relative">
              <FileText className="w-12 h-12 text-indigo-400 animate-pulse mb-4" />
              <h3 className="text-lg font-bold text-white">Exports & Reporting Center</h3>
              <p className="text-xs text-slate-400 font-medium mt-2 leading-relaxed">
                Download consolidated performance reviews, transaction sheets, or region audits directly. This module is currently loading mock data hooks.
              </p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Settings tab mock */}
        {activeTab === 'settings' && (
          <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
            <div className="glass-card p-8 md:p-12 rounded-2xl border border-slate-800/80 shadow-2xl flex flex-col items-center max-w-md bg-slate-900/10 relative">
              <Settings className="w-12 h-12 text-indigo-400 animate-pulse mb-4" />
              <h3 className="text-lg font-bold text-white">Global Workspace Settings</h3>
              <p className="text-xs text-slate-400 font-medium mt-2 leading-relaxed">
                Configure dataset parameters, SQLite cache durations, CORS whitelist, or update your Groq model configurations from here.
              </p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
      
    </div>
  );
}

export default App;
