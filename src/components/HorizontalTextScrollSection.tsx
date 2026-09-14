import { useRef, useEffect, useState } from 'react';
import { motion, MotionValue, useTransform, useSpring } from 'motion/react';
import { Sparkles, Shield, Cpu, Zap, TrendingUp, Award } from 'lucide-react';

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

  // Kept responsive (comparable to the page's main scroll spring, not the
  // much heavier ~60/28/1.1 spring used elsewhere) so it never falls behind
  // a normal scroll pace and gets cut off early by Cut 3 starting.
  const smoothLocalProgress = useSpring(localProgress, {
    stiffness: 220,
    damping: 30,
    mass: 0.5,
  });

  const totalSlides = TEXT_SLIDES.length;

  // Horizontal translation is measured directly from the actual rendered
  // layout (first/last slide centers), not guessed as a percentage of track
  // width — a guessed percentage can under/overshoot depending on real slide
  // widths, gaps, and padding, leaving dead scroll space after the last
  // slide is already centered.
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxShiftPx, setMaxShiftPx] = useState(0);

  useEffect(() => {
    const computeShift = () => {
      const track = trackRef.current;
      if (!track) return;
      const children = Array.from(track.children) as HTMLElement[];
      if (children.length < 2) return;
      const first = children[0];
      const last = children[children.length - 1];
      const firstCenter = first.offsetLeft + first.offsetWidth / 2;
      const lastCenter = last.offsetLeft + last.offsetWidth / 2;
      setMaxShiftPx(firstCenter - lastCenter);
    };

    computeShift();
    window.addEventListener('resize', computeShift);
    return () => window.removeEventListener('resize', computeShift);
  }, []);

  const trackX = useTransform(smoothLocalProgress, [0, 1], [0, maxShiftPx]);

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

  return (
    <div
      ref={containerRef}
      id="horizontal-text-scroll-container"
      className="relative w-full h-full min-h-screen overflow-hidden select-none flex flex-col justify-between"
    >
      {/* The shared atmospheric background is rendered once, persistently,
          by the parent (ParallaxExperience) — this component is
          foreground content only. */}

      {/* =========================================================================
          HORIZONTAL SCROLLING TEXT TRACK (CENTERS EACH STATEMENT ON SCROLL)
          ========================================================================= */}
      <div className="relative z-10 w-full flex-1 flex items-center overflow-visible">
        <motion.div
          ref={trackRef}
          style={{
            x: trackX,
          }}
          className="flex items-center gap-20 sm:gap-32 lg:gap-44 pl-[8vw] sm:pl-[14vw] lg:pl-[18vw] pr-[20vw] will-change-transform"
        >
          {TEXT_SLIDES.map((slide, index) => {
            const isCurrent = index === activeSlideIndex;

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
                {/* Large Clean Prominent Headline */}
                <h3
                  className={`font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] tracking-tight uppercase leading-[1.04] transition-colors duration-300 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] ${isCurrent ? 'text-white' : 'text-zinc-400'
                    }`}
                >
                  {slide.headline}
                </h3>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

    </div>
  );
}
