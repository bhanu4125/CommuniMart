import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Award, Check } from 'lucide-react';
import { IOrder } from '../types';
import { ordersAPI } from '../lib/api';
import { sounds } from '../lib/sound';
import { toast } from 'sonner';

interface ReviewModalProps {
  order: IOrder | null;
  onClose: () => void;
  onSuccess: () => void;
}

const BADGES_LIST = [
  'Punctual Neighbor',
  'Trusted Baker',
  'Prompt Handover',
  'Super Neighbor',
  'Great Condition',
  'Friendly Resident'
];

export const ReviewModal: React.FC<ReviewModalProps> = ({ order, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['Punctual Neighbor']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  const toggleBadge = (badge: string) => {
    sounds.playPop();
    if (selectedBadges.includes(badge)) {
      setSelectedBadges(selectedBadges.filter(b => b !== badge));
    } else {
      setSelectedBadges([...selectedBadges, badge]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a quick comment for your neighbor');
      return;
    }

    try {
      setIsSubmitting(true);
      await ordersAPI.submitReview(order._id, {
        rating,
        comment,
        badgesAwarded: selectedBadges
      });

      sounds.playSuccess();
      toast.success('Neighbor review & badges awarded!');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error('Failed to submit review');
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
            className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 p-6 text-left shadow-2xl border border-zinc-200 dark:border-zinc-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Neighbor Trust & Review
                </h3>
                <p className="text-xs text-zinc-500">
                  Rate your exchange with {order.seller?.name}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Star Rating */}
              <div className="text-center py-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Rating
                </label>
                <div className="flex items-center justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => {
                        setRating(star);
                        sounds.playPop();
                      }}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-300 dark:text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Award Badges */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center">
                  <Award className="w-3.5 h-3.5 mr-1 text-amber-500" />
                  Award Neighbor Badges
                </label>
                <div className="flex flex-wrap gap-2">
                  {BADGES_LIST.map((b) => {
                    const isSelected = selectedBadges.includes(b);
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => toggleBadge(b)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                            : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{b}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Neighbor Experience Note
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Prompt handover at Gate 1, bread was super fresh and warm!"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition"
                >
                  {isSubmitting ? 'Submitting...' : 'Award Badges & Review'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

