import React, { useState, useEffect } from 'react';
import { AutoMatConfig } from '../types';
import { Save, Eye, EyeOff, Shield, Folder, Key, Lock, Loader2, CheckCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [config, setConfig] = useState<AutoMatConfig>({
    intune_tenant_id: '',
    intune_client_id: '',
    intune_client_secret: '',
    powershell_cert_thumbprint: '',
    default_logo_path: 'logos/default_logo.png',
    temp_package_dir: 'temp_packages',
    wintuner_download_dir: '.\\wintuner_downloads',
    required_permissions: ['DeviceManagementApps.ReadWrite.All', 'Group.Read.All']
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Failed to fetch config", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        setSuccessMsg('Configuration saved successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (error) {
      console.error("Failed to save config", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof AutoMatConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-indigo-500"/></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">System Configuration</h2>
            <p className="text-[var(--text-secondary)] text-sm">Configure connection parameters for AutoMatTuner</p>
        </div>
        <div className="flex items-center gap-3">
          {successMsg && (
            <span className="text-emerald-500 text-sm flex items-center gap-1 animate-fade-in">
              <CheckCircle className="w-4 h-4" /> {successMsg}
            </span>
          )}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg shadow-lg shadow-indigo-500/20 text-sm font-medium transition-all"
          >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Authentication Section */}
      <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)]">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            Azure AD Authentication
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Intune Tenant ID</label>
                <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                    <input 
                        type="text" 
                        value={config.intune_tenant_id}
                        onChange={(e) => handleChange('intune_tenant_id', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg text-sm font-mono border transition-all focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Client ID</label>
                <div className="relative">
                    <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                    <input 
                        type="text" 
                        value={config.intune_client_id}
                        onChange={(e) => handleChange('intune_client_id', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg text-sm font-mono border transition-all focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
            </div>
            <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Client Secret</label>
                <div className="relative">
                    <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                    <input 
                        type={showSecret ? "text" : "password"} 
                        value={config.intune_client_secret}
                        onChange={(e) => handleChange('intune_client_secret', e.target.value)}
                        className="w-full pl-10 pr-12 py-2 rounded-lg text-sm font-mono border transition-all focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button 
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                        {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  Initially populated from Azure deployment settings. Updates here are saved locally to the container.
                </p>
            </div>
        </div>
      </div>

      {/* Environment Paths */}
      <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)]">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Folder className="w-5 h-5 text-indigo-400" />
            Environment Paths
        </h3>
        <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Default Logo Path</label>
                <input 
                    type="text" 
                    value={config.default_logo_path}
                    onChange={(e) => handleChange('default_logo_path', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg text-sm font-mono border transition-all"
                />
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Temp Package Dir</label>
                    <input 
                        type="text" 
                        value={config.temp_package_dir}
                        onChange={(e) => handleChange('temp_package_dir', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg text-sm font-mono border transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">WinTuner Download Dir</label>
                    <input 
                        type="text" 
                        value={config.wintuner_download_dir}
                        onChange={(e) => handleChange('wintuner_download_dir', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg text-sm font-mono border transition-all"
                    />
                </div>
            </div>
        </div>
      </div>

       {/* Permissions */}
       <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)]">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            Required API Permissions
        </h3>
        <div className="space-y-3">
            {config.required_permissions && config.required_permissions.map((perm, index) => (
                <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-mono text-[var(--text-primary)]">{perm}</span>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default Settings;
