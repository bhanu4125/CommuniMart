import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CreateListingModal } from './components/CreateListingModal';
import { MarketplacePage } from './pages/MarketplacePage';
import { NoticesPage } from './pages/NoticesPage';
import { OrdersPage } from './pages/OrdersPage';
import { MessagesPage } from './pages/MessagesPage';
import { AdminPage } from './pages/AdminPage';
import { useAuthStore } from './stores/useAuthStore';
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'sonner';

export const App: React.FC = () => {
  const { init, isLoading, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>('marketplace');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    init();
  }, [init]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-600 animate-pulse flex items-center justify-center text-white font-bold text-xl">
          CM
        </div>
        <p className="text-sm font-semibold text-zinc-500">
          Connecting to Green Meadows Society Network...
        </p>
      </div>
    );
  }

  return (
    <SocketProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
        <Toaster position="top-right" richColors closeButton />

        {/* Global Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openCreateModal={() => setIsCreateModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeTab === 'marketplace' && (
            <MarketplacePage
              key={refreshTrigger}
              openCreateModal={() => setIsCreateModalOpen(true)}
              onNavigateToOrders={() => setActiveTab('orders')}
            />
          )}

          {activeTab === 'notices' && <NoticesPage />}

          {activeTab === 'orders' && <OrdersPage />}

          {activeTab === 'chat' && <MessagesPage />}

          {activeTab === 'admin' && user?.role === 'committee_admin' && (
            <AdminPage />
          )}
        </main>

        {/* Create Listing Modal */}
        <CreateListingModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setRefreshTrigger((prev) => prev + 1);
            setActiveTab('marketplace');
          }}
        />

        {/* Floating Mobile Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </SocketProvider>
  );
};

export default App;
