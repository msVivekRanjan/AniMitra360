export type UserRole = 'farmer' | 'vet' | 'admin';

export type LanguageCode = 'en' | 'hi' | 'or' | 'bn' | 'pa' | 'te' | 'ta' | 'mr';

export type SpeciesType =
  | 'Cattle'
  | 'Buffalo'
  | 'Goat'
  | 'Sheep'
  | 'Poultry'
  | 'Horse'
  | 'Dog'
  | 'Cat'
  | 'Pig'
  | 'Camel';

export type ProductionStage =
  | 'Calf / Kid / Chick'
  | 'Heifer / Growing'
  | 'Lactating / Milking'
  | 'Dry / Resting'
  | 'Pregnant (Early/Mid)'
  | 'Pregnant (Late Stage)'
  | 'Layer (Egg-laying)'
  | 'Broiler (Meat)'
  | 'Adult Working / Breeding';

export interface FarmerProfile {
  id: string;
  name: string;
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
  village: string;
  district: string;
  state: string;
  primaryFarmingType?: string;
  farmType?: string;
  farmSizeAcres?: number;
  avatarUrl?: string;
  avatar?: string;
  preferredLanguage?: LanguageCode | string;
  kisanCreditCardNo?: string;
  joinedDate?: string;
  totalAnimalsCount?: number;
  gpsLocation?: {
    lat: number;
    lng: number;
    accuracy?: string;
  };
}

export interface Animal {
  id: string;
  animalTagId: string;
  name: string;
  species: SpeciesType;
  breed: string;
  gender: 'Male' | 'Female';
  dob: string;
  weightKg: number;
  productionStage: ProductionStage;
  imageUrl: string;
  notes: string;
  registrationDate: string;
  status: 'Healthy' | 'Under Treatment' | 'Vaccination Due' | 'Quarantined';
  isPregnant?: boolean;
  expectedDeliveryDate?: string;
  dailyMilkYieldLiters?: number;
  dailyEggCount?: number;
}

export interface VaccinationRecord {
  id: string;
  animalId: string;
  animalName: string;
  species: SpeciesType;
  vaccineName: string;
  diseaseTarget: string;
  dateGiven: string;
  batchNumber: string;
  nextDueDate: string;
  status: 'Completed' | 'Upcoming' | 'Overdue';
  administeredBy: string;
  costInr: number;
  notes?: string;
}

export interface DewormingRecord {
  id: string;
  animalId: string;
  animalName: string;
  species: SpeciesType;
  date: string;
  medicineName: string;
  dose: string;
  weightAtDosing: number;
  nextDueDate: string;
  administeredBy: string;
  notes?: string;
}

export interface HealthRecord {
  id: string;
  animalId: string;
  animalName: string;
  species: SpeciesType;
  date: string;
  diseaseDiagnosed: string;
  symptoms: string[];
  treatmentGiven: string;
  medicines: string[];
  vetNotes: string;
  vetName?: string;
  followUpDate?: string;
  images?: string[];
  status: 'Resolved' | 'Under Treatment' | 'Follow-up Required';
}

export interface GrowthAndProductionRecord {
  id: string;
  animalId: string;
  animalName: string;
  species?: SpeciesType;
  date: string;
  weightKg: number;
  milkYieldLiters?: number;
  milkFatPercentage?: number;
  milkSnfPercentage?: number;
  eggCount?: number;
  woolYieldKg?: number;
  feedIntakeKg?: number;
  notes?: string;
}

export interface RationPlan {
  species: SpeciesType;
  bodyWeightKg: number;
  stage: ProductionStage;
  dryMatterKg: number;
  crudeProteinGrams: number;
  totalDigestibleNutrientsKg: number;
  calciumGrams: number;
  phosphorusGrams: number;
  waterLitersPerDay: number;
  estimatedDailyCostInr: number;
  dailyFeedFormulation: {
    greenFodderKg: number;
    dryFodderKg: number;
    concentrateKg: number;
    mineralMixGrams: number;
    saltGrams: number;
  };
  feedingNotes: string[];
}

export interface NutritionRationPlan {
  species: SpeciesType;
  breed: string;
  weightKg: number;
  ageMonths: number;
  stage: ProductionStage;
  dailyGreenFodderKg: number;
  dailyDryFodderKg: number;
  dailyConcentrateKg: number;
  dailyMineralMixGrams: number;
  cleanWaterLiters: number;
  totalDryMatterKg: number;
  crudeProteinGrams: number;
  feedingSchedule: {
    time: string;
    item: string;
    portion: string;
  }[];
  tips: string[];
}

export interface WeatherData {
  location: string;
  temperatureC: number;
  humidityPercent: number;
  rainfallMm: number;
  windSpeedKmh: number;
  condition: string;
  forecastDate: string;
}

export interface WeatherDiseaseAlert {
  id: string;
  diseaseName: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Severe';
  description: string;
  speciesAffected: SpeciesType[];
  preventiveMeasures: string[];
  warningReason?: string;
  title?: string;
  weatherTrigger?: {
    tempC: number;
    humidity: number;
    rainMm: number;
    condition: string;
  };
  symptoms?: string[];
  prevention?: string[];
  suggestedActions?: string[];
  issuedDate?: string;
  source?: string;
}

export type WeatherAlert = WeatherDiseaseAlert;

export interface VetProfile {
  id: string;
  name: string;
  qualification?: string;
  specialization: string;
  experienceYears: number;
  clinicAddress?: string;
  phone?: string;
  rating: number;
  consultationFeeInr?: number;
  avatarUrl?: string;
  languages?: string[];
  isVerified?: boolean;
  title?: string;
  qualifications?: string;
  clinicName?: string;
  address?: string;
  district?: string;
  distanceKm?: number;
  contactNumber?: string;
  email?: string;
  totalReviews?: number;
  availableHours?: string;
  isOnline?: boolean;
  consultationFee?: number;
  avatar?: string;
  languagesSpoken?: string[];
}

export type VetDirectoryItem = VetProfile;

export interface ChatMessage {
  id: string;
  sender: 'farmer' | 'vet';
  text: string;
  timestamp: string;
  attachmentUrl?: string;
}

export interface VetConsultation {
  id: string;
  farmerId: string;
  farmerName: string;
  vetId: string;
  vetName: string;
  animalId: string;
  animalName: string;
  consultationType?: 'Video Call' | 'Physical Farm Visit' | 'Audio Call' | 'Chat' | 'Video' | 'Clinic Visit' | 'Emergency Farm Visit';
  scheduledDate?: string;
  scheduledTime: string;
  status: 'Confirmed' | 'Completed' | 'Pending' | 'Active' | 'Cancelled';
  reasonForVisit?: string;
  prescriptions?: string[];
  farmerMobile?: string;
  species?: SpeciesType;
  requestDate?: string;
  type?: 'Chat' | 'Video' | 'Clinic Visit' | 'Emergency Farm Visit';
  chiefComplaint?: string;
  symptoms?: string[];
  messages?: ChatMessage[];
  prescription?: {
    diagnosis: string;
    medicines: { name: string; dosage: string; duration: string }[];
    dietAdvice: string;
    nextReviewDate: string;
  };
}

export type Consultation = VetConsultation;

export type MarketplaceCategory =
  | 'Animals'
  | 'Fodder'
  | 'Feed & Supplements'
  | 'Equipment'
  | 'Veterinary Supplies'
  | 'Milk & Dairy'
  | 'Meat'
  | 'Eggs'
  | 'Wool'
  | 'Livestock / Animals'
  | 'Veterinary Medicines'
  | 'Feed & Fodder'
  | 'Farm Equipment & Supplies';

export interface MarketplaceListing {
  id: string;
  sellerId?: string;
  sellerName: string;
  sellerPhone: string;
  title: string;
  category: MarketplaceCategory;
  priceInr?: number;
  price?: number;
  unit: string;
  location: string;
  imageUrl: string;
  description: string;
  isVerifiedSeller?: boolean;
  postedDate: string;
  status: 'Active' | 'Sold' | 'Reserved';
  quantityAvailable?: string;
  sellerRole?: 'Farmer' | 'Feed Merchant' | 'Veterinary Dealer' | 'Cooperative';
  district?: string;
  isOrganic?: boolean;
  verifiedSeller?: boolean;
}

export type MarketplaceProduct = MarketplaceListing;

export interface LocalResource {
  id: string;
  name: string;
  category:
    | 'Medicine Shop'
    | 'Feed & Fodder Store'
    | 'Mineral Supplier'
    | 'Ayurvedic Products'
    | 'Veterinary Clinic'
    | 'AI & Breeding Center';
  distanceKm: number;
  address: string;
  district: string;
  contactNumber: string;
  openHours: string;
  rating: number;
  mapCoordinates: { lat: number; lng: number };
  featuredProducts: string[];
  verified: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'vaccine' | 'alert' | 'market' | 'info' | 'vaccination' | 'deworming' | 'disease_alert' | 'marketplace' | 'consultation' | 'system';
  date: string;
  isRead: boolean;
  linkTab?: string;
  priority?: 'normal' | 'high' | 'urgent';
}

export type NotificationItem = AppNotification;

export type EVMCategory =
  | 'Mastitis & Udder Care'
  | 'Wound & Maggot Healing'
  | 'Bloat & Indigestion'
  | 'Fever & Respiratory'
  | 'FMD & Lesions'
  | 'Diarrhea & Gut Health'
  | 'Parasite & Tick Control'
  | 'Fertility & Reproductive'
  | 'Immunity & General Health'
  | 'Post-Calving Care'
  | 'Joint Pain & Lameness';

export type FormulaMethod =
  | 'Topical Paste (Lep)'
  | 'Oral Bolus / Ladoo'
  | 'Drench / Decoction (Kadha)'
  | 'Herbal Oil / Wash'
  | 'Fumigation (Dhoopan)'
  | 'Dry Powder (Churna)';

export type SeasonType =
  | 'Monsoon (Varsha)'
  | 'Winter (Shishir / Hemant)'
  | 'Summer (Grishma)'
  | 'Post-Monsoon (Sharad)'
  | 'Spring (Vasant)';

export interface HerbalIngredient {
  item: string;
  quantity: string;
  hindiName?: string;
  botanicalName?: string;
  purpose?: string;
}

export interface EthnoVetRemedy {
  id: string;
  name: string;
  hindiName: string;
  odiaName?: string;
  category: EVMCategory;
  ailment: string;
  species: SpeciesType[];
  method: FormulaMethod;
  preparationTimeMinutes: number;
  ingredients: HerbalIngredient[];
  preparationSteps: string[];
  dosageAndAdministration: string;
  frequency: string;
  duration: string;
  scientificValidation: string;
  isNddbApproved: boolean;
  precautions: string[];
  whenToCallVet: string[];
  seasonalRelevance?: SeasonType | 'All Seasons';
  tags: string[];
}

export interface SeasonalLocationDiseaseAlert {
  id: string;
  district: string;
  state: string;
  agroClimaticZone: string;
  season: SeasonType;
  primaryRiskDisease: string;
  secondaryDiseases: string[];
  severity: 'Critical' | 'High' | 'Moderate' | 'Low';
  weatherTriggers: string;
  affectedSpecies: SpeciesType[];
  veterinaryAdvisory: string;
  ayurvedicPreventionTitle: string;
  ayurvedicRemedyId?: string;
  ayurvedicFormulation: {
    name: string;
    ingredients: string;
    preparation: string;
    administration: string;
  };
  vaccinationAdvisory: string;
}

export interface AyurvedicDailyTonic {
  id: string;
  title: string;
  hindiTitle: string;
  targetBenefit: string;
  recommendedFor: string;
  frequency: string;
  ingredients: string;
  preparation: string;
  benefits: string[];
}

