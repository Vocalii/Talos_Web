import { useState } from 'react';
import { motion, MotionValue, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { ParticleField } from './ParticleField';

interface PlaceholderSection2Props {
  contentY?: MotionValue<string>;
  contentOpacity?: MotionValue<number>;
}

export function PlaceholderSection2({ contentY, contentOpacity }: PlaceholderSection2Props) {
  const [isNotified, setIsNotified] = useState(false);

  const handleNotify = () => {
    setIsNotified(true);
    setTimeout(() => {
      setIsNotified(false);
    }, 3000);
  };

  return (
    <div
      id="placeholder-section-2-container"
      className="relative w-full h-full min-h-screen overflow-hidden select-none flex flex-col items-center justify-center text-center px-6"
    >
      {/* Background Image + lighter scrim, matching the same photo +
          gradient scrim atmosphere technique used elsewhere on the site */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/download-bg.png"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-[#050505]/90" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 75% at 50% 45%, transparent 0%, rgba(5,5,5,0.25) 55%, rgba(5,5,5,0.85) 100%)',
          }}
        />
      </div>

      {/* Same interactive particle field used in the Hero section */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <ParticleField />
      </div>

      <motion.div
        style={{
          y: contentY || 0,
          opacity: contentOpacity || 1,
        }}
        className="relative z-10 max-w-4xl w-full mx-auto flex flex-col items-center"
      >
        {/* Main Headline matching picture */}
        <h2
          id="download-app-headline"
          className="font-display font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase text-white leading-[1.1] drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] select-none text-center"
        >
          Download the app
          <br />
          to get started
        </h2>

        {/* Get Early Access — bold, solid, and prominent, deliberately
            distinct from the small glass pill CTA in the header: solid
            white fill for maximum contrast against the dark background,
            with an emerald glow bloom on hover instead of a subtle
            glass treatment. */}
        <button
          id="btn-get-early-access"
          onClick={handleNotify}
          className="glass group relative mt-10 sm:mt-12 px-10 sm:px-14 py-4 sm:py-5 rounded-full border border-white/25 hover:border-emerald-400/50 cursor-pointer active:scale-95 transition-all duration-300 hover:scale-[1.03] shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
          aria-label="Get early access"
        >
          {/* Ambient emerald glow bloom, more pronounced than the header's
              button so this reads as the primary CTA */}
          <span
            className="absolute -inset-5 rounded-full pointer-events-none opacity-40 group-hover:opacity-100 blur-xl transition-opacity duration-500"
            style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.45) 0%, transparent 70%)' }}
            aria-hidden="true"
          />

          {/* Hover brightening wash on the glass surface itself */}
          <span
            className="absolute inset-0 rounded-full pointer-events-none bg-white/0 group-hover:bg-white/[0.06] transition-colors duration-300"
            aria-hidden="true"
          />

          <span className="relative font-display font-medium text-sm sm:text-base tracking-[0.14em] uppercase text-white">
            Get Early Access
          </span>
        </button>

        {/* Toast notification feedback on button click */}
        <AnimatePresence>
          {isNotified && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium shadow-lg shadow-black/40"
            >
              <Check className="w-3.5 h-3.5 text-zinc-200" />
              <span>You're on the list — we'll be in touch soon!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
