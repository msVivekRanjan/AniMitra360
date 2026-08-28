import React, { useState, useEffect } from 'react';
import { Download, Wifi, WifiOff, X, CheckCircle2 } from 'lucide-react';
import { getTranslation } from '../data/translations';

interface PWAInstallBannerProps {
  showModal?: boolean;
  onClose?: () => void;
  currentLanguage?: string;
  language?: string;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onClose, currentLanguage, language }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installed, setInstalled] = useState(false);
  const lang = currentLanguage || language || 'en';

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isDismissed) return null;

  return (
    <div className="mb-6 bg-white text-emerald-950 rounded-2xl p-4 shadow-xs border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 text-base font-bold">
          🌿
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xs sm:text-sm text-emerald-950">
              {getTranslation(lang, 'offlineMode')}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center space-x-1">
              {isOnline ? (
                <Wifi className="w-2.5 h-2.5 text-emerald-600" />
              ) : (
                <WifiOff className="w-2.5 h-2.5 text-amber-600" />
              )}
              <span>{isOnline ? getTranslation(lang, 'onlineSync') : getTranslation(lang, 'offlineReady')}</span>
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-emerald-700">
            {getTranslation(lang, 'offlineBannerDesc')}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
        {installed ? (
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center space-x-1 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{getTranslation(lang, 'appInstalled')}</span>
          </span>
        ) : (
          <button
            onClick={() => {
              setInstalled(true);
              setTimeout(() => setIsDismissed(true), 1500);
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{getTranslation(lang, 'installApp')}</span>
          </button>
        )}

        <button
          onClick={() => {
            if (onClose) onClose();
            setIsDismissed(true);
          }}
          className="p-1.5 text-emerald-600 hover:text-emerald-950 rounded-lg transition"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
