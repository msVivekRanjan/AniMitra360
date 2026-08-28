import React from 'react';
import {
  LayoutDashboard,
  HeartPulse,
  Syringe,
  FileText,
  TrendingUp,
  Apple,
  CloudSunRain,
  Stethoscope,
  Building2,
  ShoppingBag,
  ShieldCheck,
  PhoneCall,
  X,
} from 'lucide-react';
import { UserRole } from '../types';
import { getTranslation } from '../data/translations';

interface SidebarProps {
  activeTab: string;
  onSelectTab?: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  userRole?: UserRole;
  currentRole?: UserRole;
  currentLanguage?: string;
  language?: string;
  animalsCount?: number;
  vaccinesDueCount?: number;
  weatherAlertsCount?: number;
  activeAlertsCount?: number;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
  farmerName?: string;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
  const {
    activeTab,
    onSelectTab,
    setActiveTab,
    userRole,
    currentRole = 'farmer',
    currentLanguage,
    language = 'en',
    vaccinesDueCount = 0,
    weatherAlertsCount,
    activeAlertsCount = 0,
    mobileMenuOpen = false,
    setMobileMenuOpen = () => {},
    farmerName = 'Rajesh Reddy',
  } = props;

  const role = userRole || currentRole;
  const lang = currentLanguage || language;
  const alertCount = weatherAlertsCount !== undefined ? weatherAlertsCount : activeAlertsCount;

  const handleTabClick = (tabId: string) => {
    if (onSelectTab) onSelectTab(tabId);
    if (setActiveTab) setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const navItems = [
    {
      id: 'dashboard',
      label: getTranslation(lang, 'dashboard'),
      icon: LayoutDashboard,
      roles: ['farmer', 'vet', 'admin'],
    },
    {
      id: 'animals',
      label: getTranslation(lang, 'animals'),
      icon: HeartPulse,
      badge: null,
      roles: ['farmer', 'vet', 'admin'],
    },
    {
      id: 'vaccinations',
      label: getTranslation(lang, 'vaccinations'),
      icon: Syringe,
      badge: vaccinesDueCount > 0 ? vaccinesDueCount : null,
      badgeColor: 'bg-amber-100 text-amber-800 border border-amber-200',
      roles: ['farmer', 'vet', 'admin'],
    },
    {
      id: 'health',
      label: getTranslation(lang, 'healthRecords'),
      icon: FileText,
      roles: ['farmer', 'vet', 'admin'],
    },
    {
      id: 'growth',
      label: getTranslation(lang, 'growth'),
      icon: TrendingUp,
      roles: ['farmer', 'vet', 'admin'],
    },
    {
      id: 'nutrition',
      label: getTranslation(lang, 'nutrition'),
      icon: Apple,
      roles: ['farmer', 'vet', 'admin'],
    },
    {
      id: 'weather',
      label: getTranslation(lang, 'weatherAlerts'),
      icon: CloudSunRain,
      badge: alertCount > 0 ? alertCount : null,
      badgeColor: 'bg-rose-100 text-rose-800 border border-rose-200',
      roles: ['farmer', 'vet', 'admin'],
    },
    {
      id: 'vets',
      label: getTranslation(lang, 'vetSupport'),
      icon: Stethoscope,
      roles: ['farmer', 'vet', 'admin'],
    },
    {
      id: 'marketplace',
      label: getTranslation(lang, 'marketplace'),
      icon: ShoppingBag,
      roles: ['farmer', 'vet', 'admin'],
    },
    {
      id: 'profile',
      label: getTranslation(lang, 'profile'),
      icon: Building2,
      roles: ['farmer', 'vet', 'admin'],
    },
  ];

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

  const roleLabel =
    role === 'farmer'
      ? getTranslation(lang, 'primaryFarmer')
      : role === 'vet'
      ? getTranslation(lang, 'vetPersona')
      : getTranslation(lang, 'adminControls');

  const renderNavContent = (isMobile = false) => (
    <div className="flex flex-col h-full justify-between">
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
        {/* Mobile Header */}
        {isMobile && (
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-50">
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold italic shadow-xs">
                A
              </div>
              <h2 className="font-bold text-lg tracking-tight text-emerald-950">
                AniMitra <span className="text-emerald-600">360</span>
              </h2>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-emerald-800 hover:bg-emerald-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="px-2 pb-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
          {getTranslation(lang, 'dashboard')} & Navigation
        </div>

        {/* Navigation Items in Clean Minimal Style */}
        <nav className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive =
              activeTab === item.id ||
              (item.id === 'health' && activeTab === 'healthRecords') ||
              (item.id === 'weather' && activeTab === 'weatherAlerts') ||
              (item.id === 'vets' && (activeTab === 'vetSupport' || activeTab === 'directory'));

            return (
              <button
                key={item.id}
                id={`nav-${item.id}${isMobile ? '-mob' : ''}`}
                onClick={() => handleTabClick(item.id)}
                className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-sm transition-colors text-left ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60'
                    : 'text-emerald-800/70 hover:bg-emerald-50/60 hover:text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isActive ? (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-transparent border border-emerald-300 shrink-0" />
                  )}
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.badgeColor || 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Emergency Hotline Card */}
        <div className="mt-6 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 mb-1">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>{getTranslation(lang, 'emergencyHelpdesk')}</span>
          </div>
          <p className="text-[11px] text-emerald-700 leading-tight mb-2">
            {getTranslation(lang, 'nationalHelpline')}
          </p>
          <a
            href="tel:1962"
            className="w-full py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>📞 {getTranslation(lang, 'dial1962')}</span>
          </a>
        </div>
      </div>

      {/* Profile Footer */}
      <div className="p-4 border-t border-emerald-100 bg-white">
        <button
          onClick={() => handleTabClick('profile')}
          className="w-full flex items-center gap-3 text-left hover:bg-emerald-50/80 p-1.5 rounded-xl transition"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs shrink-0">
            {farmerName ? farmerName.slice(0, 2).toUpperCase() : 'RR'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-950 truncate">{farmerName}</p>
            <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-medium">{roleLabel}</p>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-emerald-950/40 backdrop-blur-xs z-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Aside */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col justify-between transition-transform duration-200 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderNavContent(true)}
      </aside>

      {/* Desktop Sticky Sidebar (Strictly below Navbar z-50, self-contained z-30) */}
      <aside className="hidden lg:flex lg:flex-col lg:sticky lg:top-22 lg:h-[calc(100vh-6.5rem)] w-64 bg-white border border-emerald-100 rounded-3xl z-30 shrink-0 shadow-xs justify-between overflow-hidden">
        {renderNavContent(false)}
      </aside>
    </>
  );
};
