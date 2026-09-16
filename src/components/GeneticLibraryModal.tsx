import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Dna, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface GeneticLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GeneticLibraryModal({ isOpen, onClose }: GeneticLibraryModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="library-modal-title"
        >
          {/* Backdrop Click */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl bg-[#031109]/95 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 text-white shadow-[0_24px_70px_rgba(0,0,0,0.9)] overflow-hidden max-h-[90vh] flex flex-col pointer-events-auto"
          >
            {/* Background Ambient Radial Glow */}
            <div
              className="absolute -top-32 -right-32 w-80 h-80 rounded-full pointer-events-none opacity-30"
              style={{
                background: 'radial-gradient(circle, rgba(16,185,129,0.45) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />

            {/* Close Button */}
            <button
              id="close-genetic-library-modal-btn"
              onClick={onClose}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              aria-label="Close Genetic Library modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="pr-12">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-emerald-400">
                  Pioneer® Research & Development
                </span>
              </div>
              <h2
                id="library-modal-title"
                className="mt-2 font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-white leading-tight"
              >
                Pioneer® Genetic Library
              </h2>
              <p className="mt-2 text-sm text-zinc-300/90 leading-relaxed max-w-xl">
                Decades of germplasm breeding innovation and computational genomic mapping, powering unmatched hybrid yield architecture and field resilience.
              </p>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6 py-4 border-y border-white/10">
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80">
                  Data Points
                </div>
                <div className="font-display font-bold text-xl sm:text-2xl text-white mt-1">
                  10M+
                </div>
                <div className="text-[11px] text-zinc-400">Yield plots tested</div>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80">
                  Trait Stacks
                </div>
                <div className="font-display font-bold text-xl sm:text-2xl text-white mt-1">
                  4-Mode
                </div>
                <div className="text-[11px] text-zinc-400">Insect protection</div>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80">
                  Elite Inbreds
                </div>
                <div className="font-display font-bold text-xl sm:text-2xl text-white mt-1">
                  400+
                </div>
                <div className="text-[11px] text-zinc-400">Germplasm pool</div>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80">
                  Purity Rate
                </div>
                <div className="font-display font-bold text-xl sm:text-2xl text-white mt-1">
                  99.8%
                </div>
                <div className="text-[11px] text-zinc-400">Genomic validation</div>
              </div>
            </div>

            {/* Trait Architecture List */}
            <div className="space-y-3 overflow-y-auto pr-1">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                <Dna className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-white">
                    Predictive Genomic Selection
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    AI-assisted genome sequencing models evaluate billions of genetic trait permutations before field trials, selecting only the highest-yielding parent lines.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-white">
                    Optimized Root & Canopy Architecture
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    Enhanced nodal root anchoring and upright leaf angles maximize photosynthetic efficiency and standability through severe weather events.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-white">
                    Broad-Spectrum Pest Resistance
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    Coordinated multiple modes of action above and below the soilline protect against corn rootworm, earworm, and European corn borer.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                PIONEER® CERTIFIED TECHNOLOGY
              </span>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
