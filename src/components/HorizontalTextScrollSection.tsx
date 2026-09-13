import { useRef, useEffect, useState } from 'react';
import { motion, MotionValue, useTransform, useSpring } from 'motion/react';
import { ArrowRight, Sparkles, Shield, Cpu, Zap, TrendingUp, Award } from 'lucide-react';

interface TextSlide {
  id: string;
  tag: string;
  headline: string;
  subtext: string;
  metric?: string;
  metricLabel?: string;
  icon: typeof Shield;
}

const TEXT_SLIDES: TextSlide[] = [
  {
    id: 'advantage',
    tag: 'FIELD-PROVEN TRIAL ADVANTAGE',
    headline: '+7.7 bu/A Yield Advantage in 2020 On-Farm Trials',
    subtext: 'Demonstrating consistent yield superiority over legacy SmartStax® technology across diverse geographies.',
    metric: '+7.7 bu/A',
    metricLabel: 'Yield Increase vs SmartStax®',
    icon: TrendingUp,
  },
  {
    id: 'protection',
    tag: 'FOUR MODES OF DEFENSE',
    headline: '2 Modes Above & 2 Below for Complete Insect Control',
    subtext: 'Dual-action above-ground and below-ground bio-protection preserves pristine root mass and stalk integrity.',
    metric: '4 Modes',
    metricLabel: 'Comprehensive Insect Protection',
    icon: Shield,
  },
  {
    id: 'simulations',
    tag: 'PREDICTIVE BIOTECH ACCELERATION',
    headline: 'Over 100 Million Virtual Genomic Simulations Run Annually',
    subtext: 'Compressing a decade of field breeding into months by evaluating billions of trait combinations computationally.',
    metric: '100M+',
    metricLabel: 'Virtual Hybrid Runs Per Year',
    icon: Cpu,
  },
  {
    id: 'root-mass',
    tag: 'MAXIMUM NUTRIENT UPTAKE',
    headline: 'Unmatched Root Volume & Extended Drought Resilience',
    subtext: 'Engineered cellular vigor ensures reliable nutrient uptake even in dry, nutrient-demanding soil profiles.',
    metric: '3.2x',
    metricLabel: 'Root Surface Area Retention',
    icon: Zap,
  },
  {
    id: 'elite-performance',
    tag: 'NEXT-GENERATION PERFORMANCE',
    headline: 'The Most Optimized Agronomic Balance in the Portfolio',
    subtext: 'Delivering exceptional test weight, early-season vigor, and rapid drydown for modern progressive growers.',
    metric: '99.4%',
    metricLabel: 'Agronomic Standability Score',
    icon: Award,
  },
];

interface HorizontalTextScrollSectionProps {
  scrollProgress: MotionValue<number>;
  sectionProgressStart: number; // e.g. 0.75
  sectionProgressEnd: number;   // e.g. 1.0
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
}

export function HorizontalTextScrollSection({
  scrollProgress,
  sectionProgressStart,
  sectionProgressEnd,
  mouseX,
  mouseY,
}: HorizontalTextScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Map the section scroll window to 0 -> 1 local progress
  const localProgress = useTransform(
    scrollProgress,
    [sectionProgressStart, sectionProgressEnd],
    [0, 1]
  );

  const smoothLocalProgress = useSpring(localProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.75,
  });

  // Calculate horizontal translation:
  // As localProgress goes 0 -> 1, the track moves horizontally so each slide passes through center
  // 5 slides total -> total shift is approx -80% of total width (leaving last slide centered)
  const totalSlides = TEXT_SLIDES.length;
  // Slide percentage translation: each slide is 100vw or ~80vw
  const trackX = useTransform(
    smoothLocalProgress,
    [0, 1],
    ['0%', `-${(totalSlides - 1) * 75}%`]
  );

  // Background subtle parallax
  const bgParallaxX = useTransform(smoothLocalProgress, [0, 1], ['0%', '-25%']);

  // Track active slide index for pagination indicator
  useEffect(() => {
    const unsubscribe = smoothLocalProgress.on('change', (p) => {
      const idx = Math.min(
        totalSlides - 1,
        Math.max(0, Math.round(p * (totalSlides - 1)))
      );
      setActiveSlideIndex(idx);
    });
    return () => unsubscribe();
  }, [smoothLocalProgress, totalSlides]);

  // Subtle mouse tilt for atmospheric depth
  const mouseTiltX = useTransform(mouseX || scrollProgress, [-1, 1], [15, -15]);
  const mouseTiltY = useTransform(mouseY || scrollProgress, [-1, 1], [10, -10]);

  return (
    <div
      ref={containerRef}
      id="horizontal-text-scroll-container"
      className="relative w-full h-full min-h-screen overflow-hidden select-none flex flex-col justify-between bg-[#020704]"
    >
      {/* =========================================================================
          ATMOSPHERIC HORIZONTAL BACKGROUND (DEEP OBSIDIAN & EMERALD NEBULA HAZE)
          ========================================================================= */}
      <motion.div
        style={{
          x: bgParallaxX,
        }}
        className="absolute -inset-[20%] w-[160%] h-[140%] pointer-events-none z-0"
        aria-hidden="true"
      >
        {/* Deep Emerald Glow Pool */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 40% 50%, rgba(6, 40, 24, 0.75) 0%, rgba(2, 20, 12, 0.90) 50%, #020704 100%)',
          }}
        />

        {/* Ambient Warm Golden Ray Flashes */}
        <div
          className="absolute top-1/4 left-1/3 w-[60vw] h-[50vh] opacity-35"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.25) 0%, rgba(16, 185, 129, 0.10) 45%, transparent 70%)',
          }}
        />

        {/* Horizontal Speed lines / Subtle Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '120px 120px',
          }}
        />
      </motion.div>

      {/* Top Section Header / Breadcrumb Bar */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-24 sm:pt-28 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-emerald-300/80">
            PERFORMANCE METRICS & AGRONOMIC IMPACT
          </span>
        </div>

        {/* Scroll Horizontal Cue */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-zinc-400/80">
          <span>SCROLL DOWN TO ADVANCE</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* =========================================================================
          HORIZONTAL SCROLLING TEXT TRACK (CENTERS EACH STATEMENT ON SCROLL)
          ========================================================================= */}
      <div className="relative z-10 w-full flex-1 flex items-center overflow-visible">
        <motion.div
          style={{
            x: trackX,
          }}
          className="flex items-center gap-12 sm:gap-24 lg:gap-32 pl-[8vw] sm:pl-[14vw] lg:pl-[18vw] pr-[20vw] will-change-transform"
        >
          {TEXT_SLIDES.map((slide, index) => {
            const isCurrent = index === activeSlideIndex;
            const Icon = slide.icon;

            return (
              <motion.div
                key={slide.id}
                id={`horizontal-slide-${index}`}
                animate={{
                  opacity: isCurrent ? 1 : 0.45,
                  scale: isCurrent ? 1 : 0.94,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-[82vw] sm:w-[68vw] md:w-[60vw] lg:w-[54vw] max-w-3xl flex-shrink-0 flex flex-col justify-center text-left py-6"
              >
                {/* Category Tag & Slide Number */}
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-widest text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    {slide.tag}
                  </span>
                  <span className="text-xs font-mono text-zinc-300">
                    0{index + 1} / 0{totalSlides}
                  </span>
                </div>

                {/* Large Clean Prominent Headline */}
                <h3
                  className={`font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] tracking-tight uppercase leading-[1.04] transition-colors duration-300 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] ${
                    isCurrent ? 'text-white' : 'text-zinc-400'
                  }`}
                >
                  {slide.headline}
                </h3>

                {/* Narrative Subtext */}
                <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-zinc-300/90 max-w-2xl leading-relaxed font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {slide.subtext}
                </p>

                {/* Metric Highlight Pill */}
                {slide.metric && (
                  <div className="mt-6 sm:mt-8 inline-flex items-center gap-4 p-3 sm:p-4 rounded-xl bg-white/[0.04] border border-white/10 max-w-md backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                    <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="font-display font-black text-xl sm:text-2xl text-emerald-300 tracking-tight leading-none">
                        {slide.metric}
                      </div>
                      <div className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400 mt-1">
                        {slide.metricLabel}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* =========================================================================
          BOTTOM PROGRESS TRACK & SLIDE PILLS
          ========================================================================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-8 sm:pb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Horizontal Continuous Progress Bar */}
        <div className="w-full sm:max-w-md h-1.5 rounded-full bg-white/10 overflow-hidden relative">
          <motion.div
            style={{
              scaleX: smoothLocalProgress,
              transformOrigin: 'left',
            }}
            className="w-full h-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
          />
        </div>

        {/* Numbered Navigation Indicators */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Key performance slides">
          {TEXT_SLIDES.map((slide, idx) => {
            const isActive = idx === activeSlideIndex;
            return (
              <div
                key={slide.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-8 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                    : 'w-2 bg-white/20'
                }`}
                aria-label={`Slide ${idx + 1}`}
                aria-current={isActive ? 'true' : 'false'}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
