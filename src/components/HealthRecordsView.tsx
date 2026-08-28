import React, { useState } from 'react';
import {
  HeartPulse,
  Plus,
  Search,
  Calendar,
  FileText,
  Stethoscope,
  Pill,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  ChevronRight,
  Sparkles,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { HealthRecord, Animal } from '../types';
import { getTranslation } from '../data/translations';

interface HealthRecordsViewProps {
  animals: Animal[];
  healthRecords: HealthRecord[];
  currentLanguage?: string;
  language?: string;
  onAddHealthRecord: (record: HealthRecord) => void;
  onNavigateToVet: () => void;
  showAddModalDirectly?: boolean;
  onCloseAddModalDirectly?: () => void;
  preselectedAnimal?: Animal | null;
}

const COMMON_SYMPTOM_TAGS = [
  'High Fever (>104°F)',
  'Loss of Appetite / Anorexia',
  'Drop in Milk Yield',
  'Swollen / Red Udder',
  'Coughing & Nasal Discharge',
  'Severe Lameness / Limping',
  'Bloat / Tympany (Swollen Left Flank)',
  'Diarrhea / Watery Stool',
  'Rough Hair Coat & Dullness',
  'Skin Lesions / Ticks',
  'Eye Discharge / Conjunctivitis',
  'Retention of Placenta',
];

export const HealthRecordsView: React.FC<HealthRecordsViewProps> = ({
  animals,
  healthRecords,
  currentLanguage,
  language = 'en',
  onAddHealthRecord,
  onNavigateToVet,
  showAddModalDirectly,
  onCloseAddModalDirectly,
  preselectedAnimal,
}) => {
  const lang = currentLanguage || language;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnimalFilter, setSelectedAnimalFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(showAddModalDirectly || false);

  // Form State
  const [formData, setFormData] = useState({
    animalId: preselectedAnimal?.id || animals[0]?.id || '',
    diseaseDiagnosed: '',
    symptoms: [] as string[],
    customSymptomInput: '',
    treatmentGiven: '',
    medicinesText: '',
    vetNotes: '',
    vetName: 'Dr. Debasis Nayak (BVO)',
    date: new Date().toISOString().split('T')[0],
    followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Under Treatment' as HealthRecord['status'],
    imageUrl: '',
  });

  const toggleSymptomTag = (tag: string) => {
    if (formData.symptoms.includes(tag)) {
      setFormData({ ...formData, symptoms: formData.symptoms.filter((s) => s !== tag) });
    } else {
      setFormData({ ...formData, symptoms: [...formData.symptoms, tag] });
    }
  };

  const handleAddCustomSymptom = () => {
    if (!formData.customSymptomInput.trim()) return;
    if (!formData.symptoms.includes(formData.customSymptomInput.trim())) {
      setFormData({
        ...formData,
        symptoms: [...formData.symptoms, formData.customSymptomInput.trim()],
        customSymptomInput: '',
      });
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.diseaseDiagnosed) {
      alert('Please specify the diagnosed condition or chief complaint.');
      return;
    }

    const anim = animals.find((a) => a.id === formData.animalId) || animals[0];
    const medicinesList = formData.medicinesText
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    const newRecord: HealthRecord = {
      id: `hlth-${Date.now()}`,
      animalId: formData.animalId,
      animalName: `${anim?.name} (${anim?.species})`,
      species: anim?.species || 'Cattle',
      date: formData.date,
      diseaseDiagnosed: formData.diseaseDiagnosed,
      symptoms: formData.symptoms.length > 0 ? formData.symptoms : ['Mild clinical distress'],
      treatmentGiven: formData.treatmentGiven || 'Prescribed oral rest and symptomatic care',
      medicines: medicinesList.length > 0 ? medicinesList : ['Meloxicam Bolus', 'Multivitamin syrup'],
      vetNotes: formData.vetNotes || 'Observed by attending livestock officer.',
      vetName: formData.vetName,
      followUpDate: formData.followUpDate,
      status: formData.status,
      images: formData.imageUrl ? [formData.imageUrl] : undefined,
    };

    onAddHealthRecord(newRecord);
    setIsAddModalOpen(false);
    if (onCloseAddModalDirectly) onCloseAddModalDirectly();
  };

  const filteredRecords = healthRecords.filter((record) => {
    const matchesAnimal = selectedAnimalFilter === 'All' || record.animalId === selectedAnimalFilter;
    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
    const matchesSearch =
      record.diseaseDiagnosed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.animalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.treatmentGiven.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesAnimal && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center space-x-2">
            <span>{getTranslation(lang, 'health')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Chronological veterinary diagnoses, symptom histories, prescriptions, and follow-up schedules
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            title="Print Medical Report"
          >
            <Printer className="w-4 h-4" />
            <span>Print Records</span>
          </button>

          <button
            id="btn-log-health-issue"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-700/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{getTranslation(lang, 'logSickness')}</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search symptoms, disease, treatment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedAnimalFilter}
            onChange={(e) => setSelectedAnimalFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Animals</option>
            {animals.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.species})
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Statuses</option>
            <option value="Resolved">Resolved</option>
            <option value="Under Treatment">Under Treatment</option>
            <option value="Follow-up Required">Follow-up Required</option>
          </select>
        </div>
      </div>

      {/* Health Records Chronological Timeline Cards */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
          <HeartPulse className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-heading font-bold text-slate-800 text-base">No active medical records found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All animals are currently in good health, or no records matched your filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition space-y-3"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      record.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : record.status === 'Under Treatment'
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        {record.diseaseDiagnosed}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          record.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : record.status === 'Under Treatment'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Animal: <span className="font-bold text-slate-800">{record.animalName}</span> • Diagnosed on: <span className="font-semibold text-slate-700">{record.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 flex items-center space-x-2">
                  <span>Vet: <span className="font-semibold text-slate-800">{record.vetName || 'Attending Doctor'}</span></span>
                  {record.followUpDate && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      Follow-up: {record.followUpDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Symptoms Tags */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Observed Clinical Symptoms
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {record.symptoms.map((sym, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200/60 text-rose-900 text-xs font-medium"
                    >
                      ⚠️ {sym}
                    </span>
                  ))}
                </div>
              </div>

              {/* Treatment & Prescribed Medicines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="font-bold text-slate-700 mb-1 flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Clinical Treatment Administered:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{record.treatmentGiven}</p>
                </div>

                <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-100 text-xs">
                  <div className="font-bold text-teal-900 mb-1 flex items-center space-x-1">
                    <Pill className="w-3.5 h-3.5 text-teal-600" />
                    <span>Prescribed Drugs & Dosages:</span>
                  </div>
                  <p className="text-teal-800 font-medium leading-relaxed">
                    {record.medicines.join(' • ')}
                  </p>
                </div>
              </div>

              {/* Vet Notes */}
              {record.vetNotes && (
                <div className="text-xs text-slate-500 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/60">
                  <span className="font-bold text-amber-900">Veterinary Officer Advice:</span> {record.vetNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL: LOG NEW HEALTH ISSUE ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 relative my-8 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                if (onCloseAddModalDirectly) onCloseAddModalDirectly();
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Log Sickness / Clinical Health Record
                </h3>
                <p className="text-xs text-slate-500">
                  Record diagnosed diseases, symptoms, treatment procedures, and prescriptions
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Animal *
                  </label>
                  <select
                    value={formData.animalId}
                    onChange={(e) => setFormData({ ...formData, animalId: e.target.value })}
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
                    Disease Diagnosed / Condition *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.diseaseDiagnosed}
                    onChange={(e) => setFormData({ ...formData, diseaseDiagnosed: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Acute Mastitis / Foot Rot / High Fever"
                  />
                </div>
              </div>

              {/* Quick Symptoms Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Select Symptoms (लक्षण चुनें)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {COMMON_SYMPTOM_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleSymptomTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                        formData.symptoms.includes(tag)
                          ? 'bg-rose-600 text-white font-bold shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Custom symptom input */}
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="text"
                    value={formData.customSymptomInput}
                    onChange={(e) => setFormData({ ...formData, customSymptomInput: e.target.value })}
                    placeholder="Or type other custom symptom..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSymptom();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSymptom}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Treatment and Medicines */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Treatment / Clinical Procedure Given
                </label>
                <textarea
                  rows={2}
                  value={formData.treatmentGiven}
                  onChange={(e) => setFormData({ ...formData, treatmentGiven: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Udder wash with potassium permanganate, intramammary infusion, cold ice pack..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prescribed Medicines (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.medicinesText}
                  onChange={(e) => setFormData({ ...formData, medicinesText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Ceftiofur 125mg, Meloxicam Bolus, Vitamin E + Selenium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Diagnosis Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Under Treatment">Under Treatment</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Follow-up Required">Follow-up Required</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-700/20"
                >
                  Save Health Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
