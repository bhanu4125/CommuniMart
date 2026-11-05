import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  PlusCircle, 
  ChevronDown, 
  Store, 
  Bell, 
  ShoppingBag, 
  MessageSquareText, 
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openCreateModal }) => {
  const { user, theme, toggleTheme, isSoundEnabled, toggleSound, togglePrivacy, switchDemoUser } = useAuthStore();
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const demoResidents = [
    { role: 'verified_seller' as UserRole, name: 'Priya Sharma (Baker/Seller)', block: 'Tower A-402' },
    { role: 'committee_admin' as UserRole, name: 'Vikram Malhotra (Admin)', block: 'Tower B-101' },
    { role: 'resident' as UserRole, name: 'Karan Mehra (Audiophile)', block: 'Tower C-302' },
    { role: 'resident' as UserRole, name: 'Sneha Patel (Pending)', block: 'Tower A-303' }
  ];

  return (
    <header className="sticky top-0 z-40 glass-nav transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Society Badge */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('marketplace')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-700/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-white">
                  Communi<span className="text-teal-600 dark:text-teal-400">Mart</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Green Meadows
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
                Hyperlocal Gated Society Marketplace
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'marketplace'
                  ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Marketplace</span>
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'notices'
                  ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notice Board</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'orders'
                  ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders & Lendings</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'chat'
                  ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Direct Chat</span>
            </button>

            {user?.role === 'committee_admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold shadow-sm'
                    : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Panel</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons & Profile Switcher */}
          <div className="flex items-center space-x-2">
            {/* Create Listing CTA */}
            <button
              onClick={openCreateModal}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Listing</span>
            </button>

            {/* Privacy Door Mask Toggle */}
            <button
              onClick={togglePrivacy}
              title={user?.hideFlatNumber ? "Door Number is currently Masked from public (Revealed only upon confirmed order)" : "Door Number is Visible publicly. Click to Mask."}
              className={`hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                user?.hideFlatNumber 
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 text-amber-800 dark:text-amber-300'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300'
              }`}
            >
              {user?.hideFlatNumber ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5 text-teal-600" />}
              <span>{user?.hideFlatNumber ? 'Door Masked' : 'Door Public'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title={isSoundEnabled ? "Disable UI Audio" : "Enable UI Audio"}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4 text-teal-600" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
            </button>

            {/* Resident Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200/70 transition"
              >
                <div className="relative">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-teal-500"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white"></span>
                </div>
                <div className="text-left hidden sm:block max-w-[110px] truncate">
                  <p className="text-xs font-bold truncate text-zinc-900 dark:text-zinc-100">{user?.name || 'Resident'}</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{user?.block || 'Tower A'}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1.5 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                    <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Quick Switch Resident</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">Test different society roles</p>
                  </div>
                  {demoResidents.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        switchDemoUser(item.role);
                        setDemoMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-teal-50 dark:hover:bg-teal-950/40 flex items-center justify-between transition group"
                    >
                      <div>
                        <p className="font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-zinc-500">{item.block}</p>
                      </div>
                      <UserCheck className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-teal-600 transition" />
                    </button>
                  ))}
                  <div className="pt-1 mt-1 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="px-2 py-1 flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Society Phase:</span>
                      <span className="font-medium text-teal-600">{user?.phase || 'Phase 1'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
