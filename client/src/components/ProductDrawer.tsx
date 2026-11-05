import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Clock, 
  Gift, 
  ShoppingBag, 
  MessageCircle, 
  Radio, 
  CheckCircle2, 
  Eye, 
  Lock, 
  Truck, 
  Package, 
  Home, 
  Award,
  Sparkles
} from 'lucide-react';
import { IProduct } from '../types';
import { formatINR, formatDate } from '../lib/utils';
import { useSocket } from '../context/SocketContext';
import { sounds } from '../lib/sound';

interface ProductDrawerProps {
  product: IProduct | null;
  onClose: () => void;
  onOrder: (product: IProduct) => void;
  onChat: (product: IProduct) => void;
}

export const ProductDrawer: React.FC<ProductDrawerProps> = ({ product, onClose, onOrder, onChat }) => {
  const { sendItemPing } = useSocket();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const handleCheckoutClick = () => {
    sounds.playPop();
    onOrder(product);
  };

  const handleChatClick = () => {
    sounds.playPop();
    onChat(product);
  };

  const handlePing = () => {
    sendItemPing(product._id, product.seller._id, product.title);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal / Drawer Box */}
        <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 p-6 text-left shadow-2xl transition-all border border-zinc-200 dark:border-zinc-800"
          >
            {/* Header with Close */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {product.category}
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="inline-flex items-center text-xs font-medium text-zinc-500">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-teal-600" />
                  {product.block}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content Body */}
            <div className="mt-4 space-y-6 max-h-[72vh] overflow-y-auto pr-1">
              {/* Image Gallery */}
              <div className="space-y-2">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={product.images[activeImageIndex] || product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    {product.listingMode === 'giveaway' ? (
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md flex items-center">
                        <Gift className="w-3.5 h-3.5 mr-1" />
                        ₹0 Free to Neighbor
                      </span>
                    ) : product.listingMode === 'rent' ? (
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-zinc-950 shadow-md flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        Rent • {formatINR(product.price)}/{product.rentDuration || 'day'}
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-full text-sm font-extrabold bg-teal-800 text-white shadow-md">
                        {formatINR(product.price)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handlePing}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-xs font-bold text-teal-700 dark:text-teal-300 shadow-md flex items-center space-x-1.5 hover:bg-white transition active:scale-95"
                  >
                    <Radio className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                    <span>Ping Availability</span>
                  </button>
                </div>

                {/* Thumbnails if multiple */}
                {product.images.length > 1 && (
                  <div className="flex space-x-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-16 h-14 rounded-lg overflow-hidden border-2 transition ${
                          activeImageIndex === idx ? 'border-teal-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Price details */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">
                    {product.title}
                  </h2>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-black text-teal-700 dark:text-teal-400">
                      {formatINR(product.price)}
                    </p>
                    {product.listingMode === 'rent' && product.rentDeposit ? (
                      <p className="text-[11px] text-zinc-400">
                        Refundable Deposit: {formatINR(product.rentDeposit)}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {product.condition && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      Condition: {product.condition}
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-teal-600" />
                    Verified In Society
                  </span>
                  <span className="text-xs text-zinc-400">
                    Posted {formatDate(product.createdAt)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Description</h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Handover Logistics Info */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
                  Gated Community Handover Options
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-teal-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Doorstep Delivery</p>
                      <p className="text-[10px] text-zinc-500">Neighbor drops at door</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-2">
                    <Package className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Gate / Club House</p>
                      <p className="text-[10px] text-zinc-500">Security drop-box</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-2">
                    <Home className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Flat Pickup</p>
                      <p className="text-[10px] text-zinc-500">Collect from seller</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Trust Profile & Neighbor Badges */}
              <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.seller?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                      alt={product.seller?.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-500"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                          {product.seller?.name}
                        </span>
                        <span title="Verified Resident">
                          <ShieldCheck className="w-4 h-4 text-teal-600" />
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-zinc-500">
                        <span className="flex items-center text-amber-600 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                          {product.seller?.rating || '5.0'} ({product.seller?.ratingCount || 1} neighbor reviews)
                        </span>
                        <span>•</span>
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {product.seller?.block}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Door Status */}
                  <div className="text-right">
                    {product.seller?.hideFlatNumber ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                        <Lock className="w-3 h-3 mr-1" />
                        Door Masked
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-[11px] font-semibold bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300">
                        <Eye className="w-3 h-3 mr-1" />
                        Door: {product.seller?.flatNumber}
                      </span>
                    )}
                  </div>
                </div>

                {product.seller?.bio && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
                    "{product.seller.bio}"
                  </p>
                )}

                {/* Neighbor Badges */}
                {product.seller?.badges && product.seller.badges.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-zinc-500">Badges:</span>
                    {product.seller.badges.map((b, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-white dark:bg-zinc-900 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm"
                      >
                        <Award className="w-3 h-3 mr-1 text-amber-500" />
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
              <button
                onClick={handleChatClick}
                className="px-4 py-3 rounded-2xl border border-teal-300 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-bold text-sm hover:bg-teal-50 dark:hover:bg-teal-950/50 transition flex items-center justify-center space-x-2 shrink-0 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Neighbor</span>
              </button>

              <button
                onClick={handleCheckoutClick}
                className="flex-1 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-lg shadow-teal-700/25 transition flex items-center justify-center space-x-2 active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {product.listingMode === 'giveaway' 
                    ? 'Claim Free Item' 
                    : product.listingMode === 'rent' 
                    ? `Request Rental (${formatINR(product.price)})` 
                    : `Order Now (${formatINR(product.price)})`}
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
