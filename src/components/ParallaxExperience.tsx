import { useState, useRef, useEffect, TouchEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { PioneerLogo } from './PioneerLogo';
import { ParticleField } from './ParticleField';
import { ConstellationCanvas } from './ConstellationCanvas';
import { NavDrawer } from './NavDrawer';
import { SeedClassSection } from './SeedClassSection';

interface SlideData {
  headline: string[];
  description: string;
  features: string[];
}

const SLIDES: SlideData[] = [
  {
    headline: ['Learn The Moves', 'You Want'],
    description:
      "Whatever skill you want to learn, Talos has a structured path to get you there. With every phase mapped out so you always know exactly what to train next.",
    features: [
    ],
  },
  {
    headline: ['PREDICTIVE', 'GENOMICS IN', 'ACTION.'],
    description:
      'By analyzing billions of genetic combinations before a single seedling is planted, our machine-learning models isolate high-yield vigor, drought tolerance, and disease resistance with unprecedented precision.',
    features: [
      'Billions of genetic marker permutations evaluated',
      'Pinpoint isolation of drought vigor & disease resistance',
      'Precision hybrid selection prior to in-ground planting',
    ],
  },
  {
    headline: ['ACCELERATING', 'FIELD-READY', 'VELOCITY.'],
    description:
      'What used to take an entire decade of physical crop trials now happens in virtual cycles in a matter of months. Farmers receive optimized, battle-tested hybrid varieties years ahead of traditional breeding cycles.',
    features: [
      'Decade-long physical trial cycles compressed into virtual months',
      'Simulated across diverse climate & soil micro-profiles',
      'High-performing commercial seed delivered seasons ahead',
    ],
  },
];

// Staggered entrance variants for Section 2 content reveal
const sectionContentVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.14,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const headlineLineVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const paragraphVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const featureListContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const featureItemVariants = {
  hidden: { opacity: 0, x: -16, y: 8 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function ParallaxExperience() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSectionRevealed, setIsSectionRevealed] = useState(false);

  // Track active section for right-side pagination
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  // Scroll tracking across the scroll track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // =========================================================================
  // SPRING-BASED INERTIA PHYSICS FOR RESPONSIVE, WEIGHTED PARALLAX
  // =========================================================================
  const diagonalCutSpring = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.8,
    restDelta: 0.0001,
  });

  // Smooth cinematic inertia physics for background parallax and ambient transforms
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.75,
    restDelta: 0.0001,
  });

  // Track active section index based on scroll progress
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (p) => {
      if (p < 0.30) {
        setActiveSectionIndex(0);
      } else if (p < 0.66) {
        setActiveSectionIndex(1);
      } else {
        setActiveSectionIndex(2);
      }
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Trigger entrance animation for Section 2 elements as diagonal transition completes
  useEffect(() => {
    const checkRevealed = (val: number) => {
      if (val >= 0.32 && val < 0.65) {
        setIsSectionRevealed(true);
      } else {
        setIsSectionRevealed(false);
      }
    };
    checkRevealed(diagonalCutSpring.get());
    const unsubscribe = diagonalCutSpring.on('change', checkRevealed);
    return () => unsubscribe();
  }, [diagonalCutSpring]);

  // Mouse tilt tracking for the Hero section
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 28, stiffness: 105, mass: 0.7 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D Tilt angles for Hero stage
  const heroRotateX = useTransform(smoothMouseY, [-1, 1], [3.5, -3.5]);
  const heroRotateY = useTransform(smoothMouseX, [-1, 1], [-4.5, 4.5]);

  // Deep Background Layer Parallax (Hero mouse displacement)
  const heroMouseBgX = useTransform(smoothMouseX, [-1, 1], [14, -14]);
  const heroMouseBgY = useTransform(smoothMouseY, [-1, 1], [10, -10]);

  // Hero Foreground Text Parallax (Hero mouse displacement)
  const heroMouseTextX = useTransform(smoothMouseX, [-1, 1], [-8, 8]);
  const heroMouseTextY = useTransform(smoothMouseY, [-1, 1], [-6, 6]);

  // Dynamic light reflection hotspot for Hero
  const lightX = useTransform(smoothMouseX, [-1, 1], ['36%', '64%']);
  const lightY = useTransform(smoothMouseY, [-1, 1], ['36%', '64%']);

  // =========================================================================
  // WEIGHTED DIAGONAL CUT-IN TRANSITION GEOMETRY (TRANSITION 1: HERO -> CONTENDERS)
  // =========================================================================
  const cut1Left = useTransform(
    diagonalCutSpring,
    [0, 0.06, 0.22, 0.34, 1],
    [135, 125, 45, -12, -22]
  );
  const cut1Right = useTransform(
    diagonalCutSpring,
    [0, 0.06, 0.22, 0.34, 1],
    [110, 100, 20, -38, -48]
  );

  // Clip-path polygon string for Section 2 container (Cut 1)
  const clipPathString1 = useTransform(
    [cut1Left, cut1Right],
    ([left, right]) => `polygon(0% ${left}%, 100% ${right}%, 100% 100%, 0% 100%)`
  );

  // =========================================================================
  // WEIGHTED DIAGONAL CUT-IN TRANSITION GEOMETRY (TRANSITION 2: CONTENDERS -> SEED CLASS)
  // =========================================================================
  const cut2Left = useTransform(
    diagonalCutSpring,
    [0, 0.48, 0.62, 0.74, 1],
    [135, 125, 45, -12, -22]
  );
  const cut2Right = useTransform(
    diagonalCutSpring,
    [0, 0.48, 0.62, 0.74, 1],
    [110, 100, 20, -38, -48]
  );

  // Clip-path polygon string for Section 3 container (Cut 2)
  const clipPathString2 = useTransform(
    [cut2Left, cut2Right],
    ([left, right]) => `polygon(0% ${left}%, 100% ${right}%, 100% 100%, 0% 100%)`
  );

  // =========================================================================
  // SECTION 1 (HERO) PARALLAX DISPLACEMENTS UNDER THE CUT
  // =========================================================================
  const heroScrollBgY = useTransform(smoothProgress, [0, 0.32], ['0%', '20%']);
  const heroBgScale = useTransform(smoothProgress, [0, 0.32], [1.06, 1.22]);
  const heroBgOpacity = useTransform(smoothProgress, [0.22, 0.32], [1, 0]);

  const heroScrollTextY = useTransform(smoothProgress, [0, 0.32], ['0%', '-35%']);
  const heroTextScale = useTransform(smoothProgress, [0, 0.32], [1.0, 0.90]);
  const heroTextOpacity = useTransform(smoothProgress, [0.18, 0.28], [1, 0]);

  const heroParticlesY = useTransform(smoothProgress, [0, 0.32], ['0%', '-90%']);

  const heroIndicatorOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);
  const heroIndicatorY = useTransform(smoothProgress, [0, 0.08], [0, 20]);

  const combinedHeroBgY = useTransform(
    [heroMouseBgY, heroScrollBgY],
    ([my, sy]) => `calc(${my}px + ${sy})`
  );

  const combinedHeroTextY = useTransform(
    [heroMouseTextY, heroScrollTextY],
    ([my, sy]) => `calc(${my}px + ${sy})`
  );

  // =========================================================================
  // SECTION 2 (CONTENDERS) PARALLAX DISPLACEMENTS INSIDE CUT 1 / UNDER CUT 2
  // =========================================================================
  const contendersBgY = useTransform(smoothProgress, [0.12, 0.44], ['18%', '0%']);
  const contendersBgScale = useTransform(smoothProgress, [0.12, 0.44], [1.14, 1.0]);

  // Section 2 sinks under Cut 2 as Section 3 cuts across it
  const contendersSinkY = useTransform(smoothProgress, [0.48, 0.74], ['0%', '16%']);
  const contendersSinkScale = useTransform(smoothProgress, [0.48, 0.74], [1.0, 1.08]);

  // Constellation Canvas traverses vertically while spiraling in 3D
  const contendersCanvasY = useTransform(smoothProgress, [0.15, 0.65], ['20%', '-24%']);

  // Typography rises gracefully and exits as Cut 2 sweeps across
  const contendersTextY = useTransform(smoothProgress, [0.32, 0.44], ['20%', '0%']);
  const contendersTextOpacity = useTransform(
    smoothProgress,
    [0.30, 0.42, 0.50, 0.64],
    [0, 1, 1, 0]
  );

  // Section 2 Mouse displacement parallax & 3D tilt
  const contendersMouseBgX = useTransform(smoothMouseX, [-1, 1], [14, -14]);
  const contendersMouseBgY = useTransform(smoothMouseY, [-1, 1], [10, -10]);
  const combinedContendersBgY = useTransform(
    [contendersMouseBgY, contendersBgY, contendersSinkY],
    ([my, sy, ey]) => `calc(${my}px + ${sy} + ${ey})`
  );

  const contendersMouseTextX = useTransform(smoothMouseX, [-1, 1], [-8, 8]);
  const contendersMouseTextY = useTransform(smoothMouseY, [-1, 1], [-6, 6]);
  const combinedContendersTextY = useTransform(
    [contendersMouseTextY, contendersTextY, contendersSinkY],
    ([my, sy, ey]) => `calc(${my}px + ${sy} + ${ey})`
  );

  // =========================================================================
  // SECTION 3 (SEED CLASS SECTION) PARALLAX DISPLACEMENTS INSIDE CUT 2
  // =========================================================================
  const seedTextY = useTransform(smoothProgress, [0.58, 0.74], ['22%', '0%']);
  const seedTextOpacity = useTransform(smoothProgress, [0.56, 0.70], [0, 1]);

  // Right-edge Pagination dots fade & slide in
  const paginationOpacity = useTransform(smoothProgress, [0.08, 0.16], [0.4, 1]);
  const paginationX = useTransform(smoothProgress, [0.08, 0.16], [20, 0]);

  // =========================================================================
  // GLOBAL BACKGROUND GRADIENT & COLOR GRADING TRANSFORMS
  // =========================================================================
  const globalGradTop = useTransform(
    smoothProgress,
    [0, 0.32, 0.62, 0.85, 1],
    ['#062e1d', '#042219', '#0e141b', '#3d1e0c', '#54260d']
  );
  const globalGradMid = useTransform(
    smoothProgress,
    [0, 0.32, 0.62, 0.85, 1],
    ['#021a10', '#021511', '#080b10', '#101e14', '#0c1a10']
  );
  const globalGradBase = useTransform(
    smoothProgress,
    [0, 0.32, 0.62, 0.85, 1],
    ['#010c07', '#010a08', '#030407', '#020904', '#010603']
  );
  const globalGlowColor = useTransform(
    smoothProgress,
    [0, 0.32, 0.62, 0.85, 1],
    [
      'rgba(16, 185, 129, 0.15)',
      'rgba(20, 140, 115, 0.10)',
      'rgba(56, 189, 248, 0.06)',
      'rgba(245, 158, 11, 0.18)',
      'rgba(245, 158, 11, 0.22)',
    ]
  );

  const globalBgGradient = useTransform(
    [globalGradTop, globalGradMid, globalGradBase],
    ([top, mid, base]) =>
      `radial-gradient(135% 125% at 50% 18%, ${top} 0%, ${mid} 54%, ${base} 100%)`
  );

  // Active interaction triggers
  const heroPointerEvents = useTransform(smoothProgress, (p) => (p < 0.28 ? 'auto' : 'none'));
  const contendersPointerEvents = useTransform(smoothProgress, (p) => (p >= 0.28 && p < 0.64 ? 'auto' : 'none'));
  const seedPointerEvents = useTransform(smoothProgress, (p) => (p >= 0.64 ? 'auto' : 'none'));

  // Track cursor movement across viewport for Hero 3D tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const normalizedX = (e.clientX / width) * 2 - 1;
      const normalizedY = (e.clientY / height) * 2 - 1;
      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  // Touch swipe support
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    touchStartY.current = null;

    if (diff > 50 && scrollYProgress.get() < 0.45) {
      // Swiped UP: advance smoothly to Section 2 full-screen
      scrollToContenders();
    } else if (diff < -50 && scrollYProgress.get() > 0.45) {
      // Swiped DOWN: return to Hero section
      scrollToHero();
    }
  };

  // Keyboard navigation between sections
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PageDown') {
        scrollToContenders();
      } else if (e.key === 'PageUp') {
        scrollToHero();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Story chapters for global pagination
  const STORY_CHAPTERS = [
    { id: 'hero', title: 'Revolution' },
    { id: 'contenders', title: 'Computers & Simulations' },
    { id: 'seed-class', title: 'The New Class' },
  ];

  // Smooth scroll helper: advance to Section 2 (Constellation)
  const scrollToContenders = () => {
    if (!containerRef.current) return;
    const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
    const target = containerRef.current.offsetTop + maxScroll * 0.44;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  // Smooth scroll helper: advance to Section 3 (The New Class / 0.01% Seed)
  const scrollToSeedClass = () => {
    if (!containerRef.current) return;
    const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
    const target = containerRef.current.offsetTop + maxScroll * 0.86;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  // Smooth scroll helper to return to Hero
  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaginationClick = (index: number) => {
    if (index === 0) scrollToHero();
    else if (index === 1) scrollToContenders();
    else if (index === 2) scrollToSeedClass();
  };

  const slide = SLIDES[currentSlide];

  return (
    <motion.div
      ref={containerRef}
      id="parallax-experience-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        background: globalBgGradient,
      }}
      className="relative w-full h-[850vh] transition-colors duration-300"
    >
      {/* Sticky Fullscreen Viewport Stage */}
      <div className="sticky top-0 w-full h-screen min-h-[640px] overflow-hidden select-none">
        {/* =========================================================================
            GLOBAL ADAPTIVE BACKGROUND GRADIENT (Deep Emerald -> Dark Obsidian)
            ========================================================================= */}
        <motion.div
          id="global-stage-gradient-base"
          style={{ background: globalBgGradient }}
          className="absolute inset-0 pointer-events-none z-0"
          aria-hidden="true"
        />

        {/* Global Color Grading Vignette (Emerald Luster -> Obsidian Mineral Sheen) */}
        <motion.div
          id="global-color-grading-vignette"
          style={{
            background: useTransform(
              [globalGlowColor, globalGradBase],
              ([glow, base]) =>
                `radial-gradient(circle at 50% 25%, ${glow} 0%, transparent 60%), radial-gradient(circle at 50% 70%, transparent 35%, ${base} 100%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none z-0 opacity-80 mix-blend-screen"
          aria-hidden="true"
        />

        {/* =========================================================================
            SECTION 1: HERO (UNDERNEATH THE CUT)
            ========================================================================= */}
        <div
          id="hero-section-base"
          className="absolute inset-0 w-full h-full overflow-hidden [perspective:1400px] z-0"
        >
          {/* 3D Tilted World Stage */}
          <motion.div
            id="hero-3d-stage"
            style={{
              rotateX: heroRotateX,
              rotateY: heroRotateY,
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            {/* Deep Background Layer with Corn Ear */}
            <motion.div
              id="hero-bg-layer"
              style={{
                x: heroMouseBgX,
                y: combinedHeroBgY,
                scale: heroBgScale,
                opacity: heroBgOpacity,
              }}
              className="absolute -inset-[5%] z-0 pointer-events-none"
            >
              <img
                src="/hero-corn.jpg"
                alt="Revolutionary Pioneer Corn Ear"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />

              {/* Dynamic Lighting Sheen */}
              <motion.div
                style={{
                  background: useTransform(
                    [lightX, lightY],
                    ([lx, ly]) =>
                      `radial-gradient(circle at ${lx} ${ly}, rgba(52, 211, 153, 0.08) 0%, rgba(245, 158, 11, 0.035) 35%, transparent 70%)`
                  ),
                }}
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
              />

              {/* Vignette & Atmospheric Gradients */}
              <div
                className="absolute inset-0 bg-radial-[circle_at_50%_45%] from-transparent via-[#03150d]/40 to-[#010a05]/90 pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none"
                aria-hidden="true"
              />
            </motion.div>

            {/* Hero Particles: Streams upward */}
            <motion.div
              style={{
                y: heroParticlesY,
              }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <ParticleField />
            </motion.div>
          </motion.div>

          {/* Hero Foreground Headline & Copy */}
          <motion.div
            id="hero-content-layer"
            style={{
              opacity: heroTextOpacity,
              y: combinedHeroTextY,
              scale: heroTextScale,
              pointerEvents: heroPointerEvents,
            }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none mt-16 sm:mt-24"
          >
            <div className="max-w-7xl mx-auto w-full [transform:translateZ(20px)]">
              {/* Massive Bold Headline */}
              <h1
                id="hero-title"
                className="font-display font-black text-[clamp(1.6rem,7vw,6.5rem)] whitespace-nowrap tracking-tight uppercase text-white leading-[0.9] drop-shadow-[0_10px_35px_rgba(0,0,0,0.85)] select-none"
              >
                CALISTHENICS. REVOLUTIONIZED.
              </h1>

              {/* Subtitle */}
              <p
                id="hero-subtitle"
                className="mt-4 sm:mt-6 md:mt-7 text-sm sm:text-base md:text-lg lg:text-xl font-normal text-zinc-100/85 tracking-wide max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] px-4 select-none"
              >
                Master skills step by step with AI that adapts to every session
              </p>
            </div>
          </motion.div>
        </div>

        {/* =========================================================================
            SECTION 2: CONTENDERS (CLIPPED BY DYNAMIC DIAGONAL CUT-IN 1)
            ========================================================================= */}
        <motion.div
          id="contenders-diagonal-clipped-container"
          style={{
            clipPath: clipPathString1,
            WebkitClipPath: clipPathString1,
            background: globalBgGradient,
          }}
          className="absolute inset-0 w-full h-full z-20 overflow-hidden [perspective:1400px]"
        >
          {/* 3D Tilted World Stage for Section 2 */}
          <motion.div
            id="contenders-3d-stage"
            style={{
              rotateX: heroRotateX,
              rotateY: heroRotateY,
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            {/* Deep Data Constellation Nebula with Parallax Rise */}
            <motion.div
              id="contenders-bg-layer"
              style={{
                x: contendersMouseBgX,
                y: combinedContendersBgY,
                scale: contendersBgScale,
              }}
              className="absolute -inset-[5%] pointer-events-none z-0"
            >
              <img
                src="/data-constellation.jpg"
                alt="Biotech Data Constellation"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center opacity-65 mix-blend-screen"
              />

              {/* Dynamic Lighting Sheen */}
              <motion.div
                style={{
                  background: useTransform(
                    [lightX, lightY, globalGlowColor],
                    ([lx, ly, glow]) =>
                      `radial-gradient(circle at ${lx} ${ly}, ${glow} 0%, rgba(16, 185, 129, 0.02) 40%, transparent 75%)`
                  ),
                }}
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
              />

              {/* Base Atmospheric Emerald Fog */}
              <motion.div
                style={{
                  opacity: useTransform(smoothProgress, [0.10, 0.65], [0.85, 0.25]),
                }}
                className="absolute inset-0 bg-radial-[circle_at_60%_45%] from-emerald-950/40 via-[#03150c]/80 to-[#020b06]/95 pointer-events-none"
                aria-hidden="true"
              />

              {/* Dark Obsidian Shift Atmosphere Fog */}
              <motion.div
                style={{
                  opacity: useTransform(smoothProgress, [0.35, 0.85], [0, 0.92]),
                  background:
                    'radial-gradient(ellipse at 60% 45%, rgba(15, 23, 42, 0.45) 0%, rgba(7, 10, 15, 0.82) 50%, #030406 100%)',
                }}
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
              />

              {/* Edge vignetting layers smoothly tied to the global obsidian base color */}
              <motion.div
                style={{
                  background: useTransform(
                    globalGradBase,
                    (base) =>
                      `linear-gradient(to right, ${base} 0%, rgba(3, 4, 6, 0.75) 45%, transparent 100%)`
                  ),
                }}
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
              />
              <motion.div
                style={{
                  background: useTransform(
                    globalGradBase,
                    (base) =>
                      `linear-gradient(to top, ${base} 0%, transparent 45%, ${base} 100%)`
                  ),
                }}
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
              />
            </motion.div>

            {/* Interactive Constellation Canvas: 3D Helical Spiral with scroll-driven rotation */}
            <motion.div
              style={{
                y: contendersCanvasY,
              }}
              className="absolute -top-[40%] left-0 right-0 h-[180%] pointer-events-auto z-10 [transform:translateZ(10px)]"
            >
              <ConstellationCanvas
                activeSlide={currentSlide}
                scrollProgress={smoothProgress}
              />
            </motion.div>
          </motion.div>

          {/* Contenders Foreground Content (Headline, Narrative & Feature List) */}
          <motion.div
            id="contenders-content-layer"
            style={{
              x: contendersMouseTextX,
              y: combinedContendersTextY,
              opacity: contendersTextOpacity,
              pointerEvents: contendersPointerEvents,
            }}
            className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 lg:px-16 max-w-7xl w-full mx-auto pointer-events-none"
          >
            <div className="max-w-2xl text-left pointer-events-auto [transform:translateZ(24px)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  variants={sectionContentVariants}
                  initial="hidden"
                  animate={isSectionRevealed ? 'visible' : 'hidden'}
                  exit="exit"
                >
                  {/* Bold Condensed Section 2 Heading with staggered line reveals */}
                  <h2
                    id="contenders-title"
                    className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.2rem] tracking-tight uppercase text-white leading-[0.92] drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)] select-none"
                  >
                    {slide.headline.map((line, idx) => (
                      <motion.span
                        key={idx}
                        variants={headlineLineVariants}
                        className="block"
                      >
                        {line}
                      </motion.span>
                    ))}
                  </h2>

                  {/* Section 2 Narrative Description with smooth entrance */}
                  <motion.p
                    id="contenders-description"
                    variants={paragraphVariants}
                    className="mt-5 sm:mt-7 text-sm sm:text-base md:text-lg lg:text-[17px] font-normal text-zinc-200/90 leading-relaxed max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] select-none"
                  >
                    {slide.description}
                  </motion.p>

                  {/* Staggered Feature Capabilities List */}
                  <motion.ul
                    id="contenders-feature-list"
                    variants={featureListContainerVariants}
                    className="mt-5 sm:mt-7 space-y-2.5 sm:space-y-3"
                    aria-label="Capabilities and Innovations"
                  >
                    {slide.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        variants={featureItemVariants}
                        className="flex items-start sm:items-center gap-3 text-xs sm:text-sm md:text-[15px] text-emerald-100/90"
                      >
                        <span className="flex-shrink-0 mt-0.5 sm:mt-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2.5} />
                        </span>
                        <span className="font-normal tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] select-none">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* =========================================================================
            SECTION 3: THE NEW CLASS / 0.01% OF SEEDS (CLIPPED BY DYNAMIC DIAGONAL CUT-IN 2)
            ========================================================================= */}
        <motion.div
          id="seed-class-diagonal-clipped-container"
          style={{
            clipPath: clipPathString2,
            WebkitClipPath: clipPathString2,
            pointerEvents: seedPointerEvents,
          }}
          className="absolute inset-0 w-full h-full z-30 overflow-hidden [perspective:1400px]"
        >
          <SeedClassSection
            scrollProgress={smoothProgress}
            isActive={activeSectionIndex === 2}
            contentY={seedTextY}
            contentOpacity={seedTextOpacity}
            mouseRotateX={heroRotateX}
            mouseRotateY={heroRotateY}
          />
        </motion.div>

        {/* =========================================================================
            CHROME NAVIGATION & CONTROLS (SHARED PERSISTENT INTERFACE)
            ========================================================================= */}
        {/* Top Header Bar with Logo & Hamburger Menu */}
        <header
          id="main-header"
          className="absolute top-0 left-0 right-0 z-40 w-full py-6 md:py-8 pointer-events-auto"
        >
          <div className="max-w-7xl w-full mx-auto px-6 sm:px-12 lg:px-16 flex items-center justify-between">
            {/* Pioneer Brand Logo (Clicking smoothly returns to Hero) */}
            <button
              onClick={scrollToHero}
              className="focus:outline-none cursor-pointer hover:opacity-90 transition-opacity"
              aria-label="Return to top"
            >
              <PioneerLogo />
            </button>

            {/* Hamburger Menu Toggle */}
            <button
              id="hamburger-menu-toggle"
              onClick={() => setIsNavOpen(true)}
              className="group flex flex-col justify-center items-end gap-1.5 w-8 h-8 focus:outline-none cursor-pointer"
              aria-label="Open navigation menu"
            >
              <span className="w-7 h-[2px] bg-white transition-all duration-300 group-hover:w-8 group-hover:bg-emerald-400" />
              <span className="w-7 h-[2px] bg-white transition-all duration-300 group-hover:w-8 group-hover:bg-emerald-400" />
              <span className="w-7 h-[2px] bg-white transition-all duration-300 group-hover:w-8 group-hover:bg-emerald-400" />
            </button>
          </div>
        </header>

        {/* Right-Edge Global Chapter Pagination Dots (Hero / Constellation / Seed Class) */}
        <motion.div
          id="global-story-pagination"
          style={{
            x: paginationX,
            opacity: paginationOpacity,
          }}
          className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-40 pointer-events-auto"
          aria-label="Story chapters"
        >
          {STORY_CHAPTERS.map((chapter, index) => {
            const isActive = index === activeSectionIndex;
            return (
              <button
                key={chapter.id}
                id={`global-pagination-dot-${index}`}
                onClick={() => handlePaginationClick(index)}
                className="relative flex items-center justify-center p-2 focus:outline-none cursor-pointer group"
                aria-label={`Go to ${chapter.title}`}
                aria-current={isActive ? 'true' : 'false'}
              >
                {isActive ? (
                  <div className="relative flex items-center justify-center w-7 h-7">
                    <motion.svg
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 w-full h-full text-white/90"
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
                        className="opacity-95"
                      />
                    </motion.svg>
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                  </div>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white/80 transition-all duration-200" />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Bottom Center Animated Pulsing Scroll Indicator ("EXPLORE") */}
        <motion.div
          id="scroll-down-indicator"
          style={{
            opacity: heroIndicatorOpacity,
            y: heroIndicatorY,
            pointerEvents: heroPointerEvents,
          }}
          className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 select-none"
        >
          <motion.button
            onClick={scrollToContenders}
            initial={{ y: 0 }}
            animate={{
              y: [0, 4, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="group relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#03150d]/80 hover:bg-[#072418]/95 border border-emerald-500/30 hover:border-emerald-400/60 backdrop-blur-md text-emerald-300/80 hover:text-emerald-100 transition-all duration-300 shadow-[0_4px_18px_rgba(0,0,0,0.6)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
            aria-label="Scroll down to explore"
          >
            {/* Gentle Pulsing Ring Glow */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.3, 0.65, 0.3],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-full border border-emerald-400/35 pointer-events-none"
              aria-hidden="true"
            />

            <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-emerald-200" />
          </motion.button>

          {/* Micro text label */}
          <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-emerald-400/60 transition-colors select-none">
            EXPLORE
          </span>
        </motion.div>

        {/* Slide-out Navigation Drawer */}
        <NavDrawer isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
      </div>
    </motion.div>
  );
}
