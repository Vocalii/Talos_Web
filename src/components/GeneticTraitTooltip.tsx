import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
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
// pill status badge — tilting smoothly to face the cursor wherever it moves on screen.
export function GeneticTraitSidePanel({ trait, onClose }: GeneticTraitSidePanelProps) {
  if (!trait) return null;

  const cardRef = useRef<HTMLDivElement>(null);

  // Normalized offset from card center to cursor (-1 to 1)
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);

  // Smooth, dampened spring physics for fluid screen tracking
  const springX = useSpring(targetX, { stiffness: 140, damping: 20, mass: 0.6 });
  const springY = useSpring(targetY, { stiffness: 140, damping: 20, mass: 0.6 });

  // Tilt towards cursor:
  // When cursor is to the left (targetX < 0), rotateY > 0 so card faces left toward the cursor
  // When cursor is to the right (targetX > 0), rotateY < 0 so card faces right toward the cursor
  // When cursor is above (targetY < 0), rotateX < 0 so card faces up toward the cursor
  // When cursor is below (targetY > 0), rotateX > 0 so card faces down toward the cursor
  const rotateY = useTransform(springX, [-1, 1], ['12deg', '-12deg']);
  const rotateX = useTransform(springY, [-1, 1], ['-8deg', '8deg']);

  const theme = getTraitAtmosphere(trait);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      // Distance from card center normalized by half the viewport dimensions
      const halfW = window.innerWidth / 2 || 1;
      const halfH = window.innerHeight / 2 || 1;

      const normX = Math.max(-1, Math.min(1, (e.clientX - cardCenterX) / halfW));
      const normY = Math.max(-1, Math.min(1, (e.clientY - cardCenterY) / halfH));

      targetX.set(normX);
      targetY.set(normY);
    };

    const handlePointerLeave = () => {
      targetX.set(0);
      targetY.set(0);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', handlePointerLeave);
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', handlePointerLeave);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [targetX, targetY]);

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
    <div
      className="w-full max-w-[260px] sm:max-w-xs select-none"
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={cardRef}
        key={`trait-card-${trait.id}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          rotateX,
          rotateY,
          boxShadow: `0 30px 60px -12px rgba(0, 0, 0, 0.95), 0 0 45px -5px ${theme.glow}`,
          transformStyle: 'preserve-3d',
        }}
        className="w-full max-h-[85vh] overflow-y-auto overflow-x-hidden rounded-sm border border-white/10 bg-black/60 backdrop-blur-2xl text-left shadow-2xl relative"
      >
        {/* Cinematic Laser Sweep Line across the top rim on entry */}
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
          className="absolute top-4 right-4 z-40 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Close card (Esc or reclick node)"
          aria-label="Close trait card"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Inset "media" panel — renders the trait's uploaded image with 3D elevation */}
        <motion.div
          variants={itemVariants}
          className="relative m-3 rounded-sm overflow-hidden aspect-[3/4] shadow-lg border border-white/5"
        >
          {trait.image ? (
            <img
              src={trait.image}
              alt={trait.traitName}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: theme.blobGradient }} aria-hidden="true" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/75" aria-hidden="true" />

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
            style={{ color: theme.accent }}
            className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[8px] font-black tracking-[0.35em] uppercase shadow-md"
          >
            {getStatusLabel(trait.category)}
          </span>

          {/* Bottom-anchored name + category/chromosome subtitle */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
            <h3 className="font-display font-light text-base sm:text-lg tracking-[0.12em] uppercase text-white/95 drop-shadow-2xl leading-snug">
              {trait.traitName}
            </h3>
            <div className="mt-1 flex items-center gap-2.5">
              <span className="h-px w-5 bg-white/20" />
              <span className="text-[6px] sm:text-[8px] font-black uppercase tracking-[0.2em] text-white/45 whitespace-nowrap">
                {trait.category} • {trait.chromosome}
              </span>
              <span className="h-px w-5 bg-white/20" />
            </div>
          </div>
        </motion.div>

        {/* Biological Description */}
        <motion.p
          variants={itemVariants}
          className="px-3.5 sm:px-4 mt-2 text-[11px] sm:text-xs text-white/50 font-light leading-relaxed"
        >
          {trait.description}
        </motion.p>

        {/* Footer: Quick Hint */}
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

