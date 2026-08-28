import { WeatherDiseaseAlert, WeatherData, SpeciesType } from '../types';

export interface WeatherCondition {
  tempC: number;
  humidity: number;
  rainMm: number;
  condition: string;
  locationName: string;
  windSpeedKmh: number;
  uvIndex?: number;
  forecastDay?: string;
}

/**
 * Generates rule-based disease and biometric stress warnings based on climate factors
 */
export function evaluateWeatherDiseaseRisk(weather: WeatherData | WeatherCondition): WeatherDiseaseAlert[] {
  const alerts: WeatherDiseaseAlert[] = [];
  const tempC = 'temperatureC' in weather ? weather.temperatureC : weather.tempC;
  const humidity = 'humidityPercent' in weather ? weather.humidityPercent : weather.humidity;
  const rainMm = 'rainfallMm' in weather ? weather.rainfallMm : weather.rainMm;

  // Temperature Humidity Index (THI) for Livestock Heat Stress
  // THI = 0.8 * tempC + (humidity/100) * (tempC - 14.4) + 46.4
  const thi = 0.8 * tempC + (humidity / 100) * (tempC - 14.4) + 46.4;

  if (thi >= 80 || (tempC >= 36 && humidity >= 60)) {
    alerts.push({
      id: 'alert-heat-stress',
      diseaseName: 'Bovine Heat Stress & Acute Dehydration Risk',
      riskLevel: thi >= 88 ? 'Critical' : 'High',
      warningReason: `Elevated Temperature-Humidity Index (${Math.round(thi)}) with high ambient heat (${tempC}°C) causing thermal discomfort and milk yield drops.`,
      description: 'Open-mouth panting, severe drop in feed intake, elevated heart rate, and reduction in daily milk production.',
      preventiveMeasures: [
        'Activate sprinklers/foggers and high-velocity circulation fans inside the barn.',
        'Provide shade nets (90% density) and clean cool drinking water with electrolytes.',
        'Shift concentrated feeding to cool dawn (5:00 AM) and evening hours.',
        'Add 80-100g sodium bicarbonate (baking soda) per cow to prevent rumen acidosis.',
      ],
      speciesAffected: ['Cattle', 'Buffalo', 'Goat', 'Sheep', 'Poultry'],
    });
  }

  if (rainMm >= 25 || (humidity >= 80 && rainMm > 10)) {
    alerts.push({
      id: 'alert-foot-rot',
      diseaseName: 'Foot Rot (Interdigital Pododermatitis)',
      riskLevel: 'High',
      warningReason: `Heavy precipitation (${rainMm} mm) and high floor moisture causing bacterial softening of interdigital hoof tissue.`,
      description: 'Severe sudden lameness, foul-smelling necrotic exudate between hoof claws, swelling, and fever.',
      preventiveMeasures: [
        'Apply dry lime powder dusting on shed walkways and stall floors.',
        'Set up a 5% copper sulphate (CuSO4) foot bath at shed entrance.',
        'Trim overgrown hooves and isolate severely lame animals for topical wound dressing.',
      ],
      speciesAffected: ['Cattle', 'Buffalo', 'Goat', 'Sheep'],
    });

    alerts.push({
      id: 'alert-mastitis',
      diseaseName: 'Subclinical & Clinical Mastitis Alert',
      riskLevel: 'Moderate',
      warningReason: `High humidity (${humidity}%) promotes environmental Streptococci and Coliform growth on wet bedding.`,
      description: 'Swollen, hot, red udder quarters with abnormal milk flakes, clots, or watery consistency.',
      preventiveMeasures: [
        'Practice mandatory pre- and post-milking teat dipping in 0.5% povidone-iodine.',
        'Keep cows standing for 30 minutes post-milking by providing fresh green fodder.',
        'Conduct California Mastitis Test (CMT) weekly to detect subclinical cases early.',
      ],
      speciesAffected: ['Cattle', 'Buffalo', 'Goat'],
    });
  }

  if (tempC < 18 || (tempC < 22 && humidity > 75)) {
    alerts.push({
      id: 'alert-pneumonia',
      diseaseName: 'Calf Pneumonia & Acute Respiratory Distress',
      riskLevel: tempC < 14 ? 'High' : 'Moderate',
      warningReason: `Chilly nocturnal drafts (${tempC}°C) causing severe immune suppression in young stock.`,
      description: 'Persistent coughing, rapid labored breathing, mucoid nasal discharge, and high fever.',
      preventiveMeasures: [
        'Install burlap/gunny bag curtains to block direct cold wind drafts while retaining roof ridge ventilation.',
        'Provide dry straw bedding (minimum 4-6 inches thickness) for young calves and goat kids.',
        'Offer lukewarm drinking water and administer oral herbal bronchodilator tonics.',
      ],
      speciesAffected: ['Cattle', 'Buffalo', 'Goat', 'Sheep', 'Pig'],
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: 'alert-preventive-deworming',
      diseaseName: 'Optimal Season for Preventive Parasite Control',
      riskLevel: 'Low',
      warningReason: 'Stable weather parameters provide an ideal window for herd deworming and booster immunizations.',
      description: 'Proactive parasite control ensures maximum feed conversion efficiency and healthy weight gain.',
      preventiveMeasures: [
        'Administer broad-spectrum dewormers (Albendazole / Fenbendazole) on an empty stomach.',
        'Ensure all cattle ear tags are registered for National Animal Disease Control Programme (NADCP) vaccines.',
      ],
      speciesAffected: ['Cattle', 'Buffalo', 'Goat', 'Sheep', 'Poultry'],
    });
  }

  return alerts;
}

export const evaluateDiseaseAlerts = evaluateWeatherDiseaseRisk;
