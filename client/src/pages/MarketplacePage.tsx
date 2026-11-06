import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Sparkles, 
  Cake, 
  Laptop, 
  Armchair, 
  Gamepad2, 
  GraduationCap, 
  Flower2, 
  BookOpen, 
  Wrench, 
  SlidersHorizontal,
  PlusCircle,
  X,
  PackageOpen
} from 'lucide-react';
import { IProduct, ItemCategory, ListingMode } from '../types';
import { productsAPI } from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import { ProductDrawer } from '../components/ProductDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { ChatDrawer } from '../components/ChatDrawer';
import { sounds } from '../lib/sound';
import { useDebounce } from '../hooks/useDebounce';

interface MarketplacePageProps {
  openCreateModal: () => void;
  onNavigateToOrders: () => void;
}

const CATEGORIES: { label: ItemCategory | 'All'; icon: any }[] = [
  { label: 'All', icon: Sparkles },
  { label: 'Fresh Home Bakes & Meals', icon: Cake },
  { label: 'Pre-loved Electronics', icon: Laptop },
  { label: 'Home & Furniture', icon: Armchair },
  { label: 'Kids & Toys', icon: Gamepad2 },
  { label: 'Skill Exchange & Services', icon: GraduationCap },
  { label: 'Garden & Plants', icon: Flower2 },
  { label: 'Books & Hobbies', icon: BookOpen },
  { label: 'Tools & Utilities', icon: Wrench },
];

const BLOCKS = ['All', 'Tower A', 'Tower B', 'Tower C', 'Villa Grove'];

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ openCreateModal, onNavigateToOrders }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const latestRequest = useRef(0);
  const [category, setCategory] = useState<ItemCategory | 'All'>('All');
  const [listingMode, setListingMode] = useState<ListingMode | 'all'>('all');
  const [block, setBlock] = useState('All');
  const [condition, setCondition] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular'>('newest');

  // Selected modals
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<IProduct | null>(null);
  const [chatContact, setChatContact] = useState<any | null>(null);
  const [chatProduct, setChatProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [category, listingMode, block, condition, sortBy, debouncedSearch]);

  const fetchProducts = async () => {
    const requestId = ++latestRequest.current;
    try {
      setIsLoading(true);
      const params: any = { sortBy };
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (category !== 'All') params.category = category;
      if (listingMode !== 'all') params.listingMode = listingMode;
      if (block !== 'All') params.block = block;
      if (condition !== 'All') params.condition = condition;

      const res = await productsAPI.list(params);
      if (requestId === latestRequest.current && res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      if (requestId === latestRequest.current) {
        console.error('Failed to load products', err);
      }
    } finally {
      if (requestId === latestRequest.current) {
        setIsLoading(false);
      }
    }
  };

  const handleOpenChat = (prod: IProduct) => {
    setChatContact(prod.seller);
    setChatProduct(prod);
  };

  const handleOrder = (prod: IProduct) => {
    setSelectedProduct(null);
    setCheckoutProduct(prod);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-teal-200 text-xs font-semibold border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Green Meadows Society • Verified Resident Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Buy, borrow, rent & trade <br className="hidden sm:inline" />
            <span className="text-amber-300">with neighbors you trust.</span>
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-xl">
            From fresh home bakes and balcony plant cuttings to power tools and ICSE tutoring — discover everything available right inside our gated community.
          </p>

          {/* Quick Action Button in Hero */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-zinc-950 text-xs font-extrabold shadow-md transition flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Item / Offer Skill</span>
            </button>
            <button
              onClick={() => setListingMode('giveaway')}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/20 active:scale-95 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition"
            >
              🎁 View Free Neighbor Giveaways
            </button>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-teal-600/30 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-40 h-40 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
        {/* Top search & block picker */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by keywords, tags, or item names (e.g. sourdough, ladder, lego, bose)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Block / Tower Filter */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                value={block}
                onChange={(e) => {
                  setBlock(e.target.value);
                  sounds.playPop();
                }}
                className="text-xs px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
              >
                {BLOCKS.map((b) => (
                  <option key={b} value={b}>
                    {b === 'All' ? '🏢 All Society Towers' : `📍 ${b}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                sounds.playPop();
              }}
              className="text-xs px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
            >
              <option value="newest">🕒 Newest First</option>
              <option value="price_asc">💵 Price: Low to High</option>
              <option value="price_desc">💎 Price: High to Low</option>
              <option value="popular">🔥 Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Listing Mode Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-semibold">
          <span className="text-zinc-400 mr-1 text-[11px] uppercase tracking-wider">Mode:</span>
          {[
            { id: 'all', label: 'All Listings' },
            { id: 'sell', label: 'Fixed Price' },
            { id: 'rent', label: 'Rental (Hr/Day)' },
            { id: 'giveaway', label: '🎁 Free Giveaway' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setListingMode(m.id as any);
                sounds.playPop();
              }}
              className={`px-3 py-1.5 rounded-xl transition ${
                listingMode === m.id
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Horizontal Carousel */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = category === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => {
                setCategory(cat.label);
                sounds.playPop();
              }}
              className={`shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center space-x-1.5 transition-all select-none ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-105'
                  : 'glass-card border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-teal-500/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Product Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="glass-card rounded-2xl overflow-hidden animate-pulse border border-zinc-200 dark:border-zinc-800 h-80 flex flex-col justify-between p-4"
            >
              <div className="w-full h-44 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
              <div className="space-y-2 mt-3">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
              </div>
              <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg mt-3" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800 space-y-3">
          <PackageOpen className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <h3 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200">
            No listings found
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search filters, switching blocks, or be the first neighbor to post!
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setListingMode('all');
              setBlock('All');
            }}
            className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-xs hover:bg-teal-100 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((prod) => (
            <ProductCard
              key={prod._id}
              product={prod}
              onSelect={(p) => setSelectedProduct(p)}
              onOpenChat={(p) => handleOpenChat(p)}
            />
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOrder={(p) => handleOrder(p)}
          onChat={(p) => {
            setSelectedProduct(null);
            handleOpenChat(p);
          }}
        />
      )}

      {/* Society Checkout Modal */}
      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          onClose={() => setCheckoutProduct(null)}
          onSuccess={() => {
            setCheckoutProduct(null);
            fetchProducts();
            onNavigateToOrders();
          }}
        />
      )}

      {/* Chat Drawer */}
      {chatContact && (
        <ChatDrawer
          isOpen={!!chatContact}
          onClose={() => {
            setChatContact(null);
            setChatProduct(null);
          }}
          contact={chatContact}
          product={chatProduct}
        />
      )}
    </div>
  );
};
