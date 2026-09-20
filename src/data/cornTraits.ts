export interface CornSeedTrait {
  id: number;
  traitName: string;
  category: 'Yield & Architecture' | 'Drought & Climate' | 'Statics' | 'Nutrient Efficiency' | 'Isometric' | 'Pull';
  geneLocus: string;
  chromosome: string;
  expressionLevel: string;
  keyMetric: string;
  benefit: string;
  description: string;
  accentColor: string;
  strand: 'Strand A (Yield Locus)' | 'Strand B (Resilience Locus)' | 'Central Nexus (Polygenic)';
  /** Path to the trait's card image (e.g. '/traits/kernel-quality.jpg').
   * Drop the file in the public/ folder and set the path here — it's what
   * renders in the trait card/tooltip's media panel. Leave empty to fall
   * back to the current ambient-glow + icon placeholder. */
  image?: string;
}

export const CORN_TRAITS_MAP: Record<number, CornSeedTrait> = {
  12: {
    id: 12,
    traitName: 'Back Lever',
    category: 'Isometric',
    geneLocus: 'Advanced',
    chromosome: 'Advanced',
    expressionLevel: 'Mesophyll Chloroplast',
    keyMetric: '+15.6% Solar Conversion',
    benefit: 'Accelerated Carbon Dioxide Assimilation',
    description: 'A powerful static hold that builds straight-arm pulling strength, shoulder stability, and full-body tension as you suspend your body horizontally beneath the bar.',
    accentColor: '#facc15',
    strand: 'Strand A (Yield Locus)',
    image: '/trait-back-lever.webp',
  },
  17: {
    id: 17,
    traitName: 'Handstand',
    category: 'Statics',
    geneLocus: 'ZmTPS2-TerpeneSynth',
    chromosome: 'Intermediate',
    expressionLevel: 'Glandular Trichomes',
    keyMetric: '-75% Spider Mite Feeding',
    benefit: 'Natural Chemical Pest Deterrent',
    description: 'A vertical balance hold that builds shoulder strength, core stability, and full-body control as you support your body upside down on your hands.',
    accentColor: '#2dd4bf',
    strand: 'Strand B (Resilience Locus)',
    image: '/trait-handstand.webp',
  },
  19: {
    id: 19,
    traitName: 'Muscle Up',
    category: 'Pull',
    geneLocus: 'Advanced',
    chromosome: 'Advanced',
    expressionLevel: 'Xylem Loading',
    keyMetric: '+38% Embryo Zinc Density',
    benefit: 'Biofortified Seedling Vigor',
    description: 'A explosive pull-to-press sequence that builds full-body explosiveness as you transition from hanging to supporting your body overhead.',
    accentColor: '#5eead4',
    strand: 'Strand B (Resilience Locus)',
    image: '/trait-mu.webp',
  },
};

export function getCornTrait(id: number): CornSeedTrait | null {
  return CORN_TRAITS_MAP[id] || null;
}
