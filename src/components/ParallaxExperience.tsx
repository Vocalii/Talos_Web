import { useState, useRef, useEffect, TouchEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, X } from 'lucide-react';
import { PioneerLogo } from './PioneerLogo';
import { ParticleField } from './ParticleField';
import { ConstellationCanvas } from './ConstellationCanvas';
import { PlaceholderSection } from './PlaceholderSection';
import { HorizontalTextScrollSection } from './HorizontalTextScrollSection';
import { ProductsAtmosphereBackground } from './ProductsAtmosphereBackground';
import { PlaceholderSection2 } from './PlaceholderSection2';
import { LiquidPullText } from './LiquidPullText';
import { ExploreLibraryButton } from './ExploreLibraryButton';
import { GeneticLibraryModal } from './GeneticLibraryModal';
import { GeneticTraitSidePanel } from './GeneticTraitTooltip';
import { CornSeedTrait } from '../data/cornTraits';
import { getTraitAtmosphere } from '../utils/traitAtmosphere';

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
  hidden: { opacity: 0, y: 24, filter: 'blur(30px)', scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 2.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(12px)',
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const paragraphVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(20px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 2.2,
      delay: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(8px)',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const featureListContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.6,
    },
  },
};

const featureItemVariants = {
  hidden: { opacity: 0, x: -14, y: 8, filter: 'blur(16px)' },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    filter: 'blur(6px)',
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Roughly matches how long the headline/paragraph/feature-list stagger
// sequence above takes to visibly settle, so the Explore The Library button
// only starts phasing in once that text has already appeared — not at the
// same moment. Only applied on the one-time hidden -> visible entrance (see
// exploreButtonVariants below); toggling explore mode afterward uses its own
// separate, undelayed transition.
const EXPLORE_BUTTON_ENTRANCE_DELAY = 1.1;

const exploreButtonVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.9, filter: 'blur(16px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.4,
      delay: EXPLORE_BUTTON_ENTRANCE_DELAY,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exploreHidden: {
    opacity: 0,
    y: 0,
    scale: 0.8,
    filter: 'blur(8px)',
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// 4-Section Scroll Track (Hero -> Computers & Simulations -> Qrome Products
// [+ Agronomic Insights handoff within it] -> Placeholder 2).
//
// Hero, Contenders, and Qrome Products' own reveal (Cut 1, Cut 2, K1, K2)
// have been stable throughout this build and are untouched below. Everything
// AFTER Qrome is fully revealed is instead built from plain, named VH
// lengths — not derived fractions of each other — specifically because that
// area needed several rounds of "a bit more/less space here" corrections.
// Adjusting the pacing going forward should only ever mean changing one of
// these numbers, with no other formula to recompute by hand.
const HERO_VH = 240;
const CONTENDERS_VH = 240; // Contenders revealed & Cut 2 transition to Qrome + immediate continuous handoff into Insights
const CAROUSEL_VH = 340; // horizontal carousel scroll-through, 5 slides
const GAP_2_VH = 45; // breathing room after the carousel ends
const CUT3_VH = 240; // diagonal wipe into Section 4 — same width as Cut 1 / Cut 2

const TRACK_VH =
  HERO_VH +
  CONTENDERS_VH +
  CAROUSEL_VH +
  GAP_2_VH +
  CUT3_VH;

const K1 = HERO_VH / TRACK_VH;
const K2 = (HERO_VH + CONTENDERS_VH) / TRACK_VH;
// Seamless, continuous handoff: as Cut 2 reveals Qrome at 0.58, it immediately
// flows continuously with the scroll into Agronomic Insights without pausing or sticking
const HANDOFF_START = K1 + 0.58 * (K2 - K1);
const HANDOFF_END = K2;
const CAROUSEL_START = K2;
const CAROUSEL_END = (HERO_VH + CONTENDERS_VH + CAROUSEL_VH) / TRACK_VH;
const CUT3_START =
  (HERO_VH + CONTENDERS_VH + CAROUSEL_VH + GAP_2_VH) /
  TRACK_VH;
const K3 = 1.0;

export function ParallaxExperience() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isExploreActive, setIsExploreActive] = useState(false);
  const [isFeaturesExploreActive, setIsFeaturesExploreActive] = useState(false);
  const [selectedGeneticTrait, setSelectedGeneticTrait] = useState<CornSeedTrait | null>(null);
  const activeTraitAtmosphere = getTraitAtmosphere(selectedGeneticTrait);
  const currentSlide = 0;
  const [isHeroRevealed, setIsHeroRevealed] = useState(true);
  const [isSectionRevealed, setIsSectionRevealed] = useState(false);
  const [isSectionThreeRevealed, setIsSectionThreeRevealed] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  // Lock vertical scrolling completely while explore mode is active
  // without modifying body overflow so the page scroll position is never reset
  useEffect(() => {
    if (!isExploreActive) {
      setSelectedGeneticTrait(null);
      return;
    }

    const preventScrollWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    const preventScrollTouch = (e: globalThis.TouchEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedGeneticTrait) {
          setSelectedGeneticTrait(null);
        } else {
          setIsExploreActive(false);
        }
        return;
      }
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventScrollWheel, { passive: false });
    window.addEventListener('touchmove', preventScrollTouch, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', preventScrollWheel);
      window.removeEventListener('touchmove', preventScrollTouch);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExploreActive, selectedGeneticTrait]);

  // Scroll tracking across the scroll track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // =========================================================================
  // SPRING-BASED INERTIA PHYSICS FOR RESPONSIVE, WEIGHTED PARALLAX
  // =========================================================================
  const diagonalCutSpring = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    mass: 0.5,
    restDelta: 0.0001,
  });

  // Smooth cinematic inertia physics for background parallax and ambient transforms
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    mass: 0.5,
    restDelta: 0.0001,
  });

  // Track active section index based on scroll progress. Switches as soon as
  // each transition's diagonal cut is actually visible, not at the full
  // K1/HANDOFF_START boundary — matching the same 0.35 fraction already used
  // elsewhere (isNavHidden below, sectionThreeEntryProgress) for "this
  // section has visibly started appearing."
  useEffect(() => {
    const section2Start = K1 + 0.35 * (K2 - K1);
    const unsubscribe = smoothProgress.on('change', (p) => {
      if (p < 0.35 * K1) {
        setActiveSectionIndex(0);
      } else if (p < section2Start) {
        setActiveSectionIndex(1);
      } else if (p < CUT3_START) {
        setActiveSectionIndex(2);
      } else {
        setActiveSectionIndex(3);
      }
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Floating nav dots visibility: earlier/finer thresholds than
  // activeSectionIndex's full section boundaries — Contenders is already
  // visible well before K1 (Cut 1 finishes revealing it partway through
  // [0, K1]), and Section 4 similarly starts appearing partway through Cut 3,
  // so gating on the full K1/CUT3_START boundaries made the nav pop in late.
  const [isNavHidden, setIsNavHidden] = useState(true);
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (p) => {
      const show = p >= 0.35 * K1 && p < CUT3_START + 0.2 * (K3 - CUT3_START);
      setIsNavHidden(!show);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Trigger entrance animations for Hero, Section 2 (Contenders), and Section 3 (Qrome Products)
  // Both when scrolling down into each section AND when scrolling back up into each section
  useEffect(() => {
    const checkRevealed = (val: number) => {
      // 1. Hero (Section 1)
      if (val < 0.38 * K1) {
        setIsHeroRevealed(true);
      } else if (val >= 0.46 * K1) {
        setIsHeroRevealed(false);
      }

      // 2. Contenders (Section 2)
      if (val >= 0.52 * K1 && val < K1 + 0.46 * (K2 - K1)) {
        setIsSectionRevealed(true);
      } else if (val < 0.44 * K1 || val >= K1 + 0.52 * (K2 - K1)) {
        setIsSectionRevealed(false);
      }

      // 3. Qrome Products (Section 3)
      if (
        val >= K1 + 0.48 * (K2 - K1) &&
        val < HANDOFF_START + 0.15 * (HANDOFF_END - HANDOFF_START)
      ) {
        setIsSectionThreeRevealed(true);
      } else if (
        val < K1 + 0.40 * (K2 - K1) ||
        val >= HANDOFF_START + 0.25 * (HANDOFF_END - HANDOFF_START)
      ) {
        setIsSectionThreeRevealed(false);
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

  // 3D Tilt angles for Hero stage background assets
  const heroRotateX = useTransform(smoothMouseY, [-1, 1], [3.5, -3.5]);
  const heroRotateY = useTransform(smoothMouseX, [-1, 1], [-4.5, 4.5]);

  // Deep Background Layer Parallax (Hero mouse displacement)
  const heroMouseBgX = useTransform(smoothMouseX, [-1, 1], [20, -20]);
  const heroMouseBgY = useTransform(smoothMouseY, [-1, 1], [14, -14]);

  // Midground Particle Field Parallax (Intermediate floating drift)
  const heroMouseParticlesX = useTransform(smoothMouseX, [-1, 1], [-12, 12]);
  const heroMouseParticlesY = useTransform(smoothMouseY, [-1, 1], [-8, 8]);

  // Dynamic light reflection hotspot for Hero
  const lightX = useTransform(smoothMouseX, [-1, 1], ['28%', '72%']);
  const lightY = useTransform(smoothMouseY, [-1, 1], ['28%', '72%']);

  // =========================================================================
  // WEIGHTED DIAGONAL CUT-IN TRANSITION GEOMETRY (TRANSITION 1: HERO -> CONTENDERS)
  // =========================================================================
  const cut1Left = useTransform(
    diagonalCutSpring,
    [0, 0.08 * K1, 0.38 * K1, 0.58 * K1, K1],
    [135, 125, 50, -12, -22]
  );
  const cut1Right = useTransform(
    diagonalCutSpring,
    [0, 0.08 * K1, 0.38 * K1, 0.58 * K1, K1],
    [110, 100, 25, -38, -48]
  );

  const clipPathString1 = useTransform(
    [cut1Left, cut1Right],
    ([left, right]) => `polygon(0% ${left}%, 100% ${right}%, 100% 100%, 0% 100%)`
  );

  // =========================================================================
  // WEIGHTED DIAGONAL CUT-IN TRANSITION GEOMETRY (TRANSITION 2: CONTENDERS -> QROME PRODUCTS)
  // =========================================================================
  const cut2Left = useTransform(
    diagonalCutSpring,
    [K1, K1 + 0.08 * (K2 - K1), K1 + 0.38 * (K2 - K1), K1 + 0.58 * (K2 - K1), K2],
    [135, 125, 50, -12, -22]
  );
  const cut2Right = useTransform(
    diagonalCutSpring,
    [K1, K1 + 0.08 * (K2 - K1), K1 + 0.38 * (K2 - K1), K1 + 0.58 * (K2 - K1), K2],
    [110, 100, 25, -38, -48]
  );

  const clipPathString2 = useTransform(
    [cut2Left, cut2Right],
    ([left, right]) => `polygon(0% ${left}%, 100% ${right}%, 100% 100%, 0% 100%)`
  );

  // =========================================================================
  // WEIGHTED DIAGONAL CUT-IN TRANSITION GEOMETRY (TRANSITION 3: QROME/INSIGHTS -> PLACEHOLDER 2)
  // Exactly the same shape/width as Transitions 1 & 2 (CUT3_VH), starting
  // only at CUT3_START — well after the Insights carousel has finished
  // (CAROUSEL_END) plus its own GAP_2_VH breathing room.
  // =========================================================================
  const cut3Left = useTransform(
    diagonalCutSpring,
    [CUT3_START, CUT3_START + 0.08 * (K3 - CUT3_START), CUT3_START + 0.38 * (K3 - CUT3_START), CUT3_START + 0.58 * (K3 - CUT3_START), K3],
    [135, 125, 50, -12, -22]
  );
  const cut3Right = useTransform(
    diagonalCutSpring,
    [CUT3_START, CUT3_START + 0.08 * (K3 - CUT3_START), CUT3_START + 0.38 * (K3 - CUT3_START), CUT3_START + 0.58 * (K3 - CUT3_START), K3],
    [110, 100, 25, -38, -48]
  );

  const clipPathString3 = useTransform(
    [cut3Left, cut3Right],
    ([left, right]) => `polygon(0% ${left}%, 100% ${right}%, 100% 100%, 0% 100%)`
  );

  // =========================================================================
  // SECTION 1 (HERO) PARALLAX DISPLACEMENTS UNDER THE CUT
  // =========================================================================
  const heroScrollBgY = useTransform(smoothProgress, [0, 0.55 * K1], ['0%', '20%']);
  const heroBgScale = useTransform(smoothProgress, [0, 0.55 * K1], [1.06, 1.22]);
  const heroBgOpacity = useTransform(smoothProgress, [0.42 * K1, 0.58 * K1], [1, 0]);

  const heroScrollTextY = useTransform(smoothProgress, [0, 0.55 * K1], ['0%', '-35%']);
  const heroTextScale = useTransform(smoothProgress, [0, 0.55 * K1], [1.0, 0.90]);
  const heroTextOpacity = useTransform(smoothProgress, [0.36 * K1, 0.52 * K1], [1, 0]);

  // Hero Particles: glide upward
  const heroParticlesY = useTransform(smoothProgress, [0, 0.55 * K1], ['0%', '-90%']);

  // Hero Scroll Indicator ("EXPLORE"): fades out early in scroll
  const heroIndicatorOpacity = useTransform(smoothProgress, [0, 0.10 * K1], [1, 0]);
  const heroIndicatorY = useTransform(smoothProgress, [0, 0.10 * K1], [0, 20]);

  // Combined vertical offsets for Hero background and particle elements
  const combinedHeroBgY = useTransform(
    [heroMouseBgY, heroScrollBgY],
    ([my, sy]) => `calc(${my}px + ${sy})`
  );

  const combinedHeroParticlesY = useTransform(
    [heroMouseParticlesY, heroParticlesY],
    ([my, sy]) => `calc(${my}px + ${sy})`
  );

  // =========================================================================
  // SECTION 2 (CONTENDERS) PARALLAX DISPLACEMENTS INSIDE CUT 1 / UNDER CUT 2
  // =========================================================================
  const contendersBgY = useTransform(smoothProgress, [0.10 * K1, 0.84 * K1], ['20%', '0%']);
  const contendersBgScale = useTransform(smoothProgress, [0.10 * K1, 0.84 * K1], [1.14, 1.0]);

  // As Cut 2 sweeps in, Section 2 sinks slightly
  const contendersSinkY = useTransform(smoothProgress, [K1, K2], ['0%', '16%']);
  const contendersSinkScale = useTransform(smoothProgress, [K1, K2], [1.0, 1.08]);

  // Constellation Canvas traverses vertically
  const contendersCanvasY = useTransform(smoothProgress, [0.10 * K1, 0.90 * K1], ['22%', '-22%']);

  // Typography rises gracefully into view
  const contendersTextY = useTransform(smoothProgress, [0.46 * K1, 0.58 * K1], ['20%', '0%']);
  const contendersTextOpacity = useTransform(
    smoothProgress,
    [0.46 * K1, 0.58 * K1, K1 + 0.35 * (K2 - K1), K1 + 0.48 * (K2 - K1)],
    [0, 1, 1, 0]
  );

  // Section 2 Mouse displacement parallax
  const contendersMouseBgX = useTransform(smoothMouseX, [-1, 1], [14, -14]);
  const contendersMouseBgY = useTransform(smoothMouseY, [-1, 1], [10, -10]);
  const combinedContendersBgY = useTransform(
    [contendersMouseBgY, contendersBgY, contendersSinkY],
    ([my, sy, ey]) => `calc(${my}px + ${sy} + ${ey})`
  );
  const combinedContendersBgScale = useTransform(
    [contendersBgScale, contendersSinkScale],
    ([a, b]) => (a as number) * (b as number)
  );

  const contendersMouseTextX = useTransform(smoothMouseX, [-1, 1], [-8, 8]);
  const contendersMouseTextY = useTransform(smoothMouseY, [-1, 1], [-6, 6]);
  const combinedContendersTextY = useTransform(
    [contendersMouseTextY, contendersTextY],
    ([my, sy]) => `calc(${my}px + ${sy})`
  );

  // =========================================================================
  // SECTION 3 (PLACEHOLDER / QROME) PARALLAX DISPLACEMENTS INSIDE CUT 2
  // =========================================================================
  // Dedicated 0 -> 1 normalized entry progress for Section 3 (Qrome Products)
  // Reaches full center right at HANDOFF_START as Cut 2 clears
  const sectionThreeEntryProgress = useTransform(
    smoothProgress,
    [K1 + 0.35 * (K2 - K1), HANDOFF_START],
    [0, 1]
  );
  const placeholderTextY = useTransform(
    smoothProgress,
    [K1 + 0.35 * (K2 - K1), HANDOFF_START],
    ['20%', '0%']
  );
  const placeholderTextOpacity = useTransform(
    smoothProgress,
    [K1 + 0.35 * (K2 - K1), K1 + 0.48 * (K2 - K1)],
    [0, 1]
  );

  // =========================================================================
  // GLOBAL BACKGROUND GRADIENT & COLOR GRADING TRANSFORMS
  // =========================================================================
  // Neutral near-black color grading (matching the Talos app's flat #050505
  // background) instead of the previous emerald-to-blue hue shift.
  const globalGradTop = useTransform(
    smoothProgress,
    [0, 0.35 * K1, 0.70 * K1],
    ['#0a0a0a', '#080808', '#0c0c0c']
  );
  const globalGradMid = useTransform(
    smoothProgress,
    [0, 0.35 * K1, 0.70 * K1],
    ['#050505', '#040404', '#060606']
  );
  const globalGradBase = useTransform(
    smoothProgress,
    [0, 0.35 * K1, 0.70 * K1],
    ['#020202', '#010101', '#020202']
  );
  const globalGlowColor = useTransform(
    smoothProgress,
    [0, 0.35 * K1, 0.70 * K1],
    [
      'rgba(255, 255, 255, 0.08)',
      'rgba(255, 255, 255, 0.05)',
      'rgba(255, 255, 255, 0.04)',
    ]
  );

  const globalBgGradient = useTransform(
    [globalGradTop, globalGradMid, globalGradBase],
    ([top, mid, base]) =>
      `radial-gradient(135% 125% at 50% 18%, ${top} 0%, ${mid} 54%, ${base} 100%)`
  );

  // Active interaction triggers
  const heroPointerEvents = useTransform(smoothProgress, (p) => (p < 0.46 * K1 ? 'auto' : 'none'));
  const contendersPointerEvents = useTransform(smoothProgress, (p) =>
    p >= 0.52 * K1 && p < K1 + 0.50 * (K2 - K1) ? 'auto' : 'none'
  );
  // Section 3 (Qrome Products + Insights) clipped container remains interactive until Section 4 wipe
  const sectionThreePointerEvents = useTransform(smoothProgress, (p) =>
    p >= K1 + 0.35 * (K2 - K1) && p < CUT3_START ? 'auto' : 'none'
  );

  // Section 3 (Qrome Products) always scrolls naturally with the screen:
  // - Enters by rising into view from 24% as Cut 2 sweeps across
  // - Settles into centered view
  // - Without pausing, scrolls continuously upward off the screen into Insights (0% -> -100%)
  const sectionThreeExitProgress = useTransform(
    smoothProgress,
    [HANDOFF_START, HANDOFF_END],
    [0, 1]
  );
  const placeholderContentY = useTransform(
    smoothProgress,
    [K1 + 0.35 * (K2 - K1), HANDOFF_START, HANDOFF_END],
    ['24%', '0%', '-100%']
  );
  const placeholderContentOpacity = useTransform(
    smoothProgress,
    [
      K1 + 0.35 * (K2 - K1),
      K1 + 0.48 * (K2 - K1),
      HANDOFF_START + 0.12 * (HANDOFF_END - HANDOFF_START),
      HANDOFF_END,
    ],
    [0, 1, 1, 0]
  );
  const placeholderContentPointerEvents = useTransform(smoothProgress, (p) =>
    p >= K1 + 0.35 * (K2 - K1) && p < HANDOFF_START + 0.45 * (HANDOFF_END - HANDOFF_START) ? 'auto' : 'none'
  );

  // Agronomic Insights scrolls directly into place from below simultaneously (100% -> 0%)
  const insightsEntryProgress = useTransform(
    smoothProgress,
    [HANDOFF_START, HANDOFF_END],
    [0, 1]
  );
  const insightsExitProgress = useTransform(
    smoothProgress,
    [CAROUSEL_END, CUT3_START],
    [0, 1]
  );

  const insightsContentY = useTransform(
    smoothProgress,
    [HANDOFF_START, HANDOFF_END, CAROUSEL_END, CUT3_START],
    ['100%', '0%', '0%', '-36px']
  );
  const insightsContentOpacity = useTransform(
    smoothProgress,
    [HANDOFF_START, HANDOFF_START + 0.45 * (HANDOFF_END - HANDOFF_START), CAROUSEL_END, CUT3_START],
    [0, 1, 1, 0]
  );
  const insightsContentScale = useTransform(
    smoothProgress,
    [HANDOFF_START, HANDOFF_END, CAROUSEL_END, CUT3_START],
    [0.94, 1.0, 1.0, 0.96]
  );
  const insightsContentPointerEvents = useTransform(smoothProgress, (p) =>
    p >= HANDOFF_START + 0.45 * (HANDOFF_END - HANDOFF_START) && p < CUT3_START ? 'auto' : 'none'
  );

  // =========================================================================
  // SECTION 4 (PLACEHOLDER 2) PARALLAX DISPLACEMENTS INSIDE CUT 3
  // Mirrors the same reveal timing Sections 2 & 3 used relative to their
  // cuts, applied to Cut 3's own [CUT3_START, K3] span.
  // =========================================================================
  const section4TextY = useTransform(
    smoothProgress,
    [CUT3_START + 0.46 * (K3 - CUT3_START), CUT3_START + 0.58 * (K3 - CUT3_START)],
    ['20%', '0%']
  );
  const section4TextOpacity = useTransform(
    smoothProgress,
    [CUT3_START + 0.46 * (K3 - CUT3_START), CUT3_START + 0.56 * (K3 - CUT3_START)],
    [0, 1]
  );
  const sectionFourPointerEvents = useTransform(smoothProgress, (p) =>
    p >= CUT3_START + 0.46 * (K3 - CUT3_START) ? 'auto' : 'none'
  );

  // Track cursor movement and touch gestures across viewport for Hero 3D tilt & parallax depth
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

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const width = window.innerWidth;
        const height = window.innerHeight;
        const normalizedX = (touch.clientX / width) * 2 - 1;
        const normalizedY = (touch.clientY / height) * 2 - 1;
        mouseX.set(normalizedX);
        mouseY.set(normalizedY);
      }
    };

    const handleTouchEnd = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
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

    if (diff > 50 && scrollYProgress.get() < 0.45 * K1) {
      // Swiped UP: advance smoothly to Section 2 full-screen
      scrollToContenders();
    } else if (diff < -50 && scrollYProgress.get() > 0.45 * K1) {
      // Swiped DOWN: return to Hero section
      scrollToHero();
    }
  };

  // Keyboard navigation between sections
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PageDown') {
        if (activeSectionIndex === 0) scrollToContenders();
        else if (activeSectionIndex === 1) scrollToPlaceholder();
        else if (activeSectionIndex === 2) scrollToSection4();
      } else if (e.key === 'PageUp') {
        if (activeSectionIndex === 3) scrollToPlaceholder();
        else if (activeSectionIndex === 2) scrollToContenders();
        else if (activeSectionIndex === 1) scrollToHero();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSectionIndex]);

  // Story sections metadata for global floating navigation
  const STORY_SECTIONS = [
    { id: 'revolution', label: 'Revolution', number: '01' },
    { id: 'simulations', label: 'Computers & Simulations', number: '02' },
    { id: 'products', label: 'Qrome® Products', number: '03' },
    { id: 'placeholder2', label: 'Download App', number: '04' },
  ];

  const scrollAnimRef = useRef<number | null>(null);

  // Clean up any ongoing scroll animation on unmount
  useEffect(() => {
    return () => {
      if (scrollAnimRef.current) {
        cancelAnimationFrame(scrollAnimRef.current);
        scrollAnimRef.current = null;
      }
    };
  }, []);

  /**
   * Continuous smooth scroll animator.
   * Uses a quadratic ease-in-out curve with a brisk, continuous ~1.4s to 2.1s duration
   * to ensure continuous, uninterrupted motion across sections without lingering or pausing.
   */
  const smoothScrollTo = (targetY: number, customDuration?: number) => {
    const startY = window.scrollY || window.pageYOffset;
    const distance = Math.abs(targetY - startY);
    if (distance <= 4) {
      window.scrollTo({ top: targetY });
      return;
    }

    if (scrollAnimRef.current) {
      cancelAnimationFrame(scrollAnimRef.current);
      scrollAnimRef.current = null;
    }

    const isHero = targetY === 0;
    const viewportH = typeof window !== 'undefined' ? (window.innerHeight || 800) : 800;
    const screenCount = Math.max(1, distance / viewportH);

    // Continuous, unhurried glide back to top:
    // Distance-adaptive duration ensuring that when low on the screen (deep sections 3 & 4, ~10-13 screens down),
    // the scroll doesn't rush past at excessive speeds, while keeping intermediate sections fluid
    // without stalling or lingering:
    // - 1-2 screens: ~1.4s - 1.6s
    // - 4-5 screens: ~2.1s - 2.4s
    // - 8-9 screens: ~3.1s - 3.4s
    // - 11-13 screens (very low): ~3.8s - 4.2s
    const duration =
      customDuration ??
      (isHero
        ? Math.min(4200, Math.max(1350, 1100 + screenCount * 250))
        : Math.min(2000, Math.max(1000, 900 + screenCount * 120)));

    const startTime = performance.now();

    // Continuous quadratic ease-in-out curve:
    // Maintains steady, uninterrupted momentum through intermediate sections,
    // avoiding dead zones or plateaus that feel like stopping for a second.
    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const abort = () => {
      if (scrollAnimRef.current) {
        cancelAnimationFrame(scrollAnimRef.current);
        scrollAnimRef.current = null;
      }
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
    };

    const onWheel = (e: WheelEvent) => {
      // Guard against residual trackpad momentum during the first 300ms
      const elapsed = performance.now() - startTime;
      if (elapsed < 300 && Math.abs(e.deltaY) < 16) {
        return;
      }
      abort();
    };

    const onTouchStart = () => {
      const elapsed = performance.now() - startTime;
      if (elapsed > 200) {
        abort();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeInOutQuad(progress);
      const currentPos = startY + (targetY - startY) * eased;

      window.scrollTo(0, currentPos);

      if (progress < 1) {
        scrollAnimRef.current = requestAnimationFrame(step);
      } else {
        window.scrollTo(0, targetY);
        scrollAnimRef.current = null;
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('touchstart', onTouchStart);
      }
    };

    scrollAnimRef.current = requestAnimationFrame(step);
  };

  // Smooth scroll helper: return to Hero (Section 1) with slow, cinematic easing
  const scrollToHero = () => {
    smoothScrollTo(0);
  };

  // Smooth scroll helper: advance to Section 2 (Computers & Simulations)
  const scrollToContenders = () => {
    if (!containerRef.current) return;
    const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
    const target = containerRef.current.offsetTop + maxScroll * (0.58 * K1);
    smoothScrollTo(target, 1400);
  };

  // Smooth scroll helper: advance to Section 3 (Qrome Products)
  const scrollToPlaceholder = () => {
    if (!containerRef.current) return;
    const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
    const target = containerRef.current.offsetTop + maxScroll * (K1 + 0.58 * (K2 - K1));
    smoothScrollTo(target, 1500);
  };

  // Opening the "View The Features" panel always snaps to the same
  // anchor point within Qrome Products first (same one scrollToPlaceholder
  // settles at), so the panel appears in a consistent spot regardless of
  // where the user happened to be scrolled to when they clicked it.
  const handleFeaturesExploreActiveChange = (active: boolean) => {
    if (active) {
      scrollToPlaceholder();
    }
    setIsFeaturesExploreActive(active);
  };

  // Same fix as "View The Features": opening Explore The Library always
  // snaps to Contenders' own settled anchor point first, so the constellation
  // and its featured nodes always appear in the same spot regardless of
  // where the user was scrolled to when they clicked it.
  const handleExploreActiveChange = (active: boolean) => {
    if (active) {
      // A dedicated, slightly-lower anchor than scrollToContenders (which
      // other nav — keyboard, swipe, nav dots — still uses unchanged).
      if (containerRef.current) {
        const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
        const target = containerRef.current.offsetTop + maxScroll * (0.66 * K1);
        smoothScrollTo(target, 1400);
      }
    }
    setIsExploreActive(active);
  };

  // Smooth scroll helper: jump to a specific slide in Section 3's horizontal scroll
  const scrollToInsightsSlide = (slideIndex: number) => {
    if (!containerRef.current) return;
    const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
    const totalSlides = 5;
    const slideFrac = totalSlides > 1 ? slideIndex / (totalSlides - 1) : 0;
    const targetProgress = CAROUSEL_START + slideFrac * (CAROUSEL_END - CAROUSEL_START);
    const target = containerRef.current.offsetTop + maxScroll * targetProgress;
    smoothScrollTo(target, 900);
  };

  // Smooth scroll helper: advance to Section 4 (Placeholder 2)
  const scrollToSection4 = () => {
    if (!containerRef.current) return;
    const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
    const target = containerRef.current.offsetTop + maxScroll * (CUT3_START + 0.58 * (K3 - CUT3_START));
    smoothScrollTo(target, 1600);
  };

  const handleSectionClick = (index: number) => {
    if (index === 0) scrollToHero();
    else if (index === 1) scrollToContenders();
    else if (index === 2) scrollToPlaceholder();
    else if (index === 3) scrollToSection4();
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
        height: `${TRACK_VH}vh`,
      }}
      className="relative w-full transition-colors duration-300"
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
            {/* Deep Background Layer with Calisthenics Anatomical Sculpture */}
            <motion.div
              id="hero-bg-layer"
              style={{
                x: heroMouseBgX,
                y: combinedHeroBgY,
                scale: heroBgScale,
                opacity: heroBgOpacity,
              }}
              className="absolute -inset-[6%] z-0 pointer-events-none"
            >
              <img
                src="/hero.png"
                alt="Talos Calisthenics Anatomical Sculpture"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/hero-corn.png')) {
                    target.src = '/hero-corn.png';
                  }
                }}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />

              {/* Dynamic Studio Rim Lighting (Clean, neutral high-end studio sheen) */}
              <motion.div
                style={{
                  background: useTransform(
                    [lightX, lightY],
                    ([lx, ly]) =>
                      `radial-gradient(circle at ${lx} ${ly}, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.03) 35%, transparent 70%)`
                  ),
                }}
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
              />

              {/* Luminous Volumetric Cosmic Nebula Haze on the right (Soft, subtle ambient haze) */}
              <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_88%_44%,_rgba(16,185,129,0.07)_0%,_rgba(6,78,59,0.03)_36%,_transparent_70%)] pointer-events-none mix-blend-screen"
                aria-hidden="true"
              />

              {/* Studio Floor Specular Reflection Sheen at bottom */}
              <div
                className="absolute bottom-0 inset-x-0 h-48 bg-[radial-gradient(ellipse_at_76%_90%,_rgba(52,211,153,0.06)_0%,_rgba(6,78,59,0.02)_45%,_transparent_75%)] pointer-events-none mix-blend-screen"
                aria-hidden="true"
              />

              {/* Pure Obsidian Header Shading Mask to keep the header bar clean, dark, and clear of green tint */}
              <div
                className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#030303]/90 via-[#030303]/45 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Vignette & Cinematic Studio Framing */}
              <div
                className="absolute inset-0 bg-radial-[circle_at_50%_45%] from-transparent via-[#050505]/20 to-[#020202]/85 pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/70 pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 via-transparent to-[#050505]/30 pointer-events-none"
                aria-hidden="true"
              />
            </motion.div>

            {/* Hero Particles: Midground layer with reactive mouse drift */}
            <motion.div
              id="hero-particles-layer"
              style={{
                x: heroMouseParticlesX,
                y: combinedHeroParticlesY,
              }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <ParticleField />
            </motion.div>
          </motion.div>

          {/* Hero Foreground Headline & Copy (Completely stable, free of 3D clipping or disappearing hover effects) */}
          {/* Hero Foreground Headline & Copy with Liquid Magnetic Hover Pull */}
          <motion.div
            id="hero-content-layer"
            style={{
              opacity: heroTextOpacity,
              y: heroScrollTextY,
              scale: heroTextScale,
              pointerEvents: heroPointerEvents,
            }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none mt-16 sm:mt-24"
          >
            <div className="max-w-7xl mx-auto w-full pointer-events-auto">
              {/* Massive Bold Headline with Slow Cinematic Phase/Blur Entrance & Organic Liquid Pull */}
              <motion.h1
                id="hero-title"
                variants={headlineLineVariants}
                initial="hidden"
                animate={isHeroRevealed ? 'visible' : 'hidden'}
                className="font-display font-medium text-[clamp(1.3rem,5vw,4.2rem)] whitespace-nowrap tracking-wide uppercase text-white leading-[1.08] drop-shadow-[0_12px_40px_rgba(0,0,0,0.9)] select-none will-change-[filter,opacity,transform]"
              >
                <LiquidPullText
                  text="CALISTHENICS. REVOLUTIONIZED."
                  maxPull={1}
                  maxBlur={5}
                  radius={120}
                  lerpFactor={0.12}
                />
              </motion.h1>

              {/* Subtitle with Slow Cinematic Phase/Blur Entrance (No Hover Effect) */}
              <motion.p
                id="hero-subtitle"
                variants={paragraphVariants}
                initial="hidden"
                animate={isHeroRevealed ? 'visible' : 'hidden'}
                className="mt-4 sm:mt-6 md:mt-7 text-sm sm:text-base md:text-lg font-light text-white/75 tracking-[0.04em] max-w-lg mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] px-4 select-none will-change-[filter,opacity,transform]"
              >
                Master skills step by step with AI that adapts to every session
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* =========================================================================
            SECTION 2: CONTENDERS (CLIPPED BY DYNAMIC DIAGONAL CUT-IN 1 / UNDER CUT 2)
            ========================================================================= */}
        <motion.div
          id="contenders-diagonal-clipped-container"
          style={{
            clipPath: clipPathString1,
            WebkitClipPath: clipPathString1,
            background: globalBgGradient,
          }}
          className="absolute inset-0 w-full h-full overflow-hidden [perspective:1400px] z-20"
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
                scale: combinedContendersBgScale,
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
                      `radial-gradient(circle at ${lx} ${ly}, ${glow} 0%, rgba(34, 197, 94, 0.05) 40%, transparent 75%)`
                  ),
                }}
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
              />

              {/* Base Atmospheric Emerald Fog */}
              <motion.div
                style={{
                  opacity: useTransform(smoothProgress, [0.10 * K1, 0.65 * K1], [0.85, 0.4]),
                }}
                className="absolute inset-0 bg-radial-[circle_at_60%_45%] from-emerald-950/45 via-[#0a120d]/80 to-[#050505]/95 pointer-events-none"
                aria-hidden="true"
              />

              {/* Dark Obsidian Shift Atmosphere Fog */}
              <motion.div
                style={{
                  opacity: useTransform(smoothProgress, [0.35 * K1, 0.85 * K1], [0, 0.92]),
                  background:
                    'radial-gradient(ellipse at 60% 45%, rgba(6, 46, 28, 0.45) 0%, rgba(5, 15, 10, 0.82) 50%, #020604 100%)',
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

              {/* Dynamic Reactive Node Atmosphere: Alters the background lighting depending on the active node/tooltip */}
              <AnimatePresence>
                {isExploreActive && selectedGeneticTrait && (
                  <motion.div
                    key={`node-bg-atmosphere-${selectedGeneticTrait.category}-${selectedGeneticTrait.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 pointer-events-none z-[4]"
                  >
                    {/* Primary Atmospheric Wash: Radial bloom biased towards the active node & trait panel */}
                    <div
                      className="absolute inset-0 pointer-events-none mix-blend-screen transition-all duration-700"
                      style={{
                        background: `radial-gradient(ellipse 95% 80% at 65% 48%, ${activeTraitAtmosphere.radialGlow} 0%, ${activeTraitAtmosphere.ambientWash} 42%, transparent 75%)`,
                      }}
                      aria-hidden="true"
                    />

                    {/* Secondary Deep Chromatic Underglow across the stage */}
                    <div
                      className="absolute inset-0 pointer-events-none transition-all duration-700"
                      style={{
                        background: `radial-gradient(circle at 40% 55%, ${activeTraitAtmosphere.ambientBase} 0%, transparent 68%)`,
                      }}
                      aria-hidden="true"
                    />

                    {/* Subtle Chromatic Vignette Tint at edges for atmospheric immersion */}
                    <div
                      className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-60 transition-all duration-700"
                      style={{
                        background: `radial-gradient(ellipse at 50% 50%, transparent 40%, ${activeTraitAtmosphere.vignetteTint} 100%)`,
                      }}
                      aria-hidden="true"
                    />

                    {/* Horizon Rim Sheen */}
                    <div
                      className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-50 transition-all duration-700"
                      style={{
                        background: `linear-gradient(135deg, ${activeTraitAtmosphere.rimAccent} 0%, transparent 40%, ${activeTraitAtmosphere.rimAccent} 100%)`,
                      }}
                      aria-hidden="true"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
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
                isShiftedLeft={isExploreActive}
                selectedTrait={selectedGeneticTrait}
                onSelectTrait={setSelectedGeneticTrait}
              />
            </motion.div>
          </motion.div>

          {/* Slow, autonomously-drifting glow blob — shifts its color dynamically when a node/tooltip is active */}
          <motion.div
            animate={{
              x: [0, 60, -20, 0],
              y: [0, -40, 30, 0],
            }}
            transition={{
              duration: 26,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-[15%] right-[10%] w-[36vw] h-[36vw] max-w-[520px] max-h-[520px] rounded-full pointer-events-none z-[15] opacity-70 transition-all duration-700"
            style={{
              background:
                isExploreActive && selectedGeneticTrait
                  ? activeTraitAtmosphere.blobGradient
                  : 'radial-gradient(circle, rgba(245, 158, 11, 0.10) 0%, rgba(245, 158, 11, 0.04) 45%, transparent 75%)',
            }}
            aria-hidden="true"
          />

          {/* Inset depth vignette (top inner highlight + bottom shadow),
              matching the Talos app's own flat-gradient depth technique. */}
          <div
            className="absolute inset-0 pointer-events-none z-[16]"
            style={{
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 60px 100px -40px rgba(0,0,0,0.6)',
            }}
            aria-hidden="true"
          />

          {/* Contenders Foreground Content (Headline, Narrative & Feature List + Floating Explore Library Button) */}
          <motion.div
            id="contenders-content-layer"
            style={{
              x: contendersMouseTextX,
              y: combinedContendersTextY,
              opacity: contendersTextOpacity,
              pointerEvents: contendersPointerEvents,
            }}
            className="absolute inset-0 z-20 flex flex-col lg:flex-row items-start lg:items-center justify-between px-6 sm:px-12 lg:px-16 max-w-7xl w-full mx-auto pointer-events-none"
          >
            <motion.div
              animate={{
                opacity: isExploreActive ? 0 : 1,
                x: isExploreActive ? -140 : 0,
                filter: isExploreActive ? 'blur(16px)' : 'blur(0px)',
                scale: isExploreActive ? 0.92 : 1,
                pointerEvents: isExploreActive ? 'none' : 'auto',
              }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="max-w-2xl text-left pointer-events-auto [transform:translateZ(24px)]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  variants={sectionContentVariants}
                  initial="hidden"
                  animate={isSectionRevealed ? 'visible' : 'hidden'}
                  exit="exit"
                >
                  {/* Bold Condensed Section 2 Heading with staggered line reveals & organic liquid hover */}
                  <h2
                    id="contenders-title"
                    className="font-display font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase text-white leading-[1.1] drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)] select-none"
                  >
                    {slide.headline.map((line, idx) => (
                      <motion.span
                        key={idx}
                        variants={headlineLineVariants}
                        className="block will-change-[filter,opacity,transform]"
                      >
                        <LiquidPullText
                          text={line}
                          maxPull={1}
                          maxBlur={5}
                          radius={120}
                          lerpFactor={0.12}
                        />
                      </motion.span>
                    ))}
                  </h2>

                  {/* Section 2 Narrative Description with smooth entrance */}
                  <motion.p
                    id="contenders-description"
                    variants={paragraphVariants}
                    className="mt-5 sm:mt-7 text-sm sm:text-base font-light text-white/75 tracking-[0.02em] leading-relaxed max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] select-none will-change-[filter,opacity,transform]"
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
                        className="flex items-start sm:items-center gap-3 text-xs sm:text-sm md:text-[15px] text-white/90 will-change-[filter,opacity,transform]"
                      >
                        <span className="flex-shrink-0 mt-0.5 sm:mt-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.25)]">
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
            </motion.div>

            {/* Floating Glassmorphic Circle Button in the Constellation / Particles
                Field — phases in after the text (EXPLORE_BUTTON_ENTRANCE_DELAY),
                then toggles quickly (no extra delay) with explore mode. */}
            <motion.div
              variants={exploreButtonVariants}
              initial="hidden"
              animate={isExploreActive ? 'exploreHidden' : isSectionRevealed ? 'visible' : 'hidden'}
              style={{ pointerEvents: isExploreActive ? 'none' : 'auto' }}
              className="mt-8 lg:mt-0 pointer-events-auto [transform:translateZ(32px)] flex items-center justify-center lg:mr-8 xl:mr-14 self-center lg:self-auto"
            >
              <ExploreLibraryButton onClick={() => handleExploreActiveChange(true)} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* =========================================================================
            SECTION 3: QROME PRODUCTS (CLIPPED BY DYNAMIC DIAGONAL CUT-IN 2)
            Continuing to scroll within this same revealed section slides from
            the static placeholder content into the Agronomic Insights
            horizontal-scroll content — no second diagonal cut. The container
            itself carries the shared background color so any sub-pixel gap
            between the two sliding panels blends in instead of exposing the
            differently-colored global background layer underneath.
            ========================================================================= */}
        <motion.div
          id="placeholder-diagonal-clipped-container"
          style={{
            clipPath: clipPathString2,
            WebkitClipPath: clipPathString2,
            pointerEvents: sectionThreePointerEvents,
          }}
          className="absolute inset-0 w-full h-full z-30 overflow-hidden bg-[#050505] [perspective:1400px]"
        >
          {/* Persistent shared background — rendered once, never slides or
              fades. Both the Qrome content and the Insights content sit on
              top of this as foreground layers, so the background truly
              never changes through the handoff (including the gap between
              the two where neither panel's content is on screen). */}
          <ProductsAtmosphereBackground mouseX={smoothMouseX} mouseY={smoothMouseY} />

          <motion.div
            style={{
              y: placeholderContentY,
              opacity: placeholderContentOpacity,
              pointerEvents: placeholderContentPointerEvents,
            }}
            className="absolute inset-0"
          >
            <PlaceholderSection
              isRevealed={isSectionThreeRevealed}
              entryProgress={sectionThreeEntryProgress}
              exitProgress={sectionThreeExitProgress}
              contentY={placeholderTextY}
              contentOpacity={placeholderTextOpacity}
              mouseX={smoothMouseX}
              mouseY={smoothMouseY}
              isFeaturesExploreActive={isFeaturesExploreActive}
              onFeaturesExploreActiveChange={handleFeaturesExploreActiveChange}
            />
          </motion.div>

          <motion.div
            style={{
              y: insightsContentY,
              opacity: insightsContentOpacity,
              scale: insightsContentScale,
              pointerEvents: insightsContentPointerEvents,
            }}
            className="absolute inset-0"
          >
            <HorizontalTextScrollSection
              scrollProgress={smoothProgress}
              sectionProgressStart={CAROUSEL_START}
              sectionProgressEnd={CAROUSEL_END}
              entryProgress={insightsEntryProgress}
              exitProgress={insightsExitProgress}
              mouseX={smoothMouseX}
              mouseY={smoothMouseY}
              onSlideSelect={scrollToInsightsSlide}
            />
          </motion.div>
        </motion.div>

        {/* =========================================================================
            SECTION 4: PLACEHOLDER 2 (CLIPPED BY DYNAMIC DIAGONAL CUT-IN 3)
            ========================================================================= */}
        <motion.div
          id="placeholder2-diagonal-clipped-container"
          style={{
            clipPath: clipPathString3,
            WebkitClipPath: clipPathString3,
            pointerEvents: sectionFourPointerEvents,
          }}
          className="absolute inset-0 w-full h-full z-[35] overflow-hidden [perspective:1400px]"
        >
          <PlaceholderSection2 contentY={section4TextY} contentOpacity={section4TextOpacity} />
        </motion.div>

        {/* =========================================================================
            CHROME NAVIGATION & CONTROLS (SHARED PERSISTENT INTERFACE)
            ========================================================================= */}
        {/* Top Header Bar with Logo & Hamburger Menu (Slow, gentle fade in closely following text entrance) */}
        <motion.header
          id="main-header"
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: isExploreActive ? 0 : 1,
            y: isExploreActive ? -20 : 0,
            pointerEvents: isExploreActive ? 'none' : 'auto',
          }}
          transition={{
            duration: isExploreActive ? 0.35 : 2.2,
            delay: isExploreActive ? 0 : 1.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute top-0 left-0 right-0 z-40 w-full py-6 md:py-8 will-change-[opacity,transform]"
        >
          <div className="max-w-7xl w-full mx-auto px-6 sm:px-12 lg:px-16 flex items-center justify-between">
            {/* Pioneer Brand Logo (Clicking smoothly returns to Hero) */}
            <button
              id="header-pioneer-logo-btn"
              onClick={scrollToHero}
              className="focus:outline-none cursor-pointer hover:opacity-90 active:scale-95 transition-opacity"
              aria-label="Return to top"
            >
              <PioneerLogo />
            </button>

            {/* "Get Early Access" — glassmorphic, jumps straight to the
                Download App section instead of opening the nav drawer.
                Hover reveals an ambient emerald glow bloom + a diagonal
                sheen sweep, rather than a flat background highlight. */}
            <button
              id="get-early-access-btn"
              onClick={scrollToSection4}
              className="relative group inline-flex items-center justify-center px-4 py-3 sm:px-[18px] sm:py-3.5 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Get early access"
            >
              {/* Refined subtle ambient starlight glow bloom behind the button */}
              <span
                className="absolute -inset-2.5 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500"
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(52,211,153,0.08) 40%, transparent 70%)' }}
                aria-hidden="true"
              />

              {/* Glass surface */}
              <span className="glass absolute inset-0 rounded-full" aria-hidden="true" />

              <span className="relative font-display font-medium text-[10px] sm:text-[11px] tracking-[0.16em] text-white/85 group-hover:text-white uppercase whitespace-nowrap transition-colors duration-200">
                Get Early Access
              </span>
            </button>
          </div>
        </motion.header>

        {/* Floating Right-Edge Navigation Dot Indicator for Main Story Sections
            (Hidden in Hero & the Section 4 Download App screen, or while an
            explore hotspot is active — see isNavHidden above for the
            earlier/finer scroll thresholds this uses.) */}
        <motion.nav
          id="floating-story-navigation"
          animate={{
            opacity: isExploreActive || isFeaturesExploreActive || isNavHidden ? 0 : 1,
            x: isExploreActive || isFeaturesExploreActive || isNavHidden ? 40 : 0,
            pointerEvents: isExploreActive || isFeaturesExploreActive || isNavHidden ? 'none' : 'auto',
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Story sections navigation"
          className="absolute right-5 sm:right-8 lg:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-5 z-40 select-none"
        >
          {/* Subtle Vertical Connector Track */}
          <div
            className="absolute left-1/2 top-2.5 bottom-2.5 w-[1px] -translate-x-1/2 bg-gradient-to-b from-white/10 via-white/20 to-white/10 pointer-events-none"
            aria-hidden="true"
          />

          {STORY_SECTIONS.map((section, index) => {
            const isActive = index === activeSectionIndex;
            return (
              <button
                key={section.id}
                id={`nav-story-dot-${index}`}
                onClick={() => handleSectionClick(index)}
                className="relative group flex items-center justify-center p-2 focus:outline-none cursor-pointer"
                aria-label={`Jump to ${section.label}`}
                aria-current={isActive ? 'true' : 'false'}
              >
                {/* Floating Tooltip Pill on Hover */}
                <div className="absolute right-10 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md bg-[#0a0a0a]/92 backdrop-blur-md border border-white/30 text-[11px] font-medium tracking-wider text-white uppercase whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 shadow-[0_4px_20px_rgba(0,0,0,0.8)] flex items-center gap-2">
                  <span className="font-mono text-white text-[10px]">{section.number}</span>
                  <span>{section.label}</span>
                </div>

                {/* Active Animated Orbital Ring vs Inactive Clean Dot —
                    both always mounted and crossfaded via animate, so
                    switching the active section eases smoothly instead of
                    snapping between the two states. */}
                <div className="relative flex items-center justify-center w-7 h-7">
                  <motion.div
                    animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.6 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    {/* Continuous Rotating Segmented Aura */}
                    <motion.svg
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 w-full h-full text-emerald-400"
                      viewBox="0 0 28 28"
                    >
                      <circle
                        cx="14"
                        cy="14"
                        r="11"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeDasharray="45 15"
                        className="opacity-95 drop-shadow-[0_0_6px_rgba(34,197,94,0.6)]"
                      />
                    </motion.svg>
                    {/* Glowing Core Center */}
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9),0_0_20px_rgba(255,255,255,0.5)]" />
                  </motion.div>

                  <motion.div
                    animate={{ opacity: isActive ? 0 : 1, scale: isActive ? 0.5 : 1 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white/90 group-hover:scale-150 transition-all duration-200 group-hover:shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  </motion.div>
                </div>
              </button>
            );
          })}
        </motion.nav>

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
            className="group relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0a0a0a]/80 hover:bg-[#141414]/95 border border-emerald-500/30 hover:border-emerald-400/60 backdrop-blur-md text-emerald-300/80 hover:text-emerald-200 transition-all duration-300 shadow-[0_4px_18px_rgba(0,0,0,0.6)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
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

        {/* Minimal Floating Close Button to Restore Text from Genetic Node Explorer View */}
        <AnimatePresence>
          {isExploreActive && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50 flex items-center pointer-events-auto"
            >
              {/* Gentle continuous float, echoing the Explore The Library button */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <button
                  id="close-library-explore-mode-btn"
                  type="button"
                  onClick={() => setIsExploreActive(false)}
                  className="glass group flex items-center justify-center w-14 h-14 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Close explore view and restore text"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close button for the Qrome Products "View The Features" in-place
            panel — rendered here at the top level (not inside
            PlaceholderSection's own transformed 3D stage) for the same
            position:fixed containing-block reason as the button above. */}
        <AnimatePresence>
          {isFeaturesExploreActive && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-24 sm:top-28 right-[6%] sm:right-[9%] lg:right-[11%] z-50 flex items-center pointer-events-auto"
            >
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <button
                  id="close-features-panel-btn"
                  type="button"
                  onClick={() => setIsFeaturesExploreActive(false)}
                  className="glass group flex items-center justify-center w-14 h-14 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Close features panel"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explore Mode HUD Guidance — rendered here (alongside the Close
            button) rather than inside ConstellationCanvas, because that
            component sits inside the rotateX/rotateY-transformed 3D stage:
            any transformed ancestor becomes the containing block for
            position:fixed descendants, so it was rendering somewhere off the
            actual viewport instead of pinned to the top of the screen. */}
        <AnimatePresence>
          {isExploreActive && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ delay: 0.35, duration: 0.45 }}
              className="fixed top-6 sm:top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-1.5 text-center select-none"
            >
              <span className="font-display font-black text-[10px] sm:text-[11px] tracking-[0.4em] text-white uppercase">
                Explore Mode
              </span>
              <span className="text-[11px] sm:text-xs font-light text-white/40 tracking-wide">
                Click a Node to View Available Moves
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Genetic Trait Inspection Side Panel (Positioned on the Right of the Node Tree in Explore Mode) */}
        <AnimatePresence mode="wait">
          {isExploreActive && selectedGeneticTrait && (
            <motion.div
              id="genetic-trait-side-panel-container"
              key="genetic-trait-side-panel-container"
              className="fixed z-40 right-10 sm:right-16 lg:right-24 xl:right-32 top-1/2 -translate-y-1/2 w-full max-w-[260px] sm:max-w-xs pointer-events-auto"
            >
              {/* Backing Ambient Aura behind the trait tooltip */}
              <div
                className="absolute -inset-10 rounded-3xl blur-3xl pointer-events-none opacity-45 -z-10 transition-all duration-700"
                style={{
                  background: `radial-gradient(circle, ${activeTraitAtmosphere.radialGlow} 0%, transparent 75%)`,
                }}
                aria-hidden="true"
              />
              <GeneticTraitSidePanel
                trait={selectedGeneticTrait}
                onClose={() => setSelectedGeneticTrait(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Genetic Trait Library Explorer Modal */}
        <GeneticLibraryModal
          isOpen={isLibraryModalOpen}
          onClose={() => setIsLibraryModalOpen(false)}
        />
      </div>
    </motion.div>
  );
}

