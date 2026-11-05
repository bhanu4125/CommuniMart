import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Truck, 
  Package, 
  Home, 
  QrCode, 
  Banknote, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IProduct, HandoverOption, PaymentMethod } from '../types';
import { ordersAPI } from '../lib/api';
import { formatINR } from '../lib/utils';
import { sounds } from '../lib/sound';
import { toast } from 'sonner';

interface CheckoutModalProps {
  product: IProduct | null;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ product, onClose, onSuccess }) => {
  const [handoverOption, setHandoverOption] = useState<HandoverOption>('Doorstep Delivery');
  const [handoverNote, setHandoverNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('direct_upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  if (!product) return null;

  const sellerUpi = product.seller?.upiId || 'priyabakes@okhdfcbank';
  const upiPayLink = `upi://pay?pa=${encodeURIComponent(sellerUpi)}&pn=${encodeURIComponent(product.seller?.name || 'Resident')}&am=${product.price}&cu=INR&tn=${encodeURIComponent(`CommuniMart-${product.title.slice(0, 15)}`)}`;
  // High-res QR code generator API for clean SVG rendering
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiPayLink)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(sellerUpi);
    setCopiedUpi(true);
    sounds.playPop();
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePlaceOrder = async () => {
    try {
      setIsSubmitting(true);
      const res = await ordersAPI.create({
        productId: product._id,
        paymentMethod,
        handoverOption,
        handoverNote
      });

      if (res.data.success) {
        sounds.playSuccess();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        toast.success('Order requested successfully!', {
          description: `Notified ${product.seller.name}. Track updates in Orders tab.`
        });
        onSuccess(res.data.data._id);
      }
    } catch (err: any) {
      toast.error('Order failed', {
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
            className="w-full max-w-xl transform overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 p-6 text-left shadow-2xl border border-zinc-200 dark:border-zinc-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Gated Community Checkout
                </h3>
                <p className="text-xs text-zinc-500">
                  Direct resident exchange in Green Meadows
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Summary Pill */}
            <div className="mt-4 p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-900/60 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={product.images[0]}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {product.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Seller: {product.seller?.name} • {product.block}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-teal-700 dark:text-teal-300">
                  {formatINR(product.price)}
                </span>
                {product.listingMode === 'rent' && (
                  <p className="text-[10px] text-zinc-400">/{product.rentDuration}</p>
                )}
              </div>
            </div>

            {/* Step 1: Handover Option */}
            <div className="mt-5 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center">
                <Truck className="w-3.5 h-3.5 mr-1 text-teal-600" />
                Select Handover Option
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'Doorstep Delivery' as HandoverOption,
                    title: 'Doorstep',
                    desc: 'Drop at flat door',
                    icon: Truck
                  },
                  {
                    id: 'Club House / Security Gate Drop-box' as HandoverOption,
                    title: 'Gate Drop-box',
                    desc: 'Club / Gate 1 Desk',
                    icon: Package
                  },
                  {
                    id: 'Direct Pickup from Seller Flat' as HandoverOption,
                    title: 'Flat Pickup',
                    desc: 'Pick up in person',
                    icon: Home
                  }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = handoverOption === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setHandoverOption(item.id);
                        sounds.playPop();
                      }}
                      className={`p-3 rounded-2xl border text-left transition ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 ring-2 ring-teal-600/30'
                          : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-teal-600' : 'text-zinc-500'}`} />
                      <p className={`text-xs font-bold ${isSelected ? 'text-teal-900 dark:text-teal-200' : 'text-zinc-800 dark:text-zinc-200'}`}>
                        {item.title}
                      </p>
                      <p className="text-[10px] text-zinc-500">{item.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Handover Note */}
              <input
                type="text"
                placeholder="Optional note (e.g., Leave on doorstep rack, or deliver after 6 PM)"
                value={handoverNote}
                onChange={(e) => setHandoverNote(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Step 2: Payment Method */}
            <div className="mt-5 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center">
                <Banknote className="w-3.5 h-3.5 mr-1 text-teal-600" />
                Select Payment Mode
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'direct_upi' as PaymentMethod,
                    title: 'Direct UPI QR',
                    desc: 'GPay / PhonePe / Paytm',
                    icon: QrCode
                  },
                  {
                    id: 'cash_on_handover' as PaymentMethod,
                    title: 'Cash at Gate',
                    desc: 'Pay upon receipt',
                    icon: Banknote
                  },
                  {
                    id: 'society_escrow' as PaymentMethod,
                    title: 'Society Escrow',
                    desc: 'Held until verified',
                    icon: ShieldCheck
                  }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(item.id);
                        sounds.playPop();
                      }}
                      className={`p-3 rounded-2xl border text-left transition ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 ring-2 ring-teal-600/30'
                          : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-teal-600' : 'text-zinc-500'}`} />
                      <p className={`text-xs font-bold ${isSelected ? 'text-teal-900 dark:text-teal-200' : 'text-zinc-800 dark:text-zinc-200'}`}>
                        {item.title}
                      </p>
                      <p className="text-[10px] text-zinc-500">{item.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* UPI Dynamic Interactive Section */}
              {paymentMethod === 'direct_upi' && product.price > 0 && (
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-28 h-28 bg-white p-2 rounded-xl shadow-md border border-zinc-200 shrink-0 flex items-center justify-center">
                    <img
                      src={qrCodeUrl}
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1.5 text-center sm:text-left flex-1">
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Dynamic Society UPI Link
                    </div>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Scan or pay directly to seller's verified VPA:
                    </p>
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <code className="text-xs bg-white dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 font-mono text-teal-700 dark:text-teal-400">
                        {sellerUpi}
                      </code>
                      <button
                        onClick={handleCopyUpi}
                        className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 transition"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-500">
                      Amount: <span className="font-bold text-zinc-700 dark:text-zinc-300">{formatINR(product.price)}</span> • Ref: CommuniMart Society Order
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400">Total payable</p>
                <p className="text-xl font-black text-teal-700 dark:text-teal-400">
                  {formatINR(product.price)}
                </p>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-teal-700/25 transition flex items-center space-x-2 active:scale-95"
              >
                <span>{isSubmitting ? 'Confirming...' : 'Place Request'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
