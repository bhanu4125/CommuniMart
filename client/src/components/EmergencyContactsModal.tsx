import React from 'react';
import { Phone, ShieldAlert, Wrench, X } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyContactsModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const contacts = [
    { title: 'Main Gate Security Guardhouse', phone: '+91 98765 43210', icon: ShieldAlert },
    { title: 'Society Electrician on Duty', phone: '+91 98765 43211', icon: Wrench },
    { title: 'Clubhouse Caretaker', phone: '+91 98765 43212', icon: Phone }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-sm w-full border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Society Emergency Contacts</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-zinc-400" /></button>
        </div>
        <div className="space-y-2">
          {contacts.map((c, i) => (
            <div key={i} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center space-x-3">
              <c.icon className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{c.title}</p>
                <p className="text-xs text-teal-600 font-mono font-semibold">{c.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
