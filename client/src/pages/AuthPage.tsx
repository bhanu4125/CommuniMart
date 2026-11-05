import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ShieldCheck, 
  Home, 
  ShieldAlert, 
  Lock, 
  Mail, 
  KeyRound, 
  User, 
  Phone, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { sounds } from '../lib/sound';
import { toast } from 'sonner';

interface AuthPageProps {
  onSuccess: (portal: 'admin' | 'resident') => void;
  defaultPortal?: 'admin' | 'resident';
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, defaultPortal = 'resident' }) => {
  const { adminLogin, residentLogin, register } = useAuthStore();
  const [activePortal, setActivePortal] = useState<'resident' | 'admin'>(defaultPortal);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [block, setBlock] = useState('Tower A');
  const [flatNumber, setFlatNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('COMMUNITY2025');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePortalSwitch = (portal: 'resident' | 'admin') => {
    setActivePortal(portal);
    setIsRegisterMode(false);
    setEmail('');
    setPassword('');
    sounds.playPop();
  };

  const handleAutoFillAdmin = () => {
    setEmail('vikram.malhotra@example.com');
    setPassword('password123');
    sounds.playPop();
    toast.info('Auto-filled Committee Admin credentials');
  };

  const handleAutoFillResident = () => {
    setEmail('priya.sharma@example.com');
    setPassword('password123');
    sounds.playPop();
    toast.info('Auto-filled Flat Owner (Priya - Tower A-402) credentials');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        if (!name || !email || !password || !phone || !flatNumber) {
          toast.error('Please fill in all resident details');
          setIsSubmitting(false);
          return;
        }

        await register({
          name,
          email,
          password,
          phone,
          phase: 'Phase 1 - Green Meadows',
          block,
          flatNumber,
          verificationCode,
          hideFlatNumber: false
        });

        sounds.playSuccess();
        toast.success('Registration successful! Welcome to Green Meadows.');
        onSuccess('resident');
      } else if (activePortal === 'admin') {
        await adminLogin({ email, password });
        sounds.playSuccess();
        toast.success('Authenticated as Committee Administrator');
        onSuccess('admin');
      } else {
        await residentLogin({ email, password });
        sounds.playSuccess();
        toast.success('Welcome back to your resident portal!');
        onSuccess('resident');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-teal-500/10 via-amber-500/10 to-teal-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 z-10">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-teal-700/25">
          <Building2 className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Communi<span className="text-teal-600 dark:text-teal-400">Mart</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1 font-medium flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 mr-1" />
            Green Meadows Gated Community Authentication
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg z-10">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6">
          {/* Dual Portal Selector Tabs */}
          <div className="p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => handlePortalSwitch('resident')}
              className={`py-3 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all ${
                activePortal === 'resident'
                  ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-300 shadow-md ring-1 ring-zinc-200 dark:ring-zinc-800'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Home className="w-4 h-4 text-teal-600" />
              <span>Resident / Flat Owner</span>
            </button>

            <button
              type="button"
              onClick={() => handlePortalSwitch('admin')}
              className={`py-3 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all ${
                activePortal === 'admin'
                  ? 'bg-amber-500 text-zinc-950 shadow-md ring-1 ring-amber-600/30'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-zinc-950" />
              <span>Committee Admin</span>
            </button>
          </div>

          {/* Portal Header Information */}
          <div className="text-center space-y-1">
            {activePortal === 'admin' ? (
              <>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 mb-1">
                  Managing Committee Portal
                </div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
                  Society Admin Login
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Access committee oversight, resident verification approvals, and society moderation.
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 mb-1">
                  Resident & Household Portal
                </div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
                  {isRegisterMode ? 'Register New Society Unit' : 'Flat Owner Login'}
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  {isRegisterMode
                    ? 'Join Green Meadows to buy, sell, and borrow with verified neighbors.'
                    : 'Access your household hub, listings, active handovers, and community catalog.'}
                </p>
              </>
            )}
          </div>

          {/* Auto-fill Helper Chips */}
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Demo Quick-Fill
              </p>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {activePortal === 'admin' ? 'Committee Lead Credentials' : 'Flat Owner Credentials'}
              </p>
            </div>
            <button
              type="button"
              onClick={activePortal === 'admin' ? handleAutoFillAdmin : handleAutoFillResident}
              className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 font-bold text-xs transition border border-teal-200 dark:border-teal-800"
            >
              ⚡ Fill {activePortal === 'admin' ? 'Admin' : 'Resident'}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Registration Fields if in register mode */}
            {isRegisterMode && activePortal === 'resident' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Resident Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      Tower / Block
                    </label>
                    <select
                      value={block}
                      onChange={(e) => setBlock(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                    >
                      <option value="Tower A">Tower A</option>
                      <option value="Tower B">Tower B</option>
                      <option value="Tower C">Tower C</option>
                      <option value="Villa Grove">Villa Grove</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      Flat / Villa No.
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. A-504"
                      value={flatNumber}
                      onChange={(e) => setFlatNumber(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                {activePortal === 'admin' ? 'Committee Admin Email' : 'Resident Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  required
                  placeholder={
                    activePortal === 'admin'
                      ? 'admin@communimart.com or vikram.malhotra@example.com'
                      : 'priya.sharma@example.com'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-2xl font-extrabold text-xs shadow-lg transition flex items-center justify-center space-x-2 active:scale-98 ${
                activePortal === 'admin'
                  ? 'bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-amber-500/20'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/25'
              }`}
            >
              <span>
                {isSubmitting
                  ? 'Authenticating...'
                  : isRegisterMode
                  ? 'Complete Unit Registration'
                  : activePortal === 'admin'
                  ? 'Enter Committee Admin Dashboard'
                  : 'Enter Flat Owner Dashboard'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle between Login and Register for residents */}
          {activePortal === 'resident' && (
            <div className="text-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  sounds.playPop();
                }}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
              >
                {isRegisterMode
                  ? 'Already have an onboarded flat? Login here'
                  : 'New resident in Green Meadows? Register your flat'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

