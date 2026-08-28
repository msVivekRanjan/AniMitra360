import React, { useState } from 'react';
import {
  Bell,
  Globe,
  Download,
  Menu,
  X,
  Stethoscope,
  ShieldCheck,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { UserRole, FarmerProfile, AppNotification } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../data/translations';

interface NavbarProps {
  farmer: FarmerProfile;
  currentLanguage?: string;
  onChangeLanguage?: (lang: any) => void;
  userRole?: UserRole;
  onChangeUserRole?: (role: UserRole) => void;
  notifications?: AppNotification[];
  onMarkNotificationRead?: (id: string) => void;
  onNavigate?: (tab: string) => void;

  // Legacy props compatibility
  language?: string;
  onLanguageChange?: (lang: string) => void;
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onOpenInstallPwa?: () => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = (props) => {
  const {
    farmer,
    currentLanguage = props.language || 'en',
    onChangeLanguage = props.onLanguageChange || (() => {}),
    userRole = props.currentRole || 'farmer',
    onChangeUserRole = props.onRoleChange || (() => {}),
    notifications = props.notifications || [],
    onNavigate = props.setActiveTab || (() => {}),
    mobileMenuOpen = false,
    setMobileMenuOpen = () => {},
  } = props;

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo & Current Farm Header */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-emerald-800 hover:bg-emerald-50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-emerald-800" />}
            </button>

            <div
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold italic shadow-xs">
                A
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <h1 className="font-bold text-lg sm:text-xl tracking-tight text-emerald-950">
                    AniMitra <span className="text-emerald-600">360</span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Farm Location Subheader in Navbar */}
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-emerald-100">
              <span className="text-xs text-emerald-600 font-medium">
                {getTranslation(currentLanguage, 'currentFarm')}:
              </span>
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 inline" />
                {farmer.village ? `${farmer.village}, ${farmer.district}` : 'Green Valley Estates • Mandya, KA'}
              </span>
            </div>
          </div>

          {/* Right Header Actions (Alerts, Persona Switcher, Language, Profile) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Alerts Pending Pill */}
            {unreadCount > 0 && (
              <button
                onClick={() => onNavigate('weather')}
                className="hidden sm:flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 text-amber-700 hover:bg-amber-100/60 transition"
              >
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                <span className="text-[12px] font-semibold">
                  {unreadCount} {getTranslation(currentLanguage, 'alertsPending')}
                </span>
              </button>
            )}

            {/* PWA Install Button */}
            <button
              id="btn-pwa-install"
              onClick={() => {
                if (props.onOpenInstallPwa) props.onOpenInstallPwa();
              }}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 transition"
              title="Offline Access"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>{getTranslation(currentLanguage, 'installApp')}</span>
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                id="btn-language-dropdown"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 transition"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium text-emerald-950">{currentLangObj.name} ({currentLangObj.code.toUpperCase()})</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-2xl shadow-xl py-2 z-50 border border-emerald-100 ring-1 ring-emerald-900/5 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest border-b border-emerald-50">
                    Language / भाषा / ଭାଷା
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onChangeLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition ${
                        currentLanguage === lang.code
                          ? 'font-bold text-emerald-700 bg-emerald-50/80'
                          : 'text-emerald-900'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </span>
                      {currentLanguage === lang.code && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                id="btn-role-switcher"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
              >
                {userRole === 'farmer' && <span>🌾</span>}
                {userRole === 'vet' && <Stethoscope className="w-3.5 h-3.5 text-emerald-100" />}
                {userRole === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-100" />}
                <span className="capitalize">
                  {userRole === 'farmer' && getTranslation(currentLanguage, 'farmerPersona')}
                  {userRole === 'vet' && getTranslation(currentLanguage, 'vetPersona')}
                  {userRole === 'admin' && getTranslation(currentLanguage, 'adminControls')}
                </span>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-2xl shadow-xl py-2 z-50 border border-emerald-100 ring-1 ring-emerald-900/5 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest border-b border-emerald-50">
                    {getTranslation(currentLanguage, 'switchActivePersona')}
                  </div>

                  <button
                    onClick={() => {
                      onChangeUserRole('farmer');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center space-x-2.5 hover:bg-emerald-50 transition ${
                      userRole === 'farmer' ? 'bg-emerald-50 font-bold text-emerald-800' : 'text-slate-700'
                    }`}
                  >
                    <span className="text-base">🌾</span>
                    <div>
                      <div className="font-semibold text-emerald-950">
                        {getTranslation(currentLanguage, 'farmerPersona')}
                      </div>
                      <div className="text-[10px] text-emerald-600">Livestock, nutrition & health</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onChangeUserRole('vet');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center space-x-2.5 hover:bg-emerald-50 transition ${
                      userRole === 'vet' ? 'bg-emerald-50 font-bold text-emerald-800' : 'text-slate-700'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold text-emerald-950">
                        {getTranslation(currentLanguage, 'vetPersona')}
                      </div>
                      <div className="text-[10px] text-emerald-600">Consultations & Rx</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onChangeUserRole('admin');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center space-x-2.5 hover:bg-emerald-50 transition ${
                      userRole === 'admin' ? 'bg-emerald-50 font-bold text-emerald-800' : 'text-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold text-emerald-950">
                        {getTranslation(currentLanguage, 'adminControls')}
                      </div>
                      <div className="text-[10px] text-emerald-600">National alerts & database</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              id="btn-notifications"
              onClick={() => onNavigate('weather')}
              className="relative p-2 rounded-xl text-emerald-700 hover:bg-emerald-50 transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Farmer Profile Button */}
            <button
              id="btn-farmer-profile"
              onClick={() => onNavigate('profile')}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-emerald-50 transition"
            >
              {farmer.avatar ? (
                <img
                  src={farmer.avatar}
                  alt={farmer.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs">
                  {farmer.name ? farmer.name.slice(0, 2).toUpperCase() : 'RR'}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
