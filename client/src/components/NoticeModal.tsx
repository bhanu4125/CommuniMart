import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, AlertTriangle } from 'lucide-react';
import { noticesAPI } from '../lib/api';
import { sounds } from '../lib/sound';
import { toast } from 'sonner';

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Request / Borrow' | 'Flash Sale / Treat' | 'Notice / Alert' | 'Skill Offer'>('Request / Borrow');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please enter a title and description');
      return;
    }

    try {
      setIsSubmitting(true);
      await noticesAPI.create({
        title,
        description,
        category,
        urgency
      });

      sounds.playSuccess();
      toast.success('Notice posted to Community Board!');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error('Failed to post notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="w-full max-w-lg transform overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 p-6 text-left shadow-2xl border border-zinc-200 dark:border-zinc-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
                  Post to Community Notice Board
                </h3>
                <p className="text-xs text-zinc-500">
                  Broadcast flash needs, borrow requests, or society alerts
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Request / Borrow', 'Flash Sale / Treat', 'Notice / Alert', 'Skill Offer'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition ${
                        category === cat
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 ring-2 ring-teal-600/30'
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Notice / Request Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Looking to borrow a ladder for 2 hours today"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Details & Flat Info
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention when you need it, which tower/flat you are at, and any exchange offers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Urgency */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <input
                    type="radio"
                    name="urgency"
                    checked={urgency === 'normal'}
                    onChange={() => setUrgency('normal')}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span>Normal Post</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer text-xs font-medium text-amber-600 dark:text-amber-400">
                  <input
                    type="radio"
                    name="urgency"
                    checked={urgency === 'urgent'}
                    onChange={() => setUrgency('urgent')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span className="flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                    Urgent (Pinned at top)
                  </span>
                </label>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition"
                >
                  {isSubmitting ? 'Posting...' : 'Broadcast Notice'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
