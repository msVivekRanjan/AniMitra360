import {
  FarmerProfile,
  Animal,
  VaccinationRecord,
  DewormingRecord,
  HealthRecord,
  GrowthAndProductionRecord,
  VetProfile,
  VetConsultation,
  MarketplaceListing,
  AppNotification,
  LanguageCode,
  WeatherDiseaseAlert,
  WeatherData,
} from '../types';
import {
  INITIAL_FARMER_PROFILE,
  INITIAL_ANIMALS,
  INITIAL_VACCINATIONS,
  INITIAL_DEWORMINGS,
  INITIAL_HEALTH_RECORDS,
  INITIAL_GROWTH_RECORDS,
  INITIAL_VET_PROFILES,
  INITIAL_VET_CONSULTATIONS,
  INITIAL_MARKETPLACE_LISTINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_WEATHER_DATA,
  INITIAL_WEATHER_ALERTS,
} from '../data/mockData';

const KEYS = {
  FARMER: 'ac360_farmer_profile',
  ANIMALS: 'ac360_animals',
  VACCINATIONS: 'ac360_vaccinations',
  DEWORMINGS: 'ac360_dewormings',
  HEALTH: 'ac360_health_records',
  GROWTH: 'ac360_growth_records',
  VETS: 'ac360_vets',
  CONSULTATIONS: 'ac360_consultations',
  MARKETPLACE: 'ac360_marketplace_listings',
  NOTIFICATIONS: 'ac360_notifications',
  LANGUAGE: 'ac360_language',
  ROLE: 'ac360_active_role',
  WEATHER: 'ac360_weather_data',
  ALERTS: 'ac360_weather_alerts',
};

export function loadStoredData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

export function saveStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export const StorageService = {
  getFarmer: () => loadStoredData<FarmerProfile>(KEYS.FARMER, INITIAL_FARMER_PROFILE),
  saveFarmer: (d: FarmerProfile) => saveStoredData(KEYS.FARMER, d),

  getAnimals: () => loadStoredData<Animal[]>(KEYS.ANIMALS, INITIAL_ANIMALS),
  saveAnimals: (d: Animal[]) => saveStoredData(KEYS.ANIMALS, d),

  getVaccinations: () => loadStoredData<VaccinationRecord[]>(KEYS.VACCINATIONS, INITIAL_VACCINATIONS),
  saveVaccinations: (d: VaccinationRecord[]) => saveStoredData(KEYS.VACCINATIONS, d),

  getDewormings: () => loadStoredData<DewormingRecord[]>(KEYS.DEWORMINGS, INITIAL_DEWORMINGS),
  saveDewormings: (d: DewormingRecord[]) => saveStoredData(KEYS.DEWORMINGS, d),

  getHealthRecords: () => loadStoredData<HealthRecord[]>(KEYS.HEALTH, INITIAL_HEALTH_RECORDS),
  saveHealthRecords: (d: HealthRecord[]) => saveStoredData(KEYS.HEALTH, d),

  getGrowthRecords: () => loadStoredData<GrowthAndProductionRecord[]>(KEYS.GROWTH, INITIAL_GROWTH_RECORDS),
  saveGrowthRecords: (d: GrowthAndProductionRecord[]) => saveStoredData(KEYS.GROWTH, d),

  getVets: () => loadStoredData<VetProfile[]>(KEYS.VETS, INITIAL_VET_PROFILES),
  saveVets: (d: VetProfile[]) => saveStoredData(KEYS.VETS, d),

  getConsultations: () => loadStoredData<VetConsultation[]>(KEYS.CONSULTATIONS, INITIAL_VET_CONSULTATIONS),
  saveConsultations: (d: VetConsultation[]) => saveStoredData(KEYS.CONSULTATIONS, d),

  getListings: () => loadStoredData<MarketplaceListing[]>(KEYS.MARKETPLACE, INITIAL_MARKETPLACE_LISTINGS),
  saveListings: (d: MarketplaceListing[]) => saveStoredData(KEYS.MARKETPLACE, d),

  getNotifications: () => loadStoredData<AppNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (d: AppNotification[]) => saveStoredData(KEYS.NOTIFICATIONS, d),

  getCurrentWeather: () => loadStoredData<WeatherData>(KEYS.WEATHER, INITIAL_WEATHER_DATA),
  saveCurrentWeather: (d: WeatherData) => saveStoredData(KEYS.WEATHER, d),

  getWeatherAlerts: () => loadStoredData<WeatherDiseaseAlert[]>(KEYS.ALERTS, INITIAL_WEATHER_ALERTS),
  saveWeatherAlerts: (d: WeatherDiseaseAlert[]) => saveStoredData(KEYS.ALERTS, d),

  getLanguage: (): LanguageCode => (localStorage.getItem(KEYS.LANGUAGE) as LanguageCode) || 'en',
  saveLanguage: (lang: LanguageCode) => localStorage.setItem(KEYS.LANGUAGE, lang),

  getRole: () => (localStorage.getItem(KEYS.ROLE) as 'farmer' | 'vet' | 'admin') || 'farmer',
  saveRole: (role: string) => localStorage.setItem(KEYS.ROLE, role),

  resetToDefaults: () => {
    localStorage.removeItem(KEYS.FARMER);
    localStorage.removeItem(KEYS.ANIMALS);
    localStorage.removeItem(KEYS.VACCINATIONS);
    localStorage.removeItem(KEYS.DEWORMINGS);
    localStorage.removeItem(KEYS.HEALTH);
    localStorage.removeItem(KEYS.GROWTH);
    localStorage.removeItem(KEYS.VETS);
    localStorage.removeItem(KEYS.CONSULTATIONS);
    localStorage.removeItem(KEYS.MARKETPLACE);
    localStorage.removeItem(KEYS.NOTIFICATIONS);
    localStorage.removeItem(KEYS.WEATHER);
    localStorage.removeItem(KEYS.ALERTS);
  },
};
