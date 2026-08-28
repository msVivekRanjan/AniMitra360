import React, { useState, useEffect } from 'react';
import {
  StorageService,
} from './utils/storage';
import {
  Animal,
  VaccinationRecord,
  DewormingRecord,
  HealthRecord,
  GrowthAndProductionRecord,
  MarketplaceListing,
  VetProfile,
  VetConsultation,
  WeatherDiseaseAlert,
  WeatherData,
  FarmerProfile,
  AppNotification,
  LanguageCode,
  UserRole,
} from './types';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { DashboardView } from './components/DashboardView';
import { AnimalManagementView } from './components/AnimalManagementView';
import { VaccinationDewormingView } from './components/VaccinationDewormingView';
import { HealthRecordsView } from './components/HealthRecordsView';
import { GrowthProductionView } from './components/GrowthProductionView';
import { NutritionPlannerView } from './components/NutritionPlannerView';
import { WeatherDiseaseAlertsView } from './components/WeatherDiseaseAlertsView';
import { VeterinarySupportView } from './components/VeterinarySupportView';
import { MarketplaceView } from './components/MarketplaceView';
import { FarmerProfileView } from './components/FarmerProfileView';
import { AyurvedicEthnoVetView } from './components/AyurvedicEthnoVetView';
import { getTranslation } from './data/translations';

export default function App() {
  // Navigation & Preferences State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(StorageService.getLanguage());
  const [userRole, setUserRole] = useState<UserRole>('farmer');

  // Persistence State
  const [farmer, setFarmer] = useState<FarmerProfile>(StorageService.getFarmer());
  const [animals, setAnimals] = useState<Animal[]>(StorageService.getAnimals());
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>(StorageService.getVaccinations());
  const [dewormings, setDewormings] = useState<DewormingRecord[]>(StorageService.getDewormings());
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(StorageService.getHealthRecords());
  const [growthRecords, setGrowthRecords] = useState<GrowthAndProductionRecord[]>(StorageService.getGrowthRecords());
  const [listings, setListings] = useState<MarketplaceListing[]>(StorageService.getListings());
  const [vets, setVets] = useState<VetProfile[]>(StorageService.getVets());
  const [consultations, setConsultations] = useState<VetConsultation[]>(StorageService.getConsultations());
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherDiseaseAlert[]>(StorageService.getWeatherAlerts());
  const [currentWeather, setCurrentWeather] = useState<WeatherData>(StorageService.getCurrentWeather());
  const [notifications, setNotifications] = useState<AppNotification[]>(StorageService.getNotifications());

  // Deep Navigation / Modal Triggers
  const [preselectedAnimalForNutrition, setPreselectedAnimalForNutrition] = useState<Animal | null>(null);
  const [preselectedAnimalForHealth, setPreselectedAnimalForHealth] = useState<Animal | null>(null);
  const [showAddAnimalDirectly, setShowAddAnimalDirectly] = useState(false);
  const [showLogHealthDirectly, setShowLogHealthDirectly] = useState(false);

  // Sync Language
  const handleChangeLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    StorageService.saveLanguage(lang);
  };

  // Sync Farmer
  const handleUpdateFarmer = (updated: FarmerProfile) => {
    setFarmer(updated);
    StorageService.saveFarmer(updated);
  };

  // Sync Animals
  const handleAddAnimal = (newAnimal: Animal) => {
    const updated = [newAnimal, ...animals];
    setAnimals(updated);
    StorageService.saveAnimals(updated);

    // Also push a notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `New Animal Registered`,
      message: `${newAnimal.name} (${newAnimal.animalTagId}) has been successfully enrolled into your herd registry.`,
      type: 'info',
      date: 'Just now',
      isRead: false,
      linkTab: 'animals',
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    StorageService.saveNotifications(updatedNotifs);
  };

  const handleUpdateAnimal = (updatedAnimal: Animal) => {
    const updated = animals.map((a) => (a.id === updatedAnimal.id ? updatedAnimal : a));
    setAnimals(updated);
    StorageService.saveAnimals(updated);
  };

  const handleDeleteAnimal = (id: string) => {
    const updated = animals.filter((a) => a.id !== id);
    setAnimals(updated);
    StorageService.saveAnimals(updated);
  };

  // Sync Vaccinations
  const handleAddVaccination = (vac: VaccinationRecord) => {
    const updated = [vac, ...vaccinations];
    setVaccinations(updated);
    StorageService.saveVaccinations(updated);
  };

  const handleMarkVaccineComplete = (vacId: string) => {
    const updated = vaccinations.map((v) =>
      v.id === vacId ? { ...v, status: 'Completed' as const } : v
    );
    setVaccinations(updated);
    StorageService.saveVaccinations(updated);
  };

  // Sync Deworming
  const handleAddDeworming = (dew: DewormingRecord) => {
    const updated = [dew, ...dewormings];
    setDewormings(updated);
    StorageService.saveDewormings(updated);
  };

  // Sync Health Records
  const handleAddHealthRecord = (hlth: HealthRecord) => {
    const updated = [hlth, ...healthRecords];
    setHealthRecords(updated);
    StorageService.saveHealthRecords(updated);

    // Update animal status to under treatment
    const anim = animals.find((a) => a.id === hlth.animalId);
    if (anim && hlth.status === 'Under Treatment') {
      handleUpdateAnimal({ ...anim, status: 'Under Treatment' });
    }
  };

  // Sync Production & Growth
  const handleAddGrowthRecord = (rec: GrowthAndProductionRecord) => {
    const updated = [rec, ...growthRecords];
    setGrowthRecords(updated);
    StorageService.saveGrowthRecords(updated);
  };

  // Sync Marketplace Listings
  const handleAddListing = (listing: MarketplaceListing) => {
    const updated = [listing, ...listings];
    setListings(updated);
    StorageService.saveListings(updated);
  };

  // Sync Consultations
  const handleBookConsultation = (cons: VetConsultation) => {
    const updated = [cons, ...consultations];
    setConsultations(updated);
    StorageService.saveConsultations(updated);

    // Add notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Consultation Confirmed with ${cons.vetName}`,
      message: `Your ${cons.consultationType} on ${cons.scheduledDate} at ${cons.scheduledTime} is confirmed.`,
      type: 'vaccine',
      date: 'Just now',
      isRead: false,
      linkTab: 'vets',
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    StorageService.saveNotifications(updatedNotifs);
  };

  // Sync Weather & Location
  const handleUpdateLocationWeather = (newLocation: string) => {
    const updated: WeatherData = {
      ...currentWeather,
      location: newLocation,
    };
    setCurrentWeather(updated);
    StorageService.saveCurrentWeather(updated);
  };

  // Reset Demo Data
  const handleResetData = () => {
    StorageService.resetToDefaults();
    setFarmer(StorageService.getFarmer());
    setAnimals(StorageService.getAnimals());
    setVaccinations(StorageService.getVaccinations());
    setDewormings(StorageService.getDewormings());
    setHealthRecords(StorageService.getHealthRecords());
    setGrowthRecords(StorageService.getGrowthRecords());
    setListings(StorageService.getListings());
    setVets(StorageService.getVets());
    setConsultations(StorageService.getConsultations());
    setWeatherAlerts(StorageService.getWeatherAlerts());
    setCurrentWeather(StorageService.getCurrentWeather());
    setNotifications(StorageService.getNotifications());
    setActiveTab('dashboard');
  };

  // Clear or Mark Notification Read
  const handleMarkNotificationRead = (notifId: string) => {
    const updated = notifications.map((n) => (n.id === notifId ? { ...n, isRead: true } : n));
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  // Deep Cross-Component Navigation Handlers
  const handleOpenNutritionForAnimal = (animal: Animal) => {
    setPreselectedAnimalForNutrition(animal);
    setActiveTab('nutrition');
  };

  const handleOpenHealthRecordForAnimal = (animal: Animal) => {
    setPreselectedAnimalForHealth(animal);
    setShowLogHealthDirectly(true);
    setActiveTab('health');
  };

  const handleRegisterAnimalFromDashboard = () => {
    setShowAddAnimalDirectly(true);
    setActiveTab('animals');
  };

  const handleLogSicknessFromDashboard = () => {
    setShowLogHealthDirectly(true);
    setActiveTab('health');
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-[#064E3B] flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Universal Navbar */}
      <Navbar
        farmer={farmer}
        currentLanguage={currentLanguage}
        onChangeLanguage={handleChangeLanguage}
        userRole={userRole}
        onChangeUserRole={setUserRole}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onNavigate={setActiveTab}
      />

      {/* Main Body Layout: Sticky Sidebar on Desktop + Dynamic Tab View */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 flex gap-6">
        
        {/* Desktop Sidebar (Left 256px) */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentLanguage={currentLanguage}
          userRole={userRole}
          animalsCount={animals.length}
          vaccinesDueCount={vaccinations.filter((v) => v.status === 'Upcoming' || v.status === 'Overdue').length}
          weatherAlertsCount={weatherAlerts.length}
        />

        {/* Dynamic Center Canvas View */}
        <main className="flex-1 min-w-0">
          
          {/* PWA & Offline Sync Banner */}
          <PWAInstallBanner currentLanguage={currentLanguage} />

          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <DashboardView
              farmer={farmer}
              animals={animals}
              vaccinations={vaccinations}
              dewormings={dewormings}
              healthRecords={healthRecords}
              weatherAlerts={weatherAlerts}
              currentWeather={currentWeather}
              currentLanguage={currentLanguage}
              onNavigate={setActiveTab}
              onRegisterAnimal={handleRegisterAnimalFromDashboard}
              onLogSickness={handleLogSicknessFromDashboard}
            />
          )}

          {/* 2. ANIMAL MANAGEMENT VIEW */}
          {activeTab === 'animals' && (
            <AnimalManagementView
              animals={animals}
              vaccinations={vaccinations}
              dewormings={dewormings}
              healthRecords={healthRecords}
              growthRecords={growthRecords}
              currentLanguage={currentLanguage}
              onAddAnimal={handleAddAnimal}
              onUpdateAnimal={handleUpdateAnimal}
              onDeleteAnimal={handleDeleteAnimal}
              onOpenNutritionForAnimal={handleOpenNutritionForAnimal}
              onOpenHealthRecordForAnimal={handleOpenHealthRecordForAnimal}
              showAddModalDirectly={showAddAnimalDirectly}
              onCloseAddModalDirectly={() => setShowAddAnimalDirectly(false)}
            />
          )}

          {/* 3. VACCINATION & DEWORMING VIEW */}
          {activeTab === 'vaccinations' && (
            <VaccinationDewormingView
              animals={animals}
              vaccinations={vaccinations}
              dewormings={dewormings}
              currentLanguage={currentLanguage}
              onAddVaccination={handleAddVaccination}
              onAddDeworming={handleAddDeworming}
              onMarkVaccineComplete={handleMarkVaccineComplete}
            />
          )}

          {/* 4. HEALTH RECORDS VIEW */}
          {activeTab === 'health' && (
            <HealthRecordsView
              animals={animals}
              healthRecords={healthRecords}
              currentLanguage={currentLanguage}
              onAddHealthRecord={handleAddHealthRecord}
              onNavigateToVet={() => setActiveTab('vets')}
              showAddModalDirectly={showLogHealthDirectly}
              onCloseAddModalDirectly={() => setShowLogHealthDirectly(false)}
              preselectedAnimal={preselectedAnimalForHealth}
            />
          )}

          {/* 5. GROWTH & PRODUCTION TRACKING */}
          {activeTab === 'growth' && (
            <GrowthProductionView
              animals={animals}
              records={growthRecords}
              currentLanguage={currentLanguage}
              onAddRecord={handleAddGrowthRecord}
            />
          )}

          {/* 6. NUTRITION PLANNER & RATION ENGINE */}
          {activeTab === 'nutrition' && (
            <NutritionPlannerView
              animals={animals}
              preselectedAnimal={preselectedAnimalForNutrition}
              currentLanguage={currentLanguage}
            />
          )}

          {/* 6.5 ETHNOVETERINARY & AYURVEDIC MEDICINE VIEW */}
          {activeTab === 'ayurveda' && (
            <AyurvedicEthnoVetView
              animals={animals}
              currentLanguage={currentLanguage}
              currentLocation={farmer.district ? `${farmer.district}, ${farmer.state}` : 'Karnataka, India'}
              onLogHealthRecord={handleAddHealthRecord}
            />
          )}

          {/* 7. WEATHER DISEASE ALERTS VIEW */}
          {activeTab === 'weather' && (
            <WeatherDiseaseAlertsView
              alerts={weatherAlerts}
              currentWeather={currentWeather}
              currentLanguage={currentLanguage}
              onUpdateLocationWeather={handleUpdateLocationWeather}
            />
          )}

          {/* 8. VETERINARY SUPPORT & TELEHEALTH */}
          {activeTab === 'vets' && (
            <VeterinarySupportView
              vets={vets}
              consultations={consultations}
              animals={animals}
              currentLanguage={currentLanguage}
              onBookConsultation={handleBookConsultation}
            />
          )}

          {/* 9. FARMER MARKETPLACE */}
          {activeTab === 'marketplace' && (
            <MarketplaceView
              listings={listings}
              currentLanguage={currentLanguage}
              onAddListing={handleAddListing}
            />
          )}

          {/* 10. FARMER PROFILE & SETTINGS */}
          {activeTab === 'profile' && (
            <FarmerProfileView
              farmer={farmer}
              animals={animals}
              onUpdateFarmer={handleUpdateFarmer}
              currentLanguage={currentLanguage}
              onChangeLanguage={handleChangeLanguage}
              onResetData={handleResetData}
            />
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible on small screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-100 px-2 py-1.5 flex items-center justify-around shadow-xs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'dashboard' ? 'text-emerald-700' : 'text-emerald-800/60'
          }`}
        >
          <span className="text-base">📊</span>
          <span>{getTranslation(currentLanguage, 'dashboard')}</span>
        </button>

        <button
          onClick={() => setActiveTab('animals')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'animals' ? 'text-emerald-700' : 'text-emerald-800/60'
          }`}
        >
          <span className="text-base">🐄</span>
          <span>{getTranslation(currentLanguage, 'animals')}</span>
        </button>

        <button
          onClick={() => setActiveTab('vaccinations')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'vaccinations' ? 'text-emerald-700' : 'text-emerald-800/60'
          }`}
        >
          <span className="text-base">💉</span>
          <span>{getTranslation(currentLanguage, 'vaccinations')}</span>
        </button>

        <button
          onClick={() => setActiveTab('nutrition')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'nutrition' ? 'text-emerald-700' : 'text-emerald-800/60'
          }`}
        >
          <span className="text-base">🥣</span>
          <span>{getTranslation(currentLanguage, 'nutrition')}</span>
        </button>

        <button
          onClick={() => setActiveTab('vets')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'vets' ? 'text-emerald-700' : 'text-emerald-800/60'
          }`}
        >
          <span className="text-base">🩺</span>
          <span>{getTranslation(currentLanguage, 'vets')}</span>
        </button>

        <button
          onClick={() => setActiveTab('ayurveda')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-bold ${
            activeTab === 'ayurveda' ? 'text-emerald-700 font-extrabold' : 'text-emerald-800/60'
          }`}
        >
          <span className="text-base">🌿</span>
          <span>{getTranslation(currentLanguage, 'ayurveda', 'Ayurveda')}</span>
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'marketplace' ? 'text-emerald-700' : 'text-emerald-800/60'
          }`}
        >
          <span className="text-base">🛍️</span>
          <span>{getTranslation(currentLanguage, 'marketplace')}</span>
        </button>
      </nav>

    </div>
  );
}
