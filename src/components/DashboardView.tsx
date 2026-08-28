import React from 'react';
import {
  HeartPulse,
  Syringe,
  AlertTriangle,
  ShoppingBag,
  Plus,
  Stethoscope,
  Apple,
  TrendingUp,
  MapPin,
  Calendar,
  CloudSun,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  Thermometer,
  Droplets,
  Wind,
  Activity,
} from 'lucide-react';
import {
  FarmerProfile,
  Animal,
  VaccinationRecord,
  DewormingRecord,
  HealthRecord,
  GrowthAndProductionRecord,
  WeatherDiseaseAlert,
  WeatherData,
} from '../types';
import { getTranslation } from '../data/translations';

interface DashboardViewProps {
  farmer: FarmerProfile;
  animals: Animal[];
  vaccinations: VaccinationRecord[];
  dewormings: DewormingRecord[];
  healthRecords: HealthRecord[];
  growthRecords?: GrowthAndProductionRecord[];
  weatherAlerts: WeatherDiseaseAlert[];
  currentWeather?: WeatherData;
  currentLanguage?: string;
  language?: string;
  onNavigate: (tab: string) => void;
  onRegisterAnimal?: () => void;
  onLogSickness?: () => void;
  onOpenAddAnimal?: () => void;
  onOpenAddHealth?: () => void;
  onMarkVaccineComplete?: (vacId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  farmer,
  animals,
  vaccinations,
  dewormings,
  healthRecords,
  growthRecords = [],
  weatherAlerts,
  currentWeather,
  currentLanguage,
  language = 'en',
  onNavigate,
  onRegisterAnimal,
  onLogSickness,
  onOpenAddAnimal,
  onOpenAddHealth,
  onMarkVaccineComplete,
}) => {
  const lang = currentLanguage || language;
  const handleAddAnimal = onRegisterAnimal || onOpenAddAnimal || (() => onNavigate('animals'));
  const handleAddHealth = onLogSickness || onOpenAddHealth || (() => onNavigate('health'));

  const pendingVaccines = vaccinations.filter((v) => v.status !== 'Completed');
  const criticalAlerts = weatherAlerts.filter(
    (a) => a.riskLevel === 'High' || a.riskLevel === 'Critical' || a.riskLevel === 'Severe'
  );

  // Total daily milk estimated
  const totalDailyMilk = animals.reduce((sum, a) => sum + (a.dailyMilkYieldLiters || 0), 0);

  // Next upcoming vaccine
  const nextVaccine = vaccinations.find((v) => v.status === 'Upcoming' || v.status === 'Overdue');

  return (
    <div className="space-y-6 pb-12">
      {/* 4 Metric Stats Cards in Clean Utility Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Livestock */}
        <div
          onClick={() => onNavigate('animals')}
          className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 transition cursor-pointer"
        >
          <p className="text-[11px] uppercase tracking-wider text-emerald-600 font-bold mb-1">
            {getTranslation(lang, 'totalAnimals')}
          </p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-emerald-950 font-heading">
              {animals.length}
            </span>
            <span className="text-xs text-emerald-500 mb-1 font-medium">
              +2 {getTranslation(lang, 'thisMonth')}
            </span>
          </div>
        </div>

        {/* Card 2: Upcoming Vaccines */}
        <div
          onClick={() => onNavigate('vaccinations')}
          className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs hover:border-amber-300 transition cursor-pointer"
        >
          <p className="text-[11px] uppercase tracking-wider text-emerald-600 font-bold mb-1">
            {getTranslation(lang, 'upcomingVaccines')}
          </p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-amber-600 font-heading">
              {pendingVaccines.length.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-amber-600 mb-1 italic font-medium">
              {nextVaccine ? `Next: ${nextVaccine.nextDueDate}` : 'All up to date'}
            </span>
          </div>
        </div>

        {/* Card 3: Milk Yield (Avg) */}
        <div
          onClick={() => onNavigate('growth')}
          className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 transition cursor-pointer"
        >
          <p className="text-[11px] uppercase tracking-wider text-emerald-600 font-bold mb-1">
            {getTranslation(lang, 'milkYieldAvg')}
          </p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-emerald-950 font-heading">
              {totalDailyMilk > 0 ? `${totalDailyMilk.toFixed(0)}L` : '240L'}
            </span>
            <span className="text-xs text-emerald-500 mb-1 font-medium">{getTranslation(lang, 'perDay')}</span>
          </div>
        </div>

        {/* Card 4: Market Inquiries */}
        <div
          onClick={() => onNavigate('marketplace')}
          className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 transition cursor-pointer"
        >
          <p className="text-[11px] uppercase tracking-wider text-emerald-600 font-bold mb-1">
            {getTranslation(lang, 'marketInquiries')}
          </p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-emerald-950 font-heading">15</span>
            <span className="text-xs text-emerald-500 mb-1 font-medium">{getTranslation(lang, 'activeCount')}</span>
          </div>
        </div>
      </div>

      {/* Main 2-Col + 1-Col Layout Matching Clean Utility Theme */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Herd Health Overview & Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-emerald-100 shadow-xs flex flex-col overflow-hidden">
            <div className="p-6 border-b border-emerald-50 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-emerald-950">
                  {getTranslation(lang, 'herdHealthOverview')}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {animals.length} {getTranslation(lang, 'activeCount')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddAnimal}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{getTranslation(lang, 'addAnimal')}</span>
                </button>
                <button
                  onClick={() => onNavigate('animals')}
                  className="text-xs font-bold text-emerald-600 hover:underline tracking-wider uppercase"
                >
                  {getTranslation(lang, 'viewAllAnimals')}
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">
                  <tr>
                    <th className="pb-4">{getTranslation(lang, 'animalIdName')}</th>
                    <th className="pb-4">{getTranslation(lang, 'species')}</th>
                    <th className="pb-4">{getTranslation(lang, 'healthStatus')}</th>
                    <th className="pb-4">{getTranslation(lang, 'lastActivity')}</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-emerald-50">
                  {animals.slice(0, 5).map((animal) => {
                    const animalHealth = healthRecords.find((h) => h.animalId === animal.id);
                    const animalVac = vaccinations.find((v) => v.animalId === animal.id);

                    return (
                      <tr key={animal.id} className="hover:bg-emerald-50/30 transition">
                        <td className="py-3">
                          <p className="font-bold text-emerald-950">
                            {animal.animalTagId} ({animal.name})
                          </p>
                          <p className="text-xs text-emerald-600/80">{animal.breed}</p>
                        </td>
                        <td className="py-3 text-emerald-700 font-medium">{animal.species}</td>
                        <td className="py-3">
                          {animal.status === 'Healthy' && (
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              {getTranslation(lang, 'excellent')}
                            </span>
                          )}
                          {animal.status === 'Under Treatment' && (
                            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              {getTranslation(lang, 'monitoring')}
                            </span>
                          )}
                          {animal.status === 'Vaccination Due' && (
                            <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              {getTranslation(lang, 'actionRequired')}
                            </span>
                          )}
                          {animal.status === 'Quarantined' && (
                            <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              {getTranslation(lang, 'quarantined')}
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-emerald-600 text-xs font-medium">
                          {animalHealth
                            ? `Treatment (${animalHealth.date})`
                            : animalVac
                            ? `Vaccine: ${animalVac.vaccineName}`
                            : 'Registered'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Yield Chart Clean Utility Visualizer */}
              <div className="mt-6 p-4 bg-emerald-50/40 rounded-2xl border border-dashed border-emerald-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-between w-full mb-2 px-2">
                  <span className="text-xs font-semibold text-emerald-800">
                    {getTranslation(lang, 'weeklyYieldIndex')}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold">Avg: 240L {getTranslation(lang, 'perDay')}</span>
                </div>
                <div className="flex gap-2.5 items-end mt-2 h-16">
                  <div className="w-6 h-8 bg-emerald-200 rounded-t-md hover:bg-emerald-400 transition" title="Mon: 210L"></div>
                  <div className="w-6 h-12 bg-emerald-300 rounded-t-md hover:bg-emerald-400 transition" title="Tue: 235L"></div>
                  <div className="w-6 h-10 bg-emerald-200 rounded-t-md hover:bg-emerald-400 transition" title="Wed: 220L"></div>
                  <div className="w-6 h-14 bg-emerald-400 rounded-t-md hover:bg-emerald-500 transition" title="Thu: 248L"></div>
                  <div className="w-6 h-13 bg-emerald-300 rounded-t-md hover:bg-emerald-400 transition" title="Fri: 242L"></div>
                  <div className="w-6 h-16 bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition" title="Sat: 260L"></div>
                  <div className="w-6 h-15 bg-emerald-400 rounded-t-md hover:bg-emerald-500 transition" title="Sun: 255L"></div>
                </div>
                <div className="flex justify-between w-full text-[10px] text-emerald-600 font-bold mt-2 px-3">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Utility Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onNavigate('nutrition')}
              className="p-3.5 bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 transition text-left shadow-xs group"
            >
              <Apple className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-emerald-950">{getTranslation(lang, 'rationCalculator')}</p>
              <p className="text-[10px] text-emerald-600">{getTranslation(lang, 'icarFeedFormulations')}</p>
            </button>

            <button
              onClick={() => onNavigate('vets')}
              className="p-3.5 bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 transition text-left shadow-xs group"
            >
              <Stethoscope className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-emerald-950">{getTranslation(lang, 'telehealth')}</p>
              <p className="text-[10px] text-emerald-600">{getTranslation(lang, 'bookDoctorVisit')}</p>
            </button>

            <button
              onClick={() => onNavigate('marketplace')}
              className="p-3.5 bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 transition text-left shadow-xs group"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-emerald-950">{getTranslation(lang, 'farmerMarketplace')}</p>
              <p className="text-[10px] text-emerald-600">{getTranslation(lang, 'buySellFeedFodder')}</p>
            </button>

            <button
              onClick={() => onNavigate('vaccinations')}
              className="p-3.5 bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 transition text-left shadow-xs group"
            >
              <Syringe className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-emerald-950">{getTranslation(lang, 'vaccineRegistry')}</p>
              <p className="text-[10px] text-emerald-600">{getTranslation(lang, 'nadcpImmunizations')}</p>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Weather & Disease Alert Dark Card + Daily Ration Plan */}
        <div className="space-y-6">
          {/* Weather & Disease Alert Deep Emerald Card */}
          <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold mb-2">
                {getTranslation(lang, 'weatherDiseaseAlert')}
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl font-light">32°</span>
                <div className="text-xs">
                  <p className="font-bold text-emerald-100">
                    {getTranslation(lang, 'highHumidity')} ({currentWeather ? `${currentWeather.humidityPercent}%` : '84%'})
                  </p>
                  <p className="opacity-70 text-emerald-200">
                    {farmer.district ? `${farmer.district} District` : 'Mandya District'}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-800/50 border border-emerald-700 p-3.5 rounded-2xl">
                <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse"></span>
                  {getTranslation(lang, 'highRiskMastitis')}
                </p>
                <p className="text-[11px] leading-relaxed opacity-90 italic text-emerald-100">
                  {getTranslation(lang, 'mastitisAdvisory')}
                </p>
              </div>

              <button
                onClick={() => onNavigate('weather')}
                className="mt-4 text-xs font-semibold text-emerald-300 hover:text-white flex items-center gap-1"
              >
                <span>{getTranslation(lang, 'viewAllDiseaseWarnings')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Subtle background ring graphic */}
            <div className="absolute -right-4 -bottom-4 opacity-10 scale-150 rotate-12 pointer-events-none">
              <div className="w-32 h-32 border-8 border-white rounded-full"></div>
            </div>
          </div>

          {/* Daily Ration Plan Card */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-emerald-950">{getTranslation(lang, 'dailyRationPlan')}</h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {getTranslation(lang, 'lactatingBovine')}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-700 font-medium">{getTranslation(lang, 'greenFodder')}</span>
                  <span className="font-bold text-emerald-950">12.5 kg/unit</span>
                </div>
                <div className="w-full bg-emerald-50 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-[80%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-700 font-medium">{getTranslation(lang, 'dryFodder')}</span>
                  <span className="font-bold text-emerald-950">4.0 kg/unit</span>
                </div>
                <div className="w-full bg-emerald-50 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-[60%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-700 font-medium">{getTranslation(lang, 'concentrateFeed')}</span>
                  <span className="font-bold text-emerald-950">2.2 kg/unit</span>
                </div>
                <div className="w-full bg-emerald-50 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-[45%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-700 font-medium">{getTranslation(lang, 'mineralMixture')}</span>
                  <span className="font-bold text-emerald-950">50 g/unit</span>
                </div>
                <div className="w-full bg-emerald-50 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-[70%]"></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('nutrition')}
              className="w-full mt-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors uppercase tracking-wider shadow-xs"
            >
              {getTranslation(lang, 'updateRation')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
