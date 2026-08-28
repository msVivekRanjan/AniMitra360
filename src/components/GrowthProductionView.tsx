import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Calendar,
  Sparkles,
  Award,
  Milk,
  Egg,
  Scale,
  DollarSign,
  LineChart,
  X,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { GrowthAndProductionRecord, Animal } from '../types';
import { getTranslation } from '../data/translations';

interface GrowthProductionViewProps {
  animals: Animal[];
  records: GrowthAndProductionRecord[];
  currentLanguage?: string;
  language?: string;
  onAddRecord: (record: GrowthAndProductionRecord) => void;
}

export const GrowthProductionView: React.FC<GrowthProductionViewProps> = ({
  animals,
  records,
  currentLanguage,
  language = 'en',
  onAddRecord,
}) => {
  const lang = currentLanguage || language;
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>('All');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    animalId: animals[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    weightKg: animals[0]?.weightKg || 380,
    milkYieldMorning: 6.5,
    milkYieldEvening: 5.5,
    milkFatPercentage: 4.2,
    milkSnfPercentage: 8.6,
    eggCount: 0,
    notes: 'Normal feeding and regular milking.',
  });

  const handleAnimalSelect = (id: string) => {
    const anim = animals.find((a) => a.id === id);
    setFormData({
      ...formData,
      animalId: id,
      weightKg: anim?.weightKg || 380,
      milkYieldMorning: anim?.dailyMilkYieldLiters ? +(anim.dailyMilkYieldLiters * 0.55).toFixed(1) : 0,
      milkYieldEvening: anim?.dailyMilkYieldLiters ? +(anim.dailyMilkYieldLiters * 0.45).toFixed(1) : 0,
      eggCount: anim?.dailyEggCount || 0,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const anim = animals.find((a) => a.id === formData.animalId) || animals[0];
    const totalMilk =
      (Number(formData.milkYieldMorning) || 0) + (Number(formData.milkYieldEvening) || 0);

    const newRec: GrowthAndProductionRecord = {
      id: `prod-${Date.now()}`,
      animalId: formData.animalId,
      animalName: `${anim?.name} (${anim?.species})`,
      date: formData.date,
      weightKg: Number(formData.weightKg) || anim?.weightKg || 100,
      milkYieldLiters: totalMilk > 0 ? totalMilk : undefined,
      milkFatPercentage: formData.milkFatPercentage ? Number(formData.milkFatPercentage) : undefined,
      milkSnfPercentage: formData.milkSnfPercentage ? Number(formData.milkSnfPercentage) : undefined,
      eggCount: formData.eggCount ? Number(formData.eggCount) : undefined,
      notes: formData.notes,
    };

    onAddRecord(newRec);
    setIsLogModalOpen(false);
  };

  // Calculations
  const filteredRecords = records.filter((r) => {
    return selectedAnimalId === 'All' || r.animalId === selectedAnimalId;
  });

  // Calculate totals
  const totalDailyMilk = animals.reduce((sum, a) => sum + (a.dailyMilkYieldLiters || 0), 0);
  const totalDailyEggs = animals.reduce((sum, a) => sum + (a.dailyEggCount || 0), 0);
  const estimatedDailyIncome = Math.round(totalDailyMilk * 45 + totalDailyEggs * 6.5);

  // Top producing animal
  const topMilker = [...animals].sort((a, b) => (b.dailyMilkYieldLiters || 0) - (a.dailyMilkYieldLiters || 0))[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center space-x-2">
            <span>{getTranslation(lang, 'growth')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor daily milk yield, FAT & SNF percentages, egg counts, and biological weight gain curves
          </p>
        </div>

        <button
          id="btn-log-production-modal"
          onClick={() => setIsLogModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{getTranslation(lang, 'logDailyYield')}</span>
        </button>
      </div>

      {/* Production Analytics Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Milk className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Herd Daily Milk</div>
            <div className="text-xl font-extrabold font-heading text-slate-900">
              {totalDailyMilk.toFixed(1)} <span className="text-xs font-normal text-slate-500">Liters/day</span>
            </div>
            <div className="text-[10px] text-blue-600 font-semibold">Avg 4.3% FAT • 8.7% SNF</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Egg className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Daily Egg Yield</div>
            <div className="text-xl font-extrabold font-heading text-slate-900">
              {totalDailyEggs} <span className="text-xs font-normal text-slate-500">Eggs/day</span>
            </div>
            <div className="text-[10px] text-amber-700 font-semibold">Farm poultry birds</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Est. Daily Gross Income</div>
            <div className="text-xl font-extrabold font-heading text-slate-900">
              ₹{estimatedDailyIncome} <span className="text-xs font-normal text-slate-500">/ day</span>
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold">~₹{(estimatedDailyIncome * 30).toLocaleString()} / month</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Top Milking Champion</div>
            <div className="text-sm font-extrabold font-heading text-slate-900 truncate">
              {topMilker?.name || 'N/A'}
            </div>
            <div className="text-[11px] text-purple-700 font-bold">
              {topMilker?.dailyMilkYieldLiters || 0} L/day ({topMilker?.breed})
            </div>
          </div>
        </div>
      </div>

      {/* Filter by Animal */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filter Logged Records for:</span>
        </div>
        <select
          value={selectedAnimalId}
          onChange={(e) => setSelectedAnimalId(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
        >
          <option value="All">All Animals & Birds</option>
          {animals.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.species} - {a.animalTagId})
            </option>
          ))}
        </select>
      </div>

      {/* Production & Growth Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-heading font-bold text-slate-900 text-base flex items-center space-x-2">
            <LineChart className="w-4 h-4 text-emerald-600" />
            <span>Yield & Biological Growth Logs</span>
          </h3>
          <span className="text-xs text-slate-500">{filteredRecords.length} Entries Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Animal & Tag</th>
                <th className="py-3 px-4">Live Weight</th>
                <th className="py-3 px-4">Milk Harvest (L)</th>
                <th className="py-3 px-4">Milk Quality (FAT / SNF)</th>
                <th className="py-3 px-4">Egg Yield</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-semibold text-slate-900">{rec.date}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{rec.animalName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 font-bold text-slate-800">
                      {rec.weightKg} kg
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {rec.milkYieldLiters ? (
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-bold">
                        🥛 {rec.milkYieldLiters} L
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {rec.milkFatPercentage ? (
                      <span className="text-slate-700 font-medium">
                        FAT: <span className="font-bold text-emerald-700">{rec.milkFatPercentage}%</span> • SNF: <span className="font-bold text-emerald-700">{rec.milkSnfPercentage}%</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {rec.eggCount ? (
                      <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-bold">
                        🥚 {rec.eggCount} Eggs
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{rec.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: LOG NEW MEASUREMENT ================= */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative my-8">
            <button
              onClick={() => setIsLogModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Log Production & Weight Entry
                </h3>
                <p className="text-xs text-slate-500">
                  Record daily morning/evening milk harvest, fat content, egg collection, or body weight
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Animal / Bird Flock *
                </label>
                <select
                  value={formData.animalId}
                  onChange={(e) => handleAnimalSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                >
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.species} - {a.animalTagId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Live Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Morning Milk (L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.milkYieldMorning}
                    onChange={(e) => setFormData({ ...formData, milkYieldMorning: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Evening Milk (L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.milkYieldEvening}
                    onChange={(e) => setFormData({ ...formData, milkYieldEvening: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Milk FAT %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.milkFatPercentage}
                    onChange={(e) => setFormData({ ...formData, milkFatPercentage: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Milk SNF %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.milkSnfPercentage}
                    onChange={(e) => setFormData({ ...formData, milkSnfPercentage: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Egg Count</label>
                  <input
                    type="number"
                    value={formData.eggCount}
                    onChange={(e) => setFormData({ ...formData, eggCount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Feed / Health Observation Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Fed 4kg green berseem, high butterfat content..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
