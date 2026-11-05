import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  PlusCircle, 
  MessageSquare, 
  CheckCircle, 
  MapPin, 
  Sparkles,
  Flame,
  ShieldCheck,
  Check
} from 'lucide-react';
import { INotice } from '../types';
import { noticesAPI } from '../lib/api';
import { NoticeModal } from '../components/NoticeModal';
import { ChatDrawer } from '../components/ChatDrawer';
import { useAuthStore } from '../stores/useAuthStore';
import { formatDate } from '../lib/utils';
import { sounds } from '../lib/sound';
import { toast } from 'sonner';

export const NoticesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [notices, setNotices] = useState<INotice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatContact, setChatContact] = useState<any | null>(null);

  useEffect(() => {
    fetchNotices();
  }, [category]);

  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      const res = await noticesAPI.list(category);
      if (res.data.success) {
        setNotices(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load notices', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleResolve = async (noticeId: string) => {
    try {
      await noticesAPI.toggleResolve(noticeId);
      sounds.playSuccess();
      toast.success('Notice status updated!');
      fetchNotices();
    } catch (err: any) {
      toast.error('Failed to update status');
    }
  };

  const categories = [
    'All',
    'Request / Borrow',
    'Flash Sale / Treat',
    'Notice / Alert',
    'Skill Offer'
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Green Meadows Society Notice Board</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
            Community Notice & Flash Requests
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mt-1">
            Need to borrow a hand tool for an hour? Got extra baked treats fresh out of the oven? Post here to reach all society residents instantly.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-teal-700/25 transition flex items-center space-x-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Notice / Request</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              sounds.playPop();
            }}
            className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              category === cat
                ? 'bg-teal-600 text-white shadow-md'
                : 'glass-card border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-teal-500/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices Stream */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-6 h-36 animate-pulse" />
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800 space-y-3">
          <Bell className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <h3 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200">
            No active notices
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Everything is quiet right now in Green Meadows. Post the first community request!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => {
            const isAuthor = user?._id === notice.author._id;
            const isAdmin = user?.role === 'committee_admin';
            const canManage = isAuthor || isAdmin;

            return (
              <div
                key={notice._id}
                className={`glass-card rounded-3xl p-5 border transition-all ${
                  notice.urgency === 'urgent' && !notice.resolved
                    ? 'border-amber-400/80 bg-amber-50/30 dark:bg-amber-950/10 shadow-md ring-1 ring-amber-400/30'
                    : 'border-zinc-200 dark:border-zinc-800'
                } ${notice.resolved ? 'opacity-65' : ''}`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex items-center space-x-3">
                    <img
                      src={notice.author?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          {notice.author?.name}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span className="text-zinc-400">•</span>
                        <span className="text-xs text-zinc-500">
                          {notice.author?.block}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        Posted {formatDate(notice.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {notice.urgency === 'urgent' && !notice.resolved && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-zinc-950 shadow-xs">
                        <Flame className="w-3.5 h-3.5 mr-1" />
                        Urgent Need
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300">
                      {notice.category}
                    </span>
                    {notice.resolved && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        <Check className="w-3 h-3 mr-1" />
                        Resolved
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="py-3 space-y-1.5">
                  <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                    {notice.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                    {notice.description}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-medium">
                    Resident exchange
                  </span>

                  <div className="flex items-center space-x-2">
                    {canManage && (
                      <button
                        onClick={() => handleToggleResolve(notice._id)}
                        className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-100 transition"
                      >
                        {notice.resolved ? 'Mark Unresolved' : 'Mark Resolved'}
                      </button>
                    )}

                    {!isAuthor && (
                      <button
                        onClick={() => setChatContact(notice.author)}
                        className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Offer Help / Chat</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notice creation modal */}
      <NoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchNotices}
      />

      {/* Chat drawer if user clicks Offer Help */}
      {chatContact && (
        <ChatDrawer
          isOpen={!!chatContact}
          onClose={() => setChatContact(null)}
          contact={chatContact}
        />
      )}
    </div>
  );
};
