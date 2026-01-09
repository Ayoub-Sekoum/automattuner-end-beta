import React, { useState } from 'react';
import { generateDetectionScript } from '../services/geminiService';
import { Sparkles, Copy, Check, Terminal, Code2, Command, Zap } from 'lucide-react';

const AiAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setScript('');
    
    try {
      const result = await generateDetectionScript(prompt);
      setScript(result);
    } catch (e) {
      setError("Failed to generate script. Ensure API_KEY is set.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex gap-6 animate-fade-in">
      
      {/* Input Section */}
      <div className="w-1/3 flex flex-col gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] shadow-xl">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Script Architect
            </h2>
            <p className="text-[var(--text-secondary)] text-sm mb-6 leading-relaxed">
                Describe the Intune detection logic in natural language. The AI will compile it into production-ready PowerShell.
            </p>

            <div className="space-y-4">
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. Detect if file config.xml exists in AppData..."
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent outline-none transition-all h-40 resize-none font-medium text-sm"
                    />
                </div>
                
                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                    {loading ? (
                         <>
                            <Zap className="w-4 h-4 animate-pulse fill-white" />
                            Compiling...
                         </>
                    ) : (
                        <>
                            <Command className="w-4 h-4" />
                            Generate Script
                        </>
                    )}
                </button>
            </div>
            
            {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                    {error}
                </div>
            )}
        </div>

        {/* Quick Actions */}
        <div className="flex-1 overflow-y-auto space-y-3">
             <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider px-2">Templates</div>
             {[
                { label: "Registry Key Check", cmd: "Check if registry key HKLM\\SOFTWARE\\Google\\Chrome exists" },
                { label: "File Version Check", cmd: "Check if C:\\App\\bin.exe version is > 1.2" },
                { label: "MSI Product Code", cmd: "Check for MSI product code {1234-5678}" }
             ].map((item, i) => (
                <button 
                    key={i}
                    onClick={() => setPrompt(item.cmd)}
                    className="w-full text-left p-4 glass-card rounded-xl border border-[var(--border-color)] hover:border-indigo-500/30 transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--bg-card)] rounded-lg group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                            <Terminal className="w-4 h-4 text-[var(--text-secondary)]" />
                        </div>
                        <div>
                            <p className="text-[var(--text-primary)] text-sm font-medium">{item.label}</p>
                            <p className="text-[var(--text-secondary)] text-xs truncate max-w-[200px]">{item.cmd}</p>
                        </div>
                    </div>
                </button>
             ))}
        </div>
      </div>

      {/* Output Section (Code Editor Look) */}
      <div className="flex-1 bg-[#1e1e1e] rounded-2xl border border-[var(--border-color)] shadow-2xl flex flex-col overflow-hidden relative">
         <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-white/5">
            <div className="flex items-center gap-2">
                <div className="flex gap-1.5 mr-4">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-[#1e1e1e] rounded text-xs text-slate-300">
                    <Code2 className="w-3 h-3 text-blue-400" />
                    detection_rule.ps1
                </div>
            </div>
            {script && (
                <button
                onClick={copyToClipboard}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-medium bg-white/5 px-3 py-1.5 rounded hover:bg-white/10"
                >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
                </button>
            )}
         </div>

         <div className="flex-1 overflow-auto p-0 relative">
            {!script ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                    <Code2 className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-sm font-medium">Ready to generate code</p>
                </div>
            ) : (
                <div className="p-6">
                    <pre className="font-mono text-sm leading-relaxed">
                        <code className="text-[#d4d4d4]" dangerouslySetInnerHTML={{
                            __html: script
                                .replace(/#.*/g, '<span class="text-[#6a9955]">$&</span>')
                                .replace(/\b(if|else|return|exit)\b/g, '<span class="text-[#c586c0]">$1</span>')
                                .replace(/\b(Test-Path|Get-ItemProperty|Write-Host)\b/g, '<span class="text-[#dcdcaa]">$1</span>')
                                .replace(/".*?"/g, '<span class="text-[#ce9178]">$&</span>')
                        }} />
                    </pre>
                </div>
            )}
         </div>
      </div>

    </div>
  );
};

export default AiAssistant;