import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Server,
  Database,
  Cpu,
  Building2,
  Sparkles,
  Activity,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';

interface PlatformLoginProps {
  onSwitchToClinicLogin?: () => void;
  onSwitchToClinic?: () => void;
}

export const PlatformLogin: React.FC<PlatformLoginProps> = ({
  onSwitchToClinicLogin,
  onSwitchToClinic,
}) => {
  const switchPortal = onSwitchToClinic || onSwitchToClinicLogin;
  const { loginPlatform } = useAuth();
  
  const [email, setEmail] = useState('admin@clinicfirst.ai');
  const [password, setPassword] = useState('PlatformAdmin2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginPlatform(email.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#083B4A] text-white flex flex-col justify-between selection:bg-[#0F4C5C]/30 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0F4C5C]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#0F4C5C]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-[#0F4C5C]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#083B4A] flex items-center justify-center text-white font-black text-sm shadow-md border border-[#0F4C5C]/40">
            CF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white tracking-tight text-base sm:text-lg">
                CLINICFIRST
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-white/10 text-slate-200 border border-white/20">
                PLATFORM ROOT
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium hidden sm:block">
              Multi-Tenant Cluster, Voice Pipeline Orchestration & Master Telephony
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xs border border-white/15 rounded-full text-xs text-white shadow-xs">
            <Shield className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-semibold text-[11px]">Hardware Enclave Active</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex items-center justify-center z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Platform Infrastructure Overview */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 pr-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-slate-200">
                <Cpu className="w-3.5 h-3.5 text-slate-300" />
                <span>Global Multi-Tenant Infrastructure</span>
              </div>
              <h1 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Master Control Center &<br />
                <span className="text-[#0F4C5C]/80">Telephony Node Orchestration.</span>
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                Manage clinic deployments, inspect real-time SIP trunk streams, monitor speech latency thresholds, and provision enterprise clinical integrations.
              </p>
            </div>

            {/* Live Infrastructure Status Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-200">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Production Cluster Alpha-01</h4>
                    <p className="text-[11px] text-slate-400">Asia-Southeast & US-East Regional Gateways</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>99.99% UP</span>
                </div>
              </div>

              {/* Node Metrics */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-base font-extrabold text-white font-mono">14</div>
                  <div className="text-[10px] text-slate-400">Active Clinics</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-base font-extrabold text-white font-mono">1,842</div>
                  <div className="text-[10px] text-slate-400">Calls Today</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-base font-extrabold text-amber-300 font-mono">420ms</div>
                  <div className="text-[10px] text-slate-400">TTS Latency</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <KeyRound className="w-4 h-4 text-slate-300" />
              <span>Restricted Root Access. All commands and queries are audit-logged for compliance.</span>
            </div>
          </div>

          {/* Right Column: Platform Login Card */}
          <div className="w-full lg:col-span-6 max-w-md mx-auto">
            <div className="bg-white text-[#172B3A] border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              
              <div className="space-y-2 mb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#083B4A]/10 text-[#083B4A] text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C5C]" />
                  <span>Root SuperAdmin Console</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#083B4A]">
                  Platform Sign-In
                </h2>
                <p className="text-xs text-[#64748B] font-medium">
                  Authenticate with authorized Master Root credentials.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569]">
                    Master Admin Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@clinicfirst.ai"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-xl focus:border-[#083B4A] focus:ring-2 focus:ring-[#083B4A]/15 text-[#172B3A] placeholder-[#94A3B8] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569]">
                    Master Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-xl focus:border-[#083B4A] focus:ring-2 focus:ring-[#083B4A]/15 text-[#172B3A] placeholder-[#94A3B8] outline-none transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#475569] cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full bg-[#083B4A] hover:bg-[#0F4C5C] text-white shadow-md shadow-[#083B4A]/20 hover:shadow-lg font-bold text-sm py-3 cursor-pointer"
                    loading={loading}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Enter Platform SuperAdmin
                  </Button>
                </div>
              </form>

              {/* Demo Account Fill Helper Chip */}
              <div className="mt-5 pt-4 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@clinicfirst.ai');
                    setPassword('PlatformAdmin2026!');
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#083B4A] text-xs text-[#172B3A] transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <span className="font-semibold block">Auto-Fill SuperAdmin</span>
                    <span className="text-[11px] text-[#64748B]">admin@clinicfirst.ai</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#083B4A] px-2 py-0.5 bg-white border border-[#E2E8F0] rounded">
                    PlatformAdmin2026!
                  </span>
                </button>
              </div>

              {/* Back to Clinic Login */}
              <div className="mt-4 pt-3 text-center">
                <button
                  type="button"
                  id="switch-to-clinic-btn"
                  onClick={switchPortal}
                  className="text-xs text-[#083B4A] hover:text-[#0F4C5C] hover:underline font-semibold cursor-pointer py-1 px-2 rounded hover:bg-[#083B4A]/5 transition-colors"
                >
                  ← Return to Clinic Staff & Doctor Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 z-10">
        <span>CLINICFIRST Master Control Infrastructure • Internal Platform v2.4.0</span>
        <span className="hidden sm:inline">Authorized Administrative Personnel Only</span>
      </footer>
    </div>
  );
};


