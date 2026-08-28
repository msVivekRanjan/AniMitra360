import React, { useState } from 'react';
import {
  Syringe,
  Pill,
  Calendar,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Sparkles,
  Info,
  ShieldCheck,
  X,
  FileCheck2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  VaccinationRecord,
  DewormingRecord,
  Animal,
  SpeciesType,
} from '../types';
import { getTranslation } from '../data/translations';

interface VaccinationDewormingViewProps {
  animals: Animal[];
  vaccinations: VaccinationRecord[];
  dewormings: DewormingRecord[];
  currentLanguage?: string;
  language?: string;
  onAddVaccination: (record: VaccinationRecord) => void;
  onAddDeworming: (record: DewormingRecord) => void;
  onMarkVaccineComplete: (vacId: string) => void;
}

const COMMON_VACCINES: Record<SpeciesType, { name: string; target: string; frequency: string }[]> = {
  Cattle: [
    { name: 'Raksha-Ovac (FMD)', target: 'Foot & Mouth Disease', frequency: 'Every 6 Months' },
    { name: 'Raksha-HS+BQ Combined', target: 'Hemorrhagic Septicemia & Black Quarter', frequency: 'Annual (Pre-Monsoon)' },
    { name: 'Bruvax (S19)', target: 'Brucellosis (Heifer Calves)', frequency: 'Once in Lifetime (4-8 months)' },
    { name: 'Anthrax Spore Vaccine', target: 'Anthrax', frequency: 'Annual (Endemic areas)' },
    { name: 'Theileriosis Vaccine', target: 'Bovine Theileriosis (Crossbreds)', frequency: 'Once in Lifetime' },
  ],
  Buffalo: [
    { name: 'Raksha-Ovac (FMD)', target: 'Foot & Mouth Disease', frequency: 'Every 6 Months' },
    { name: 'Raksha-HS+BQ Combined', target: 'Hemorrhagic Septicemia & Black Quarter', frequency: 'Annual (Pre-Monsoon)' },
    { name: 'Anthrax Spore Vaccine', target: 'Anthrax', frequency: 'Annual' },
  ],
  Goat: [
    { name: 'PPR-VAC', target: 'Peste des Petits Ruminants (Goat Plague)', frequency: 'Once every 3 Years' },
    { name: 'ET-VAC (Enterotoxemia)', target: 'Enterotoxemia (Pulpy Kidney)', frequency: 'Annual (Pre-Monsoon)' },
    { name: 'Goat Pox Vaccine', target: 'Goat Pox', frequency: 'Annual' },
    { name: 'CCPP-VAC', target: 'Contagious Caprine Pleuropneumonia', frequency: 'Annual' },
  ],
  Sheep: [
    { name: 'ET-VAC (Enterotoxemia)', target: 'Enterotoxemia', frequency: 'Annual' },
    { name: 'Sheep Pox Vaccine', target: 'Sheep Pox', frequency: 'Annual' },
    { name: 'PPR-VAC', target: 'Peste des Petits Ruminants', frequency: 'Every 3 Years' },
  ],
  Poultry: [
    { name: 'Marek Disease Vaccine (HVT)', target: 'Marek Disease', frequency: 'Day 1 at Hatchery' },
    { name: 'Ranikhet Disease (F / LaSota)', target: 'Newcastle Disease', frequency: 'Day 7 & Booster Day 28' },
    { name: 'Gumboro Vaccine (IBD)', target: 'Infectious Bursal Disease', frequency: 'Day 14' },
    { name: 'Fowl Pox Vaccine', target: 'Fowl Pox', frequency: 'Week 6-8' },
    { name: 'Ranikhet R2B Booster', target: 'Newcastle Disease (Adults)', frequency: 'Week 16-18' },
  ],
  Horse: [
    { name: 'Tetanus Toxoid', target: 'Equine Tetanus', frequency: 'Annual Booster' },
    { name: 'Equine Influenza Vaccine', target: 'Equine Flu', frequency: 'Annual' },
    { name: 'Rabies Equine Vaccine', target: 'Rabies', frequency: 'Annual' },
  ],
  Dog: [
    { name: 'Nobivac DHPPi 7-in-1', target: 'Parvo, Distemper, Hepatitis', frequency: 'Annual Booster' },
    { name: 'Nobivac Rabies (R)', target: 'Rabies', frequency: 'Annual Booster' },
    { name: 'Corona + Giardia Vaccine', target: 'Canine Coronavirus', frequency: 'Annual' },
  ],
  Cat: [
    { name: 'Felocell 4-in-1', target: 'Feline Panleukopenia & Rhino', frequency: 'Annual' },
    { name: 'Rabies Feline', target: 'Rabies', frequency: 'Annual' },
  ],
  Pig: [
    { name: 'Classical Swine Fever (CSF)', target: 'Swine Fever (Hog Cholera)', frequency: 'Annual' },
    { name: 'FMD Pig Vaccine', target: 'Foot & Mouth Disease', frequency: 'Every 6 Months' },
  ],
};

export const VaccinationDewormingView: React.FC<VaccinationDewormingViewProps> = ({
  animals,
  vaccinations,
  dewormings,
  currentLanguage,
  language = 'en',
  onAddVaccination,
  onAddDeworming,
  onMarkVaccineComplete,
}) => {
  const lang = currentLanguage || language;
  const [activeSubTab, setActiveSubTab] = useState<'vaccination' | 'deworming' | 'schedule'>('vaccination');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Upcoming' | 'Overdue' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddVaccineModalOpen, setIsAddVaccineModalOpen] = useState(false);
  const [isAddDewormingModalOpen, setIsAddDewormingModalOpen] = useState(false);

  // New Vaccine Form
  const [vacForm, setVacForm] = useState({
    animalId: animals[0]?.id || '',
    vaccineName: 'Raksha-Ovac (FMD)',
    diseaseTarget: 'Foot & Mouth Disease (FMD)',
    dateGiven: new Date().toISOString().split('T')[0],
    batchNumber: `VAC-${Math.floor(100 + Math.random() * 900)}-24`,
    nextDueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    administeredBy: 'Dr. Debasis Nayak (BVO)',
    costInr: 0,
    notes: 'Administered under National Animal Disease Control Programme (NADCP).',
  });

  // New Deworming Form
  const [dewForm, setDewForm] = useState({
    animalId: animals[0]?.id || '',
    medicineName: 'Albendazole 3000mg Bolus (Albomar)',
    dose: '1 Bolus orally in morning',
    weightAtDosing: animals[0]?.weightKg || 400,
    date: new Date().toISOString().split('T')[0],
    nextDueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    administeredBy: 'Self (Farmer)',
    notes: 'Given with jaggery ball on empty stomach.',
  });

  const handleAnimalSelectInVac = (animId: string) => {
    const anim = animals.find((a) => a.id === animId);
    if (!anim) return;
    const presets = COMMON_VACCINES[anim.species] || COMMON_VACCINES['Cattle'];
    setVacForm({
      ...vacForm,
      animalId: animId,
      vaccineName: presets[0]?.name || 'Raksha-Ovac (FMD)',
      diseaseTarget: presets[0]?.target || 'Foot & Mouth Disease',
    });
  };

  const handleAnimalSelectInDew = (animId: string) => {
    const anim = animals.find((a) => a.id === animId);
    if (!anim) return;
    setDewForm({
      ...dewForm,
      animalId: animId,
      weightAtDosing: anim.weightKg,
    });
  };

  const handleCreateVaccination = (e: React.FormEvent) => {
    e.preventDefault();
    const anim = animals.find((a) => a.id === vacForm.animalId) || animals[0];
    const newVac: VaccinationRecord = {
      id: `vac-${Date.now()}`,
      animalId: vacForm.animalId,
      animalName: `${anim?.name} (${anim?.species})`,
      species: anim?.species || 'Cattle',
      vaccineName: vacForm.vaccineName,
      diseaseTarget: vacForm.diseaseTarget,
      dateGiven: vacForm.dateGiven,
      batchNumber: vacForm.batchNumber,
      nextDueDate: vacForm.nextDueDate,
      status: 'Upcoming',
      administeredBy: vacForm.administeredBy,
      costInr: Number(vacForm.costInr) || 0,
      notes: vacForm.notes,
    };

    onAddVaccination(newVac);
    setIsAddVaccineModalOpen(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  const handleCreateDeworming = (e: React.FormEvent) => {
    e.preventDefault();
    const anim = animals.find((a) => a.id === dewForm.animalId) || animals[0];
    const newDew: DewormingRecord = {
      id: `dew-${Date.now()}`,
      animalId: dewForm.animalId,
      animalName: `${anim?.name} (${anim?.species})`,
      species: anim?.species || 'Cattle',
      date: dewForm.date,
      medicineName: dewForm.medicineName,
      dose: dewForm.dose,
      weightAtDosing: Number(dewForm.weightAtDosing) || 100,
      nextDueDate: dewForm.nextDueDate,
      administeredBy: dewForm.administeredBy,
      notes: dewForm.notes,
    };

    onAddDeworming(newDew);
    setIsAddDewormingModalOpen(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  const handleMarkDoneWithCelebration = (vacId: string) => {
    onMarkVaccineComplete(vacId);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#10b981', '#34d399', '#f59e0b', '#3b82f6'],
    });
  };

  // Filtered lists
  const filteredVaccinations = vaccinations.filter((v) => {
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    const matchesSearch =
      v.vaccineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.diseaseTarget.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.animalName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredDewormings = dewormings.filter((d) => {
    return (
      d.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.animalName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center space-x-2">
            <span>{getTranslation(lang, 'vaccinations')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Timely immunization tracking, NADCP booster schedules, and parasite management
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="btn-log-vaccine-modal"
            onClick={() => setIsAddVaccineModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition active:scale-95"
          >
            <Syringe className="w-4 h-4" />
            <span>{getTranslation(lang, 'recordVaccination')}</span>
          </button>

          <button
            id="btn-log-deworming-modal"
            onClick={() => setIsAddDewormingModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition active:scale-95"
          >
            <Pill className="w-4 h-4" />
            <span>{getTranslation(lang, 'recordDeworming')}</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs: Vaccination vs Deworming vs National Schedule */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('vaccination')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition flex items-center space-x-2 ${
            activeSubTab === 'vaccination'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Syringe className="w-4 h-4" />
          <span>{getTranslation(lang, 'vaccinations')} ({vaccinations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('deworming')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition flex items-center space-x-2 ${
            activeSubTab === 'deworming'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>{getTranslation(lang, 'deworming')} ({dewormings.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('schedule')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition flex items-center space-x-2 ${
            activeSubTab === 'schedule'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Info className="w-4 h-4 text-teal-600" />
          <span>{getTranslation(lang, 'nadcpSchedule')}</span>
        </button>
      </div>

      {/* ================= SUB-TAB 1: VACCINATION ================= */}
      {activeSubTab === 'vaccination' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search vaccine name, animal, or disease target (FMD, HS, Anthrax)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Vaccine Statuses</option>
                <option value="Upcoming">Upcoming Due</option>
                <option value="Overdue">Overdue Alerts</option>
                <option value="Completed">Completed History</option>
              </select>
            </div>
          </div>

          {/* Vaccination Cards List */}
          <div className="space-y-3">
            {filteredVaccinations.map((vac) => (
              <div
                key={vac.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      vac.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : vac.status === 'Overdue'
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <Syringe className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                        {vac.vaccineName}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {vac.diseaseTarget}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          vac.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : vac.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {vac.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500">
                      Animal: <span className="font-semibold text-slate-800">{vac.animalName}</span> • Administered: {vac.dateGiven} • Batch: <span className="font-mono text-slate-700">{vac.batchNumber}</span>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center space-x-3 pt-0.5">
                      <span>By: <span className="font-medium text-slate-700">{vac.administeredBy}</span></span>
                      <span>•</span>
                      <span>Next Due: <span className="font-bold text-slate-900">{vac.nextDueDate}</span></span>
                    </div>

                    {vac.notes && (
                      <p className="text-xs text-slate-500 italic pt-1">{vac.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  {vac.status === 'Completed' ? (
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Certified Vaccinated</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMarkDoneWithCelebration(vac.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Administered</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ================= SUB-TAB 2: DEWORMING ================= */}
      {activeSubTab === 'deworming' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-center space-x-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <span className="font-bold">Quarterly Deworming Protocol:</span> Administer anthelmintics (Albendazole / Fenbendazole / Ivermectin) every 3-4 months on an empty stomach to maintain optimal feed conversion ratio and prevent bottle jaw & anaemia.
            </div>
          </div>

          <div className="space-y-3">
            {filteredDewormings.map((dew) => (
              <div
                key={dew.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Pill className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                        {dew.medicineName}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        Dose: {dew.dose}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500">
                      Animal: <span className="font-semibold text-slate-800">{dew.animalName}</span> • Weight at dosing: {dew.weightAtDosing} kg • Administered: {dew.date}
                    </div>

                    <div className="text-xs text-slate-700 font-medium">
                      Next Scheduled Deworming: <span className="font-bold text-emerald-700">{dew.nextDueDate}</span>
                    </div>

                    {dew.notes && <p className="text-xs text-slate-500 italic pt-0.5">{dew.notes}</p>}
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Logged by: <span className="font-semibold text-slate-700">{dew.administeredBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 3: ICAR / NADCP NATIONAL SCHEDULE GUIDE ================= */}
      {activeSubTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">
                National Livestock & Poultry Vaccination Calendar (ICAR Standard)
              </h3>
              <p className="text-xs text-slate-500">
                Official guidelines from the Department of Animal Husbandry & Dairying (DAHD), Govt. of India
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                  <th className="py-3 px-4">Species</th>
                  <th className="py-3 px-4">Disease / Target</th>
                  <th className="py-3 px-4">Primary Vaccine Age</th>
                  <th className="py-3 px-4">Booster Frequency</th>
                  <th className="py-3 px-4">Best Season</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Cattle & Buffalo</td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">Foot & Mouth Disease (FMD)</td>
                  <td className="py-3 px-4">4 Months of age</td>
                  <td className="py-3 px-4">Every 6 Months</td>
                  <td className="py-3 px-4">Feb - Mar & Aug - Sep</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Cattle & Buffalo</td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">Hemorrhagic Septicemia (HS)</td>
                  <td className="py-3 px-4">6 Months of age</td>
                  <td className="py-3 px-4">Annual</td>
                  <td className="py-3 px-4">May - June (Pre-Monsoon)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Cattle & Buffalo</td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">Black Quarter (BQ)</td>
                  <td className="py-3 px-4">6 Months of age</td>
                  <td className="py-3 px-4">Annual</td>
                  <td className="py-3 px-4">May - June (Pre-Monsoon)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Female Calves (Cattle)</td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">Brucellosis (Calfhood S19)</td>
                  <td className="py-3 px-4">4 - 8 Months (Only once)</td>
                  <td className="py-3 px-4">Lifelong Immunity</td>
                  <td className="py-3 px-4">Any season</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Goat & Sheep</td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">PPR (Peste des Petits Ruminants)</td>
                  <td className="py-3 px-4">3 Months of age</td>
                  <td className="py-3 px-4">Every 3 Years</td>
                  <td className="py-3 px-4">Nov - Dec</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Goat & Sheep</td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">Enterotoxemia (ET)</td>
                  <td className="py-3 px-4">4 Months of age</td>
                  <td className="py-3 px-4">Annual</td>
                  <td className="py-3 px-4">May - June</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Poultry</td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">Ranikhet Disease (RD LaSota)</td>
                  <td className="py-3 px-4">Day 7 (Eye drop)</td>
                  <td className="py-3 px-4">Booster at Day 28 & Wk 16</td>
                  <td className="py-3 px-4">Continuous</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Dogs & Pets</td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">Anti-Rabies Vaccine (ARV)</td>
                  <td className="py-3 px-4">3 Months of age</td>
                  <td className="py-3 px-4">Annual Booster</td>
                  <td className="py-3 px-4">Any season</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL: RECORD NEW VACCINATION ================= */}
      {isAddVaccineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative my-8">
            <button
              onClick={() => setIsAddVaccineModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Syringe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Record Vaccination Shot
                </h3>
                <p className="text-xs text-slate-500">
                  Log official vaccine batch, date given, and auto-set next reminder
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateVaccination} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Animal *
                </label>
                <select
                  value={vacForm.animalId}
                  onChange={(e) => handleAnimalSelectInVac(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                >
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.species} - {a.animalTagId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vaccine Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={vacForm.vaccineName}
                    onChange={(e) => setVacForm({ ...vacForm, vaccineName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Raksha-Ovac (FMD)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Disease *
                  </label>
                  <input
                    type="text"
                    required
                    value={vacForm.diseaseTarget}
                    onChange={(e) => setVacForm({ ...vacForm, diseaseTarget: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Foot and Mouth Disease"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date Administered</label>
                  <input
                    type="date"
                    value={vacForm.dateGiven}
                    onChange={(e) => setVacForm({ ...vacForm, dateGiven: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Next Booster Due Date</label>
                  <input
                    type="date"
                    value={vacForm.nextDueDate}
                    onChange={(e) => setVacForm({ ...vacForm, nextDueDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={vacForm.batchNumber}
                    onChange={(e) => setVacForm({ ...vacForm, batchNumber: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500"
                    placeholder="FMD-B24-0981"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Administered By</label>
                  <input
                    type="text"
                    value={vacForm.administeredBy}
                    onChange={(e) => setVacForm({ ...vacForm, administeredBy: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    placeholder="Dr. Debasis Nayak (BVO)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Government Scheme</label>
                <textarea
                  rows={2}
                  value={vacForm.notes}
                  onChange={(e) => setVacForm({ ...vacForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Free NADCP vaccination camp..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddVaccineModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20"
                >
                  Save Vaccination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: RECORD NEW DEWORMING ================= */}
      {isAddDewormingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative my-8">
            <button
              onClick={() => setIsAddDewormingModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Record Deworming Dose
                </h3>
                <p className="text-xs text-slate-500">
                  Log anthelmintic medicine, dosage by body weight, and next schedule
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateDeworming} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Animal *
                </label>
                <select
                  value={dewForm.animalId}
                  onChange={(e) => handleAnimalSelectInDew(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                >
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.species} - {a.animalTagId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Medicine Name & Formulation *
                </label>
                <input
                  type="text"
                  required
                  value={dewForm.medicineName}
                  onChange={(e) => setDewForm({ ...dewForm, medicineName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Albendazole 3000mg Bolus / Nilzan Suspension"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dosage Given</label>
                  <input
                    type="text"
                    value={dewForm.dose}
                    onChange={(e) => setDewForm({ ...dewForm, dose: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. 1 Bolus orally"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Weight at Dosing (kg)</label>
                  <input
                    type="number"
                    value={dewForm.weightAtDosing}
                    onChange={(e) => setDewForm({ ...dewForm, weightAtDosing: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date Administered</label>
                  <input
                    type="date"
                    value={dewForm.date}
                    onChange={(e) => setDewForm({ ...dewForm, date: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Next Due Date (90-120 days)</label>
                  <input
                    type="date"
                    value={dewForm.nextDueDate}
                    onChange={(e) => setDewForm({ ...dewForm, nextDueDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddDewormingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20"
                >
                  Save Deworming Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
