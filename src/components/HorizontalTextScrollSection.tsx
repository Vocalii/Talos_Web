import React, { useRef, useEffect, useState } from 'react';
import { motion, MotionValue, useTransform, useSpring, useMotionValue } from 'motion/react';

interface TextSlide {
  id: string;
  headline: string;
}

const TEXT_SLIDES: TextSlide[] = [
  {
    id: 'advantage',
    headline: 'Real-Time Form Analysis',
  },
  {
    id: 'protection',
    headline: 'Community & Competition',
  },
  {
    id: 'simulations',
    headline: 'Health & Wearable Integration',
  },
  {
    id: 'root-mass',
    headline: 'Mastery System',
  },
  {
    id: 'elite-performance',
    headline: 'And Many More Moves',
  },
];

interface HorizontalTextScrollSectionProps {
  scrollProgress: MotionValue<number>;
  sectionProgressStart: number;
  sectionProgressEnd: number;
  entryProgress?: MotionValue<number>;
  exitProgress?: MotionValue<number>;
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
  onSlideSelect?: (index: number) => void;
}

interface HorizontalSlideProps {
  slide: TextSlide;
  index: number;
  totalSlides: number;
  localProgress: MotionValue<number>;
  onSelect?: () => void;
}

const HorizontalSlide: React.FC<HorizontalSlideProps> = ({
  slide,
  index,
  totalSlides,
  localProgress,
  onSelect,
}) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const targetP = totalSlides > 1 ? index / (totalSlides - 1) : 0;
  const step = totalSlides > 1 ? 1 / (totalSlides - 1) : 1;

  // Continuous, pure scroll-linked opacity curve:
  // Perfectly focused when centered (1.0), smoothly dimming with distance
  const slideOpacity = useTransform(localProgress, (p: number) => {
    const dist = Math.abs(p - targetP) / step;
    if (dist <= 0.05) return 1;
    if (dist >= 1.7) return 0.12;
    if (dist >= 1.0) {
      return 0.40 - ((dist - 1.0) / 0.7) * 0.28;
    }
    return 1 - dist * 0.60;
  });

  // Continuous smooth scaling: 1.0 when active, 0.90 when neighboring
  const slideScale = useTransform(localProgress, (p: number) => {
    const dist = Math.abs(p - targetP) / step;
    if (dist <= 0.05) return 1.0;
    if (dist >= 1.5) return 0.88;
    return 1.0 - (dist / 1.5) * 0.12;
  });

  // Continuous subtle vertical parallax drift
  const slideY = useTransform(localProgress, (p: number) => {
    const dist = Math.abs(p - targetP) / step;
    if (dist <= 0.05) return 0;
    if (dist >= 1.5) return 14;
    return (dist / 1.5) * 14;
  });

  // Subtle 3D rotation Y (perspectival curve into the horizon as it scrolls past)
  const slideRotateY = useTransform(localProgress, (p: number) => {
    const diff = (p - targetP) / step;
    const clamped = Math.max(-1.5, Math.min(1.5, diff));
    return clamped * 5;
  });

  // Phase in/out with a blur, matching the same cinematic entrance style
  // used on the Hero/Contenders/Qrome headlines as you scroll a slide into
  // and out of focus.
  const slideBlurPx = useTransform(localProgress, (p: number) => {
    const dist = Math.abs(p - targetP) / step;
    if (dist <= 0.05) return 0;
    if (dist >= 1.2) return 14;
    return (dist / 1.2) * 14;
  });
  const slideFilter = useTransform(slideBlurPx, (b) => `blur(${b}px)`);

  return (
    <motion.div
      ref={slideRef}
      id={`horizontal-slide-${index}`}
      style={{
        opacity: slideOpacity,
        scale: slideScale,
        y: slideY,
        rotateY: slideRotateY,
        filter: slideFilter,
        transformPerspective: 1200,
      }}
      onClick={onSelect}
      className="w-[86vw] sm:w-[76vw] md:w-[68vw] lg:w-[60vw] max-w-4xl flex-shrink-0 flex flex-col items-center justify-center text-center py-6 will-change-transform cursor-pointer select-none"
    >
      {/* Coming Soon eyebrow label */}
      <span className="font-display text-[10px] sm:text-[11px] font-light uppercase tracking-[0.4em] text-white/40 mb-4">
        Coming Soon
      </span>

      {/* Prominent High-Impact Headline — Pure Typography */}
      <h3
        className="font-display font-medium text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide uppercase leading-[1.15] text-white drop-shadow-[0_12px_36px_rgba(0,0,0,0.95)]"
      >
        {slide.headline}
      </h3>
    </motion.div>
  );
};

export function HorizontalTextScrollSection({
  scrollProgress,
  sectionProgressStart,
  sectionProgressEnd,
  entryProgress,
  exitProgress,
  mouseX,
  mouseY,
  onSlideSelect,
}: HorizontalTextScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxShiftPx, setMaxShiftPx] = useState(0);

  const defaultEntry = useMotionValue(1);
  const activeEntry = entryProgress || defaultEntry;

  const defaultExit = useMotionValue(0);
  const activeExit = exitProgress || defaultExit;

  // Map the section scroll window to 0 -> 1 local progress with strict clamping
  const localProgress = useTransform(
    scrollProgress,
    [sectionProgressStart, sectionProgressEnd],
    [0, 1],
    { clamp: true }
  );

  // Responsive spring with optimized mass & damping for silky horizontal glide
  const smoothLocalProgress = useSpring(localProgress, {
    stiffness: 170,
    damping: 28,
    mass: 0.35,
    restDelta: 0.0001,
  });

  const totalSlides = TEXT_SLIDES.length;

  // Accurately compute physical horizontal shift from slide center offsets
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

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(computeShift).catch(() => { });
    }

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && trackRef.current) {
      ro = new ResizeObserver(computeShift);
      ro.observe(trackRef.current);
    }

    return () => {
      window.removeEventListener('resize', computeShift);
      if (ro) ro.disconnect();
    };
  }, []);

  const trackX = useTransform(smoothLocalProgress, [0, 1], [0, maxShiftPx]);

  // =========================================================================
  // CINEMATIC ENTRANCE & EXIT CHOREOGRAPHY FOR THE HORIZONTAL SECTION
  // =========================================================================
  // Main horizontal track entrance
  const trackEntryY = useTransform(activeEntry, [0.15, 0.85], [44, 0]);
  const trackEntryOpacity = useTransform(activeEntry, [0.15, 0.75], [0, 1]);
  const trackEntryScale = useTransform(activeEntry, [0.15, 0.90], [0.95, 1.0]);

  // Graceful exit transforms before Section 4 diagonal wipe begins
  const containerExitY = useTransform(activeExit, [0.08, 0.85], [0, -32]);
  const containerExitOpacity = useTransform(activeExit, [0.08, 0.80], [1, 0]);

  return (
    <motion.div
      ref={containerRef}
      id="horizontal-text-scroll-container"
      style={{
        y: containerExitY,
        opacity: containerExitOpacity,
      }}
      className="relative w-full h-full min-h-screen overflow-hidden select-none flex items-center justify-center"
    >
      {/* =========================================================================
          HORIZONTAL SCROLLING TEXT TRACK (CENTERS EACH STATEMENT ON SCROLL)
          ========================================================================= */}
      <motion.div
        id="horizontal-scroll-track-stage"
        style={{
          y: trackEntryY,
          opacity: trackEntryOpacity,
          scale: trackEntryScale,
        }}
        className="relative z-10 w-full flex items-center overflow-visible"
      >
        <motion.div
          ref={trackRef}
          style={{
            x: trackX,
          }}
          className="flex items-center gap-20 sm:gap-32 lg:gap-44 pl-[8vw] sm:pl-[14vw] lg:pl-[18vw] pr-[20vw] will-change-transform"
        >
          {TEXT_SLIDES.map((slide, index) => (
            <HorizontalSlide
              key={slide.id}
              slide={slide}
              index={index}
              totalSlides={totalSlides}
              localProgress={smoothLocalProgress}
              onSelect={() => onSlideSelect && onSlideSelect(index)}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
