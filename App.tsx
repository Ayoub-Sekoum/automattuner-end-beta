import React, { useState, useEffect } from 'react';
import { Tab, IntuneApp, AppStatus, LogEntry } from './types';
import Dashboard from './components/Dashboard';
import AppManager from './components/AppManager';
import AiAssistant from './components/AiAssistant';
import Settings from './components/Settings';
import Login from './components/Login';
import { LayoutGrid, Layers, Cpu, Settings as SettingsIcon, LogOut, Search, Bell, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  
  // Apps State
  const [apps, setApps] = useState<IntuneApp[]>([
    { id: '1', name: 'Google Chrome', version: '119.0.6045', status: AppStatus.IDLE, progress: 0, lastUpdated: 'Today', size: '105 MB' },
    { id: '2', name: '7-Zip', version: '23.01', status: AppStatus.IDLE, progress: 0, lastUpdated: 'Today', size: '1.5 MB' },
    { id: '3', name: 'Adobe Reader DC', version: '2023.006', status: AppStatus.ERROR, progress: 45, lastUpdated: 'Yesterday', size: '240 MB' },
    { id: '4', name: 'VLC Media Player', version: '3.0.18', status: AppStatus.SUCCESS, progress: 100, lastUpdated: 'Yesterday', size: '40 MB' },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '0', timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: 'System initialization complete.' },
    { id: '1', timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: 'Graph API Connection: ESTABLISHED' },
  ]);

  // Apply Theme to Body
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  // Upload Simulation Logic
  const startUpload = () => {
    setActiveTab(Tab.APPS);
    const newLogs = [...logs, { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'INFO' as const, message: 'Initiating batch upload sequence...' }];
    setLogs(newLogs);

    const updatedApps = apps.map(app => 
      app.status === AppStatus.IDLE ? { ...app, status: AppStatus.PACKAGING, progress: 5 } : app
    );
    setApps(updatedApps);

    let progress = 5;
    const interval = setInterval(() => {
      progress += 5;
      
      if (Math.random() > 0.6) {
        setLogs(prev => [...prev, {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          level: 'INFO',
          message: `Packaging stream [${(Math.random() * 1000).toFixed(0)}] processed.`
        }]);
      }

      setApps(currentApps => currentApps.map(app => {
        if (app.status === AppStatus.PACKAGING || app.status === AppStatus.UPLOADING) {
          if (progress >= 100) {
             const isFailure = app.name === '7-Zip'; 
             if (isFailure) {
                setLogs(prev => [...prev, {
                    id: Date.now().toString(),
                    timestamp: new Date().toLocaleTimeString(),
                    level: 'ERROR',
                    message: `FATAL: ${app.name} upload rejected. 401 Unauthorized.`
                }]);
                return { ...app, status: AppStatus.ERROR, progress: 85 };
             }
             return { ...app, status: AppStatus.SUCCESS, progress: 100 };
          }
          const newStatus = progress > 30 ? AppStatus.UPLOADING : AppStatus.PACKAGING;
          return { ...app, status: newStatus, progress };
        }
        return app;
      }));

      if (progress >= 100) {
        clearInterval(interval);
        setLogs(prev => [...prev, { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', message: 'Batch sequence completed.' }]);
      }
    }, 600);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD: return <Dashboard apps={apps} />;
      case Tab.APPS: return <AppManager apps={apps} logs={logs} onUploadStart={startUpload} />;
      case Tab.AI_ASSISTANT: return <AiAssistant />;
      case Tab.SETTINGS: return <Settings />;
      default: return <Dashboard apps={apps} />;
    }
  };

  const NavItem = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
        activeTab === tab 
          ? 'text-[var(--text-primary)] bg-[var(--bg-card)] shadow-lg shadow-black/5 border border-[var(--border-color)]' 
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
      }`}
    >
      <Icon className={`w-5 h-5 transition-colors ${activeTab === tab ? 'text-indigo-500' : 'text-[var(--text-secondary)] group-hover:text-indigo-400'}`} />
      <span className="font-medium tracking-wide text-sm">{label}</span>
      {activeTab === tab && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"></div>}
    </button>
  );

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen text-[var(--text-primary)]">
      {/* Sidebar */}
      <aside className="w-72 glass-panel border-r-0 m-4 rounded-3xl flex flex-col shadow-2xl z-20">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              AT
            </div>
            <div>
                <h1 className="font-bold text-[var(--text-primary)] tracking-tight leading-tight">AutoMatTuner</h1>
                <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-semibold">Monitor v2.0</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem tab={Tab.DASHBOARD} icon={LayoutGrid} label="Dashboard" />
          <NavItem tab={Tab.APPS} icon={Layers} label="App Manager" />
          <NavItem tab={Tab.AI_ASSISTANT} icon={Cpu} label="AI Architect" />
          <NavItem tab={Tab.SETTINGS} icon={SettingsIcon} label="Settings" />
        </nav>

        <div className="p-4 mt-auto">
          <div className="glass-card p-4 rounded-xl mb-4">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">System Online</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">Latency: 24ms</p>
                </div>
             </div>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-3 text-[var(--text-secondary)] hover:text-red-400 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-24 flex items-center justify-between px-8 pt-6 pb-2 z-10">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                {activeTab === Tab.DASHBOARD && 'Mission Control'}
                {activeTab === Tab.APPS && 'Deployment Center'}
                {activeTab === Tab.AI_ASSISTANT && 'Neural Script Engine'}
                {activeTab === Tab.SETTINGS && 'Settings'}
            </h2>
            <p className="text-[var(--text-secondary)] text-sm">Welcome back, Administrator</p>
          </div>

          <div className="flex items-center gap-4">
             {/* Theme Toggle */}
             <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-indigo-400 transition-all"
             >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>

             <div className="relative group hidden md:block">
                <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search logs, apps..." 
                    className="pl-10 pr-4 py-2 rounded-full text-sm w-64 transition-all"
                />
             </div>
             <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[var(--bg-main)]"></span>
             </button>
             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-[var(--border-color)] shadow-lg"></div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto px-8 pb-8 pt-2">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;