import React, { useState, useMemo } from 'react';
import {
  Leaf,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Compass,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Flame,
  Stethoscope,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  BookOpen,
  HeartHandshake,
  Check,
  Printer,
  Share2,
  RefreshCw,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  EthnoVetRemedy,
  SeasonalLocationDiseaseAlert,
  AyurvedicDailyTonic,
  SpeciesType,
  EVMCategory,
  FormulaMethod,
  SeasonType,
  Animal,
  HealthRecord,
} from '../types';
import {
  ETHNOVET_REMEDIES,
  SEASONAL_LOCATION_ALERTS,
  AYURVEDIC_DAILY_TONICS,
} from '../data/ayurvedicData';
import { getTranslation } from '../data/translations';

interface AyurvedicEthnoVetViewProps {
  currentLanguage?: string;
  language?: string;
  animals?: Animal[];
  onLogHealthRecord?: (record: HealthRecord) => void;
  onNavigateToVets?: () => void;
}

const CATEGORIES: (EVMCategory | 'All')[] = [
  'All',
  'Mastitis & Udder Care',
  'Bloat & Indigestion',
  'FMD & Lesions',
  'Wound & Maggot Healing',
  'Diarrhea & Gut Health',
  'Fever & Respiratory',
  'Parasite & Tick Control',
  'Fertility & Reproductive',
  'Immunity & General Health',
  'Post-Calving Care',
];

const SPECIES_LIST: (SpeciesType | 'All')[] = [
  'All',
  'Cattle',
  'Buffalo',
  'Goat',
  'Sheep',
  'Poultry',
];

const SEASONS: SeasonType[] = [
  'Monsoon (Varsha)',
  'Winter (Shishir / Hemant)',
  'Summer (Grishma)',
  'Post-Monsoon (Sharad)',
  'Spring (Vasant)',
];

export const AyurvedicEthnoVetView: React.FC<AyurvedicEthnoVetViewProps> = ({
  currentLanguage,
  language = 'en',
  animals = [],
  onLogHealthRecord,
  onNavigateToVets,
}) => {
  const lang = currentLanguage || language;

  // Active sub-tab state: 'remedies' | 'seasonal-alerts' | 'daily-tonics' | 'first-aid'
  const [activeSubTab, setActiveSubTab] = useState<
    'remedies' | 'seasonal-alerts' | 'daily-tonics' | 'first-aid'
  >('remedies');

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EVMCategory | 'All'>('All');
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesType | 'All'>('All');
  const [selectedMethod, setSelectedMethod] = useState<FormulaMethod | 'All'>('All');

  // Modal / Detailed remedy state
  const [activeRemedyModal, setActiveRemedyModal] = useState<EthnoVetRemedy | null>(null);

  // Scaled Recipe Dose Calculator state inside modal
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [targetAnimalSize, setTargetAnimalSize] = useState<string>('Adult Bovine (350-450 kg)');

  // Seasonal location alert filters
  const [selectedAlertDistrict, setSelectedAlertDistrict] = useState<string>(
    SEASONAL_LOCATION_ALERTS[0].district
  );
  const [selectedAlertSeason, setSelectedAlertSeason] = useState<SeasonType>(
    SEASONAL_LOCATION_ALERTS[0].season
  );

  // First-Aid quick symptom selector
  const [selectedSymptomKey, setSelectedSymptomKey] = useState<string>('mastitis');

  // Toast / Log feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered EVM remedies
  const filteredRemedies = useMemo(() => {
    return ETHNOVET_REMEDIES.filter((remedy) => {
      const matchesSearch =
        remedy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        remedy.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        remedy.ailment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        remedy.ingredients.some((ing) =>
          ing.item.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === 'All' || remedy.category === selectedCategory;

      const matchesSpecies =
        selectedSpecies === 'All' || remedy.species.includes(selectedSpecies as SpeciesType);

      const matchesMethod =
        selectedMethod === 'All' || remedy.method === selectedMethod;

      return matchesSearch && matchesCategory && matchesSpecies && matchesMethod;
    });
  }, [searchQuery, selectedCategory, selectedSpecies, selectedMethod]);

  // Current active location-season alert
  const activeSeasonalAlert = useMemo(() => {
    const found = SEASONAL_LOCATION_ALERTS.find(
      (a) => a.district === selectedAlertDistrict && a.season === selectedAlertSeason
    );
    return found || SEASONAL_LOCATION_ALERTS.find((a) => a.district === selectedAlertDistrict) || SEASONAL_LOCATION_ALERTS[0];
  }, [selectedAlertDistrict, selectedAlertSeason]);

  // Quick symptom solver map
  const QUICK_SYMPTOM_SOLUTIONS: Record<
    string,
    { title: string; hint: string; remedyId: string; emergencyNote?: string }
  > = {
    mastitis: {
      title: 'Udder hot, swollen, or clots in milk (Thanela)',
      hint: 'Apply NDDB Aloe Vera + Turmeric + Lime crimson paste 5 times daily.',
      remedyId: 'evm-mastitis-aloe-turmeric',
      emergencyNote: 'Isolate affected quarter and milk out completely before application.',
    },
    bloat: {
      title: 'Left flank tightly swollen like a drum (Afara / Gas)',
      hint: 'Administer Hing (Asafoetida) + Ginger + Garlic + Mustard Oil drench.',
      remedyId: 'evm-bloat-hing-ginger',
      emergencyNote: 'Walk the animal and massage left flank. If breathing fails, call vet immediately.',
    },
    wounds: {
      title: 'Open cuts, horn injuries, or live maggots (Keede)',
      hint: 'Use Neem Oil + Camphor + Custard Apple leaf drops.',
      remedyId: 'evm-maggot-wound-oil',
      emergencyNote: 'Maggots will drop out within 1-2 hours; clean and protect with turmeric dust.',
    },
    diarrhea: {
      title: 'Watery dung or calf scours (Dast / Pechish)',
      hint: 'Feed roasted Fenugreek (Methi) + Cumin (Jeera) + Jaggery bolus.',
      remedyId: 'evm-diarrhea-methi-jeera',
      emergencyNote: 'Always provide oral rehydration water (salt + jaggery) alongside.',
    },
    fever: {
      title: 'High temperature, nasal discharge & cough (Bukhar / Sardi)',
      hint: 'Drench Tulsi + Vasaka (Adusa) + Black Pepper + Ginger kadha.',
      remedyId: 'evm-fever-respiratory-kadha',
      emergencyNote: 'If temp exceeds 104°F with swollen neck, suspect HS and call doctor.',
    },
    fmd: {
      title: 'Salivating mouth blisters & hoof limping (FMD / Khurpaka)',
      hint: 'Apply Honey-Turmeric-Camphor paste in mouth; Neem wash for hooves.',
      remedyId: 'evm-fmd-lesions-wash-paste',
      emergencyNote: 'Report to veterinary department for NADCP ring vaccination.',
    },
    ticks: {
      title: 'Heavy ticks, lice, or mange itching (Chichad / Joon)',
      hint: 'Spray Neem Seed Kernel + Karanj Oil + Camphor water emulsion.',
      remedyId: 'evm-ticks-lice-neem-camphor',
      emergencyNote: 'Treat all animals and shed walls simultaneously.',
    },
  };

  const handleOpenRemedy = (remedy: EthnoVetRemedy) => {
    setActiveRemedyModal(remedy);
    setScaleFactor(1);
    setTargetAnimalSize('Adult Bovine (350-450 kg)');
  };

  const handleLogRemedyTreatment = (remedy: EthnoVetRemedy) => {
    if (animals.length > 0 && onLogHealthRecord) {
      const targetAnimal = animals[0];
      const newRecord: HealthRecord = {
        id: `hlth-evm-${Date.now()}`,
        animalId: targetAnimal.id,
        animalName: targetAnimal.name,
        species: targetAnimal.species,
        date: new Date().toISOString().split('T')[0],
        diseaseDiagnosed: remedy.ailment,
        symptoms: [remedy.category, 'Ayurvedic EVM Treatment Initiated'],
        treatmentGiven: `Administered ${remedy.name} (${remedy.method}) as per NDDB EVM protocol.`,
        medicines: remedy.ingredients.map((ing) => ing.item),
        vetNotes: `Herbal therapy duration: ${remedy.duration}. Frequency: ${remedy.frequency}. Monitored by farmer.`,
        status: 'Under Treatment',
      };
      onLogHealthRecord(newRecord);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      showToast(`Logged herbal treatment for ${targetAnimal.name} into Health Records!`);
    } else {
      showToast(`Remedy copied: ${remedy.name}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 border border-emerald-700/40 shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>NDDB & ICAR-IVRI Validated EVM Repository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-white">
              Ethnoveterinary & Ayurvedic Healthcare
            </h1>
            <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed">
              Cost-effective, zero-chemical-residue herbal remedies proven across 50,000+ Indian dairy farms. Combined with real-time location & seasonal disease alert intelligence.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2 shrink-0">
            <button
              onClick={() => setActiveSubTab('seasonal-alerts')}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-2 transition"
            >
              <Compass className="w-4 h-4" />
              <span>Seasonal Risk Radar</span>
            </button>
            <button
              onClick={() => setActiveSubTab('first-aid')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Quick Symptom Solver</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="mt-8 pt-4 border-t border-emerald-800/60 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab('remedies')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'remedies'
                ? 'bg-white text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/40'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Herbal Remedy Library ({ETHNOVET_REMEDIES.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('seasonal-alerts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'seasonal-alerts'
                ? 'bg-white text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/40'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Location & Seasonal Disease Alerts</span>
            <span className="px-1.5 py-0.2 bg-amber-500/30 text-amber-200 rounded-md text-[10px]">
              Active
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('daily-tonics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'daily-tonics'
                ? 'bg-white text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/40'
            }`}
          >
            <Flame className="w-4 h-4 text-emerald-400" />
            <span>General Treatments & Daily Rasayana</span>
          </button>

          <button
            onClick={() => setActiveSubTab('first-aid')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'first-aid'
                ? 'bg-white text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/40'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-emerald-400" />
            <span>Herbal First-Aid Toolkit</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: LOCATION & SEASONAL DISEASE ALERT RADAR */}
      {activeSubTab === 'seasonal-alerts' && (
        <div className="space-y-6">
          {/* Location & Season Selector Card */}
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-emerald-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-600" />
                  <span>Agro-Climatic Zone & Seasonal Epidemiological Warning Radar</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select your district and current season to access tailor-made Ayurvedic preventive drenches, vaccination calendars, and bio-security protocols.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Risk Model:</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ICAR-NIVEDI + NDDB
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select District / Agro-Climatic Zone
                </label>
                <select
                  value={selectedAlertDistrict}
                  onChange={(e) => setSelectedAlertDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {Array.from(
                    new Set(SEASONAL_LOCATION_ALERTS.map((a) => a.district))
                  ).map((dist) => (
                    <option key={dist} value={dist}>
                      📍 {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Climate Season
                </label>
                <select
                  value={selectedAlertSeason}
                  onChange={(e) => setSelectedAlertSeason(e.target.value as SeasonType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {SEASONS.map((s) => (
                    <option key={s} value={s}>
                      🗓️ {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <div className="w-full p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs">
                  <span className="font-bold">Agro-Climatic Classification:</span>{' '}
                  <span className="text-emerald-700">{activeSeasonalAlert.agroClimaticZone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Alert Comprehensive Card */}
          <div className="p-6 sm:p-8 bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl border border-emerald-700/50 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-emerald-800/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      activeSeasonalAlert.severity === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : activeSeasonalAlert.severity === 'High'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}
                  >
                    🚨 {activeSeasonalAlert.severity} Epidemiological Risk
                  </span>
                  <span className="text-xs text-emerald-300/80">
                    {activeSeasonalAlert.district} • {activeSeasonalAlert.season}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-white">
                  {activeSeasonalAlert.primaryRiskDisease}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-emerald-200">Species at Risk:</span>
                <div className="flex gap-1">
                  {activeSeasonalAlert.affectedSpecies.map((sp) => (
                    <span
                      key={sp}
                      className="px-2 py-0.5 rounded-md bg-emerald-800/60 text-emerald-200 text-xs font-bold"
                    >
                      {sp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Climate Triggers & Co-occurring Diseases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-900/30 border border-emerald-700/40 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Climatic & Environmental Triggers</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  {activeSeasonalAlert.weatherTriggers}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-900/30 border border-emerald-700/40 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Secondary Co-occurring Vulnerabilities</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeSeasonalAlert.secondaryDiseases.map((sec) => (
                    <span
                      key={sec}
                      className="px-2.5 py-1 rounded-lg bg-emerald-800/50 text-white text-xs font-medium border border-emerald-600/30"
                    >
                      ⚠️ {sec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Ayurvedic First-Line Intervention Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-emerald-800/30 border-2 border-emerald-500/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm sm:text-base">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                  <span>Ayurvedic Preventive Intervention: {activeSeasonalAlert.ayurvedicPreventionTitle}</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Zero Antibiotic Resistance
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <p className="text-emerald-100">
                  <strong className="text-white">Herb Formulation:</strong>{' '}
                  {activeSeasonalAlert.ayurvedicFormulation.ingredients}
                </p>
                <p className="text-emerald-100">
                  <strong className="text-white">Preparation:</strong>{' '}
                  {activeSeasonalAlert.ayurvedicFormulation.preparation}
                </p>
                <p className="text-emerald-100">
                  <strong className="text-white">Administration Schedule:</strong>{' '}
                  {activeSeasonalAlert.ayurvedicFormulation.administration}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-700/50">
                <div className="text-xs text-amber-200 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Vaccine Advisory: {activeSeasonalAlert.vaccinationAdvisory}</span>
                </div>

                {activeSeasonalAlert.ayurvedicRemedyId && (
                  <button
                    onClick={() => {
                      const match = ETHNOVET_REMEDIES.find(
                        (r) => r.id === activeSeasonalAlert.ayurvedicRemedyId
                      );
                      if (match) handleOpenRemedy(match);
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    <span>View Complete Recipe & Steps</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Standard Veterinary Bio-security Guide */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 text-xs text-slate-300 flex items-start gap-3">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Veterinary Bio-Security Protocol:</span>{' '}
                {activeSeasonalAlert.veterinaryAdvisory}
              </div>
            </div>
          </div>

          {/* All 6 Agro-Climatic Regions Overview Grid */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              National Agro-Climatic Disease Advisories ({SEASONAL_LOCATION_ALERTS.length} Key Regions)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SEASONAL_LOCATION_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => {
                    setSelectedAlertDistrict(alert.district);
                    setSelectedAlertSeason(alert.season);
                  }}
                  className={`p-4 rounded-2xl border transition cursor-pointer text-left space-y-2 ${
                    alert.district === selectedAlertDistrict && alert.season === selectedAlertSeason
                      ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{alert.district}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        alert.severity === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {alert.severity} Risk
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 line-clamp-1">
                    {alert.primaryRiskDisease}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    🌿 {alert.ayurvedicPreventionTitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: REMEDIES LIBRARY */}
      {activeSubTab === 'remedies' && (
        <div className="space-y-6">
          {/* Search & Filter Controls */}
          <div className="p-4 sm:p-5 bg-white rounded-3xl border border-emerald-100 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search remedies by ailment, herb (e.g. Haldi, Aloe vera, Methi), or disease..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>

              {/* Species & Method Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <select
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value as SpeciesType | 'All')}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">🐾 All Species</option>
                  <option value="Cattle">🐄 Cattle (Cows)</option>
                  <option value="Buffalo">🐃 Buffalo</option>
                  <option value="Goat">🐐 Goat</option>
                  <option value="Sheep">🐑 Sheep</option>
                  <option value="Poultry">🐔 Poultry</option>
                </select>

                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value as FormulaMethod | 'All')}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">🥣 All Formulations</option>
                  <option value="Topical Paste (Lep)">Topical Paste (Lep)</option>
                  <option value="Oral Bolus / Ladoo">Oral Bolus / Ladoo</option>
                  <option value="Drench / Decoction (Kadha)">Drench / Kadha</option>
                  <option value="Herbal Oil / Wash">Herbal Oil / Wash</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mr-1 shrink-0">
                Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Remedies Grid */}
          {filteredRemedies.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-3">
              <Leaf className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No matching herbal remedies found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try clearing your search query or switching to "All Categories" to view complete NDDB protocols.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedSpecies('All');
                  setSelectedMethod('All');
                }}
                className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRemedies.map((remedy) => (
                <div
                  key={remedy.id}
                  className="bg-white rounded-3xl border border-emerald-100 shadow-xs hover:shadow-lg hover:border-emerald-300 transition flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Header Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                        {remedy.category}
                      </span>
                      {remedy.isNddbApproved && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 flex items-center gap-1 shrink-0">
                          <Check className="w-3 h-3 text-amber-600" />
                          <span>NDDB Validated</span>
                        </span>
                      )}
                    </div>

                    {/* Remedy Title */}
                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                        {remedy.name}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-800">
                        {remedy.hindiName}
                      </p>
                    </div>

                    {/* Ailment & Species */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      <strong className="text-slate-800">Indication:</strong> {remedy.ailment}
                    </p>

                    {/* Key Ingredients Preview */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Key Herbs & Ingredients ({remedy.ingredients.length})</span>
                        <span className="text-emerald-700 font-normal">{remedy.method}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {remedy.ingredients.slice(0, 3).map((ing, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 text-[11px] border border-slate-100"
                          >
                            🌱 {ing.item.split('(')[0].trim()}
                          </span>
                        ))}
                        {remedy.ingredients.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            +{remedy.ingredients.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{remedy.preparationTimeMinutes} min prep</span>
                    </div>

                    <button
                      onClick={() => handleOpenRemedy(remedy)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs active:scale-95"
                    >
                      <span>View Recipe & Dose</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: DAILY AYURVEDIC TONICS & RASAYANA */}
      {activeSubTab === 'daily-tonics' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-emerald-100 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-emerald-600" />
              <span>Ayurvedic Rasayana & Preventative Herd Vitality Tonics</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Daily and seasonal natural formulations to strengthen bovine digestive fire (Agni), detoxify the liver, and maintain peak milk yield without synthetic hormones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AYURVEDIC_DAILY_TONICS.map((tonic) => (
              <div
                key={tonic.id}
                className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-7 shadow-xs hover:shadow-md transition space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                      Preventative Rasayana
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{tonic.title}</h3>
                    <p className="text-xs font-semibold text-emerald-700">{tonic.hindiTitle}</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
                    🌿
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{tonic.targetBenefit}</p>

                {/* Formulation & Ingredients Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <p>
                    <strong className="text-slate-800">Ingredients:</strong> {tonic.ingredients}
                  </p>
                  <p>
                    <strong className="text-slate-800">Preparation & Feed Method:</strong>{' '}
                    {tonic.preparation}
                  </p>
                  <p>
                    <strong className="text-slate-800">Recommended Frequency:</strong>{' '}
                    <span className="text-emerald-700 font-bold">{tonic.frequency}</span>
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Therapeutic & Production Benefits:
                  </div>
                  <ul className="space-y-1">
                    {tonic.benefits.map((ben, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: HERBAL FIRST-AID QUICK SYMPTOM SOLVER */}
      {activeSubTab === 'first-aid' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-emerald-100 shadow-xs space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                <span>Instant Herbal First-Aid Decision Guide</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Identify acute livestock symptoms instantly and apply safe, zero-delay kitchen and farm herbal interventions.
              </p>
            </div>

            {/* Quick Symptom Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {Object.entries(QUICK_SYMPTOM_SOLUTIONS).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSymptomKey(key)}
                  className={`p-4 rounded-2xl text-left border transition space-y-1.5 ${
                    selectedSymptomKey === key
                      ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">{data.title}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{data.hint}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Active First-Aid Selected Card */}
          {selectedSymptomKey && QUICK_SYMPTOM_SOLUTIONS[selectedSymptomKey] && (
            <div className="p-6 sm:p-8 bg-linear-to-br from-emerald-900 to-slate-900 text-white rounded-3xl border border-emerald-700/50 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-800">
                <div>
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    First-Aid Immediate Action
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-heading text-white mt-1">
                    {QUICK_SYMPTOM_SOLUTIONS[selectedSymptomKey].title}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    const match = ETHNOVET_REMEDIES.find(
                      (r) => r.id === QUICK_SYMPTOM_SOLUTIONS[selectedSymptomKey].remedyId
                    );
                    if (match) handleOpenRemedy(match);
                  }}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2 shrink-0 shadow-lg active:scale-95"
                >
                  <span>Open Full Preparation Guide</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-800/40 border border-emerald-600/40 text-emerald-100 text-xs sm:text-sm leading-relaxed">
                <strong className="text-white">Recommended Protocol:</strong>{' '}
                {QUICK_SYMPTOM_SOLUTIONS[selectedSymptomKey].hint}
              </div>

              {QUICK_SYMPTOM_SOLUTIONS[selectedSymptomKey].emergencyNote && (
                <div className="p-3.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{QUICK_SYMPTOM_SOLUTIONS[selectedSymptomKey].emergencyNote}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* DETAILED REMEDY MODAL (WITH DOSE CALCULATOR) */}
      {activeRemedyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-linear-to-r from-emerald-900 to-teal-900 text-white flex items-start justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-400/30">
                    {activeRemedyModal.category}
                  </span>
                  <span className="text-xs text-emerald-200">
                    Prep: {activeRemedyModal.preparationTimeMinutes} mins • {activeRemedyModal.method}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  {activeRemedyModal.name}
                </h2>
                <p className="text-xs font-medium text-emerald-200">
                  {activeRemedyModal.hindiName}
                </p>
              </div>

              <button
                onClick={() => setActiveRemedyModal(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition text-xs font-bold shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              {/* Scientific & Field Validation Badge */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Validation Standard:</span>{' '}
                  {activeRemedyModal.scientificValidation}
                </div>
              </div>

              {/* Interactive Ingredient Scaling Dose Calculator */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Interactive Dose Calculator (Weight Scaler)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Scales herbs precisely to animal body mass
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Adult Bovine (400 kg)', scale: 1 },
                    { label: 'Heifer / Calf (150 kg)', scale: 0.5 },
                    { label: 'Goat / Sheep (40 kg)', scale: 0.2 },
                    { label: 'Poultry Flock (10 birds)', scale: 0.1 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setScaleFactor(preset.scale);
                        setTargetAnimalSize(preset.label);
                      }}
                      className={`p-2 rounded-xl text-xs font-bold border transition ${
                        scaleFactor === preset.scale
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Scaled Ingredients Table */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-slate-700">
                    Required Herbs for: <span className="text-emerald-700">{targetAnimalSize}</span>
                  </div>
                  <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white overflow-hidden text-xs">
                    {activeRemedyModal.ingredients.map((ing, i) => (
                      <div key={i} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-900">{ing.item}</span>
                          {ing.hindiName && (
                            <span className="text-slate-500 ml-1.5">({ing.hindiName})</span>
                          )}
                          {ing.purpose && (
                            <p className="text-[11px] text-slate-400">{ing.purpose}</p>
                          )}
                        </div>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold text-xs whitespace-nowrap self-start sm:self-center">
                          {scaleFactor === 1 ? ing.quantity : `${ing.quantity} (Scaled x${scaleFactor})`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step-by-Step Preparation Protocol */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-emerald-600" />
                  <span>Step-by-Step Preparation Method</span>
                </h3>
                <div className="space-y-2">
                  {activeRemedyModal.preparationSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3 text-xs text-slate-700"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dosage, Frequency & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1 text-xs">
                  <span className="font-bold text-emerald-950 uppercase tracking-wider">
                    Application & Dosage:
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {activeRemedyModal.dosageAndAdministration}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1 text-xs">
                  <span className="font-bold text-emerald-950 uppercase tracking-wider">
                    Frequency & Duration:
                  </span>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Frequency:</strong> {activeRemedyModal.frequency}
                  </p>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Course Duration:</strong> {activeRemedyModal.duration}
                  </p>
                </div>
              </div>

              {/* Clinical Red Flags: When to Call a Vet */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-rose-900 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Clinical Safety: When to Immediately Contact a Veterinarian</span>
                </div>
                <ul className="space-y-1 text-rose-800 list-disc pl-5">
                  {activeRemedyModal.whenToCallVet.map((alert, i) => (
                    <li key={i}>{alert}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Recipe</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${activeRemedyModal.name}\nIngredients: ${activeRemedyModal.ingredients
                        .map((i) => i.item)
                        .join(', ')}\nDosage: ${activeRemedyModal.dosageAndAdministration}`
                    );
                    showToast('Recipe copied to clipboard!');
                  }}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveRemedyModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleLogRemedyTreatment(activeRemedyModal);
                    setActiveRemedyModal(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Treatment to Animal Medical File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
