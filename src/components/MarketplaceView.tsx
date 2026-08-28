import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  MapPin,
  Phone,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Sparkles,
  DollarSign,
  MessageCircle,
  X,
  ExternalLink,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MarketplaceListing, MarketplaceCategory } from '../types';
import { getTranslation } from '../data/translations';

interface MarketplaceViewProps {
  listings: MarketplaceListing[];
  currentLanguage?: string;
  language?: string;
  onAddListing: (listing: MarketplaceListing) => void;
}

const CATEGORIES: { id: MarketplaceCategory | 'All'; label: string; icon: string }[] = [
  { id: 'All', label: 'All Items', icon: '🛍️' },
  { id: 'Animals', label: 'Livestock & Animals', icon: '🐄' },
  { id: 'Fodder', label: 'Green & Dry Fodder', icon: '🌾' },
  { id: 'Feed & Supplements', label: 'Cattle Feed & Mineral Mix', icon: '🥣' },
  { id: 'Equipment', label: 'Dairy Equipment & Machinery', icon: '⚙️' },
  { id: 'Veterinary Supplies', label: 'Vet Supplies & Grooming', icon: '🧴' },
];

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  listings,
  currentLanguage,
  language = 'en',
  onAddListing,
}) => {
  const lang = currentLanguage || language;
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // New Listing Form State
  const [form, setForm] = useState({
    title: '',
    category: 'Animals' as MarketplaceCategory,
    priceInr: 45000,
    unit: 'Per Animal',
    location: 'Bhubaneswar, Odisha',
    description: '',
    phone: '+91 94371 88412',
    imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=600&auto=format&fit=crop&q=80',
  });

  const handleCategoryChangeInForm = (cat: MarketplaceCategory) => {
    let presetImg = form.imageUrl;
    let presetUnit = 'Per Item';

    if (cat === 'Animals') {
      presetImg = 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=600&auto=format&fit=crop&q=80';
      presetUnit = 'Per Animal';
    } else if (cat === 'Fodder') {
      presetImg = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80';
      presetUnit = 'Per Quintal';
    } else if (cat === 'Feed & Supplements') {
      presetImg = 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80';
      presetUnit = 'Per 50kg Bag';
    } else if (cat === 'Equipment') {
      presetImg = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80';
      presetUnit = 'Per Machine';
    }

    setForm({
      ...form,
      category: cat,
      imageUrl: presetImg,
      unit: presetUnit,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      alert('Please enter a listing title.');
      return;
    }

    const newListing: MarketplaceListing = {
      id: `list-${Date.now()}`,
      sellerId: 'farmer-01',
      sellerName: 'Ramesh Chandra Mohapatra',
      sellerPhone: form.phone,
      title: form.title,
      category: form.category,
      priceInr: Number(form.priceInr) || 1000,
      unit: form.unit,
      location: form.location,
      imageUrl: form.imageUrl,
      description: form.description || 'Quality assured farm product listed directly by verified farmer.',
      isVerifiedSeller: true,
      postedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    };

    onAddListing(newListing);
    setIsPostModalOpen(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  const filteredListings = listings.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center space-x-2">
            <span>{getTranslation(lang, 'marketplace')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Buy & sell certified animals, green fodder, feed supplements, and dairy equipment with zero middlemen
          </p>
        </div>

        <button
          id="btn-post-marketplace-listing"
          onClick={() => setIsPostModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{getTranslation(lang, 'postListing')}</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center space-x-1.5 border ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search cows, goats, green Napier grass, wheat straw bhusa, milking machine..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Marketplace Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
          <ShoppingBag className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-heading font-bold text-slate-800 text-base">No items found in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or be the first farmer to post a listing in this category!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-emerald-300 transition duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Category Header */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold">
                    {item.category}
                  </div>

                  {item.isVerifiedSeller && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center space-x-1 shadow-sm">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Farmer</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-xl font-extrabold font-heading text-white drop-shadow-md">
                      ₹{(item.priceInr ?? item.price ?? 0).toLocaleString()}{' '}
                      <span className="text-xs font-normal text-slate-200">/ {item.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-4 space-y-2.5">
                  <h3 className="font-heading font-bold text-base text-slate-900 line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
                    <div className="flex items-center space-x-1 truncate max-w-[170px]">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      {item.postedDate}
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    Seller: <span className="font-semibold text-slate-800">{item.sellerName}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${item.sellerPhone}`}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Seller</span>
                </a>

                <a
                  href={`https://wa.me/${item.sellerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello, I am interested in your AnimalCare 360 listing: ${item.title}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition flex items-center justify-center space-x-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Safety Notice & Quality Assurance */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-start space-x-3 text-xs text-slate-600">
        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-slate-900">
            Safe Livestock Trading Guidelines on AnimalCare 360:
          </div>
          <p>
            Always verify the 12-digit ear tag ID of cattle/buffalo on the national INAPH database. Inspect physical health records and NADCP vaccination certificates before finalizing payments.
          </p>
        </div>
      </div>

      {/* ================= MODAL: POST NEW LISTING ================= */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative my-8 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsPostModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Post Farm Marketplace Listing
                </h3>
                <p className="text-xs text-slate-500">
                  Sell animals, green fodder, silage bales, feed, or dairy machinery
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Listing Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Sahiwal 2nd Lactation Cow (14L milk/day) with Female Calf"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => handleCategoryChangeInForm(e.target.value as MarketplaceCategory)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Animals">Livestock & Animals</option>
                    <option value="Fodder">Green & Dry Fodder</option>
                    <option value="Feed & Supplements">Feed & Supplements</option>
                    <option value="Equipment">Dairy Equipment</option>
                    <option value="Veterinary Supplies">Vet Supplies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Per Animal / Per Quintal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={form.priceInr}
                    onChange={(e) => setForm({ ...form, priceInr: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location / Village</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Pipili, Puri / Khordha, Odisha"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Photo Image URL</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Very docile cow, giving 14 liters daily, vaccinated against FMD & HS, healthy teats..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
