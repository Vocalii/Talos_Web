import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PioneerLogo } from './PioneerLogo';
import { ConstellationCanvas } from './ConstellationCanvas';
import { NavDrawer } from './NavDrawer';
import { CookieModal } from './CookieModal';

interface SlideData {
  headline: string[];
  description: string;
}

const SLIDES: SlideData[] = [
  {
    headline: ['COMPUTERS', 'CUT DOWN THE', 'CONTENDERS.'],
    description:
      "Petabytes of data (that's one million GB each) feed into computers, running millions of simulations using proprietary algorithms for the most accurate predictions. Nearly 20x more candidates are in our pipeline compared with 10 years ago, far more than we could ever test in the field.",
  },
  {
    headline: ['PREDICTIVE', 'GENOMICS IN', 'ACTION.'],
    description:
      'By analyzing billions of genetic combinations before a single seedling is planted, our machine-learning models isolate high-yield vigor, drought tolerance, and disease resistance with unprecedented precision.',
  },
  {
    headline: ['ACCELERATING', 'FIELD-READY', 'VELOCITY.'],
    description:
      'What used to take an entire decade of physical crop trials now happens in virtual cycles in a matter of months. Farmers receive optimized, battle-tested hybrid varieties years ahead of traditional breeding cycles.',
  },
];

interface ContendersSectionProps {
  onScrollToHero?: () => void;
}

export function ContendersSection({ onScrollToHero }: ContendersSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  // Auto-advance or allow manual navigation
  const slide = SLIDES[currentSlide];

  // Optional keyboard navigation for slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section
      id="contenders-section"
      className="relative w-full h-screen min-h-[640px] bg-[#020d07] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Cinematic Deep Background Photo & Algorithmic Green Nebula */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/data-constellation.jpg"
          alt="Biotech Data Constellation"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-60 mix-blend-screen"
        />

        {/* Emerald and Forest Green Volumetric Fog Gradients */}
        <div
          className="absolute inset-0 bg-radial-[circle_at_60%_45%] from-emerald-950/40 via-[#03150c]/80 to-[#020b06]/95 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#020b06]/95 via-[#020b06]/75 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#020b06] via-transparent to-[#020b06]/70 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Interactive Canvas: Genetic Node Constellation & Point Cloud */}
      <ConstellationCanvas activeSlide={currentSlide} className="z-10" />

      {/* Top Header Bar */}
      <motion.header
        id="contenders-header"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-30 w-full px-6 sm:px-10 lg:px-12 py-6 md:py-8 flex items-center pointer-events-auto"
      >
        <div className="flex items-center gap-6 sm:gap-8">
          {/* Hamburger Menu Toggle */}
          <button
            id="contenders-hamburger-menu-toggle"
            onClick={() => setIsNavOpen(true)}
            className="group flex flex-col justify-center items-start gap-1.5 w-8 h-8 focus:outline-none cursor-pointer"
            aria-label="Open navigation menu"
          >
            <span className="w-7 h-[2px] bg-white transition-all duration-300 group-hover:w-8 group-hover:bg-emerald-400" />
            <span className="w-7 h-[2px] bg-white transition-all duration-300 group-hover:w-8 group-hover:bg-emerald-400" />
            <span className="w-7 h-[2px] bg-white transition-all duration-300 group-hover:w-8 group-hover:bg-emerald-400" />
          </button>

          {/* Pioneer Brand Logo */}
          <button
            onClick={onScrollToHero}
            className="focus:outline-none cursor-pointer hover:opacity-90 transition-opacity"
            aria-label="Pioneer Home"
          >
            <PioneerLogo />
          </button>
        </div>
      </motion.header>

      {/* Left-Aligned Headline and Description Content */}
      <main
        id="contenders-main-content"
        className="relative z-20 flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 max-w-7xl w-full mx-auto pointer-events-none"
      >
        <div className="max-w-2xl text-left pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Massive Bold Headline matching screenshot */}
              <h2
                id="contenders-title"
                className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] tracking-tight uppercase text-white leading-[0.92] drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)]"
              >
                {slide.headline.map((line, idx) => (
                  <span key={idx} className="block">
                    {line}
                  </span>
                ))}
              </h2>

              {/* Subtitle Description */}
              <p
                id="contenders-description"
                className="mt-6 sm:mt-8 md:mt-10 text-sm sm:text-base md:text-lg lg:text-[17px] font-normal text-zinc-200/90 leading-relaxed max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              >
                {slide.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Right-Edge Vertical Pagination Dots matching screenshot */}
      <div
        id="contenders-pagination"
        className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4 pointer-events-auto"
        aria-label="Story sections"
      >
        {SLIDES.map((_, index) => {
          const isActive = index === currentSlide;
          return (
            <button
              key={index}
              id={`pagination-dot-${index}`}
              onClick={() => setCurrentSlide(index)}
              className="relative flex items-center justify-center p-2 focus:outline-none cursor-pointer group"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive ? 'true' : 'false'}
            >
              {isActive ? (
                // Active slide: circled dot with outer thin ring as seen in screenshot
                <div className="relative flex items-center justify-center w-7 h-7">
                  {/* Outer circle with rotating arc effect */}
                  <motion.svg
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 w-full h-full text-white/80"
                    viewBox="0 0 28 28"
                  >
                    <circle
                      cx="14"
                      cy="14"
                      r="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeDasharray="60 15"
                      className="opacity-90"
                    />
                  </motion.svg>
                  {/* Central solid dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </div>
              ) : (
                // Inactive slide: small clean dot
                <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white/80 transition-all duration-200" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Footer Area with Cookie Preferences Pill matching screenshot */}
      <footer
        id="contenders-footer"
        className="relative z-30 w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between pointer-events-auto"
      >
        {/* Cookie Preferences Pill Button */}
        <button
          id="contenders-cookie-preferences-pill"
          onClick={() => setIsCookieModalOpen(true)}
          className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#071d15]/80 hover:bg-[#0c2e22]/90 border border-teal-500/30 hover:border-teal-400/50 backdrop-blur-md text-teal-200/90 hover:text-teal-100 transition-all duration-200 shadow-lg cursor-pointer"
          aria-label="Open Cookie Preferences"
        >
          <div className="w-3.5 h-3.5 rounded-full border border-teal-400/60 flex items-center justify-center p-0.5">
            <div className="w-full h-full bg-teal-300/80 rounded-full group-hover:scale-110 transition-transform" />
          </div>

          <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase font-body">
            COOKIE PREFERENCES
          </span>
        </button>
      </footer>

      {/* Slide-out Navigation Drawer */}
      <NavDrawer isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      {/* Interactive Cookie Preferences Modal */}
      <CookieModal isOpen={isCookieModalOpen} onClose={() => setIsCookieModalOpen(false)} />
    </section>
  );
}
