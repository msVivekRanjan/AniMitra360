import React, { useState } from 'react';
import {
  Stethoscope,
  Phone,
  Video,
  MapPin,
  Clock,
  Calendar,
  Star,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  UserCheck,
  X,
  MessageSquare,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VetProfile, VetConsultation, Animal } from '../types';
import { getTranslation } from '../data/translations';

interface VeterinarySupportViewProps {
  vets: VetProfile[];
  consultations: VetConsultation[];
  animals: Animal[];
  currentLanguage?: string;
  language?: string;
  onBookConsultation: (consultation: VetConsultation) => void;
}

export const VeterinarySupportView: React.FC<VeterinarySupportViewProps> = ({
  vets,
  consultations,
  animals,
  currentLanguage,
  language = 'en',
  onBookConsultation,
}) => {
  const lang = currentLanguage || language;
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVetForBooking, setSelectedVetForBooking] = useState<VetProfile | null>(null);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    animalId: animals[0]?.id || '',
    consultationType: 'Video Call' as VetConsultation['consultationType'],
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: '10:30 AM',
    reasonForVisit: 'General health checkup and milk drop assessment.',
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVetForBooking) return;

    const anim = animals.find((a) => a.id === bookingForm.animalId) || animals[0];
    const newConsultation: VetConsultation = {
      id: `cons-${Date.now()}`,
      farmerId: 'farmer-01',
      farmerName: 'Ramesh Chandra Mohapatra',
      vetId: selectedVetForBooking.id,
      vetName: selectedVetForBooking.name,
      animalId: bookingForm.animalId,
      animalName: `${anim?.name} (${anim?.species})`,
      consultationType: bookingForm.consultationType,
      scheduledDate: bookingForm.scheduledDate,
      scheduledTime: bookingForm.scheduledTime,
      status: 'Confirmed',
      reasonForVisit: bookingForm.reasonForVisit,
    };

    onBookConsultation(newConsultation);
    setSelectedVetForBooking(null);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
  };

  const filteredVets = vets.filter((vet) => {
    const matchesSpec =
      selectedSpecialty === 'All' ||
      vet.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase());
    const matchesSearch =
      vet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vet.clinicAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vet.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpec && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center space-x-2">
            <span>{getTranslation(lang, 'vets')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Connect directly with verified Block Veterinary Officers (BVOs), livestock surgeons, and AI insemination experts
          </p>
        </div>

        <a
          href="tel:1962"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-700/20 transition active:scale-95 animate-pulse"
        >
          <Phone className="w-4 h-4" />
          <span>Call 1962 (Mobile Vet SOS)</span>
        </a>
      </div>

      {/* Emergency MVU Hotline Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-700/50">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-bold text-xs uppercase">
              Free Government Service
            </span>
            <span className="text-xs text-emerald-200">Govt. of Odisha / DAHD</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
            1962 Mobile Veterinary Unit (MVU) at Your Doorstep
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
            GPS-fitted Mobile Ambulances equipped with emergency drugs, surgical kits, and diagnostic instruments. Servicing rural villages within 45 minutes of SOS dispatch.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <a
            href="tel:1962"
            className="px-6 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-sm shadow-lg transition flex items-center space-x-2"
          >
            <Phone className="w-4 h-4 text-emerald-700" />
            <span>Dial 1962 Now</span>
          </a>
        </div>
      </div>

      {/* Booked Appointments Banner if any */}
      {consultations.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <h3 className="font-heading font-bold text-slate-900 text-base flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Your Active Consultations & Doctor Visits ({consultations.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {consultations.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{c.vetName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {c.status}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    Animal: <span className="font-semibold text-slate-800">{c.animalName}</span>
                  </div>
                  <div className="text-slate-700 font-medium flex items-center space-x-2">
                    <span>📅 {c.scheduledDate} at {c.scheduledTime}</span>
                    <span>•</span>
                    <span className="font-bold text-teal-700">{c.consultationType}</span>
                  </div>
                  <div className="text-slate-500 italic text-[11px] pt-0.5">
                    "{c.reasonForVisit}"
                  </div>
                </div>

                <div className="shrink-0">
                  {c.consultationType === 'Video Call' ? (
                    <button
                      onClick={() => alert(`Starting encrypted video consultation room with ${c.vetName}...`)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Call</span>
                    </button>
                  ) : (
                    <a
                      href="tel:+919437108842"
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center space-x-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Contact</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Directory Search & Category Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctors by name, clinic location, or specialty (Bovine, Poultry, Surgery)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none">
            {['All', 'Bovine', 'Surgeon', 'Poultry', 'AI & Breeding'].map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  selectedSpecialty === spec
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVets.map((vet) => (
            <div
              key={vet.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-lg hover:border-emerald-300 transition duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Doctor Avatar & Status */}
                <div className="flex items-start space-x-3.5">
                  <div className="relative">
                    <img
                      src={vet.avatarUrl}
                      alt={vet.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <h3 className="font-heading font-bold text-base text-slate-900 truncate">
                        {vet.name}
                      </h3>
                      {vet.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Verified Govt / Registered Officer" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{vet.qualification}</p>
                    <div className="flex items-center space-x-2 text-xs text-slate-600 mt-1">
                      <span className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                        {vet.rating}
                      </span>
                      <span>•</span>
                      <span>{vet.experienceYears} Years Exp</span>
                    </div>
                  </div>
                </div>

                {/* Specialization & Languages */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-500 font-medium">Specialty:</span>
                    <span className="font-bold text-emerald-800">{vet.specialization}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-500 font-medium">Languages:</span>
                    <span className="font-medium text-slate-800">{vet.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-start justify-between text-slate-700 pt-1">
                    <span className="text-slate-500 font-medium">Location:</span>
                    <span className="font-medium text-slate-800 text-right truncate max-w-[180px]">
                      {vet.clinicAddress}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Consultation Fee:</span>
                  <span className="font-extrabold text-slate-900 font-heading">
                    {vet.consultationFeeInr === 0 ? 'FREE (Govt Hospital)' : `₹${vet.consultationFeeInr}`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <a
                  href={`tel:${vet.phone}`}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call Direct</span>
                </a>

                <button
                  onClick={() => setSelectedVetForBooking(vet)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition flex items-center justify-center space-x-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Visit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL: BOOK APPOINTMENT ================= */}
      {selectedVetForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative my-8">
            <button
              onClick={() => setSelectedVetForBooking(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <img
                src={selectedVetForBooking.avatarUrl}
                alt={selectedVetForBooking.name}
                className="w-12 h-12 rounded-2xl object-cover border"
              />
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Book with {selectedVetForBooking.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedVetForBooking.qualification} • {selectedVetForBooking.specialization}
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Animal for Checkup *
                </label>
                <select
                  value={bookingForm.animalId}
                  onChange={(e) => setBookingForm({ ...bookingForm, animalId: e.target.value })}
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
                  Consultation Mode *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Video Call', 'Physical Farm Visit', 'Audio Call'] as VetConsultation['consultationType'][]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, consultationType: mode })}
                      className={`p-2.5 rounded-xl text-xs font-bold text-center border transition ${
                        bookingForm.consultationType === mode
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={bookingForm.scheduledDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, scheduledDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={bookingForm.scheduledTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, scheduledTime: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="09:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:30 AM">10:30 AM - 11:30 AM</option>
                    <option value="02:30 PM">02:30 PM - 03:30 PM</option>
                    <option value="05:00 PM">05:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Visit / Sickness Description
                </label>
                <textarea
                  rows={2}
                  value={bookingForm.reasonForVisit}
                  onChange={(e) => setBookingForm({ ...bookingForm, reasonForVisit: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Swelling in right rear quarter, fever, reduced feed intake..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedVetForBooking(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
