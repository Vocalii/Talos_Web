import { motion } from 'motion/react';
import { CornSeedTrait } from '../data/cornTraits';
import { Dna, Sparkles, ShieldCheck, Sprout, Droplets, Zap, Activity, X, ChevronRight, Cpu } from 'lucide-react';

interface GeneticTraitSidePanelProps {
  trait: CornSeedTrait | null;
  onClose: () => void;
}

export function GeneticTraitSidePanel({ trait, onClose }: GeneticTraitSidePanelProps) {
  if (!trait) return null;

  const getCategoryIcon = (category: CornSeedTrait['category']) => {
    switch (category) {
      case 'Drought & Climate':
        return <Droplets className="w-4 h-4 text-amber-300" />;
      case 'Disease & Pest Defense':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'Nutrient Efficiency':
        return <Zap className="w-4 h-4 text-teal-400" />;
      case 'Germination & Vigor':
        return <Sprout className="w-4 h-4 text-zinc-200" />;
      case 'Kernel Quality':
        return <Sparkles className="w-4 h-4 text-purple-300" />;
      case 'Yield & Architecture':
      default:
        return <Dna className="w-4 h-4 text-red-400" />;
    }
  };

  const getCategoryTheme = (category: CornSeedTrait['category']) => {
    switch (category) {
      case 'Drought & Climate':
        return {
          badgeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
          metricBg: 'bg-amber-400/15 border-amber-400/40 text-amber-200',
          glow: 'rgba(245, 158, 11, 0.35)',
          border: 'border-amber-500/40',
          accent: '#f59e0b',
          scanColor: 'rgba(245, 158, 11, 0.8)',
        };
      case 'Disease & Pest Defense':
        return {
          badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(34,197,94,0.2)]',
          metricBg: 'bg-emerald-400/15 border-emerald-400/40 text-emerald-200',
          glow: 'rgba(34, 197, 94, 0.35)',
          border: 'border-emerald-500/40',
          accent: '#22c55e',
          scanColor: 'rgba(34, 197, 94, 0.8)',
        };
      case 'Nutrient Efficiency':
        return {
          badgeBg: 'bg-teal-500/20 border-teal-500/40 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.2)]',
          metricBg: 'bg-teal-400/15 border-teal-400/40 text-teal-200',
          glow: 'rgba(20, 184, 166, 0.35)',
          border: 'border-teal-500/40',
          accent: '#14b8a6',
          scanColor: 'rgba(20, 184, 166, 0.8)',
        };
      case 'Kernel Quality':
        return {
          badgeBg: 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]',
          metricBg: 'bg-purple-400/15 border-purple-400/40 text-purple-200',
          glow: 'rgba(168, 85, 247, 0.35)',
          border: 'border-purple-500/40',
          accent: '#a855f7',
          scanColor: 'rgba(168, 85, 247, 0.8)',
        };
      case 'Germination & Vigor':
      case 'Yield & Architecture':
      default:
        return {
          badgeBg: 'bg-red-500/20 border-red-500/40 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.2)]',
          metricBg: 'bg-red-400/15 border-red-400/40 text-red-200',
          glow: 'rgba(239, 68, 68, 0.35)',
          border: 'border-red-500/40',
          accent: '#ef4444',
          scanColor: 'rgba(239, 68, 68, 0.8)',
        };
    }
  };

  const theme = getCategoryTheme(trait.category);

  // Stagger container variants for dramatic phase-in
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
    <div className="w-full max-w-lg select-none">
      <motion.div
        key={`trait-card-${trait.id}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          boxShadow: `0 30px 60px -12px rgba(0, 0, 0, 0.95), 0 0 45px -5px ${theme.glow}`,
        }}
        className={`w-full rounded-2xl backdrop-blur-2xl bg-[#0a0a0a]/92 border ${theme.border} p-6 sm:p-7 text-left shadow-2xl relative overflow-hidden`}
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

        {/* Ambient background bloom */}
        <div
          className="absolute -top-24 -right-24 w-52 h-52 rounded-full blur-3xl pointer-events-none opacity-40 transition-all duration-700"
          style={{ background: theme.accent }}
          aria-hidden="true"
        />

        {/* Header: Category Badge, Chromosome, and Close button */}
        <motion.div variants={itemVariants} className="flex items-center justify-between gap-3 mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${theme.badgeBg}`}
            >
              {getCategoryIcon(trait.category)}
              <span>{trait.category}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-black/60 border border-white/10 px-2.5 py-1 rounded-md shadow-inner">
              <Activity className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>{trait.chromosome}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close card (Esc or reclick node)"
              aria-label="Close trait card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Trait Title */}
        <motion.h3
          variants={itemVariants}
          className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-2 relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          {trait.traitName}
        </motion.h3>

        {/* Gene Locus Tag and Strand Information */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2.5 mb-4 relative z-10">
          <span className="text-xs font-mono text-zinc-200 font-semibold bg-zinc-950/80 border border-white/35 px-2.5 py-0.5 rounded shadow-sm">
            LOCUS: {trait.geneLocus}
          </span>
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-white/5">
            <Cpu className="w-3 h-3 text-white/80" />
            {trait.strand}
          </span>
        </motion.div>

        {/* Key Metric Highlight Card */}
        <motion.div
          variants={itemVariants}
          className={`flex items-center justify-between px-4 py-3 rounded-xl border ${theme.metricBg} bg-black/50 mb-4 relative z-10 backdrop-blur-md shadow-inner`}
        >
          <span className="text-sm font-medium text-slate-100">
            {trait.benefit}
          </span>
          <span className="text-sm font-bold font-mono tracking-tight text-white ml-3 whitespace-nowrap bg-zinc-950/90 px-2.5 py-1 rounded-lg border border-white/35 shadow-inner">
            {trait.keyMetric}
          </span>
        </motion.div>

        {/* Biological Description */}
        <motion.p variants={itemVariants} className="text-sm text-slate-300 leading-relaxed mb-5 relative z-10">
          {trait.description}
        </motion.p>

        {/* Footer: Expression Level & Quick Hint */}
        <motion.div
          variants={itemVariants}
          className="pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono relative z-10"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">EXPRESSION:</span>
            <span className="text-zinc-200 font-semibold">{trait.expressionLevel}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>Reclick or Esc to deselect</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
