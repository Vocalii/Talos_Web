import { motion, MotionValue } from 'motion/react';

interface PlaceholderSectionProps {
  contentY?: MotionValue<string>;
  contentOpacity?: MotionValue<number>;
}

export function PlaceholderSection({ contentY, contentOpacity }: PlaceholderSectionProps) {
  return (
    <div
      id="placeholder-section-container"
      className="relative w-full h-full min-h-screen overflow-hidden select-none flex items-center justify-center bg-gradient-to-b from-[#0a0e12] to-[#02040a]"
    >
      <motion.div
        style={{
          y: contentY || 0,
          opacity: contentOpacity || 1,
        }}
        className="relative z-10 max-w-3xl w-full mx-auto px-6 sm:px-12 lg:px-16 text-center"
      >
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
          Coming Soon
        </span>
        <h2
          id="placeholder-section-headline"
          className="mt-4 font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight uppercase text-white leading-[0.95] drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)]"
        >
          More To Come.
        </h2>
        <p className="mt-5 text-sm sm:text-base md:text-lg font-normal text-zinc-300/80 leading-relaxed max-w-xl mx-auto">
          This section is a placeholder for what comes next — the transition mechanics are wired up,
          the content will follow.
        </p>
      </motion.div>
    </div>
  );
}
