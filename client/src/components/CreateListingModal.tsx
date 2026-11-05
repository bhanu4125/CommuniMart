import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Plus, 
  Check, 
  Image as ImageIcon, 
  HelpCircle 
} from 'lucide-react';
import { ItemCategory, ListingMode, ItemCondition, HandoverOption } from '../types';
import { productsAPI } from '../lib/api';
import { sounds } from '../lib/sound';
import { toast } from 'sonner';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES: ItemCategory[] = [
  'Fresh Home Bakes & Meals',
  'Pre-loved Electronics',
  'Home & Furniture',
  'Kids & Toys',
  'Skill Exchange & Services',
  'Garden & Plants',
  'Books & Hobbies',
  'Tools & Utilities'
];

const PRESET_IMAGES = [
  { name: 'Sourdough Bread', url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80' },
  { name: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
  { name: 'Houseplant', url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80' },
  { name: 'Cordless Drill', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80' },
  { name: 'Kids Bicycle', url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600&auto=format&fit=crop&q=80' },
  { name: 'Study Desk', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80' }
];

export const CreateListingModal: React.FC<CreateListingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Fresh Home Bakes & Meals');
  const [listingMode, setListingMode] = useState<ListingMode>('sell');
  const [price, setPrice] = useState<number>(200);
  const [rentDuration, setRentDuration] = useState<'hour' | 'day' | 'week'>('day');
  const [rentDeposit, setRentDeposit] = useState<number>(0);
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [imageUrl, setImageUrl] = useState('');
  const [handoverOptions, setHandoverOptions] = useState<HandoverOption[]>([
    'Doorstep Delivery',
    'Club House / Security Gate Drop-box',
    'Direct Pickup from Seller Flat'
  ]);
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleHandover = (opt: HandoverOption) => {
    sounds.playPop();
    if (handoverOptions.includes(opt)) {
      if (handoverOptions.length > 1) {
        setHandoverOptions(handoverOptions.filter(h => h !== opt));
      }
    } else {
      setHandoverOptions([...handoverOptions, opt]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in title and description');
      return;
    }

    try {
      setIsSubmitting(true);
      const tags = tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      const img = imageUrl.trim() || PRESET_IMAGES[0].url;

      await productsAPI.create({
        title,
        description,
        category,
        listingMode,
        price: listingMode === 'giveaway' ? 0 : Number(price),
        rentDuration: listingMode === 'rent' ? rentDuration : undefined,
        rentDeposit: listingMode === 'rent' ? Number(rentDeposit) : 0,
        condition,
        images: [img],
        handoverOptions,
        tags
      });

      sounds.playSuccess();
      toast.success('Listing posted to community marketplace!');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error('Failed to create listing', {
        description: err.response?.data?.message || err.message
      });
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
            className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 p-6 text-left shadow-2xl border border-zinc-200 dark:border-zinc-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
                  Post to CommuniMart
                </h3>
                <p className="text-xs text-zinc-500">
                  List items, bakes, rentals, or skills for your gated society neighbors
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
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Listing Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Homemade Cinnamon Rolls (Box of 4), or Bose QC45 Headphones"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Mode Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Listing Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sell', label: 'Fixed Price', desc: 'Sell outright' },
                    { id: 'giveaway', label: 'Giveaway', desc: '₹0 Free to neighbor' },
                    { id: 'rent', label: 'Rental', desc: 'Hourly / Daily rent' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setListingMode(m.id as ListingMode);
                        sounds.playPop();
                      }}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        listingMode === m.id
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 ring-2 ring-teal-600/30'
                          : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                      }`}
                    >
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{m.label}</p>
                      <p className="text-[10px] text-zinc-500">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Rent Fields */}
              {listingMode !== 'giveaway' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      {listingMode === 'rent' ? 'Rental Rate (₹)' : 'Price (₹)'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {listingMode === 'rent' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                        Per Duration
                      </label>
                      <select
                        value={rentDuration}
                        onChange={(e) => setRentDuration(e.target.value as any)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="hour">Per Hour</option>
                        <option value="day">Per Day</option>
                        <option value="week">Per Week</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Condition */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Item Condition
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Brand New', 'Like New', 'Good', 'Fair'] as ItemCondition[]).map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setCondition(cond)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        condition === cond
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Description & Society Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention availability times, ingredients (if food), instructions, or details for your neighbors..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Image URL & Preset Samples */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Image URL or Choose Preset
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-zinc-400 font-medium">Quick Presets:</span>
                  {PRESET_IMAGES.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(p.url)}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Handover Options Checkboxes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                  Handover Options Supported
                </label>
                <div className="space-y-1.5">
                  {(['Doorstep Delivery', 'Club House / Security Gate Drop-box', 'Direct Pickup from Seller Flat'] as HandoverOption[]).map((opt) => (
                    <label
                      key={opt}
                      onClick={() => toggleHandover(opt)}
                      className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer select-none"
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                        handoverOptions.includes(opt) ? 'bg-teal-600 border-teal-600 text-white' : 'border-zinc-300 dark:border-zinc-700'
                      }`}>
                        {handoverOptions.includes(opt) && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., fresh, sourdough, breakfast, tools, diy"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Submit */}
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
                  {isSubmitting ? 'Posting...' : 'Post Listing'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

