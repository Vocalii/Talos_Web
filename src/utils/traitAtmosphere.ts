import { CornSeedTrait } from '../data/cornTraits';

export interface TraitAtmosphere {
  accent: string;
  category: string;
  glow: string;
  badgeBg: string;
  metricBg: string;
  border: string;
  scanColor: string;
  // Dynamic background lighting values
  radialGlow: string;
  ambientWash: string;
  ambientBase: string;
  rimAccent: string;
  vignetteTint: string;
  blobGradient: string;
  ambientCanvasColor: string;
}

const DEFAULT_BLOB_GRADIENT =
  'radial-gradient(circle, rgba(245, 158, 11, 0.10) 0%, rgba(245, 158, 11, 0.04) 45%, transparent 75%)';

export const DEFAULT_TRAIT_ATMOSPHERE: TraitAtmosphere = {
  accent: '#a1a1aa',
  category: 'Default',
  glow: 'rgba(255, 255, 255, 0.2)',
  badgeBg: 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300 shadow-none',
  metricBg: 'bg-zinc-800/40 border-zinc-700/40 text-zinc-200',
  border: 'border-white/20',
  scanColor: 'rgba(255, 255, 255, 0.6)',
  radialGlow: 'transparent',
  ambientWash: 'transparent',
  ambientBase: 'transparent',
  rimAccent: 'transparent',
  vignetteTint: 'transparent',
  blobGradient: DEFAULT_BLOB_GRADIENT,
  ambientCanvasColor: 'transparent',
};

export function getTraitAtmosphere(trait: CornSeedTrait | null): TraitAtmosphere {
  if (!trait) return DEFAULT_TRAIT_ATMOSPHERE;

  switch (trait.category) {
    case 'Drought & Climate':
      return {
        accent: '#f59e0b',
        category: trait.category,
        glow: 'rgba(245, 158, 11, 0.35)',
        badgeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
        metricBg: 'bg-amber-400/15 border-amber-400/40 text-amber-200',
        border: 'border-amber-500/40',
        scanColor: 'rgba(245, 158, 11, 0.8)',
        radialGlow: 'rgba(245, 158, 11, 0.22)',
        ambientWash: 'rgba(217, 119, 6, 0.12)',
        ambientBase: 'rgba(180, 83, 9, 0.08)',
        rimAccent: 'rgba(251, 191, 36, 0.09)',
        vignetteTint: 'rgba(69, 26, 3, 0.40)',
        blobGradient:
          'radial-gradient(circle, rgba(245, 158, 11, 0.24) 0%, rgba(217, 119, 6, 0.10) 45%, transparent 75%)',
        ambientCanvasColor: 'rgba(245, 158, 11, 0.15)',
      };

    case 'Disease & Pest Defense':
      return {
        accent: '#10b981',
        category: trait.category,
        glow: 'rgba(16, 185, 129, 0.35)',
        badgeBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
        metricBg: 'bg-emerald-400/15 border-emerald-400/40 text-emerald-200',
        border: 'border-emerald-500/40',
        scanColor: 'rgba(16, 185, 129, 0.8)',
        radialGlow: 'rgba(16, 185, 129, 0.20)',
        ambientWash: 'rgba(5, 150, 105, 0.11)',
        ambientBase: 'rgba(6, 95, 70, 0.07)',
        rimAccent: 'rgba(52, 211, 153, 0.08)',
        vignetteTint: 'rgba(2, 44, 34, 0.40)',
        blobGradient:
          'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(5, 150, 105, 0.09) 45%, transparent 75%)',
        ambientCanvasColor: 'rgba(16, 185, 129, 0.14)',
      };

    case 'Nutrient Efficiency':
      return {
        accent: '#14b8a6',
        category: trait.category,
        glow: 'rgba(20, 184, 166, 0.35)',
        badgeBg: 'bg-teal-500/20 border-teal-500/40 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.2)]',
        metricBg: 'bg-teal-400/15 border-teal-400/40 text-teal-200',
        border: 'border-teal-500/40',
        scanColor: 'rgba(20, 184, 166, 0.8)',
        radialGlow: 'rgba(20, 184, 166, 0.22)',
        ambientWash: 'rgba(13, 148, 136, 0.12)',
        ambientBase: 'rgba(15, 118, 110, 0.08)',
        rimAccent: 'rgba(45, 212, 191, 0.09)',
        vignetteTint: 'rgba(4, 47, 46, 0.40)',
        blobGradient:
          'radial-gradient(circle, rgba(20, 184, 166, 0.24) 0%, rgba(13, 148, 136, 0.10) 45%, transparent 75%)',
        ambientCanvasColor: 'rgba(20, 184, 166, 0.15)',
      };

    case 'Kernel Quality':
      return {
        accent: '#a855f7',
        category: trait.category,
        glow: 'rgba(168, 85, 247, 0.35)',
        badgeBg: 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]',
        metricBg: 'bg-purple-400/15 border-purple-400/40 text-purple-200',
        border: 'border-purple-500/40',
        scanColor: 'rgba(168, 85, 247, 0.8)',
        radialGlow: 'rgba(168, 85, 247, 0.22)',
        ambientWash: 'rgba(147, 51, 234, 0.12)',
        ambientBase: 'rgba(107, 33, 168, 0.08)',
        rimAccent: 'rgba(192, 132, 252, 0.09)',
        vignetteTint: 'rgba(59, 7, 100, 0.40)',
        blobGradient:
          'radial-gradient(circle, rgba(168, 85, 247, 0.24) 0%, rgba(147, 51, 234, 0.10) 45%, transparent 75%)',
        ambientCanvasColor: 'rgba(168, 85, 247, 0.15)',
      };

    case 'Yield & Architecture':
      return {
        accent: '#ef4444',
        category: trait.category,
        glow: 'rgba(239, 68, 68, 0.35)',
        badgeBg: 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(239,68,68,0.2)]',
        metricBg: 'bg-rose-400/15 border-rose-400/40 text-rose-200',
        border: 'border-rose-500/40',
        scanColor: 'rgba(239, 68, 68, 0.8)',
        radialGlow: 'rgba(239, 68, 68, 0.20)',
        ambientWash: 'rgba(225, 29, 72, 0.11)',
        ambientBase: 'rgba(159, 18, 57, 0.07)',
        rimAccent: 'rgba(251, 113, 133, 0.08)',
        vignetteTint: 'rgba(76, 5, 25, 0.40)',
        blobGradient:
          'radial-gradient(circle, rgba(239, 68, 68, 0.22) 0%, rgba(225, 29, 72, 0.09) 45%, transparent 75%)',
        ambientCanvasColor: 'rgba(239, 68, 68, 0.14)',
      };

    case 'Germination & Vigor':
      return {
        accent: '#84cc16',
        category: trait.category,
        glow: 'rgba(132, 204, 22, 0.35)',
        badgeBg: 'bg-lime-500/20 border-lime-500/40 text-lime-300 shadow-[0_0_12px_rgba(132,204,22,0.2)]',
        metricBg: 'bg-lime-400/15 border-lime-400/40 text-lime-200',
        border: 'border-lime-500/40',
        scanColor: 'rgba(132, 204, 22, 0.8)',
        radialGlow: 'rgba(132, 204, 22, 0.20)',
        ambientWash: 'rgba(101, 163, 13, 0.11)',
        ambientBase: 'rgba(77, 124, 15, 0.07)',
        rimAccent: 'rgba(163, 230, 53, 0.08)',
        vignetteTint: 'rgba(26, 46, 5, 0.40)',
        blobGradient:
          'radial-gradient(circle, rgba(132, 204, 22, 0.22) 0%, rgba(101, 163, 13, 0.09) 45%, transparent 75%)',
        ambientCanvasColor: 'rgba(132, 204, 22, 0.14)',
      };

    default:
      return DEFAULT_TRAIT_ATMOSPHERE;
  }
}
