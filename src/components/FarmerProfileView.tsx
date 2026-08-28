import React, { useState } from 'react';
import {
  User,
  MapPin,
  Phone,
  Edit2,
  ShieldCheck,
  Award,
  Download,
  RotateCcw,
  Languages,
  CheckCircle2,
  Calendar,
  Globe,
  Sparkles,
  FileCheck2,
  X,
} from 'lucide-react';
import { FarmerProfile, LanguageCode, Animal } from '../types';

interface FarmerProfileViewProps {
  farmer: FarmerProfile;
  animals: Animal[];
  onUpdateFarmer: (farmer: FarmerProfile) => void;
  currentLanguage: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  onResetData: () => void;
}

const SUPPORTED_LANGUAGES: { code: LanguageCode; label: string; nativeName: string }[] = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'or', label: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা' },
  { code: 'pa', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
];

export const FarmerProfileView: React.FC<FarmerProfileViewProps> = ({
  farmer,
  animals,
  onUpdateFarmer,
  currentLanguage,
  onChangeLanguage,
  onResetData,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<FarmerProfile>({ ...farmer });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFarmer(editForm);
    setIsEditModalOpen(false);
  };

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            farmer,
            animals,
            exportDate: new Date().toISOString(),
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AnimalCare360_Backup_${farmer.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={farmer.avatarUrl}
                alt={farmer.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full ring-2 ring-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
                  {farmer.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  Verified Dairy Farmer
                </span>
              </div>
              
              <div className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-3">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{farmer.village}, {farmer.district}, {farmer.state}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{farmer.phone}</span>
                </span>
              </div>

              <div className="text-xs text-slate-600 font-medium pt-1">
                Farm Focus: <span className="font-bold text-slate-800">{farmer.primaryFarmingType}</span> ({farmer.farmSizeAcres} Acres)
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0 self-end sm:self-center">
            <button
              onClick={() => {
                setEditForm({ ...farmer });
                setIsEditModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition flex items-center space-x-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Farm Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Language & Regional Customization Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
        <h3 className="font-heading font-bold text-slate-900 text-base flex items-center space-x-2">
          <Languages className="w-4 h-4 text-emerald-600" />
          <span>Regional App Language Preference (भाषा चयन)</span>
        </h3>
        <p className="text-xs text-slate-500">
          Switch the app interface into your preferred native mother tongue
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onChangeLanguage(lang.code)}
              className={`p-3 rounded-xl border text-left transition ${
                currentLanguage === lang.code
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50/50'
              }`}
            >
              <div className="font-bold text-xs">{lang.nativeName}</div>
              <div className={`text-[10px] ${currentLanguage === lang.code ? 'text-emerald-100' : 'text-slate-400'}`}>
                {lang.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Government Schemes & Subsidies Enrolled */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Award className="w-5 h-5 text-emerald-600" />
          <h3 className="font-heading font-bold text-slate-900 text-base">
            National Livestock Mission & Dairy Insurance Schemes
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1.5">
            <div className="font-bold text-emerald-950 flex items-center justify-between">
              <span>Rashtriya Gokul Mission (RGM)</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-800 text-[10px] font-bold">Active</span>
            </div>
            <p className="text-emerald-900/80">
              Free Sex-sorted semen straws and Artificial Insemination (AI) door delivery subsidy.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1.5">
            <div className="font-bold text-blue-950 flex items-center justify-between">
              <span>Kisan Credit Card (KCC) Livestock</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-200 text-blue-800 text-[10px] font-bold">Enrolled</span>
            </div>
            <p className="text-blue-900/80">
              ₹1.60 Lakh collateral-free working capital loan for fodder and feed at 4% interest subvention.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1.5">
            <div className="font-bold text-amber-950 flex items-center justify-between">
              <span>Livestock Insurance Scheme (NLM)</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-800 text-[10px] font-bold">50% Subsidy</span>
            </div>
            <p className="text-amber-900/80">
              Cattle health & mortality risk cover against natural calamities and infectious diseases.
            </p>
          </div>
        </div>
      </div>

      {/* Data Management & Offline Backup */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-heading font-bold text-slate-900 text-sm">
            Offline Data Portability & Local Cache
          </h4>
          <p className="text-xs text-slate-500">
            Export a full JSON backup of your farm herd records or restore initial demo data
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Farm JSON</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset to default initial farm demonstration dataset?')) {
                onResetData();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* ================= MODAL: EDIT FARMER PROFILE ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative my-8">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-heading text-slate-900 mb-4">
              Edit Farmer Profile & Location
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Village</label>
                  <input
                    type="text"
                    value={editForm.village}
                    onChange={(e) => setEditForm({ ...editForm, village: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={editForm.district}
                    onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Farming Type</label>
                  <select
                    value={editForm.primaryFarmingType}
                    onChange={(e) => setEditForm({ ...editForm, primaryFarmingType: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Dairy & Livestock">Dairy & Livestock</option>
                    <option value="Goat & Sheep Farming">Goat & Sheep Farming</option>
                    <option value="Poultry & Layer">Poultry & Layer</option>
                    <option value="Mixed Livestock & Crops">Mixed Livestock & Crops</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Farm Land Size (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editForm.farmSizeAcres}
                    onChange={(e) => setEditForm({ ...editForm, farmSizeAcres: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Profile Photo URL</label>
                <input
                  type="url"
                  value={editForm.avatarUrl}
                  onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
