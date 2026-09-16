import { motion } from 'motion/react';
import { CornSeedTrait } from '../data/cornTraits';
import { Dna, Sparkles, ShieldCheck, Sprout, Droplets, Zap, X, ChevronRight } from 'lucide-react';
import { getTraitAtmosphere } from '../utils/traitAtmosphere';

interface GeneticTraitSidePanelProps {
  trait: CornSeedTrait | null;
  onClose: () => void;
}

// Styled after the Talos app's own MoveDirectory card language: a thin
// hairline frame, an inset "media" panel with bottom-anchored name and an
// extreme-tracking category subtitle flanked by divider lines, and a small
// pill status badge — rather than the previous dense, filled data-card look.
export function GeneticTraitSidePanel({ trait, onClose }: GeneticTraitSidePanelProps) {
  if (!trait) return null;

  const getCategoryIcon = (category: CornSeedTrait['category']) => {
    switch (category) {
      case 'Drought & Climate':
        return <Droplets className="w-10 h-10" />;
      case 'Statics':
        return <ShieldCheck className="w-10 h-10" />;
      case 'Nutrient Efficiency':
        return <Zap className="w-10 h-10" />;
      case 'Isometric':
        return <Sprout className="w-10 h-10" />;
      case 'Pull':
        return <Sparkles className="w-10 h-10" />;
      case 'Yield & Architecture':
      default:
        return <Dna className="w-10 h-10" />;
    }
  };

  const theme = getTraitAtmosphere(trait);

  const getStatusLabel = (category: CornSeedTrait['category']) => {
    switch (category) {
      case 'Isometric':
        return 'Available';
      case 'Statics':
        return 'Mastered';
      default:
        return 'Active Trait';
    }
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      x: 52,
      scale: 0.92,
      filter: 'blur(16px) brightness(1.4)',
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: 'blur(0px) brightness(1)',
      transition: {
        duration: 0.52,
        ease: [0.19, 1, 0.22, 1],
        staggerChildren: 0.05,
        delayChildren: 0.04,
      },
    },
    exit: {
      opacity: 0,
      x: 36,
      scale: 0.94,
      filter: 'blur(12px) brightness(0.85)',
      transition: {
        duration: 0.3,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="w-full max-w-[260px] sm:max-w-xs select-none">
      <motion.div
        key={`trait-card-${trait.id}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          boxShadow: `0 30px 60px -12px rgba(0, 0, 0, 0.95), 0 0 45px -5px ${theme.glow}`,
        }}
        className="w-full max-h-[85vh] overflow-y-auto overflow-x-hidden rounded-sm border border-white/10 bg-black/50 backdrop-blur-2xl text-left shadow-2xl relative"
      >
        {/* Cinematic Laser Sweep Line across the top rim */}
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '100%', opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${theme.scanColor} 50%, transparent 100%)`,
          }}
          className="absolute top-0 left-0 w-full h-[2px] pointer-events-none z-20"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Close card (Esc or reclick node)"
          aria-label="Close trait card"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Inset "media" panel — renders the trait's uploaded image when
            one is set (see the `image` field in src/data/cornTraits.ts);
            otherwise falls back to the ambient glow + category glyph
            placeholder, echoing the same inset-frame proportions Talos
            uses for its move photography. */}
        <motion.div variants={itemVariants} className="relative m-3 rounded-sm overflow-hidden aspect-[3/4]">
          {trait.image ? (
            <img
              src={trait.image}
              alt={trait.traitName}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: theme.blobGradient }} aria-hidden="true" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" aria-hidden="true" />

          {!trait.image && (
            <>
              {/* Decorative rotated geometric symbols, low opacity */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20" aria-hidden="true">
                <div className="w-28 h-28 border border-white/40 rotate-45" />
                <div className="absolute w-20 h-20 rounded-full border border-white/40" />
              </div>

              {/* Large category glyph */}
              <div className="absolute inset-0 flex items-center justify-center opacity-25" style={{ color: theme.accent }} aria-hidden="true">
                {getCategoryIcon(trait.category)}
              </div>
            </>
          )}

          {/* Status pill */}
          <span
            className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[8px] font-black tracking-[0.35em] uppercase"
            style={{ color: theme.accent }}
          >
            {getStatusLabel(trait.category)}
          </span>

          {/* Bottom-anchored name + category/chromosome subtitle */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
            <h3 className="font-display font-light text-base sm:text-lg tracking-[0.12em] uppercase text-white/95 drop-shadow-2xl leading-snug">
              {trait.traitName}
            </h3>
            <div className="mt-1 gap-3">
              <span className="h-px w-6 bg-white/20" />
              <span className="text-[6px] sm:text-[8px] font-black uppercase tracking-[0.2em] text-white/40 whitespace-nowrap">
                {trait.category} • {trait.chromosome}
              </span>
              <span className="h-px w-6 bg-white/20" />
            </div>
          </div>
        </motion.div>

        {/* Biological Description */}
        <motion.p variants={itemVariants} className="px-3.5 sm:px-4 mt-2 text-[11px] sm:text-xs text-white/50 font-light leading-relaxed">
          {trait.description}
        </motion.p>

        {/* Footer: Expression Level & Quick Hint */}
        <motion.div
          variants={itemVariants}
          className="mt-3 px-3.5 sm:px-4 py-2.5 border-t border-white/10 flex items-center justify-between text-[9px] text-white/40 font-mono"
        >
          <div className="flex items-center gap-1 text-[10px] text-white/80">
            <span>Reclick or Esc to deselect</span>
            <ChevronRight className="w-3 h-3 text-white/30" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
