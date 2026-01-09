import React, { useState } from 'react';
import { LayoutGrid, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Simulate Azure AD Redirect delay
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent z-0"></div>
      
      <div className="w-full max-w-md p-8 glass-panel rounded-2xl shadow-2xl relative z-10 animate-fade-in mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto mb-4">
            AT
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">AutoMatTuner</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-2">Intune Automation & Deployment</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="p-4 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] flex items-center gap-3">
               <div className="w-5 h-5 flex-shrink-0">
                  {/* Microsoft Logo SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
               </div>
               <span className="text-sm font-medium text-[var(--text-primary)]">Sign in with Microsoft Entra ID</span>
            </div>
          </div>
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Access Dashboard
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          
          <div className="text-center">
             <p className="text-xs text-[var(--text-secondary)] flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Secured by Microsoft Graph API
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;