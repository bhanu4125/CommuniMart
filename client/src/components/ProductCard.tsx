import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Gift, 
  MessageCircle, 
  Radio, 
  Truck, 
  Package, 
  Home, 
  Star 
} from 'lucide-react';
import { IProduct } from '../types';
import { formatINR } from '../lib/utils';
import { useSocket } from '../context/SocketContext';
import { sounds } from '../lib/sound';
import { formatINR } from '../lib/formatters';

interface ProductCardProps {
  product: IProduct;
  onSelect: (product: IProduct) => void;
  onOpenChat: (product: IProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onOpenChat }) => {
  const { sendItemPing } = useSocket();

  const handlePing = (e: React.MouseEvent) => {
    e.stopPropagation();
    sendItemPing(product._id, product.seller._id, product.title);
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPop();
    onOpenChat(product);
  };

  const getHandoverIcon = (opt: string) => {
    if (opt.includes('Doorstep')) return <span title="Doorstep Delivery"><Truck className="w-3.5 h-3.5 text-teal-600" /></span>;
    if (opt.includes('Security') || opt.includes('Club House')) return <span title="Gate Drop-box"><Package className="w-3.5 h-3.5 text-amber-600" /></span>;
    return <span title="Flat Pickup"><Home className="w-3.5 h-3.5 text-blue-600" /></span>;
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={() => onSelect(product)}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between transition-shadow duration-300 hover:shadow-glass-hover"
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600'}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Listing Mode Pill */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {product.listingMode === 'giveaway' ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                <Gift className="w-3 h-3 mr-1" />
                Free to a Neighbor
              </span>
            ) : product.listingMode === 'rent' ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-zinc-950 shadow-md">
                <Clock className="w-3 h-3 mr-1" />
                Rent • {formatINR(product.price)}/{product.rentDuration || 'day'}
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-teal-800/90 text-white backdrop-blur-md shadow-md">
                {formatINR(product.price)}
              </span>
            )}

            {product.condition && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 backdrop-blur-md shadow-sm">
                {product.condition}
              </span>
            )}
          </div>

          {/* Availability Ping Button */}
          <button
            onClick={handlePing}
            title="Ping neighbor for availability"
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-700 dark:text-zinc-200 hover:text-teal-600 hover:bg-white shadow-md active:scale-90 transition"
          >
            <Radio className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-4 space-y-2">
          {/* Category & Block Tag */}
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-teal-700 dark:text-teal-400 truncate max-w-[150px]">
              {product.category}
            </span>
            <span className="inline-flex items-center bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
              <MapPin className="w-3 h-3 mr-1 text-teal-600" />
              {product.block}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {product.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Handover Options Badges */}
          <div className="pt-1 flex items-center space-x-1.5 text-xs text-zinc-500">
            <span className="text-[11px] text-zinc-400 font-medium">Handover:</span>
            <div className="flex items-center space-x-1.5">
              {product.handoverOptions.map((opt, i) => (
                <span key={i} className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  {getHandoverIcon(opt)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Seller & Action Footer */}
      <div className="px-4 pb-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
        {/* Seller Info */}
        <div className="flex items-center space-x-2">
          <img
            src={product.seller?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
            alt={product.seller?.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-teal-500"
          />
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[100px]">
                {product.seller?.name?.split(' ')[0]}
              </span>
              <span title="Verified Resident">
                <ShieldCheck className="w-3 h-3 text-teal-600" />
              </span>
            </div>
            <div className="flex items-center text-[10px] text-zinc-500">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 mr-0.5" />
              <span>{product.seller?.rating || '5.0'}</span>
              <span className="mx-1">•</span>
              <span className="truncate max-w-[80px]">
                {product.seller?.hideFlatNumber ? 'Masked' : product.seller?.flatNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Chat Button */}
        <button
          onClick={handleChat}
          className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900 transition active:scale-95 flex items-center space-x-1 text-xs font-semibold"
          title="Direct Chat with Neighbor"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Chat</span>
        </button>
      </div>
    </motion.div>
  );
};
