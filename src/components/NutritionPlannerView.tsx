import React, { useState, useEffect } from 'react';
import {
  Apple,
  Scale,
  Sparkles,
  Printer,
  ChevronRight,
  Info,
  Droplets,
  DollarSign,
  Leaf,
  Wheat,
  PieChart as PieIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Animal, SpeciesType, ProductionStage, RationPlan } from '../types';
import { calculateRationPlan } from '../utils/nutritionEngine';
import { getTranslation } from '../data/translations';

interface NutritionPlannerViewProps {
  animals: Animal[];
  preselectedAnimal?: Animal | null;
  currentLanguage?: string;
  language?: string;
}

const STAGES: ProductionStage[] = [
  'Lactating / Milking',
  'Dry / Resting',
  'Pregnant (Late Stage)',
  'Pregnant (Early/Mid)',
  'Heifer / Growing',
  'Calf / Kid / Chick',
  'Adult Working / Breeding',
  'Layer (Egg-laying)',
  'Broiler (Meat)',
];

export const NutritionPlannerView: React.FC<NutritionPlannerViewProps> = ({
  animals,
  preselectedAnimal,
  currentLanguage,
  language = 'en',
}) => {
  const lang = currentLanguage || language;
  // Selection state
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>(
    preselectedAnimal?.id || animals[0]?.id || 'custom'
  );

  // Manual input variables
  const [species, setSpecies] = useState<SpeciesType>(
    preselectedAnimal?.species || animals[0]?.species || 'Cattle'
  );
  const [bodyWeight, setBodyWeight] = useState<number>(
    preselectedAnimal?.weightKg || animals[0]?.weightKg || 400
  );
  const [stage, setStage] = useState<ProductionStage>(
    preselectedAnimal?.productionStage || animals[0]?.productionStage || 'Lactating / Milking'
  );
  const [milkYield, setMilkYield] = useState<number>(
    preselectedAnimal?.dailyMilkYieldLiters || 12
  );
  const [fatPct, setFatPct] = useState<number>(4.2);
  const [eggCount, setEggCount] = useState<number>(preselectedAnimal?.dailyEggCount || 0);

  // Computed Ration
  const [ration, setRation] = useState<RationPlan | null>(null);

  // When animal selection changes
  const handleAnimalChange = (animId: string) => {
    setSelectedAnimalId(animId);
    if (animId === 'custom') return;
    const anim = animals.find((a) => a.id === animId);
    if (anim) {
      setSpecies(anim.species);
      setBodyWeight(anim.weightKg);
      setStage(anim.productionStage);
      setMilkYield(anim.dailyMilkYieldLiters || 0);
      setEggCount(anim.dailyEggCount || 0);
    }
  };

  // Re-calculate whenever inputs change
  useEffect(() => {
    const computed = calculateRationPlan({
      species,
      bodyWeightKg: Number(bodyWeight) || 100,
      stage,
      milkYieldLiters: Number(milkYield) || 0,
      fatPercentage: Number(fatPct) || 4.0,
      eggCount: Number(eggCount) || 0,
    });
    setRation(computed);
  }, [species, bodyWeight, stage, milkYield, fatPct, eggCount]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center space-x-2">
            <span>{getTranslation(lang, 'nutrition')}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              ICAR 2013 / NRC Standard
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Scientifically balanced Dry Matter (DM), Crude Protein (CP), and energy rations using local green fodder & grains
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print Daily Feeding Chart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Animal Parameters (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-slate-900 text-base flex items-center space-x-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Select Animal & Bio-Parameters</span>
            </h3>

            {/* Quick Animal Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Choose from Registered Animals
              </label>
              <select
                value={selectedAnimalId}
                onChange={(e) => handleAnimalChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {animals.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.species} - {a.weightKg}kg)
                  </option>
                ))}
                <option value="custom">✏️ Custom Animal Calculator</option>
              </select>
            </div>

            {/* Species */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Species Type</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as SpeciesType)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Cattle">Cattle (Cow)</option>
                <option value="Buffalo">Buffalo</option>
                <option value="Goat">Goat</option>
                <option value="Sheep">Sheep</option>
                <option value="Poultry">Poultry Bird</option>
                <option value="Horse">Horse / Equine</option>
              </select>
            </div>

            {/* Live Body Weight */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Live Body Weight (kg)</label>
                <span className="text-xs font-bold text-emerald-700">{bodyWeight} kg</span>
              </div>
              <input
                type="range"
                min="5"
                max="800"
                step="5"
                value={bodyWeight}
                onChange={(e) => setBodyWeight(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>5 kg</span>
                <span>400 kg</span>
                <span>800 kg</span>
              </div>
            </div>

            {/* Production Stage */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Production Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as ProductionStage)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              >
                {STAGES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Milk Yield if lactating */}
            {(species === 'Cattle' || species === 'Buffalo' || species === 'Goat') && (
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-emerald-900">Daily Milk Harvest</label>
                    <span className="text-xs font-extrabold text-emerald-800">{milkYield} Liters/day</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="0.5"
                    value={milkYield}
                    onChange={(e) => setMilkYield(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-emerald-900">Butterfat Percentage (%)</label>
                    <span className="text-xs font-extrabold text-emerald-800">{fatPct}% FAT</span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="9.0"
                    step="0.1"
                    value={fatPct}
                    onChange={(e) => setFatPct(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Egg yield if poultry */}
            {species === 'Poultry' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Daily Eggs</label>
                <input
                  type="number"
                  value={eggCount}
                  onChange={(e) => setEggCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Formulated Ration & Biological Nutrient Breakdown (8 Cols) */}
        {ration && (
          <div className="lg:col-span-8 space-y-5">
            
            {/* Summary Highlights Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Dry Matter (DM)</div>
                <div className="text-lg sm:text-xl font-extrabold font-heading text-slate-900 mt-0.5">
                  {ration.dryMatterKg} <span className="text-xs font-normal text-slate-500">kg/day</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Daily appetite intake</div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Crude Protein (CP)</div>
                <div className="text-lg sm:text-xl font-extrabold font-heading text-emerald-700 mt-0.5">
                  {ration.crudeProteinGrams} <span className="text-xs font-normal text-slate-500">g/day</span>
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">Muscle & Milk synthesis</div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Daily Water Need</div>
                <div className="text-lg sm:text-xl font-extrabold font-heading text-blue-700 mt-0.5">
                  {ration.waterLitersPerDay} <span className="text-xs font-normal text-slate-500">Liters</span>
                </div>
                <div className="text-[10px] text-blue-600 font-medium">Clean potable water</div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Daily Feed Cost</div>
                <div className="text-lg sm:text-xl font-extrabold font-heading text-amber-700 mt-0.5">
                  ₹{ration.estimatedDailyCostInr} <span className="text-xs font-normal text-slate-500">/day</span>
                </div>
                <div className="text-[10px] text-amber-700 font-medium">At current farm rates</div>
              </div>
            </div>

            {/* Practical Daily Feed Formulation Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Apple className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-slate-900 text-base">
                      Practical Farm Daily Feeding Formulation
                    </h3>
                    <p className="text-xs text-slate-500">
                      Exact fresh weight quantities to weigh and feed every morning and evening
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  Balanced Ration
                </span>
              </div>

              {/* 4 Formulation Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Green Fodder */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      <span>1. Succulent Green Fodder</span>
                    </span>
                    <span className="text-base font-extrabold text-emerald-800">
                      {ration.dailyFeedFormulation.greenFodderKg} kg
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900/80 leading-relaxed">
                    Hybrid Napier / CO-4 / Berseem / Lucerne / Green Maize fodder. Provides essential carotene (Vitamin A) and rumen digestibility.
                  </p>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Morning: {(ration.dailyFeedFormulation.greenFodderKg * 0.5).toFixed(1)} kg • Evening: {(ration.dailyFeedFormulation.greenFodderKg * 0.5).toFixed(1)} kg
                  </div>
                </div>

                {/* 2. Dry Roughage */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950 flex items-center space-x-1.5">
                      <Wheat className="w-4 h-4 text-amber-600" />
                      <span>2. Dry Roughage (Straw / Stover)</span>
                    </span>
                    <span className="text-base font-extrabold text-amber-900">
                      {ration.dailyFeedFormulation.dryFodderKg} kg
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/80 leading-relaxed">
                    Paddy straw / Wheat bhusa / Sorghum stover (chaffed into 1-2 inch pieces). Prevents acidosis and stimulates cud-chewing.
                  </p>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Feed mixed with chopped green fodder for maximum palatability.
                  </div>
                </div>

                {/* 3. Concentrate Mix */}
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-950 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>3. Balanced Concentrate Mash / Pellets</span>
                    </span>
                    <span className="text-base font-extrabold text-blue-900">
                      {ration.dailyFeedFormulation.concentrateKg} kg
                    </span>
                  </div>
                  <p className="text-xs text-blue-900/80 leading-relaxed">
                    35% Grains (Maize/Barley) + 30% Oilcake (Mustard/Cottonseed/Soy) + 32% Wheat Bran/Rice Bran.
                  </p>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Feed during milking times (split equally 2 times a day).
                  </div>
                </div>

                {/* 4. Mineral Mixture & Salt */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-950 flex items-center space-x-1.5">
                      <Scale className="w-4 h-4 text-purple-600" />
                      <span>4. Mineral Mixture & Salt</span>
                    </span>
                    <span className="text-base font-extrabold text-purple-900">
                      {ration.dailyFeedFormulation.mineralMixGrams} g + {ration.dailyFeedFormulation.saltGrams} g
                    </span>
                  </div>
                  <p className="text-xs text-purple-900/80 leading-relaxed">
                    Chelated Area-Specific Mineral Mixture (ASMM) + Common iodized salt daily. Prevents silent heat & anestrus.
                  </p>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Mix thoroughly into the concentrate feed mash.
                  </div>
                </div>

              </div>

              {/* Feeding Advice Notes */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <span>Scientific Feeding Protocol & Best Practices:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                  {ration.feedingNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
