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
  UserCheck 
} from 'lucide-react';
import { IUser } from '../types';
import { adminAPI } from '../lib/api';
import { formatINR } from '../lib/utils';
import { sounds } from '../lib/sound';
import { toast } from 'sonner';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [residents, setResidents] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const [statsRes, resRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getResidents()
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (resRes.data.success) {
        setResidents(resRes.data.data);
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
      toast.success(`Resident verification set to: ${newStatus}`);
      loadDashboard();
    } catch (err) {
      toast.error('Failed to update resident status');
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

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Green Meadows Managing Committee</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
            Society Committee & Verification Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mt-1">
            Review resident unit registrations, manage verified seller credentials, and track community impact metrics.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Verified Residents</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {stats?.verifiedResidents || 0} / {stats?.totalResidents || 0}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Active Listings</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {stats?.activeListings || 0}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Society Volume</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {formatINR(stats?.totalTransactionVolume || 0)}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-lime-100 dark:bg-lime-950 flex items-center justify-center text-lime-700 dark:text-lime-300 shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500">Waste Diverted</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              ~{stats?.wasteDivertedKg || 0} kg
            </p>
          </div>
        </div>
      </div>

      {/* Residents Verification Table */}
      <div className="glass-card rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
              Resident Unit Verification Roster
            </h3>
            <p className="text-xs text-zinc-500">
              Manage committee approvals for flat & villa residents
            </p>
          </div>
          <span className="text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-xl">
            {residents.length} Registered Units
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Resident</th>
                <th className="py-3 px-4">Unit / Tower</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Door Privacy</th>
                <th className="py-3 px-4 text-right">Committee Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {residents.map((r) => (
                <tr key={r._id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition">
                  {/* Resident Name & Avatar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={r.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">{r.name}</p>
                        <p className="text-[10px] text-zinc-400">{r.phone}</p>
                      </div>
                    </div>
                  </td>

                  {/* Tower & Flat */}
                  <td className="py-3 px-4">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">{r.block}</p>
                    <p className="text-[10px] text-zinc-400">{r.flatNumber}</p>
                  </td>

                  {/* Role */}
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

                  {/* Verification Status */}
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

                  {/* Door Privacy */}
                  <td className="py-3 px-4 text-zinc-500">
                    {r.hideFlatNumber ? '🔒 Masked' : '👁️ Visible'}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      {r.verificationStatus !== 'verified' && (
                        <button
                          onClick={() => handleUpdateStatus(r._id, 'verified')}
                          className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] transition"
                        >
                          Approve
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
      </div>
    </div>
  );
};
