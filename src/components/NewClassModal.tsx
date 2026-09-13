import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Dna, Activity, CheckCircle2, ChevronRight, BarChart3, ShieldCheck, Sparkles } from 'lucide-react';

interface NewClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SeedContender {
  id: string;
  name: string;
  code: string;
  maturity: string;
  yieldAdvantage: string;
  standability: string;
  droughtScore: string;
  simulationsPassed: string;
  status: string;
  description: string;
  keyTraits: string[];
}

const ELITE_CONTENDERS: SeedContender[] = [
  {
    id: 'p0953',
    name: 'Pioneer® P0953AM™ Hybrid',
    code: 'GEN-IX-0953',
    maturity: '109 CRM',
    yieldAdvantage: '+14.6 Bu/Acre',
    standability: '9.8 / 10',
    droughtScore: '9.9 / 10',
    simulationsPassed: '4,820,000',
    status: 'Certified Commercial Class',
    description: 'Engineered for exceptional dryland resilience and late-season plant health. Dominates high-yield environments with outstanding stalk integrity.',
    keyTraits: ['Ultra-dense kernel fill', 'Optimum® AQUAmax® genomics', 'Leptosphaeria resistance'],
  },
  {
    id: 'p1197',
    name: 'Pioneer® P1197CHR™ Hybrid',
    code: 'GEN-IX-1197',
    maturity: '111 CRM',
    yieldAdvantage: '+16.2 Bu/Acre',
    standability: '9.9 / 10',
    droughtScore: '9.6 / 10',
    simulationsPassed: '5,140,000',
    status: 'Certified Commercial Class',
    description: 'The national yield champion standard. Validated through 5M+ computational stress tests before ground deployment.',
    keyTraits: ['Maximum light interception', 'Rapid drydown velocity', 'Superior test weight genetics'],
  },
  {
    id: 'p1366',
    name: 'Pioneer® P1366Q™ Hybrid',
    code: 'GEN-IX-1366',
    maturity: '113 CRM',
    yieldAdvantage: '+15.1 Bu/Acre',
    standability: '9.7 / 10',
    droughtScore: '9.8 / 10',
    simulationsPassed: '4,450,000',
    status: 'Certified Commercial Class',
    description: 'High-energy grain composition with integrated multi-pest resistance package and synchronized pollination genetics.',
    keyTraits: ['Qrome® trait protection', 'Enhanced nitrogen uptake', 'Deep taproot architecture'],
  },
];

export function NewClassModal({ isOpen, onClose }: NewClassModalProps) {
  const [selectedContender, setSelectedContender] = useState<SeedContender>(ELITE_CONTENDERS[0]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="new-class-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl"
        >
          {/* Backdrop dismiss */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          <motion.div
            id="new-class-modal-container"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl bg-[#06140e] border border-emerald-500/30 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden text-zinc-100 flex flex-col max-h-[90vh]"
          >
            {/* Top Atmospheric Gradient Banner */}
            <div className="relative px-6 sm:px-8 py-6 bg-gradient-to-r from-[#b85d19]/25 via-emerald-950/40 to-[#06140e] border-b border-emerald-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-widest text-amber-400 uppercase font-mono">
                      ELITE 0.01% CLASS
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Validated
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
                    The New Pioneer Seed Class
                  </h3>
                </div>
              </div>

              <button
                id="close-new-class-modal"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Two-Column Showcase */}
            <div className="p-6 sm:p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Contender Selection List */}
              <div className="lg:col-span-5 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Select Certified Contender
                </div>
                {ELITE_CONTENDERS.map((contender) => {
                  const isSelected = contender.id === selectedContender.id;
                  return (
                    <button
                      key={contender.id}
                      onClick={() => setSelectedContender(contender)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0b2419] border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/40'
                          : 'bg-[#040e0a]/70 border-emerald-900/30 hover:border-emerald-700/50 hover:bg-[#071912]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[11px] font-mono text-amber-400 font-semibold">{contender.code}</div>
                          <div className="font-display font-bold text-white text-base mt-0.5">{contender.name}</div>
                          <div className="text-xs text-zinc-400 mt-1">{contender.maturity} • {contender.yieldAdvantage}</div>
                        </div>
                        <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-zinc-600'}`} />
                      </div>
                    </button>
                  );
                })}

                {/* Screening Metric Box */}
                <div className="mt-4 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-zinc-300 text-xs leading-relaxed">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold mb-1">
                    <Award className="w-4 h-4" />
                    <span>Rigorous 0.01% Filter</span>
                  </div>
                  Out of 4,000,000+ candidates in virtual genomics pipelines, only 1 in 10,000 reaches this certified class.
                </div>
              </div>

              {/* Right Column: Deep Contender Telemetry & Traits */}
              <div className="lg:col-span-7 bg-[#040e0a]/90 border border-emerald-900/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-emerald-950 pb-4 mb-4">
                    <div>
                      <span className="text-xs font-mono text-emerald-400">{selectedContender.code}</span>
                      <h4 className="text-xl sm:text-2xl font-display font-black text-white">{selectedContender.name}</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-400/30">
                      {selectedContender.status}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                    {selectedContender.description}
                  </p>

                  {/* Telemetry Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-[#091b13] border border-emerald-900/40">
                      <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                        Yield Advantage
                      </div>
                      <div className="text-base sm:text-lg font-mono font-bold text-emerald-300 mt-1">
                        {selectedContender.yieldAdvantage}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#091b13] border border-emerald-900/40">
                      <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        Standability
                      </div>
                      <div className="text-base sm:text-lg font-mono font-bold text-amber-300 mt-1">
                        {selectedContender.standability}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#091b13] border border-emerald-900/40 col-span-2 sm:col-span-1">
                      <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-teal-400" />
                        Simulations
                      </div>
                      <div className="text-base sm:text-lg font-mono font-bold text-teal-300 mt-1">
                        {selectedContender.simulationsPassed}
                      </div>
                    </div>
                  </div>

                  {/* Key Traits List */}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                      <Dna className="w-3.5 h-3.5 text-emerald-400" />
                      Validated Genomic Traits
                    </div>
                    <div className="space-y-2">
                      {selectedContender.keyTraits.map((trait, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-200 bg-[#071911] px-3 py-2 rounded-lg border border-emerald-900/30"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>{trait}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-4 border-t border-emerald-950/80 flex items-center justify-between text-xs text-zinc-400">
                  <span>Pioneer Class Verification ID: #{selectedContender.id.toUpperCase()}</span>
                  <span className="text-emerald-400 font-medium">Ready for Commercial Planting</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
