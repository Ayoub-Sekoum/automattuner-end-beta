import React, { useState, useEffect, useRef } from 'react';
import { IntuneApp, AppStatus, LogEntry } from '../types';
import { Play, FileBox, CheckCircle, XCircle, Loader2, Terminal, AlertCircle, Cpu, HardDrive } from 'lucide-react';
import { analyzeErrorLog } from '../services/geminiService';

interface AppManagerProps {
  apps: IntuneApp[];
  logs: LogEntry[];
  onUploadStart: () => void;
}

const AppManager: React.FC<AppManagerProps> = ({ apps, logs, onUploadStart }) => {
  const logEndRef = useRef<HTMLDivElement>(null);
  const [selectedApp, setSelectedApp] = useState<IntuneApp | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleAnalyzeError = async (app: IntuneApp) => {
    if (app.status !== AppStatus.ERROR) return;
    const errorLog = logs.slice().reverse().find(l => l.level === 'ERROR');
    if (!errorLog) return;
    setAnalyzing(true);
    setAiAnalysis(null);
    setSelectedApp(app);
    const result = await analyzeErrorLog(errorLog.message);
    setAiAnalysis(result);
    setAnalyzing(false);
  };

  const getStatusBadge = (status: AppStatus) => {
    switch (status) {
      case AppStatus.SUCCESS: return <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">DEPLOYED</span>;
      case AppStatus.ERROR: return <span className="text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">FAILED</span>;
      case AppStatus.PACKAGING: return <span className="text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded animate-pulse">PACKING</span>;
      case AppStatus.UPLOADING: return <span className="text-xs font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded animate-pulse">UPLOADING</span>;
      default: return <span className="text-xs font-bold text-[var(--text-secondary)] bg-[var(--text-secondary)]/10 border border-[var(--text-secondary)]/20 px-2 py-1 rounded">QUEUED</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* App List */}
      <div className="xl:col-span-2 glass-panel rounded-2xl border border-[var(--border-color)] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-card)]">
          <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2 tracking-tight">
            <HardDrive className="w-5 h-5 text-indigo-400" />
            Packaging Queue
          </h3>
          <button 
            onClick={onUploadStart}
            disabled={apps.some(a => a.status === AppStatus.PACKAGING || a.status === AppStatus.UPLOADING)}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-[var(--bg-card)] disabled:text-[var(--text-secondary)] text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20"
          >
            {apps.some(a => a.status === AppStatus.PACKAGING || a.status === AppStatus.UPLOADING) ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                EXEC_RUNNING...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                INITIATE
              </>
            )}
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-2">
            <div className="grid grid-cols-12 text-xs uppercase text-[var(--text-secondary)] font-bold tracking-wider px-4 mb-2">
                <div className="col-span-5">Application</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-2 text-right">Progress</div>
            </div>
          {apps.map((app) => (
            <div 
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`grid grid-cols-12 items-center p-4 rounded-xl border transition-all cursor-pointer group ${
                selectedApp?.id === app.id 
                ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-indigo-500/30'
              }`}
            >
              <div className="col-span-5 flex items-center gap-3">
                <div className="p-2 rounded bg-[var(--bg-main)] border border-[var(--border-color)]">
                    <FileBox className="w-5 h-5 text-[var(--text-secondary)]" />
                </div>
                <div>
                  <h4 className="text-[var(--text-primary)] font-semibold text-sm">{app.name}</h4>
                  <p className="text-[10px] text-[var(--text-secondary)] font-mono">v{app.version}</p>
                </div>
              </div>
              <div className="col-span-2 text-xs text-[var(--text-secondary)] font-mono">{app.size}</div>
              <div className="col-span-3">{getStatusBadge(app.status)}</div>
              <div className="col-span-2 flex flex-col items-end gap-1">
                 <span className="text-xs font-mono text-[var(--text-secondary)]">{app.progress}%</span>
                 <div className="w-full bg-[var(--bg-main)] h-1.5 rounded-full overflow-hidden">
                    <div 
                    className={`h-full transition-all duration-500 ${app.status === AppStatus.ERROR ? 'bg-red-500' : 'bg-indigo-500'}`}
                    style={{ width: `${app.progress}%` }}
                    />
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs & Details */}
      <div className="flex flex-col gap-6 h-full overflow-hidden">
        {/* Terminal */}
        <div className="flex-1 bg-[#0c0c0e] rounded-2xl border border-[var(--border-color)] shadow-2xl flex flex-col overflow-hidden font-mono text-xs">
          <div className="p-3 border-b border-white/10 bg-[#141417] flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
              <Terminal className="w-3 h-3" />
              /var/log/syslog
            </span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 leading-relaxed opacity-90 hover:opacity-100 transition-opacity">
                <span className="text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
                <span className={`${
                  log.level === 'ERROR' ? 'text-red-400 font-bold' : 
                  log.level === 'WARN' ? 'text-amber-400' : 
                  log.level === 'SUCCESS' ? 'text-emerald-400' : 'text-slate-300'
                }`}>
                  {log.level === 'INFO' && <span className="text-indigo-400 mr-2">➜</span>}
                  {log.message}
                </span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

        {/* AI Analysis Panel */}
        {selectedApp && (
          <div className="h-auto min-h-[160px] glass-panel rounded-2xl border border-[var(--border-color)] shadow-xl p-5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="flex justify-between items-start mb-3 relative z-10">
                <div>
                    <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-indigo-400" />
                        Diagnostic: {selectedApp.name}
                    </h4>
                </div>
                {selectedApp.status === AppStatus.ERROR && (
                   <button 
                    onClick={() => handleAnalyzeError(selectedApp)}
                    disabled={analyzing}
                    className="text-xs flex items-center gap-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 px-3 py-1.5 rounded-md border border-indigo-500/30 transition-all"
                   >
                     {analyzing ? <Loader2 className="w-3 h-3 animate-spin"/> : <AlertCircle className="w-3 h-3" />}
                     Neural Analysis
                   </button>
                )}
             </div>
             
             {analyzing && (
               <div className="text-indigo-400/80 text-sm animate-pulse flex items-center gap-2">
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                 Processing logs with Gemini 3.0 Flash...
               </div>
             )}

             {!analyzing && aiAnalysis && selectedApp.status === AppStatus.ERROR && (
               <div className="bg-[var(--bg-main)] border border-indigo-500/30 p-4 rounded-lg text-sm text-[var(--text-secondary)] shadow-inner relative z-10">
                 <div className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">AI Root Cause Analysis</div>
                 {aiAnalysis}
               </div>
             )}

             {!analyzing && !aiAnalysis && (
               <div className="text-[var(--text-secondary)] text-sm mt-4 relative z-10">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[var(--bg-card)] p-2 rounded">
                        <span className="block text-[10px] uppercase text-[var(--text-secondary)] font-bold">Size</span>
                        <span className="text-[var(--text-primary)] font-mono">{selectedApp.size}</span>
                    </div>
                    <div className="bg-[var(--bg-card)] p-2 rounded">
                        <span className="block text-[10px] uppercase text-[var(--text-secondary)] font-bold">Sync</span>
                        <span className="text-[var(--text-primary)] font-mono">{selectedApp.lastUpdated}</span>
                    </div>
                 </div>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppManager;