import React, { useState } from 'react';
import {
  HeartPulse,
  Plus,
  Search,
  Filter,
  Syringe,
  Pill,
  FileText,
  Apple,
  Calendar,
  Sparkles,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Tag,
  Clock,
} from 'lucide-react';
import {
  Animal,
  SpeciesType,
  ProductionStage,
  VaccinationRecord,
  DewormingRecord,
  HealthRecord,
  GrowthAndProductionRecord,
} from '../types';
import { getTranslation } from '../data/translations';

interface AnimalManagementViewProps {
  animals: Animal[];
  vaccinations: VaccinationRecord[];
  dewormings: DewormingRecord[];
  healthRecords: HealthRecord[];
  growthRecords: GrowthAndProductionRecord[];
  currentLanguage?: string;
  language?: string;
  onAddAnimal: (animal: Animal) => void;
  onUpdateAnimal: (animal: Animal) => void;
  onDeleteAnimal: (id: string) => void;
  onOpenNutritionForAnimal: (animal: Animal) => void;
  onOpenHealthRecordForAnimal: (animal: Animal) => void;
  showAddModalDirectly?: boolean;
  onCloseAddModalDirectly?: () => void;
}

const SPECIES_LIST: { type: SpeciesType | 'All'; label: string; icon: string }[] = [
  { type: 'All', label: 'All Animals', icon: '🐾' },
  { type: 'Cattle', label: 'Cattle (Cows)', icon: '🐄' },
  { type: 'Buffalo', label: 'Buffalo', icon: '🐃' },
  { type: 'Goat', label: 'Goats', icon: '🐐' },
  { type: 'Sheep', label: 'Sheep', icon: '🐑' },
  { type: 'Poultry', label: 'Poultry (Birds)', icon: '🐔' },
  { type: 'Horse', label: 'Horses & Equines', icon: '🐎' },
  { type: 'Dog', label: 'Farm Dogs & Pets', icon: '🐕' },
];

const PRODUCTION_STAGES: ProductionStage[] = [
  'Calf / Kid / Chick',
  'Heifer / Growing',
  'Lactating / Milking',
  'Dry / Resting',
  'Pregnant (Early/Mid)',
  'Pregnant (Late Stage)',
  'Layer (Egg-laying)',
  'Broiler (Meat)',
  'Adult Working / Breeding',
];

const DEFAULT_IMAGE_PRESETS: Record<SpeciesType, string> = {
  Cattle: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=600&auto=format&fit=crop&q=80',
  Buffalo: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80',
  Goat: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600&auto=format&fit=crop&q=80',
  Sheep: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=600&auto=format&fit=crop&q=80',
  Poultry: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80',
  Horse: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&auto=format&fit=crop&q=80',
  Dog: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
  Cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
  Pig: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&auto=format&fit=crop&q=80',
  Camel: 'https://images.unsplash.com/photo-1509205477838-a534e43a849f?w=600&auto=format&fit=crop&q=80',
};

export const AnimalManagementView: React.FC<AnimalManagementViewProps> = ({
  animals,
  vaccinations,
  dewormings,
  healthRecords,
  growthRecords,
  currentLanguage,
  language = 'en',
  onAddAnimal,
  onUpdateAnimal,
  onDeleteAnimal,
  onOpenNutritionForAnimal,
  onOpenHealthRecordForAnimal,
  showAddModalDirectly,
  onCloseAddModalDirectly,
}) => {
  const lang = currentLanguage || language;
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Animal['status']>('All');
  
  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(showAddModalDirectly || false);
  const [selectedAnimalForDetail, setSelectedAnimalForDetail] = useState<Animal | null>(null);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);

  // New Animal Form State
  const [formData, setFormData] = useState<Partial<Animal>>({
    species: 'Cattle',
    breed: 'Sahiwal',
    gender: 'Female',
    dob: '2022-01-15',
    weightKg: 380,
    productionStage: 'Lactating / Milking',
    notes: '',
    status: 'Healthy',
    name: '',
    animalTagId: `IN-OD-${Math.floor(1000 + Math.random() * 9000)}-COW`,
    imageUrl: DEFAULT_IMAGE_PRESETS['Cattle'],
    dailyMilkYieldLiters: 12,
  });

  const handleSpeciesChangeInForm = (sp: SpeciesType) => {
    const defaultBreed =
      sp === 'Cattle'
        ? 'Sahiwal'
        : sp === 'Buffalo'
        ? 'Murrah'
        : sp === 'Goat'
        ? 'Black Bengal'
        : sp === 'Sheep'
        ? 'Deccani'
        : sp === 'Poultry'
        ? 'Kadaknath'
        : sp === 'Horse'
        ? 'Marwari'
        : 'Indian Pariah';

    setFormData({
      ...formData,
      species: sp,
      breed: defaultBreed,
      imageUrl: DEFAULT_IMAGE_PRESETS[sp],
      animalTagId: `IN-OD-${Math.floor(1000 + Math.random() * 9000)}-${sp.substring(0, 3).toUpperCase()}`,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.animalTagId) {
      alert('Please provide animal name and tag ID.');
      return;
    }

    const newAnimal: Animal = {
      id: `anim-${Date.now()}`,
      name: formData.name,
      animalTagId: formData.animalTagId,
      species: formData.species || 'Cattle',
      breed: formData.breed || 'Indigenous Breed',
      gender: formData.gender || 'Female',
      dob: formData.dob || '2022-01-01',
      weightKg: Number(formData.weightKg) || 100,
      productionStage: formData.productionStage || 'Lactating / Milking',
      imageUrl: formData.imageUrl || DEFAULT_IMAGE_PRESETS[formData.species || 'Cattle'],
      notes: formData.notes || 'Registered via AnimalCare 360 mobile MVP.',
      registrationDate: new Date().toISOString().split('T')[0],
      status: formData.status || 'Healthy',
      dailyMilkYieldLiters: formData.dailyMilkYieldLiters ? Number(formData.dailyMilkYieldLiters) : undefined,
      dailyEggCount: formData.dailyEggCount ? Number(formData.dailyEggCount) : undefined,
    };

    onAddAnimal(newAnimal);
    setIsAddModalOpen(false);
    if (onCloseAddModalDirectly) onCloseAddModalDirectly();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnimal) return;
    onUpdateAnimal(editingAnimal);
    setEditingAnimal(null);
    setSelectedAnimalForDetail(editingAnimal);
  };

  // Filtered Animals
  const filteredAnimals = animals.filter((animal) => {
    const matchesSpecies = selectedSpecies === 'All' || animal.species === selectedSpecies;
    const matchesStatus = statusFilter === 'All' || animal.status === statusFilter;
    const matchesSearch =
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.animalTagId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.species.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecies && matchesStatus && matchesSearch;
  });

  // Calculate age helper
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const now = new Date();
    const diffMonths = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());
    if (diffMonths < 12) return `${Math.max(1, diffMonths)} Months`;
    const years = (diffMonths / 12).toFixed(1);
    return `${years} Years`;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center space-x-2">
            <span>{getTranslation(lang, 'animals')}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {animals.length} {getTranslation(lang, 'activeCount')}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Individual digital ear-tag identity, biological lifecycle records, and health histories
          </p>
        </div>

        <button
          id="btn-register-new-animal"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{getTranslation(lang, 'registerNewAnimal')}</span>
        </button>
      </div>

      {/* Species Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {SPECIES_LIST.map((sp) => {
          const speciesKey = sp.type === 'All' ? 'allAnimals' : sp.type === 'Cattle' ? 'cattle' : sp.type === 'Buffalo' ? 'buffalo' : sp.type === 'Goat' ? 'goat' : sp.type === 'Sheep' ? 'sheep' : sp.type === 'Poultry' ? 'poultry' : '';
          const label = speciesKey ? getTranslation(lang, speciesKey, sp.label) : sp.label;
          return (
            <button
              key={sp.type}
              onClick={() => setSelectedSpecies(sp.type)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center space-x-1.5 border ${
                selectedSpecies === sp.type
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <span>{sp.icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Status Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={getTranslation(lang, 'searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">{getTranslation(lang, 'healthStatus')}: All</option>
            <option value="Healthy">{getTranslation(lang, 'healthy')}</option>
            <option value="Under Treatment">{getTranslation(lang, 'underTreatment')}</option>
            <option value="Vaccination Due">{getTranslation(lang, 'vaccineDue')}</option>
            <option value="Quarantined">{getTranslation(lang, 'quarantined')}</option>
          </select>
        </div>
      </div>

      {/* Animal Cards Grid */}
      {filteredAnimals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
            🐄
          </div>
          <h3 className="font-heading font-bold text-slate-800 text-base">No animals match your search criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or species filter, or register a new animal to your herd.
          </p>
          <button
            onClick={() => {
              setSelectedSpecies('All');
              setSearchQuery('');
              setStatusFilter('All');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAnimals.map((animal) => {
            const animalVacs = vaccinations.filter((v) => v.animalId === animal.id);
            const animalHealths = healthRecords.filter((h) => h.animalId === animal.id);

            return (
              <div
                key={animal.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-emerald-300 transition duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Tag Header */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={animal.imageUrl}
                      alt={animal.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                    
                    {/* Ear Tag ID Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-mono font-bold flex items-center space-x-1 border border-white/20">
                      <Tag className="w-3 h-3 text-amber-300" />
                      <span>{animal.animalTagId}</span>
                    </div>

                    {/* Status Pill */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                          animal.status === 'Healthy'
                            ? 'bg-emerald-500 text-white'
                            : animal.status === 'Under Treatment'
                            ? 'bg-rose-500 text-white'
                            : animal.status === 'Vaccination Due'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-indigo-500 text-white'
                        }`}
                      >
                        {animal.status}
                      </span>
                    </div>

                    {/* Animal Name & Breed Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-heading font-extrabold text-lg text-white drop-shadow-md truncate">
                        {animal.name}
                      </h3>
                      <div className="text-xs text-slate-200 font-medium">
                        {animal.breed} • {animal.species}
                      </div>
                    </div>
                  </div>

                  {/* Animal Key Metrics */}
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Age</div>
                        <div className="font-bold text-slate-800">{calculateAge(animal.dob)}</div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Weight</div>
                        <div className="font-bold text-slate-800">{animal.weightKg} kg</div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Gender</div>
                        <div className="font-bold text-slate-800">{animal.gender}</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs">
                      <div className="flex items-center justify-between text-emerald-900">
                        <span className="text-slate-500 font-medium">Production Stage:</span>
                        <span className="font-bold">{animal.productionStage}</span>
                      </div>
                      {animal.dailyMilkYieldLiters && (
                        <div className="flex items-center justify-between text-emerald-800 mt-1 font-semibold">
                          <span>Daily Milk Harvest:</span>
                          <span className="text-emerald-700 font-bold">{animal.dailyMilkYieldLiters} Liters/day</span>
                        </div>
                      )}
                      {animal.dailyEggCount && (
                        <div className="flex items-center justify-between text-emerald-800 mt-1 font-semibold">
                          <span>Daily Egg Yield:</span>
                          <span className="text-emerald-700 font-bold">{animal.dailyEggCount} Eggs/day</span>
                        </div>
                      )}
                    </div>

                    {/* Notes / Health Summary */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {animal.notes}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedAnimalForDetail(animal)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center space-x-1"
                  >
                    <span>View Full Timeline</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenNutritionForAnimal(animal)}
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                    title="Calculate Feed Ration"
                  >
                    <Apple className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= ADD ANIMAL MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                if (onCloseAddModalDirectly) onCloseAddModalDirectly();
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-heading font-bold">
                🐄
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-slate-900">
                  Register New Animal / Livestock
                </h3>
                <p className="text-xs text-slate-500">
                  Create an official digital ear-tag health profile on AnimalCare 360
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              
              {/* Species Selection Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Select Species (पशु प्रजाति)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {(['Cattle', 'Buffalo', 'Goat', 'Sheep', 'Poultry', 'Horse', 'Dog'] as SpeciesType[]).map((sp) => (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => handleSpeciesChangeInForm(sp)}
                      className={`p-2 rounded-xl text-xs font-bold text-center border transition flex flex-col items-center justify-center ${
                        formData.species === sp
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                      }`}
                    >
                      <span className="text-lg mb-0.5">{DEFAULT_IMAGE_PRESETS[sp] ? (sp === 'Cattle' ? '🐄' : sp === 'Buffalo' ? '🐃' : sp === 'Goat' ? '🐐' : sp === 'Sheep' ? '🐑' : sp === 'Poultry' ? '🐔' : sp === 'Horse' ? '🐎' : '🐕') : '🐾'}</span>
                      <span className="text-[11px] truncate w-full">{sp}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag ID & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Animal Tag ID / Microchip No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.animalTagId}
                    onChange={(e) => setFormData({ ...formData, animalTagId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="IN-OD-8841-COW"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Animal Name / Identification Alias *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. Gauri / Kalyani / Fluffy"
                  />
                </div>
              </div>

              {/* Breed, Gender, DOB */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Breed</label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. Sahiwal / Gir / Murrah"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Weight, Stage, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Live Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Production Stage</label>
                  <select
                    value={formData.productionStage}
                    onChange={(e) => setFormData({ ...formData, productionStage: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {PRODUCTION_STAGES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Health Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Under Treatment">Under Treatment</option>
                    <option value="Vaccination Due">Vaccination Due</option>
                    <option value="Quarantined">Quarantined</option>
                  </select>
                </div>
              </div>

              {/* Milk / Egg yield if applicable */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Daily Milk Yield (Liters) - Optional
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.dailyMilkYieldLiters || ''}
                    onChange={(e) => setFormData({ ...formData, dailyMilkYieldLiters: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. 14.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Photo URL (Preview or Unsplash link)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Breeding History / Identification Marks / Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="e.g. White patch on forehead, calm milker, Artificial Insemination on..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ANIMAL DETAIL & LIFETIME TIMELINE MODAL ================= */}
      {selectedAnimalForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 relative my-8 max-h-[92vh] overflow-y-auto">
            
            {/* Header with Photo Banner */}
            <div className="relative h-56 sm:h-64 w-full bg-slate-900">
              <img
                src={selectedAnimalForDetail.imageUrl}
                alt={selectedAnimalForDetail.name}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <button
                onClick={() => setSelectedAnimalForDetail(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono font-extrabold text-xs">
                      🏷️ {selectedAnimalForDetail.animalTagId}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-xs font-bold">
                      {selectedAnimalForDetail.status}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                    {selectedAnimalForDetail.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-200">
                    {selectedAnimalForDetail.breed} ({selectedAnimalForDetail.species}) • Registered {selectedAnimalForDetail.registrationDate}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingAnimal(selectedAnimalForDetail);
                      setSelectedAnimalForDetail(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold flex items-center space-x-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${selectedAnimalForDetail.name}?`)) {
                        onDeleteAnimal(selectedAnimalForDetail.id);
                        setSelectedAnimalForDetail(null);
                      }
                    }}
                    className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs"
                    title="Delete Animal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Biological Vital Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Calculated Age</div>
                  <div className="text-sm sm:text-base font-bold text-slate-800 mt-0.5">
                    {calculateAge(selectedAnimalForDetail.dob)}
                  </div>
                  <div className="text-[10px] text-slate-500">DOB: {selectedAnimalForDetail.dob}</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Live Weight</div>
                  <div className="text-sm sm:text-base font-bold text-slate-800 mt-0.5">
                    {selectedAnimalForDetail.weightKg} kg
                  </div>
                  <div className="text-[10px] text-slate-500">Normal BMI range</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Production Stage</div>
                  <div className="text-xs sm:text-sm font-bold text-emerald-700 mt-0.5 truncate">
                    {selectedAnimalForDetail.productionStage}
                  </div>
                  <div className="text-[10px] text-slate-500">{selectedAnimalForDetail.gender}</div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                  <div className="text-emerald-600 text-[10px] uppercase font-bold">Daily Yield</div>
                  <div className="text-sm sm:text-base font-bold text-emerald-800 mt-0.5">
                    {selectedAnimalForDetail.dailyMilkYieldLiters
                      ? `${selectedAnimalForDetail.dailyMilkYieldLiters} L/day`
                      : selectedAnimalForDetail.dailyEggCount
                      ? `${selectedAnimalForDetail.dailyEggCount} Eggs`
                      : 'N/A'}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">Farm harvest</div>
                </div>
              </div>

              {/* Action Buttons for this animal */}
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => {
                    onOpenNutritionForAnimal(selectedAnimalForDetail);
                    setSelectedAnimalForDetail(null);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition flex items-center justify-center space-x-1.5"
                >
                  <Apple className="w-4 h-4" />
                  <span>Generate Customized Ration Plan</span>
                </button>

                <button
                  onClick={() => {
                    onOpenHealthRecordForAnimal(selectedAnimalForDetail);
                    setSelectedAnimalForDetail(null);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition flex items-center justify-center space-x-1.5"
                >
                  <HeartPulse className="w-4 h-4 text-teal-600" />
                  <span>Log Health / Sickness Record</span>
                </button>
              </div>

              {/* Complete Lifelong Health Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-heading font-bold text-slate-900 text-base flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Lifelong Health, Vaccination & Production Timeline</span>
                  </h4>
                </div>

                {/* Unified timeline items */}
                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                  
                  {/* Vaccination items */}
                  {vaccinations
                    .filter((v) => v.animalId === selectedAnimalForDetail.id)
                    .map((vac) => (
                      <div key={vac.id} className="relative flex items-start space-x-3 pl-8">
                        <div className="absolute left-1.5 top-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white">
                          <Syringe className="w-2.5 h-2.5" />
                        </div>
                        <div className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">
                              Vaccination: {vac.vaccineName} ({vac.diseaseTarget})
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {vac.status}
                            </span>
                          </div>
                          <div className="text-slate-500 mt-1">
                            Given: {vac.dateGiven} • Batch: {vac.batchNumber} • Next Due: <span className="font-semibold text-slate-800">{vac.nextDueDate}</span>
                          </div>
                          {vac.notes && <div className="text-slate-600 mt-1 italic">{vac.notes}</div>}
                        </div>
                      </div>
                    ))}

                  {/* Deworming items */}
                  {dewormings
                    .filter((d) => d.animalId === selectedAnimalForDetail.id)
                    .map((dew) => (
                      <div key={dew.id} className="relative flex items-start space-x-3 pl-8">
                        <div className="absolute left-1.5 top-1 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center ring-4 ring-white">
                          <Pill className="w-2.5 h-2.5" />
                        </div>
                        <div className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">
                              Deworming: {dew.medicineName}
                            </span>
                            <span className="text-[11px] text-slate-500">{dew.date}</span>
                          </div>
                          <div className="text-slate-500 mt-1">
                            Dose: {dew.dose} (at weight {dew.weightAtDosing} kg) • Next Due: <span className="font-semibold text-slate-800">{dew.nextDueDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* Health Diagnosis items */}
                  {healthRecords
                    .filter((h) => h.animalId === selectedAnimalForDetail.id)
                    .map((hlth) => (
                      <div key={hlth.id} className="relative flex items-start space-x-3 pl-8">
                        <div className="absolute left-1.5 top-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center ring-4 ring-white">
                          <HeartPulse className="w-2.5 h-2.5" />
                        </div>
                        <div className="flex-1 p-3 rounded-xl bg-rose-50/50 border border-rose-200/70 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-rose-950">
                              Medical Issue: {hlth.diseaseDiagnosed}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              {hlth.status}
                            </span>
                          </div>
                          <div className="text-rose-900 mt-1 font-medium">
                            Treatment: {hlth.treatmentGiven}
                          </div>
                          <div className="text-slate-500 mt-1">
                            Medicines: {hlth.medicines.join(', ')} • Vet: {hlth.vetName || 'Attending Officer'}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT ANIMAL MODAL ================= */}
      {editingAnimal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setEditingAnimal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-heading text-slate-900 mb-4">
              Edit Details for {editingAnimal.name}
            </h3>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editingAnimal.name}
                  onChange={(e) => setEditingAnimal({ ...editingAnimal, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Live Weight (kg)</label>
                  <input
                    type="number"
                    value={editingAnimal.weightKg}
                    onChange={(e) => setEditingAnimal({ ...editingAnimal, weightKg: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Daily Milk (L)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingAnimal.dailyMilkYieldLiters || ''}
                    onChange={(e) => setEditingAnimal({ ...editingAnimal, dailyMilkYieldLiters: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Production Stage</label>
                  <select
                    value={editingAnimal.productionStage}
                    onChange={(e) => setEditingAnimal({ ...editingAnimal, productionStage: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    {PRODUCTION_STAGES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Health Status</label>
                  <select
                    value={editingAnimal.status}
                    onChange={(e) => setEditingAnimal({ ...editingAnimal, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Under Treatment">Under Treatment</option>
                    <option value="Vaccination Due">Vaccination Due</option>
                    <option value="Quarantined">Quarantined</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={editingAnimal.notes}
                  onChange={(e) => setEditingAnimal({ ...editingAnimal, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingAnimal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-700/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
