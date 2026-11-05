import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowUpRight, ArrowDownLeft, Sparkles, PackageCheck } from 'lucide-react';
import { IOrder } from '../types';
import { ordersAPI } from '../lib/api';
import { OrderTrackingCard } from '../components/OrderTrackingCard';
import { ReviewModal } from '../components/ReviewModal';
import { ChatDrawer } from '../components/ChatDrawer';
import { useAuthStore } from '../stores/useAuthStore';
import { sounds } from '../lib/sound';

export const OrdersPage: React.FC = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'purchases' | 'sales'>('purchases');

  const [reviewOrder, setReviewOrder] = useState<IOrder | null>(null);
  const [chatContact, setChatContact] = useState<any | null>(null);
  const [chatOrderId, setChatOrderId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await ordersAPI.getMyOrders();
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'purchases') {
      return o.buyer._id === user?._id;
    } else {
      return o.seller._id === user?._id;
    }
  });

  const handleOpenChat = (contactId: string, orderId: string) => {
    const targetOrder = orders.find((o) => o._id === orderId);
    if (!targetOrder) return;
    const isBuyer = targetOrder.buyer._id === user?._id;
    const other = isBuyer ? targetOrder.seller : targetOrder.buyer;
    setChatContact(other);
    setChatOrderId(orderId);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Community Order Tracking & Handover</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
            Orders, Rentals & Lendings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mt-1">
            Track real-time status transitions from request to handover at security gates or doorsteps.
          </p>
        </div>

        {/* Tab switch */}
        <div className="p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex items-center space-x-1">
          <button
            onClick={() => {
              setActiveTab('purchases');
              sounds.playPop();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
              activeTab === 'purchases'
                ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-300 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>My Purchases & Borrows</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('sales');
              sounds.playPop();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
              activeTab === 'sales'
                ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-300 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>My Sales & Lendings</span>
          </button>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card rounded-3xl p-6 h-48 animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800 space-y-3">
          <PackageCheck className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <h3 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200">
            No orders in this tab
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {activeTab === 'purchases'
              ? 'You have not placed any orders or borrow requests yet.'
              : 'You have not received any requests for your listings yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderTrackingCard
              key={order._id}
              order={order}
              onRefresh={fetchOrders}
              onOpenReview={(ord) => setReviewOrder(ord)}
              onOpenChat={handleOpenChat}
            />
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewOrder && (
        <ReviewModal
          order={reviewOrder}
          onClose={() => setReviewOrder(null)}
          onSuccess={fetchOrders}
        />
      )}

      {/* Chat Drawer */}
      {chatContact && (
        <ChatDrawer
          isOpen={!!chatContact}
          onClose={() => {
            setChatContact(null);
            setChatOrderId(undefined);
          }}
          contact={chatContact}
          orderId={chatOrderId}
        />
      )}
    </div>
  );
};

