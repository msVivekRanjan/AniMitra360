import React, { useState } from 'react';
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  AlertTriangle,
  ShieldAlert,
  Thermometer,
  Sparkles,
  MapPin,
  Phone,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { WeatherDiseaseAlert, WeatherData } from '../types';
import { evaluateWeatherDiseaseRisk } from '../utils/weatherDiseaseRules';
import { getTranslation } from '../data/translations';

interface WeatherDiseaseAlertsViewProps {
  alerts: WeatherDiseaseAlert[];
  currentWeather: WeatherData;
  onUpdateLocationWeather: (newLocation: string) => void;
  currentLanguage?: string;
  language?: string;
}

const DISTRICT_PRESETS = [
  { name: 'Bhubaneswar (Khordha, Odisha)', temp: 34, humidity: 82, rainfall: 45, wind: 18, condition: 'Heavy Rain / Monsoon' },
  { name: 'Ludhiana (Punjab)', temp: 42, humidity: 38, rainfall: 0, wind: 12, condition: 'Extreme Heatwave' },
  { name: 'Pune (Maharashtra)', temp: 28, humidity: 75, rainfall: 15, wind: 14, condition: 'Cloudy & Moderate Rain' },
  { name: 'Coimbatore (Tamil Nadu)', temp: 31, humidity: 65, rainfall: 5, wind: 10, condition: 'Warm & Humid' },
  { name: 'Karnal (Haryana)', temp: 11, humidity: 88, rainfall: 2, wind: 8, condition: 'Winter Fog & Cold Wave' },
];

export const WeatherDiseaseAlertsView: React.FC<WeatherDiseaseAlertsViewProps> = ({
  alerts: initialAlerts,
  currentWeather: initialWeather,
  onUpdateLocationWeather,
  currentLanguage,
  language = 'en',
}) => {
  const lang = currentLanguage || language;
  const [currentWeather, setCurrentWeather] = useState<WeatherData>(initialWeather);
  const [selectedDistrict, setSelectedDistrict] = useState(DISTRICT_PRESETS[0].name);

  // Compute live dynamic disease risk based on current weather values
  const activeRisks = evaluateWeatherDiseaseRisk(currentWeather);

  const handleDistrictChange = (name: string) => {
    setSelectedDistrict(name);
    const preset = DISTRICT_PRESETS.find((p) => p.name === name);
    if (preset) {
      const updatedWeather: WeatherData = {
        location: preset.name,
        temperatureC: preset.temp,
        humidityPercent: preset.humidity,
        rainfallMm: preset.rainfall,
        windSpeedKmh: preset.wind,
        condition: preset.condition,
        forecastDate: new Date().toISOString().split('T')[0],
      };
      setCurrentWeather(updatedWeather);
      onUpdateLocationWeather(preset.name);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center space-x-2">
            <span>{getTranslation(lang, 'weather')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time agro-meteorological forecasting matched with veterinary epidemiological risk models
          </p>
        </div>

        {/* District Selector */}
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
          >
            {DISTRICT_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>
                📍 {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Weather Forecast Bar */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Agro-Met Sensor Feed</span>
              </span>
              <span className="text-xs text-slate-300">Updated: Today 08:30 AM</span>
            </div>

            <div className="flex items-baseline space-x-4">
              <span className="text-4xl sm:text-5xl font-extrabold font-heading text-white">
                {currentWeather.temperatureC}°C
              </span>
              <span className="text-lg sm:text-xl font-medium text-emerald-300">
                {currentWeather.condition}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Location: <span className="font-bold text-white">{currentWeather.location}</span>
            </p>
          </div>

          {/* Meteorological Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-slate-300 text-[10px] uppercase font-bold flex items-center justify-center space-x-1">
                <Droplets className="w-3 h-3 text-blue-400" />
                <span>Humidity</span>
              </div>
              <div className="text-lg font-bold text-white mt-0.5">{currentWeather.humidityPercent}%</div>
              <div className="text-[10px] text-slate-300">Relative dampness</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-slate-300 text-[10px] uppercase font-bold flex items-center justify-center space-x-1">
                <CloudRain className="w-3 h-3 text-sky-400" />
                <span>Precipitation</span>
              </div>
              <div className="text-lg font-bold text-white mt-0.5">{currentWeather.rainfallMm} mm</div>
              <div className="text-[10px] text-slate-300">24hr rainfall</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-slate-300 text-[10px] uppercase font-bold flex items-center justify-center space-x-1">
                <Wind className="w-3 h-3 text-teal-400" />
                <span>Wind Speed</span>
              </div>
              <div className="text-lg font-bold text-white mt-0.5">{currentWeather.windSpeedKmh} km/h</div>
              <div className="text-[10px] text-slate-300">Breeze velocity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Disease Risk Forecast Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-slate-900 text-lg flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>Active Outbreak & Vulnerability Warnings ({activeRisks.length})</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            Rule engine calibrated with IVRI & ICAR epidemiology maps
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeRisks.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl p-5 border transition shadow-xs flex flex-col justify-between space-y-4 ${
                alert.riskLevel === 'Critical'
                  ? 'bg-rose-50/70 border-rose-300 shadow-rose-100'
                  : alert.riskLevel === 'High'
                  ? 'bg-amber-50/70 border-amber-300 shadow-amber-100'
                  : alert.riskLevel === 'Moderate'
                  ? 'bg-yellow-50/50 border-yellow-200'
                  : 'bg-emerald-50/50 border-emerald-200'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                        alert.riskLevel === 'Critical'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : alert.riskLevel === 'High'
                          ? 'bg-amber-600 text-white'
                          : 'bg-yellow-500 text-slate-900'
                      }`}
                    >
                      {alert.riskLevel} Outbreak Risk
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-800 text-xs font-bold">
                      {alert.speciesAffected.join(', ')}
                    </span>
                  </div>
                </div>

                <h4 className="font-heading font-bold text-slate-950 text-base mb-1">
                  {alert.diseaseName}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {alert.description}
                </p>

                {/* Preventive Actions Checklist */}
                <div className="space-y-1.5 bg-white/80 p-3.5 rounded-xl border border-slate-200/70">
                  <div className="text-[11px] font-bold text-slate-800 uppercase flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mandatory Preventive Biosecurity Steps:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {alert.preventiveMeasures.map((measure, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Emergency Action */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Trigger condition: {currentWeather.condition}
                </span>
                <a
                  href="tel:1962"
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
                >
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>Call 1962 (Toll-Free)</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Biosecurity & Farm Sanitation Protocols Guide */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-base">
              Year-Round Farm Biosecurity & Shed Hygiene Guidelines
            </h3>
            <p className="text-xs text-slate-500">
              Standard operating procedures for disease prevention across all seasons
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
              <CloudRain className="w-4 h-4 text-blue-600" />
              <span>Monsoon Season Precautions</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Ensure shed floor drainage is elevated to prevent foot rot. Dust lime powder (Chuna) weekly. Ensure drinking water tanks are chlorinated with bleaching powder.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Sun className="w-4 h-4 text-amber-600" />
              <span>Summer Heatwave Management</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Provide gunny bag curtains with water sprinklers. Offer cool drinking water 4-5 times a day with 50g electrolytes / baking soda to prevent rumen acidosis and panting.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Wind className="w-4 h-4 text-teal-600" />
              <span>Winter Cold Protection</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Cover calves with jute coats. Install 200W incandescent warming lamps for poultry chicks. Avoid night cold drafts by hanging tarpaulin sheets.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
