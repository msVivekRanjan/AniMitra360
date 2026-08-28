import { SpeciesType, ProductionStage, RationPlan, NutritionRationPlan } from '../types';

export interface RationCalculationParams {
  species: SpeciesType;
  bodyWeightKg: number;
  stage: ProductionStage;
  milkYieldLiters?: number;
  fatPercentage?: number;
  eggCount?: number;
}

/**
 * Science-based ICAR/NRC livestock and poultry nutrition calculation engine
 */
export function calculateRationPlan(params: RationCalculationParams): RationPlan {
  const { species, bodyWeightKg, stage, milkYieldLiters = 0, fatPercentage = 4.2, eggCount = 0 } = params;
  const safeWeight = Math.max(1, bodyWeightKg);

  let dryMatterKg = 0;
  let crudeProteinGrams = 0;
  let totalDigestibleNutrientsKg = 0;
  let calciumGrams = 0;
  let phosphorusGrams = 0;
  let waterLitersPerDay = 0;
  let estimatedDailyCostInr = 0;

  let greenFodderKg = 0;
  let dryFodderKg = 0;
  let concentrateKg = 0;
  let mineralMixGrams = 0;
  let saltGrams = 30;

  const feedingNotes: string[] = [];

  switch (species) {
    case 'Cattle':
    case 'Buffalo': {
      const isBuffalo = species === 'Buffalo';
      const dmRate = isBuffalo ? 0.03 : 0.028;
      dryMatterKg = Math.round(safeWeight * dmRate * 10) / 10;

      // Base maintenance concentrate
      let baseConc = safeWeight * 0.0035; // ~1.4 - 1.8 kg for 400-500kg cow

      // Production addition (1 kg concentrate per 2.5 - 3 liters of milk)
      if (stage.includes('Lactating') || milkYieldLiters > 0) {
        const yieldBonus = (milkYieldLiters || 8) * (isBuffalo ? 0.45 : 0.38);
        baseConc += yieldBonus;
        feedingNotes.push('Provide high energy bypass fat during peak lactation to maintain milk fat % and body condition.');
      }

      if (stage.includes('Pregnant')) {
        baseConc += 1.5; // pregnancy allowance
        feedingNotes.push('In last trimester, steam up with extra 1.5kg concentrate and bypass protein for robust calf weight.');
      }

      concentrateKg = Math.round(baseConc * 10) / 10;
      greenFodderKg = Math.round((safeWeight * 0.05 + (milkYieldLiters > 10 ? 5 : 0)) * 10) / 10; // 20-30 kg
      dryFodderKg = Math.round(safeWeight * 0.012 * 10) / 10; // 4-6 kg
      mineralMixGrams = Math.round(safeWeight * 0.12); // ~50g - 80g
      saltGrams = 35;
      waterLitersPerDay = Math.round(safeWeight * 0.1 + (milkYieldLiters || 0) * 3.2); // 50-90 Liters
      crudeProteinGrams = Math.round(concentrateKg * 180 + greenFodderKg * 18 + dryFodderKg * 25);
      totalDigestibleNutrientsKg = Math.round((concentrateKg * 0.72 + greenFodderKg * 0.12 + dryFodderKg * 0.45) * 10) / 10;
      calciumGrams = Math.round(30 + (milkYieldLiters || 0) * 3);
      phosphorusGrams = Math.round(20 + (milkYieldLiters || 0) * 2);

      // Estimated feed cost in INR (Green ₹2/kg, Dry ₹5/kg, Concentrate ₹24/kg, Mineral mix ₹0.1/g)
      estimatedDailyCostInr = Math.round(
        greenFodderKg * 2.2 + dryFodderKg * 5.5 + concentrateKg * 24 + mineralMixGrams * 0.12 + 2
      );

      feedingNotes.push('Chop green and dry fodder in a 3:1 ratio (TMR - Total Mixed Ration) to prevent selective feeding.');
      feedingNotes.push('Always keep clean, ad-libitum fresh drinking water available within 15 meters of feeding stall.');
      feedingNotes.push('Add 35g of common salt daily to stimulate salivation and maintain rumen buffer balance.');
      break;
    }

    case 'Goat':
    case 'Sheep': {
      dryMatterKg = Math.round(safeWeight * 0.035 * 10) / 10;
      greenFodderKg = Math.round(safeWeight * 0.08 * 10) / 10; // 3-4 kg
      dryFodderKg = Math.round(safeWeight * 0.018 * 10) / 10; // 0.8-1.2 kg
      concentrateKg = stage.includes('Lactating') || stage.includes('Pregnant') ? 0.45 : 0.25;
      mineralMixGrams = 15;
      saltGrams = 10;
      waterLitersPerDay = Math.round(safeWeight * 0.12 * 10) / 10; // 4-7 liters
      crudeProteinGrams = Math.round(concentrateKg * 160 + greenFodderKg * 15);
      totalDigestibleNutrientsKg = Math.round((concentrateKg * 0.7 + greenFodderKg * 0.12 + dryFodderKg * 0.45) * 10) / 10;
      calciumGrams = 8;
      phosphorusGrams = 5;
      estimatedDailyCostInr = Math.round(greenFodderKg * 2 + dryFodderKg * 5 + concentrateKg * 24 + 2);

      feedingNotes.push('Browse tree loppings like Subabul, Neem, and Mulberry for natural anthelmintic (anti-worm) properties.');
      feedingNotes.push('Provide mineral salt licks in the goat shed to prevent mineral deficiency.');
      break;
    }

    case 'Poultry': {
      const isLayer = stage.includes('Layer') || eggCount > 0;
      const isChick = stage.includes('Chick');
      concentrateKg = isChick ? 0.04 : isLayer ? 0.115 : 0.14; // kg (115g per bird)
      greenFodderKg = 0.03;
      dryFodderKg = 0.0;
      mineralMixGrams = isLayer ? 8 : 4;
      saltGrams = 1;
      waterLitersPerDay = isLayer ? 0.28 : 0.2;
      dryMatterKg = concentrateKg;
      crudeProteinGrams = Math.round(concentrateKg * (isChick ? 220 : 180));
      totalDigestibleNutrientsKg = Math.round(concentrateKg * 0.78 * 100) / 100;
      calciumGrams = isLayer ? 4 : 1;
      phosphorusGrams = 1;
      estimatedDailyCostInr = Math.round(concentrateKg * 32 * 10) / 10;

      feedingNotes.push('For layers, supplement with limestone grit or oyster shell powder in the evening for solid eggshells.');
      feedingNotes.push('Maintain clean nipple/bell drinkers sanitized with chlorine water (1-2 ppm).');
      break;
    }

    case 'Horse': {
      dryMatterKg = Math.round(safeWeight * 0.025 * 10) / 10;
      greenFodderKg = Math.round(safeWeight * 0.04 * 10) / 10;
      dryFodderKg = Math.round(safeWeight * 0.015 * 10) / 10;
      concentrateKg = Math.round(safeWeight * 0.008 * 10) / 10;
      mineralMixGrams = 50;
      saltGrams = 25;
      waterLitersPerDay = Math.round(safeWeight * 0.09);
      crudeProteinGrams = Math.round(concentrateKg * 140 + greenFodderKg * 20);
      totalDigestibleNutrientsKg = Math.round((concentrateKg * 0.72 + greenFodderKg * 0.12 + dryFodderKg * 0.45) * 10) / 10;
      calciumGrams = 25;
      phosphorusGrams = 18;
      estimatedDailyCostInr = Math.round(greenFodderKg * 2.5 + dryFodderKg * 6 + concentrateKg * 28 + 5);

      feedingNotes.push('Feed concentrate in small multiple meals (at least 3 times daily) to prevent colic.');
      feedingNotes.push('Never feed mouldy hay or sudden high-starch grain meals.');
      break;
    }

    default: {
      dryMatterKg = Math.round(safeWeight * 0.03 * 10) / 10;
      greenFodderKg = Math.round(safeWeight * 0.05 * 10) / 10;
      dryFodderKg = Math.round(safeWeight * 0.015 * 10) / 10;
      concentrateKg = Math.round(safeWeight * 0.005 * 10) / 10;
      mineralMixGrams = 25;
      saltGrams = 15;
      waterLitersPerDay = Math.round(safeWeight * 0.08);
      crudeProteinGrams = Math.round(concentrateKg * 160);
      totalDigestibleNutrientsKg = Math.round(dryMatterKg * 0.6 * 10) / 10;
      calciumGrams = 15;
      phosphorusGrams = 10;
      estimatedDailyCostInr = Math.round(greenFodderKg * 2 + dryFodderKg * 5 + concentrateKg * 24 + 3);
      feedingNotes.push('Maintain balanced forage to concentrate ratio to sustain digestive microbiome equilibrium.');
      break;
    }
  }

  return {
    species,
    bodyWeightKg: safeWeight,
    stage,
    dryMatterKg,
    crudeProteinGrams,
    totalDigestibleNutrientsKg,
    calciumGrams,
    phosphorusGrams,
    waterLitersPerDay,
    estimatedDailyCostInr,
    dailyFeedFormulation: {
      greenFodderKg,
      dryFodderKg,
      concentrateKg,
      mineralMixGrams,
      saltGrams,
    },
    feedingNotes,
  };
}

export function calculateRation(
  species: SpeciesType,
  breed: string,
  weightKg: number,
  ageMonths: number,
  stage: ProductionStage,
  milkYieldLiters: number = 0
): NutritionRationPlan {
  const result = calculateRationPlan({
    species,
    bodyWeightKg: weightKg,
    stage,
    milkYieldLiters,
  });

  return {
    species,
    breed,
    weightKg,
    ageMonths,
    stage,
    dailyGreenFodderKg: result.dailyFeedFormulation.greenFodderKg,
    dailyDryFodderKg: result.dailyFeedFormulation.dryFodderKg,
    dailyConcentrateKg: result.dailyFeedFormulation.concentrateKg,
    dailyMineralMixGrams: result.dailyFeedFormulation.mineralMixGrams,
    cleanWaterLiters: result.waterLitersPerDay,
    totalDryMatterKg: result.dryMatterKg,
    crudeProteinGrams: result.crudeProteinGrams,
    feedingSchedule: [
      {
        time: '06:00 AM',
        item: 'Morning Concentrate & Mineral Mix',
        portion: `${(result.dailyFeedFormulation.concentrateKg * 0.5).toFixed(1)} kg + ${Math.round(result.dailyFeedFormulation.mineralMixGrams * 0.5)}g ASMM`,
      },
      {
        time: '08:30 AM',
        item: 'Fresh Chopped Green Fodder',
        portion: `${(result.dailyFeedFormulation.greenFodderKg * 0.6).toFixed(1)} kg freshly cut Napier/Berseem`,
      },
      {
        time: '01:30 PM',
        item: 'Dry Roughage (Wheat Straw / Bhusa) + Water',
        portion: `${(result.dailyFeedFormulation.dryFodderKg * 0.5).toFixed(1)} kg straw + ad-libitum water`,
      },
      {
        time: '05:30 PM',
        item: 'Evening Concentrate & Green Fodder',
        portion: `${(result.dailyFeedFormulation.concentrateKg * 0.5).toFixed(1)} kg concentrate + ${(result.dailyFeedFormulation.greenFodderKg * 0.4).toFixed(1)} kg greens`,
      },
    ],
    tips: result.feedingNotes,
  };
}
