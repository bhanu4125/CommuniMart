import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  ShoppingBag, 
  Leaf, 
  IndianRupee, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Building, 
  UserCheck, 
  Trash2, 
  Eye, 
  SlidersHorizontal,
  Flame,
  BellRing
} from 'lucide-react';
import { IUser, IProduct } from '../types';
import { adminAPI, productsAPI, noticesAPI } from '../lib/api';
import { formatINR, formatDate } from '../lib/utils';
import { sounds } from '../lib/sound';
import { toast } from 'sonner';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [residents, setResidents] = useState<IUser[]>([]);
  const [allListings, setAllListings] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminTab, setAdminTab] = useState<'verification' | 'listings' | 'blocks'>('verification');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const [statsRes, resRes, prodRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getResidents(),
        productsAPI.list({ available: 'all' })
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (resRes.data.success) {
        setResidents(resRes.data.data);
      }
      if (prodRes.data.success) {
        setAllListings(prodRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (userId: string, newStatus: 'verified' | 'rejected') => {
    try {
      await adminAPI.updateResident(userId, { verificationStatus: newStatus });
      sounds.playSuccess();
      toast.success(`Resident status updated to ${newStatus}`);
      loadDashboard();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handlePromoteToSeller = async (userId: string) => {
    try {
      await adminAPI.updateResident(userId, {
        role: 'verified_seller',
        verificationStatus: 'verified',
        badges: ['Verified Resident', 'Trusted Seller']
      });
      sounds.playSuccess();
      toast.success('Resident upgraded to Verified Seller!');
      loadDashboard();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteListingAdmin = async (productId: string) => {
    if (!window.confirm('Committee Moderation: Are you sure you want to remove this listing?')) return;
    try {
      await productsAPI.delete(productId);
      sounds.playPop();
      toast.success('Listing removed by committee moderation');
      loadDashboard();
    } catch (err) {
      toast.error('Failed to delete listing');
    }
  };

  const filteredResidents = residents.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.verificationStatus === filterStatus;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Admin Executive Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-700 via-amber-800 to-zinc-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-200 text-xs font-bold mb-2 border border-white/15">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Green Meadows Managing Committee • Admin Oversight</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Society Committee Executive Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/80 max-w-xl mt-1">
              Verify unit onboarding, manage resident seller credentials, oversee active community exchanges, and monitor sustainability impact.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-white/10 px-3.5 py-2 rounded-2xl backdrop-blur-md border border-white/10 shrink-0">
            <Building className="w-5 h-5 text-amber-300" />
            <div>
              <p className="text-[10px] text-amber-200 font-bold uppercase">Society Jurisdiction</p>
              <p className="text-xs font-black text-white">4 Blocks • 2 Phases</p>
            </div>
          </div>
        </div>
      </div>

      {/* Society Overview KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-3.5 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Verified Units</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {stats?.verifiedResidents || 0} / {stats?.totalResidents || 0}
            </p>
            <p className="text-[10px] text-amber-600 font-bold">
              {stats?.pendingResidents || 0} Pending Approvals
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-3.5 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Society Listings</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {stats?.activeListings || 0}
            </p>
            <p className="text-[10px] text-emerald-600 font-bold">
              {allListings.length} Total Catalogs
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-3.5 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Society Volume</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {formatINR(stats?.totalTransactionVolume || 0)}
            </p>
            <p className="text-[10px] text-zinc-400">
              {stats?.completedOrders || 0} Completed Orders
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-3.5 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-lime-100 dark:bg-lime-950 flex items-center justify-center text-lime-700 dark:text-lime-300 shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Landfill Diverted</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              ~{stats?.wasteDivertedKg || 0} kg
            </p>
            <p className="text-[10px] text-lime-600 font-bold">
              Circular Society Economy
            </p>
          </div>
        </div>
      </div>

      {/* Admin Module Tabs */}
      <div className="glass-card rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setAdminTab('verification');
                sounds.playPop();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                adminTab === 'verification'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              Resident Approvals ({residents.length})
            </button>

            <button
              onClick={() => {
                setAdminTab('listings');
                sounds.playPop();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                adminTab === 'listings'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              Listings Oversight ({allListings.length})
            </button>

            <button
              onClick={() => {
                setAdminTab('blocks');
                sounds.playPop();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                adminTab === 'blocks'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              Block Distribution
            </button>
          </div>

          {/* Filter for verification */}
          {adminTab === 'verification' && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-zinc-400">Filter:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Approvals</option>
                <option value="verified">Verified Residents</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}
        </div>

        {/* Tab 1: Resident Verification Roster */}
        {adminTab === 'verification' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Resident</th>
                  <th className="py-3 px-4">Tower & Flat</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Door Privacy</th>
                  <th className="py-3 px-4 text-right">Committee Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredResidents.map((r) => (
                  <tr key={r._id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={r.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">{r.name}</p>
                          <p className="text-[10px] text-zinc-400">{r.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200">{r.block}</p>
                      <p className="text-[10px] text-zinc-400">Flat: {r.flatNumber}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.role === 'committee_admin'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : r.role === 'verified_seller'
                          ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}>
                        {r.role}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.verificationStatus === 'verified'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : r.verificationStatus === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 animate-pulse'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      }`}>
                        {r.verificationStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-zinc-500">
                      {r.hideFlatNumber ? '🔒 Masked' : '👁️ Public'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {r.verificationStatus !== 'verified' && (
                          <button
                            onClick={() => handleUpdateStatus(r._id, 'verified')}
                            className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] transition shadow-xs"
                          >
                            Approve
                          </button>
                        )}
                        {r.verificationStatus === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(r._id, 'rejected')}
                            className="px-2.5 py-1 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition"
                          >
                            Reject
                          </button>
                        )}
                        {r.role !== 'verified_seller' && r.role !== 'committee_admin' && (
                          <button
                            onClick={() => handlePromoteToSeller(r._id)}
                            className="px-2.5 py-1 rounded-lg border border-teal-300 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 text-[11px] font-semibold transition"
                          >
                            Make Seller
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Society Listings Oversight */}
        {adminTab === 'listings' && (
          <div className="p-5">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {allListings.map((prod) => (
                <div key={prod._id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={prod.images[0]}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                        {prod.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500">
                        Posted by: <strong>{prod.seller?.name}</strong> ({prod.block}) • Category: {prod.category}
                      </p>
                      <p className="text-[10px] text-teal-600 font-semibold mt-0.5">
                        {prod.listingMode === 'giveaway' ? '₹0 Free' : formatINR(prod.price)} • Status: {prod.available ? 'Available' : 'Reserved / Completed'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteListingAdmin(prod._id)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950 transition flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Moderate / Remove</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Tower & Block Distribution */}
        {adminTab === 'blocks' && (
          <div className="p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Resident Distribution across Society Blocks
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(stats?.blockDistribution || []).map((b: any) => (
                <div
                  key={b._id}
                  className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700"
                >
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{b._id}</p>
                  <p className="text-2xl font-black text-amber-600 mt-1">{b.count}</p>
                  <p className="text-[10px] text-zinc-400">Registered Households</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
