import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  Package, 
  Home, 
  Star, 
  Award, 
  QrCode, 
  ShieldCheck, 
  ChevronRight, 
  AlertCircle 
} from 'lucide-react';
import { IOrder, OrderStatus } from '../types';
import { ordersAPI } from '../lib/api';
import { formatINR, formatDate } from '../lib/utils';
import { useAuthStore } from '../stores/useAuthStore';
import { sounds } from '../lib/sound';
import { toast } from 'sonner';

interface OrderTrackingCardProps {
  order: IOrder;
  onRefresh: () => void;
  onOpenReview: (order: IOrder) => void;
  onOpenChat: (contactId: string, orderId: string) => void;
}

const LIFECYCLE_STEPS: OrderStatus[] = [
  'Requested',
  'Accepted by Neighbor',
  'Ready for Handover',
  'Completed'
];

export const OrderTrackingCard: React.FC<OrderTrackingCardProps> = ({
  order,
  onRefresh,
  onOpenReview,
  onOpenChat
}) => {
  const { user } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const isBuyer = user?._id === order.buyer._id;
  const isSeller = user?._id === order.seller._id;
  const otherPerson = isBuyer ? order.seller : order.buyer;

  const currentStepIndex = LIFECYCLE_STEPS.indexOf(order.status as any);

  const handleUpdateStatus = async (newStatus: OrderStatus, note?: string) => {
    try {
      setIsUpdating(true);
      await ordersAPI.updateStatus(order._id, newStatus, note);
      sounds.playSuccess();
      toast.success(`Order moved to: ${newStatus}`);
      onRefresh();
    } catch (err: any) {
      toast.error('Failed to update status', {
        description: err.response?.data?.message || err.message
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      setIsUpdating(true);
      await ordersAPI.confirmPayment(order._id);
      sounds.playSuccess();
      toast.success('Payment marked as paid!');
      onRefresh();
    } catch (err: any) {
      toast.error('Payment update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
      {/* Top Header: Order ID & Date */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70 px-2 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800">
            {order.upiReference || `ORD-${order._id.slice(-6)}`}
          </span>
          <span className="text-xs text-zinc-400">
            {formatDate(order.createdAt)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-zinc-500">
            Role: <strong className="text-zinc-800 dark:text-zinc-200">{isBuyer ? 'Buyer' : 'Seller'}</strong>
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            order.status === 'Completed'
              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
              : order.status === 'Cancelled'
              ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
              : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 animate-pulse'
          }`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Product & Neighbor Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <img
            src={order.product?.images?.[0] || 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600'}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
          />
          <div>
            <h4 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 leading-snug">
              {order.product?.title || 'Community Item'}
            </h4>
            <p className="text-xs text-zinc-500 flex items-center mt-0.5">
              <span className="font-semibold text-teal-700 dark:text-teal-400 mr-2">
                {formatINR(order.totalAmount)}
              </span>
              <span>via {order.handoverOption}</span>
            </p>
            {order.handoverNote && (
              <p className="text-[11px] text-zinc-500 italic mt-0.5">
                Note: "{order.handoverNote}"
              </p>
            )}
          </div>
        </div>

        {/* Other Resident Card */}
        <div className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700 flex items-center space-x-3 shrink-0">
          <img
            src={otherPerson?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
            alt=""
            className="w-9 h-9 rounded-full object-cover ring-1 ring-teal-500"
          />
          <div className="text-left">
            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center">
              {otherPerson?.name}
              <ShieldCheck className="w-3 h-3 text-teal-600 ml-1" />
            </p>
            <p className="text-[10px] text-zinc-500">
              {otherPerson?.block} • Flat {otherPerson?.flatNumber}
            </p>
          </div>
          <button
            onClick={() => onOpenChat(otherPerson._id, order._id)}
            className="p-1.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 hover:bg-teal-100 text-xs font-semibold"
            title="Chat with neighbor"
          >
            Chat
          </button>
        </div>
      </div>

      {/* Visual Step-by-Step Lifecycle Stepper */}
      <div className="pt-2">
        <div className="grid grid-cols-4 gap-1 relative">
          {LIFECYCLE_STEPS.map((step, idx) => {
            const isCompleted = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div key={step} className="flex flex-col items-center text-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                  } ${isCurrent ? 'ring-4 ring-teal-600/20 scale-110' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-[10px] mt-1.5 font-semibold leading-tight ${
                  isCurrent ? 'text-teal-700 dark:text-teal-300' : 'text-zinc-500'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Notes */}
      {order.timeline && order.timeline.length > 0 && (
        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
          <p className="font-bold text-zinc-500 text-[10px] uppercase tracking-wider">Latest Activity:</p>
          <p className="font-medium text-zinc-700 dark:text-zinc-300">
            • {order.timeline[order.timeline.length - 1].note || order.timeline[order.timeline.length - 1].status}
            <span className="text-[10px] text-zinc-400 ml-2">
              ({formatDate(order.timeline[order.timeline.length - 1].timestamp)})
            </span>
          </p>
        </div>
      )}

      {/* Review Box if already reviewed */}
      {order.review && (
        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= (order.review?.rating || 5)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-zinc-300'
                  }`}
                />
              ))}
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 ml-1">
                Neighbor Review
              </span>
            </div>
            <span className="text-[10px] text-zinc-400">
              {formatDate(order.review.createdAt)}
            </span>
          </div>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 italic">
            "{order.review.comment}"
          </p>
          {order.review.badgesAwarded && order.review.badgesAwarded.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {order.review.badgesAwarded.map((b, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-zinc-900 text-teal-800 dark:text-teal-300 border border-teal-200 shadow-xs flex items-center"
                >
                  <Award className="w-3 h-3 mr-1 text-amber-500" />
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons based on state & role */}
      <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
        {/* Payment Confirmation if pending and UPI */}
        {order.paymentStatus === 'pending' && order.paymentMethod === 'direct_upi' && (
          <button
            onClick={handleConfirmPayment}
            disabled={isUpdating}
            className="px-3.5 py-1.5 rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold hover:bg-teal-100 transition flex items-center space-x-1"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Mark UPI Paid</span>
          </button>
        )}

        {/* Seller Actions */}
        {isSeller && order.status === 'Requested' && (
          <button
            onClick={() => handleUpdateStatus('Accepted by Neighbor', 'Accepted by neighbor seller')}
            disabled={isUpdating}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition"
          >
            Accept Request
          </button>
        )}

        {isSeller && order.status === 'Accepted by Neighbor' && (
          <button
            onClick={() => handleUpdateStatus('Ready for Handover', `Item ready via ${order.handoverOption}`)}
            disabled={isUpdating}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition"
          >
            Mark Ready for Handover
          </button>
        )}

        {/* Handover Complete */}
        {order.status === 'Ready for Handover' && (
          <button
            onClick={() => handleUpdateStatus('Completed', 'Handover confirmed by resident')}
            disabled={isUpdating}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
          >
            Confirm Handover Complete
          </button>
        )}

        {/* Review button for Buyer when completed */}
        {isBuyer && order.status === 'Completed' && !order.review && (
          <button
            onClick={() => onOpenReview(order)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold shadow-md transition flex items-center space-x-1.5"
          >
            <Star className="w-3.5 h-3.5 fill-zinc-950" />
            <span>Review Neighbor & Give Badges</span>
          </button>
        )}
      </div>
    </div>
  );
};
