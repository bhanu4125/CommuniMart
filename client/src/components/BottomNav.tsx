import React from 'react';
import { motion } from 'framer-motion';
import { Store, Bell, ShoppingBag, MessageSquareText, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuthStore();

  const tabs = [
    { id: 'marketplace', label: 'Market', icon: Store },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'chat', label: 'Chat', icon: MessageSquareText },
    ...(user?.role === 'committee_admin' ? [{ id: 'admin', label: 'Admin', icon: ShieldAlert }] : [])
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 md:hidden flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl rounded-2xl p-1.5 flex items-center space-x-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-3 py-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-colors select-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-teal-600 rounded-xl"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              <span className={`relative z-10 flex flex-col items-center ${isActive ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'}`}>
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[10px] tracking-tight">{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
