import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Plus, 
  Check, 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  AlertCircle,
  Trash2,
  PackageCheck
} from 'lucide-react';
import { ItemCategory, ListingMode, ItemCondition, HandoverOption } from '../types';
import { productsAPI } from '../lib/api';
import { useAuthStore } from '../stores/useAuthStore';
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
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Fresh Home Bakes & Meals');
  const [listingMode, setListingMode] = useState<ListingMode>('sell');
  const [price, setPrice] = useState<string>('250');
  const [rentDuration, setRentDuration] = useState<'hour' | 'day' | 'week'>('day');
  const [rentDeposit, setRentDeposit] = useState<string>('500');
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  
  // Image handling: supports local file upload, URL, and preset
  const [imagePreview, setImagePreview] = useState<string>(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');

  const [handoverOptions, setHandoverOptions] = useState<HandoverOption[]>([
    'Doorstep Delivery',
    'Club House / Security Gate Drop-box',
    'Direct Pickup from Seller Flat'
  ]);
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (!imagePreview) {
        setImagePreview(PRESET_IMAGES[0].url);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image file too large. Please select a photo under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
        sounds.playPop();
        toast.success('Photo selected from device!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (url: string) => {
    setImagePreview(url);
    sounds.playPop();
  };

  const handleUrlChange = (url: string) => {
    setCustomImageUrl(url);
    if (url.trim()) {
      setImagePreview(url.trim());
    }
  };

  const toggleHandover = (opt: HandoverOption) => {
    sounds.playPop();
    if (handoverOptions.includes(opt)) {
      if (handoverOptions.length > 1) {
        setHandoverOptions(handoverOptions.filter(h => h !== opt));
      } else {
        toast.error('At least one society handover option must be supported');
      }
    } else {
      setHandoverOptions([...handoverOptions, opt]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to post a community listing');
      return;
    }

    if (!title.trim() || title.trim().length < 3) {
      toast.error('Please enter a descriptive title (at least 3 characters)');
      return;
    }

    if (!description.trim() || description.trim().length < 5) {
      toast.error('Please enter description details (at least 5 characters)');
      return;
    }

    const numericPrice = listingMode === 'giveaway' ? 0 : Number(price);
    if (listingMode !== 'giveaway' && (isNaN(numericPrice) || numericPrice <= 0)) {
      toast.error('Please enter a valid price greater than 0');
      return;
    }

    if (handoverOptions.length === 0) {
      toast.error('Please select at least one handover option');
      return;
    }

    try {
      setIsSubmitting(true);
      const tags = tagsInput
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);

      const finalImage = imagePreview.trim() || PRESET_IMAGES[0].url;

      await productsAPI.create({
        title: title.trim(),
        description: description.trim(),
        category,
        listingMode,
        price: numericPrice,
        rentDuration: listingMode === 'rent' ? rentDuration : undefined,
        rentDeposit: listingMode === 'rent' ? Number(rentDeposit) || 0 : 0,
        condition,
        images: [finalImage],
        handoverOptions,
        tags
      });

      sounds.playSuccess();
      toast.success('Listing successfully published to community marketplace!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setPrice('250');
      setCustomImageUrl('');
      setTagsInput('');
      
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Create listing error:', err);
      toast.error('Failed to post listing', {
        description: err.response?.data?.message || err.message || 'Please check your inputs'
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
                  Post Item / Offer Service
                </h3>
                <p className="text-xs text-zinc-500">
                  Publish to Green Meadows Gated Society ({user?.block || 'Tower A'})
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
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[72vh] overflow-y-auto pr-1">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Listing Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sourdough Loaf, Bose Headphones, Bosch Drill, or ICSE Math Tutoring"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              {/* Listing Mode Selection */}
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

              {/* Price & Rental Duration */}
              {listingMode !== 'giveaway' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      {listingMode === 'rent' ? 'Rental Rate (₹)' : 'Price (₹)'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      placeholder="e.g. 250"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                    />
                  </div>

                  {listingMode === 'rent' ? (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                        Rent Interval
                      </label>
                      <select
                        value={rentDuration}
                        onChange={(e) => setRentDuration(e.target.value as any)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                      >
                        <option value="hour">Per Hour</option>
                        <option value="day">Per Day</option>
                        <option value="week">Per Week</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                        Pricing Type
                      </label>
                      <div className="text-xs px-3.5 py-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold">
                        Fixed Community Price
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-emerald-600" />
                  Free giveaway mode: Price set to ₹0. Any verified neighbor can claim!
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        condition === cond
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
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
                  Description & Society Notes <span className="text-rose-500">*</span>
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

              {/* Photo Upload & Presets Section */}
              <div className="space-y-2.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center">
                    <ImageIcon className="w-3.5 h-3.5 mr-1 text-teal-600" />
                    Product Image (Upload, Preset, or URL)
                  </label>
                  <span className="text-[10px] text-zinc-400 font-medium">1 Photo Required</span>
                </div>

                {/* Live Image Preview + Upload button */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 shrink-0 relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <span className="text-[10px] text-white font-bold">Active Photo</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {/* Upload from Device Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-teal-500 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition flex items-center justify-center space-x-2"
                    >
                      <Upload className="w-4 h-4 text-teal-600" />
                      <span>Choose Photo from Device / Camera</span>
                    </button>

                    {/* Web URL input */}
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="url"
                        placeholder="Or paste an image web link (https://...)"
                        value={customImageUrl}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset samples */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-zinc-400 block mb-1.5">
                    Or Pick a Community Preset:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {PRESET_IMAGES.map((p, i) => {
                      const isSelected = imagePreview === p.url;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handlePresetSelect(p.url)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                            isSelected
                              ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-teal-500'
                          }`}
                        >
                          {p.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Handover Options Checkboxes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                  Handover Options Supported <span className="text-rose-500">*</span>
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
                  Keywords & Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., fresh, sourdough, breakfast, tools, diy"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Submit Button */}
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
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition flex items-center space-x-1.5"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Publishing Item...' : 'Publish Listing'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
