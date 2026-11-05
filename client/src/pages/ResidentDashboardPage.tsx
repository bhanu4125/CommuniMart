import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  PlusCircle, 
  Package, 
  IndianRupee, 
  Star, 
  Award, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Truck, 
  QrCode, 
  Edit3, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles,
  Gift
} from 'lucide-react';
import { IProduct, IOrder } from '../types';
import { productsAPI, ordersAPI, authAPI } from '../lib/api';
import { useAuthStore } from '../stores/useAuthStore';
import { formatINR, formatDate } from '../lib/utils';
import { sounds } from '../lib/sound';
import { toast } from 'sonner';

interface ResidentDashboardProps {
  openCreateModal: () => void;
  onNavigateToOrders: () => void;
  onNavigateToMarketplace: () => void;
}

export const ResidentDashboardPage: React.FC<ResidentDashboardProps> = ({
  openCreateModal,
  onNavigateToOrders,
  onNavigateToMarketplace
}) => {
  const { user, togglePrivacy } = useAuthStore();
  const [myListings, setMyListings] = useState<IProduct[]>([]);
  const [myOrders, setMyOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'handovers' | 'settings'>('listings');
  const [editingUpi, setEditingUpi] = useState(false);
  const [upiInput, setUpiInput] = useState(user?.upiId || '');

  useEffect(() => {
    loadResidentData();
  }, [user?._id]);

  const loadResidentData = async () => {
    if (!user?._id) return;
    try {
      setIsLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        productsAPI.list({ sellerId: user._id, available: 'all' }),
        ordersAPI.getMyOrders()
      ]);

      if (productsRes.data.success) {
        setMyListings(productsRes.data.data);
      }
      if (ordersRes.data.success) {
        setMyOrders(ordersRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load resident hub data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAvailability = async (productId: string) => {
    try {
      await productsAPI.toggleAvailability(productId);
      sounds.playSuccess();
      toast.success('Listing availability updated!');
      loadResidentData();
    } catch (err) {
      toast.error('Failed to update listing');
    }
  };

  const handleDeleteListing = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await productsAPI.delete(productId);
      sounds.playPop();
      toast.success('Listing deleted');
      loadResidentData();
    } catch (err) {
      toast.error('Failed to delete listing');
    }
  };

  const handleSaveUpi = async () => {
    try {
      await authAPI.updateProfile({ upiId: upiInput });
      sounds.playSuccess();
      toast.success('UPI ID updated for receiving payments!');
      setEditingUpi(false);
    } catch (err) {
      toast.error('Failed to update UPI');
    }
  };

  // Calculations
  const activeCount = myListings.filter(p => p.available).length;
  const soldOrders = myOrders.filter(o => o.seller._id === user?._id && o.status === 'Completed');
  const totalEarnings = soldOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingHandovers = myOrders.filter(
    o => o.status === 'Requested' || o.status === 'Accepted by Neighbor' || o.status === 'Ready for Handover'
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Resident Welcome & Unit Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
                alt=""
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 ring-2 ring-teal-900 flex items-center justify-center text-[10px] text-zinc-900 font-bold">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {user?.name || 'Resident'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-zinc-950 shadow-sm">
                  {user?.role === 'verified_seller' ? 'Verified Seller' : 'Flat Owner'}
                </span>
              </div>

              {/* Unit Tag */}
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-teal-100/90 font-medium">
                <span className="flex items-center bg-white/10 px-2.5 py-1 rounded-xl backdrop-blur-md">
                  <Home className="w-3.5 h-3.5 mr-1 text-teal-300" />
                  {user?.block} • Flat {user?.flatNumber}
                </span>
                <span className="bg-white/10 px-2.5 py-1 rounded-xl backdrop-blur-md">
                  {user?.phase || 'Phase 1 - Green Meadows'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={openCreateModal}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-zinc-950 font-extrabold text-xs shadow-md transition flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Item / Service</span>
            </button>
            <button
              onClick={onNavigateToMarketplace}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition flex items-center space-x-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Catalog</span>
            </button>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Household Security & Privacy Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Door Privacy Shield */}
        <div className="glass-card rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-teal-600" />
              Unit Door Privacy
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              user?.hideFlatNumber
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
            }`}>
              {user?.hideFlatNumber ? 'Door Masked' : 'Door Visible'}
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {user?.hideFlatNumber
              ? 'Your flat number is masked from neighbors in the public catalog. It is only revealed after an order request is confirmed.'
              : 'Your flat number is visible on your listings for seamless neighborhood pickups.'}
          </p>
          <button
            onClick={togglePrivacy}
            className="w-full py-2 rounded-xl text-xs font-bold border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center justify-center space-x-1.5"
          >
            {user?.hideFlatNumber ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{user?.hideFlatNumber ? 'Make Door Number Visible' : 'Mask Door Number'}</span>
          </button>
        </div>

        {/* UPI VPA for Receiving Payments */}
        <div className="glass-card rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center">
              <QrCode className="w-4 h-4 mr-1 text-teal-600" />
              Direct UPI Payout VPA
            </span>
            <button
              onClick={() => setEditingUpi(!editingUpi)}
              className="text-xs font-semibold text-teal-600 hover:underline flex items-center"
            >
              <Edit3 className="w-3 h-3 mr-1" />
              {editingUpi ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {editingUpi ? (
            <div className="space-y-2">
              <input
                type="text"
                value={upiInput}
                onChange={(e) => setUpiInput(e.target.value)}
                placeholder="yourname@okhdfcbank"
                className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
              <button
                onClick={handleSaveUpi}
                className="w-full py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold"
              >
                Save UPI ID
              </button>
            </div>
          ) : (
            <div>
              <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg font-mono text-teal-700 dark:text-teal-400 block truncate">
                {user?.upiId || 'Not configured'}
              </code>
              <p className="text-[11px] text-zinc-400 mt-1">
                Used to generate dynamic QR codes when neighbors pay for your items.
              </p>
            </div>
          )}
          <div className="text-[10px] text-zinc-500 flex items-center">
            <Sparkles className="w-3 h-3 text-amber-500 mr-1" />
            Zero commission • Direct flat-to-flat UPI
          </div>
        </div>

        {/* Reputation & Badges */}
        <div className="glass-card rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center">
              <Star className="w-4 h-4 mr-1 text-amber-500" />
              Neighbor Reputation
            </span>
            <div className="flex items-center text-amber-600 font-extrabold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
              {user?.rating || '5.0'} ({user?.ratingCount || 1} reviews)
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(user?.badges || ['Verified Resident']).map((b, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-xs"
              >
                <Award className="w-3 h-3 mr-1 text-amber-500" />
                {b}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-zinc-400">
            Badges are awarded by neighbors after completed handovers.
          </p>
        </div>
      </div>

      {/* Household Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">My Active Items</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{activeCount}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Sales & Rentals</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{formatINR(totalEarnings)}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Pending Handovers</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{pendingHandovers.length}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Total Exchanges</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{myOrders.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs: My Listings / Pending Handovers */}
      <div className="glass-card rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setActiveTab('listings');
                sounds.playPop();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'listings'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              My Household Listings ({myListings.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('handovers');
                sounds.playPop();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'handovers'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              Active Handovers ({pendingHandovers.length})
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="px-3.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-xs hover:bg-teal-100 transition flex items-center space-x-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post Item</span>
          </button>
        </div>

        {/* Tab 1: My Listings */}
        {activeTab === 'listings' && (
          <div className="p-5">
            {myListings.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <Package className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  You haven't listed any items yet
                </p>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Have fresh bakes, extra tools, plants, or pre-loved electronics? Share or rent them to your neighbors!
                </p>
                <button
                  onClick={openCreateModal}
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-md"
                >
                  Post First Item
                </button>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {myListings.map((prod) => (
                  <div key={prod._id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={prod.images[0]}
                        alt=""
                        className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                            {prod.title}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prod.available ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-700'
                          }`}>
                            {prod.available ? 'Available' : 'Reserved / Sold'}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5 flex items-center space-x-2">
                          <span className="font-bold text-teal-700 dark:text-teal-400">
                            {prod.listingMode === 'giveaway' ? '₹0 Free' : formatINR(prod.price)}
                          </span>
                          <span>•</span>
                          <span>{prod.category}</span>
                          <span>•</span>
                          <span>{formatDate(prod.createdAt)}</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleToggleAvailability(prod._id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                          prod.available
                            ? 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300'
                            : 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {prod.available ? 'Mark Reserved' : 'Mark Available'}
                      </button>

                      <button
                        onClick={() => handleDeleteListing(prod._id)}
                        className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Active Handovers */}
        {activeTab === 'handovers' && (
          <div className="p-5">
            {pendingHandovers.length === 0 ? (
              <div className="text-center py-10 text-zinc-400">
                <Truck className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
                <p className="text-xs font-semibold">No pending handovers right now.</p>
                <p className="text-[10px] text-zinc-500 mt-1">All deliveries and pickups are up to date!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingHandovers.map((ord) => (
                  <div
                    key={ord._id}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                          {ord.product?.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Handover via: <strong className="text-zinc-700 dark:text-zinc-300">{ord.handoverOption}</strong> • Amount: {formatINR(ord.totalAmount)}
                      </p>
                    </div>

                    <button
                      onClick={onNavigateToOrders}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition"
                    >
                      Track & Advance
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
