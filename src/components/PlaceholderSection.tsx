import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import { motion, AnimatePresence, MotionValue, useMotionValue, useSpring, useTransform, LayoutGroup } from 'motion/react';
import { X, Sparkles, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { LiquidPullText } from './LiquidPullText';
import { ExploreLibraryButton } from './ExploreLibraryButton';
import { FloatingPhoneVideo } from './FloatingPhoneVideo';

export interface FeatureDetail {
  id: string;
  title: string;
  category: string;
  paragraph1: string;
  paragraph2: string;
  tags: string[];
  phonePreset: string;
  phoneInterval: string;
  cycle: string;
  minutes: string;
  seconds: string;
  accentColor: string;
}

export const TALOS_FEATURES: FeatureDetail[] = [
  {
    id: 'training-modes',
    title: 'Training Modes',
    category: 'STRUCTURED FOCUS PROTOCOL',
    paragraph1:
      'Training Modes are customizable (Professional Plan), structured work-break templates that eliminate the friction of starting a focus session.',
    paragraph2:
      'They go beyond standard timers by instantly applying scientifically-backed intervals (like "Deep Dive" or "Quick Spark") tailored to the cognitive demand of your task, ensuring you enter your Flow State faster and maintain optimal efficiency.',
    tags: ['Frictionless Intervals', 'Cognitive Demand Tuning', 'Flow State Accelerator'],
    phonePreset: 'The Power Hour',
    phoneInterval: '50 • 10 MIN',
    cycle: '1st Cycle',
    minutes: '49',
    seconds: '49',
    accentColor: '#22d3ee',
  },
  {
    id: 'form-ai',
    title: 'Kinematic Form AI',
    category: 'COMPUTER VISION KINEMATICS',
    paragraph1:
      'Kinematic vision models track your joint angles and velocity rep-by-rep, providing instant auditory and haptic cues during every hold.',
    paragraph2:
      'It eliminates guesswork on false-grip transitions, scapular depression, and hollow-body alignment—ensuring pristine execution before fatigue compromises your mechanics.',
    tags: ['Real-Time Joint Tracking', 'Haptic Angle Cues', 'False-Grip Mechanics'],
    phonePreset: 'Muscle-Up Protocol',
    phoneInterval: '45 • 15 MIN',
    cycle: '2nd Cycle',
    minutes: '38',
    seconds: '12',
    accentColor: '#34d399',
  },
  {
    id: 'progress-telemetry',
    title: 'Progress Telemetry',
    category: 'PHYSIOLOGICAL ADAPTATION',
    paragraph1:
      'Granular strength-to-weight curves and tendon conditioning indexes track your physiological adaptation across every meso-cycle.',
    paragraph2:
      'Auto-regulated volume metrics unlock higher-tier skill variations only when your connective tissue is primed, accelerating your journey toward flawless mastery.',
    tags: ['Strength-to-Weight Curves', 'Tendon Conditioning Index', 'Auto-Regulated Volume'],
    phonePreset: 'Peak Hypertrophy',
    phoneInterval: '30 • 05 MIN',
    cycle: '3rd Cycle',
    minutes: '24',
    seconds: '50',
    accentColor: '#c084fc',
  },
];

interface ProductData {
  id: number;
  brand: string;
  name: string;
  description: string;
  footnote: string;
  modesAbove: number;
  modesBelow: number;
  yieldAdvantage: string;
  comparisonTech: string;
  keyFeatures: string[];
}

const productHeadlineVariants = {
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

const productDescVariants = {
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

const productCtaVariants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(14px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 2.0,
      delay: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    filter: 'blur(6px)',
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const PRODUCTS: ProductData[] = [
  {
    id: 1,
    brand: 'PIONEER® BRAND',
    name: 'VORCEED™ ENLIST® CORN',
    description:
      'Next-generation corn rootworm protection built on the proven power of Qrome® technology with four modes of insect protection. Combined with the Enlist® weed control system for ultimate weed and insect defense.',
    footnote: '[1]',
    modesAbove: 2,
    modesBelow: 2,
    yieldAdvantage: '+4.5 bu/A',
    comparisonTech: 'Legacy CRW Traits in multi-year trials',
    keyFeatures: [
      'Four robust modes of insect action (above and below ground)',
      'Tolerance to 2,4-D choline, glyphosate, and glufosinate',
      'Engineered for maximum root mass retention under heavy pressure',
    ],
  },
  {
    id: 2,
    brand: 'PIONEER® BRAND',
    name: 'OPTIMUM® LEPTRA® CORN',
    description:
      'Superior protection against above-ground pests including corn earworm, European corn borer, Southwestern corn borer, and fall armyworm. Delivers unmatched grain quality and ear health in demanding high-pest geographies.',
    footnote: '[2]',
    modesAbove: 3,
    modesBelow: 0,
    yieldAdvantage: '+6.2 bu/A',
    comparisonTech: 'Non-traited competitive hybrids',
    keyFeatures: [
      'Triple-action above-ground insect protection',
      'Exceptional kernel integrity and reduced mycotoxin contamination',
      'Top-tier agronomics and drydown speed across diverse soil types',
    ],
  },
  {
    id: 3,
    brand: '',
    name: 'Built to Unlock Your Potential',
    description:
      'Talos combines structured skill progressions, an AI coach that responds to every session, and workouts built around your specific weaknesses. Be one of the first to experience a new standard in calisthenics training',
    footnote: '[3]',
    modesAbove: 2,
    modesBelow: 2,
    yieldAdvantage: '+7.7 bu/A',
    comparisonTech: 'SmartStax® technology in 2020 on-farm trials',
    keyFeatures: [
      'Two modes of action above & two modes below for balanced insect control',
      '7.7 bu/A yield advantage over SmartStax® technology in 2020 on-farm trials',
      'Preserves pristine root structure and maximizes nutrient uptake efficiency',
    ],
  },
];

interface PlaceholderSectionProps {
  contentY?: MotionValue<string>;
  contentOpacity?: MotionValue<number>;
  entryProgress?: MotionValue<number>;
  exitProgress?: MotionValue<number>;
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
  isRevealed?: boolean;
  isFeaturesExploreActive?: boolean;
  onFeaturesExploreActiveChange?: (active: boolean) => void;
}

export function PlaceholderSection({
  contentY,
  contentOpacity,
  entryProgress,
  exitProgress,
  mouseX: externalMouseX,
  mouseY: externalMouseY,
  isRevealed = true,
  isFeaturesExploreActive = false,
  onFeaturesExploreActiveChange,
}: PlaceholderSectionProps) {
  // Active product state (QROME® PRODUCTS)
  const selectedProductIndex = 2;
  const setIsFeaturesExploreActive = (active: boolean) => onFeaturesExploreActiveChange?.(active);

  // Active feature mode for the features structure (from user screenshot)
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const currentFeature = TALOS_FEATURES[activeFeatureIndex];

  // Lock vertical scrolling while the features panel is active, without
  // touching body overflow, so scroll position is preserved on close.
  useEffect(() => {
    if (!isFeaturesExploreActive) return;

    const preventScrollWheel = (e: WheelEvent) => {
      e.preventDefault();
    };
    const preventScrollTouch = (e: globalThis.TouchEvent) => {
      e.preventDefault();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFeaturesExploreActive(false);
      } else if (e.key === 'ArrowRight') {
        setActiveFeatureIndex((prev) => (prev + 1) % TALOS_FEATURES.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveFeatureIndex((prev) => (prev - 1 + TALOS_FEATURES.length) % TALOS_FEATURES.length);
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
  }, [isFeaturesExploreActive]);

  // Normalized entry progress: use provided entryProgress, or fallback
  const fallbackEntry = useMotionValue(1);
  const activeEntry = entryProgress || fallbackEntry;

  // Normalized exit progress: use provided exitProgress, or fallback
  const fallbackExit = useMotionValue(0);
  const activeExit = exitProgress || fallbackExit;

  // =========================================================================
  // HIGH-PRECISION ENTRY CHOREOGRAPHY: DECOUPLED TEXT & PRODUCT KINEMATICS
  // =========================================================================

  // 1. LEFT TEXT COLUMN ENTRANCE
  const textColEntryY = useTransform(activeEntry, [0.10, 0.78], [54, 0]);
  const textColEntryOpacity = useTransform(activeEntry, [0.10, 0.68], [0, 1]);

  const brandEyebrowY = useTransform(activeEntry, [0.12, 0.60], [22, 0]);
  const brandEyebrowOpacity = useTransform(activeEntry, [0.12, 0.50], [0, 1]);

  const titleY = useTransform(activeEntry, [0.20, 0.72], [36, 0]);
  const titleOpacity = useTransform(activeEntry, [0.20, 0.62], [0, 1]);
  const titleScale = useTransform(activeEntry, [0.20, 0.74], [0.94, 1]);

  const descY = useTransform(activeEntry, [0.28, 0.80], [28, 0]);
  const descOpacity = useTransform(activeEntry, [0.28, 0.72], [0, 1]);

  const ctaY = useTransform(activeEntry, [0.38, 0.86], [20, 0]);
  const ctaOpacity = useTransform(activeEntry, [0.38, 0.78], [0, 1]);

  // 2. RIGHT / CENTER PRODUCT 3D STAGE ENTRANCE
  const productStageY = useTransform(activeEntry, [0.14, 0.82], [56, 0]);
  const productStageOpacity = useTransform(activeEntry, [0.14, 0.70], [0, 1]);

  const promptY = useTransform(activeEntry, [0.40, 0.90], [-18, 0]);
  const promptOpacity = useTransform(activeEntry, [0.40, 0.80], [0, 1]);

  const glowScale = useTransform(activeEntry, [0.14, 0.82], [0.45, 1.0]);
  const glowOpacity = useTransform(activeEntry, [0.14, 0.70], [0, 1]);

  const orbitScale = useTransform(activeEntry, [0.20, 0.86], [0.65, 1.0]);
  const orbitOpacity = useTransform(activeEntry, [0.20, 0.74], [0, 1]);
  const orbitEntryRotateZ = useTransform(activeEntry, [0.20, 0.86], [-22, 0]);

  const kernelEntryScale = useTransform(activeEntry, [0.16, 0.84], [0.72, 1.0]);
  const kernelEntryY = useTransform(activeEntry, [0.16, 0.84], [44, 0]);
  const kernelEntryRotateY = useTransform(activeEntry, [0.16, 0.86], [-26, 0]);
  const kernelEntryRotateX = useTransform(activeEntry, [0.16, 0.86], [14, 0]);
  const kernelEntryOpacity = useTransform(activeEntry, [0.16, 0.64], [0, 1]);

  const hotspotScale = useTransform(activeEntry, [0.48, 0.96], [0, 1]);
  const hotspotOpacity = useTransform(activeEntry, [0.48, 0.86], [0, 1]);

  // =========================================================================
  // HIGH-PRECISION EXIT CHOREOGRAPHY: DECOUPLED TEXT & PRODUCT KINEMATICS
  // (Cinematic elongated sequence across extended scroll window)
  // =========================================================================

  // 1. LEFT TEXT COLUMN EXIT
  const textColExitY = useTransform(activeExit, [0.10, 0.92], [0, -52]);
  const textColExitOpacity = useTransform(activeExit, [0.10, 0.86], [1, 0]);

  const brandEyebrowExitY = useTransform(activeExit, [0.18, 0.80], [0, -32]);
  const brandEyebrowExitOpacity = useTransform(activeExit, [0.18, 0.72], [1, 0]);

  const titleExitY = useTransform(activeExit, [0.18, 0.84], [0, -46]);
  const titleExitOpacity = useTransform(activeExit, [0.18, 0.76], [1, 0]);
  const titleExitScale = useTransform(activeExit, [0.18, 0.88], [1, 0.93]);

  const descExitY = useTransform(activeExit, [0.12, 0.68], [0, -36]);
  const descExitOpacity = useTransform(activeExit, [0.12, 0.60], [1, 0]);

  const ctaExitY = useTransform(activeExit, [0.08, 0.52], [0, -26]);
  const ctaExitOpacity = useTransform(activeExit, [0.08, 0.45], [1, 0]);

  // 2. CENTER / RIGHT PRODUCT 3D STAGE EXIT
  const productStageExitY = useTransform(activeExit, [0.08, 0.94], [0, -58]);
  const productStageExitOpacity = useTransform(activeExit, [0.08, 0.88], [1, 0]);

  const promptExitY = useTransform(activeExit, [0.0, 0.36], [0, -22]);
  const promptExitOpacity = useTransform(activeExit, [0.0, 0.30], [1, 0]);

  const glowExitScale = useTransform(activeExit, [0.10, 0.88], [1.0, 0.42]);
  const glowExitOpacity = useTransform(activeExit, [0.10, 0.78], [1, 0]);

  const orbitExitScale = useTransform(activeExit, [0.10, 0.92], [1.0, 0.60]);
  const orbitExitOpacity = useTransform(activeExit, [0.10, 0.80], [1, 0]);
  const orbitExitRotateZ = useTransform(activeExit, [0.10, 0.94], [0, 32]);

  const kernelExitScale = useTransform(activeExit, [0.08, 0.94], [1.0, 0.64]);
  const kernelExitY = useTransform(activeExit, [0.08, 0.94], [0, -52]);
  const kernelExitRotateY = useTransform(activeExit, [0.08, 0.94], [0, 30]);
  const kernelExitRotateX = useTransform(activeExit, [0.08, 0.94], [0, -16]);
  const kernelExitOpacity = useTransform(activeExit, [0.24, 0.88], [1, 0]);

  const hotspotExitScale = useTransform(activeExit, [0.0, 0.38], [1, 0]);
  const hotspotExitOpacity = useTransform(activeExit, [0.0, 0.32], [1, 0]);

  // =========================================================================
  // COMBINED TRANSFORMS (MOUSE TILT + ENTRY + EXIT)
  // =========================================================================

  // Internal tilt physics if external not provided
  const internalMouseX = useMotionValue(0);
  const internalMouseY = useMotionValue(0);
  const activeMouseX = externalMouseX || internalMouseX;
  const activeMouseY = externalMouseY || internalMouseY;

  const springConfig = { damping: 26, stiffness: 100, mass: 0.75 };
  const smoothX = useSpring(activeMouseX, springConfig);
  const smoothY = useSpring(activeMouseY, springConfig);

  // Tilt dampening multiplier: smoothly drops to 0 when in view feature mode, disabling all 3D tilt
  const tiltFactor = useSpring(isFeaturesExploreActive ? 0 : 1, {
    damping: 28,
    stiffness: 140,
  });

  useEffect(() => {
    tiltFactor.set(isFeaturesExploreActive ? 0 : 1);
  }, [isFeaturesExploreActive, tiltFactor]);

  // 3D Tilt transforms across Section 3 layers (scaled by tiltFactor)
  const rawStageTiltRotateX = useTransform(smoothY, [-1, 1], [4.5, -4.5]);
  const rawStageTiltRotateY = useTransform(smoothX, [-1, 1], [-5.5, 5.5]);
  const stageTiltRotateX = useTransform(
    [rawStageTiltRotateX, tiltFactor],
    ([rot, factor]) => (rot as number) * (factor as number)
  );
  const stageTiltRotateY = useTransform(
    [rawStageTiltRotateY, tiltFactor],
    ([rot, factor]) => (rot as number) * (factor as number)
  );

  // Text layer: subdued displacement and counter-rotation to significantly reduce tilt on the headline/copy for optimal readability
  const rawTextTiltRotateX = useTransform(smoothY, [-1, 1], [-3.6, 3.6]);
  const rawTextTiltRotateY = useTransform(smoothX, [-1, 1], [4.4, -4.4]);
  const rawTextDisplaceX = useTransform(smoothX, [-1, 1], [-2.5, 2.5]);
  const rawTextDisplaceY = useTransform(smoothY, [-1, 1], [-2, 2]);

  const textTiltRotateX = useTransform(
    [rawTextTiltRotateX, tiltFactor],
    ([rot, factor]) => (rot as number) * (factor as number)
  );
  const textTiltRotateY = useTransform(
    [rawTextTiltRotateY, tiltFactor],
    ([rot, factor]) => (rot as number) * (factor as number)
  );
  const textDisplaceX = useTransform(
    [rawTextDisplaceX, tiltFactor],
    ([disp, factor]) => (disp as number) * (factor as number)
  );
  const textDisplaceY = useTransform(
    [rawTextDisplaceY, tiltFactor],
    ([disp, factor]) => (disp as number) * (factor as number)
  );

  // Orbit ring tilt angle
  const rawOrbitTiltX = useTransform(smoothY, [-1, 1], [-8, 8]);
  const rawOrbitTiltY = useTransform(smoothX, [-1, 1], [10, -10]);
  const orbitTiltX = useTransform(
    [rawOrbitTiltX, tiltFactor],
    ([tilt, factor]) => (tilt as number) * (factor as number)
  );
  const orbitTiltY = useTransform(
    [rawOrbitTiltY, tiltFactor],
    ([tilt, factor]) => (tilt as number) * (factor as number)
  );

  const currentProduct = PRODUCTS[selectedProductIndex];

  const handleContainerMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isFeaturesExploreActive) return;
    if (!externalMouseX) {
      const rect = e.currentTarget.getBoundingClientRect();
      const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normalizedY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      internalMouseX.set(normalizedX);
      internalMouseY.set(normalizedY);
    }
  };

  // Kernel mouse-tilt additions
  const rawKernelTiltX = useTransform(smoothY, [-1, 1], [9, -9]);
  const rawKernelTiltY = useTransform(smoothX, [-1, 1], [-12, 12]);
  const kernelTiltX = useTransform(
    [rawKernelTiltX, tiltFactor],
    ([tilt, factor]) => (tilt as number) * (factor as number)
  );
  const kernelTiltY = useTransform(
    [rawKernelTiltY, tiltFactor],
    ([tilt, factor]) => (tilt as number) * (factor as number)
  );

  // Left column combined transforms
  const combinedTextColY = useTransform(
    [textDisplaceY, textColEntryY, textColExitY],
    ([mouseY, entryY, exitY]) => (mouseY as number) + (entryY as number) + (exitY as number)
  );
  const combinedTextColOpacity = useTransform(
    [textColEntryOpacity, textColExitOpacity],
    ([enOp, exOp]) => (enOp as number) * (exOp as number)
  );

  const combinedBrandEyebrowY = useTransform(
    [brandEyebrowY, brandEyebrowExitY],
    ([enY, exY]) => (enY as number) + (exY as number)
  );
  const combinedBrandEyebrowOpacity = useTransform(
    [brandEyebrowOpacity, brandEyebrowExitOpacity],
    ([enOp, exOp]) => (enOp as number) * (exOp as number)
  );

  const combinedTitleY = useTransform(
    [titleY, titleExitY],
    ([enY, exY]) => (enY as number) + (exY as number)
  );
  const combinedTitleOpacity = useTransform(
    [titleOpacity, titleExitOpacity],
    ([enOp, exOp]) => (enOp as number) * (exOp as number)
  );
  const combinedTitleScale = useTransform(
    [titleScale, titleExitScale],
    ([enSc, exSc]) => (enSc as number) * (exSc as number)
  );

  const combinedDescY = useTransform(
    [descY, descExitY],
    ([enY, exY]) => (enY as number) + (exY as number)
  );
  const combinedDescOpacity = useTransform(
    [descOpacity, descExitOpacity],
    ([enOp, exOp]) => (enOp as number) * (exOp as number)
  );

  const combinedCtaY = useTransform(
    [ctaY, ctaExitY],
    ([enY, exY]) => (enY as number) + (exY as number)
  );
  const combinedCtaOpacity = useTransform(
    [ctaOpacity, ctaExitOpacity],
    ([enOp, exOp]) => (enOp as number) * (exOp as number)
  );

  // Center / Right Stage combined transforms
  const combinedProductStageY = useTransform(
    [productStageY, productStageExitY],
    ([enY, exY]) => (enY as number) + (exY as number)
  );
  const combinedProductStageOpacity = useTransform(
    [productStageOpacity, productStageExitOpacity],
    ([enOp, exOp]) => (enOp as number) * (exOp as number)
  );

  const combinedPromptY = useTransform(
    [promptY, promptExitY],
    ([enY, exY]) => (enY as number) + (exY as number)
  );
  const combinedPromptOpacity = useTransform(
    [promptOpacity, promptExitOpacity],
    ([enOp, exOp]) => (enOp as number) * (exOp as number)
  );

  const combinedGlowScale = useTransform(
    [glowScale, glowExitScale],
    ([enSc, exSc]) => (enSc as number) * (exSc as number)
  );
  const combinedGlowOpacity = useTransform(
    [glowOpacity, glowExitOpacity],
    ([enOp, exOp]) => (enOp as number) * (exOp as number)
  );

  const combinedOrbitScale = useTransform(
    [orbitScale, orbitExitScale],
    ([enSc, exSc]) => (enSc as number) * (exSc as number)
  );
  const combinedOrbitOpacity = useTransform(
    [orbitOpacity, orbitExitOpacity],
    ([enOp, exOp]) => (enOp as number) * (exOp as number)
  );
  const combinedOrbitRotateZ = useTransform(
    [orbitEntryRotateZ, orbitExitRotateZ],
    ([enRot, exRot]) => (enRot as number) + (exRot as number)
  );

  const combinedKernelScale = useTransform(
    [kernelEntryScale, kernelExitScale],
    ([enSc, exSc]) => (enSc as number) * (exSc as number)
  );
  const combinedKernelY = useTransform(
    [kernelEntryY, kernelExitY],
    ([enY, exY]) => (enY as number) + (exY as number)
  );
  const combinedKernelRotateY = useTransform(
    [kernelTiltY, kernelEntryRotateY, kernelExitRotateY],
    ([tiltY, enRotY, exRotY]) => (tiltY as number) + (enRotY as number) + (exRotY as number)
  );
  const combinedKernelRotateX = useTransform(
    [kernelTiltX, kernelEntryRotateX, kernelExitRotateX],
    ([tiltX, enRotX, exRotX]) => (tiltX as number) + (enRotX as number) + (exRotX as number)
  );
  const combinedKernelOpacity = useTransform(
    [kernelEntryOpacity, kernelExitOpacity],
    ([enOp, exOp]) => (enOp as number) * (exOp as number)
  );

  const combinedHotspotScale = useTransform(
    [hotspotScale, hotspotExitScale],
    ([enSc, exSc]) => (enSc as number) * (exSc as number)
  );
  const combinedHotspotOpacity = useTransform(
    [hotspotOpacity, hotspotExitOpacity],
    ([enOp, exOp]) => (enOp as number) * (exOp as number)
  );

  return (
    <div
      id="placeholder-section-container"
      onMouseMove={handleContainerMouseMove}
      className={`relative w-full h-full min-h-screen overflow-hidden select-none flex items-center justify-center transition-all duration-700 ${
        isFeaturesExploreActive ? '[perspective:none]' : '[perspective:1400px]'
      }`}
    >
      {/* The shared atmospheric background is rendered once, persistently,
          by the parent (ParallaxExperience) — this component is
          foreground content only. */}

      {/* =========================================================================
          3D TILTED MAIN CONTENT STAGE CONTAINER (TILT FLATTENS IN FEATURE MODE)
          ========================================================================= */}
      <motion.div
        id="products-3d-stage"
        style={{
          y: entryProgress ? 0 : (contentY || 0),
          opacity: contentOpacity || 1,
          rotateX: stageTiltRotateX,
          rotateY: stageTiltRotateY,
          transformStyle: isFeaturesExploreActive ? 'flat' : 'preserve-3d',
        }}
        className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-12 lg:px-16 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 flex flex-col justify-center min-h-[580px] lg:min-h-[640px] pointer-events-none"
      >
        {/* Centered Phone Stage: Phone in the exact horizontal center (50%) of the screen,
            with text & feature button fitted cleanly on the left.
            When clicking "VIEW THE FEATURES", this entire stage fluidly morphs into the
            Feature Exploration Layout via LayoutGroup and coordinates. */}
        <LayoutGroup id="features-mode-stage">
          <div className="w-full my-auto relative">
            {/* Cinematic Stage Ambient Flare when entering features mode */}
            <AnimatePresence>
              {isFeaturesExploreActive && (
                <motion.div
                  key="feature-stage-ambient-flare"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 0.75, 0.45], scale: [0.6, 1.35, 1.1] }}
                  exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[500px] rounded-full pointer-events-none z-0 blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${currentFeature.accentColor}28 0%, rgba(255,255,255,0.03) 50%, transparent 75%)`,
                  }}
                />
              )}
            </AnimatePresence>

            <div
              className={`w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-8 xl:gap-12 relative transition-all duration-1000 ${
                isFeaturesExploreActive ? '' : '[transform-style:preserve-3d]'
              }`}
            >
              {/* LEFT COLUMN: BRAND & OVERVIEW (WHEN IN OVERVIEW MODE) OR FULL FEATURE SPEC SCREEN (WHEN ACTIVE) */}
              <motion.div
                layout="position"
                id="products-left-column"
                style={{
                  x: textDisplaceX,
                  y: combinedTextColY,
                  opacity: combinedTextColOpacity,
                  rotateX: textTiltRotateX,
                  rotateY: textTiltRotateY,
                }}
                transition={{
                  layout: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
                }}
                className={`relative z-20 text-left pointer-events-auto w-full col-span-1 lg:row-start-1 transition-[max-width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isFeaturesExploreActive
                    ? 'lg:col-start-1 lg:col-end-8 max-w-2xl'
                    : 'lg:col-start-1 lg:col-end-5 max-w-md'
                } ${
                  isFeaturesExploreActive ? '[transform:none]' : '[transform:translateZ(8px)]'
                }`}
              >
                <AnimatePresence mode="wait">
                  {!isFeaturesExploreActive ? (
                    <motion.div
                      key="overview-content"
                      initial={{ opacity: 0, x: -24, filter: 'blur(12px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{
                        opacity: 0,
                        x: -32,
                        filter: 'blur(14px)',
                        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                      }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full pb-1"
                    >
                    {/* Brand & Product Headline */}
                    <h2
                      id="product-section-headline"
                      className="font-display font-medium text-2xl sm:text-3xl lg:text-3xl xl:text-4xl tracking-wide uppercase text-white leading-[1.12] drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] select-none"
                    >
                      {currentProduct.brand ? (
                        <motion.span
                          variants={productHeadlineVariants}
                          className="block text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-white/70 mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] will-change-[filter,opacity,transform]"
                        >
                          <LiquidPullText
                            text={currentProduct.brand}
                            maxPull={1}
                            maxBlur={5}
                            radius={120}
                            lerpFactor={0.12}
                          />
                        </motion.span>
                      ) : null}
                      <motion.span
                        variants={productHeadlineVariants}
                        className="block text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] will-change-[filter,opacity,transform]"
                      >
                        <LiquidPullText
                          text={currentProduct.name}
                          maxPull={1}
                          maxBlur={5}
                          radius={120}
                          lerpFactor={0.12}
                        />
                      </motion.span>
                    </h2>

                    {/* Body Paragraph */}
                    <motion.p
                      id="product-section-description"
                      variants={productDescVariants}
                      className="mt-3.5 sm:mt-4 text-xs sm:text-sm lg:text-[13px] xl:text-sm font-light text-white/75 tracking-[0.02em] leading-relaxed max-w-md drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)] will-change-[filter,opacity,transform] select-none"
                    >
                      {currentProduct.description}
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`feature-view-${currentFeature.id}`}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.12,
                          delayChildren: 0.2,
                        },
                      },
                      exit: {
                        opacity: 0,
                        x: 16,
                        filter: 'blur(10px)',
                        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    className="w-full pb-2"
                  >
                    {/* Interactive Protocol Stepper Header */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: -12, filter: 'blur(8px)' },
                        visible: {
                          opacity: 1,
                          y: 0,
                          filter: 'blur(0px)',
                          transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                        },
                      }}
                      className="flex flex-wrap items-center gap-3 mb-5 sm:mb-6 select-none"
                    >
                      {/* Live Protocol Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md shadow-sm">
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{
                            backgroundColor: currentFeature.accentColor,
                            boxShadow: `0 0 10px ${currentFeature.accentColor}`,
                          }}
                        />
                        <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-white/90">
                          PROTOCOL 0{activeFeatureIndex + 1} / 0{TALOS_FEATURES.length}
                        </span>
                      </div>

                      {/* Interactive Segmented Progress Capsules */}
                      <div className="flex items-center gap-1.5">
                        {TALOS_FEATURES.map((feat, idx) => (
                          <button
                            key={feat.id}
                            type="button"
                            onClick={() => setActiveFeatureIndex(idx)}
                            aria-label={`Jump to feature ${idx + 1}: ${feat.title}`}
                            className="group py-1 cursor-pointer focus:outline-none"
                          >
                            <div
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                idx === activeFeatureIndex
                                  ? 'w-7 bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]'
                                  : 'w-2.5 bg-white/20 hover:bg-white/45 group-hover:w-3.5'
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      {/* Category eyebrow */}
                      <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40 hidden sm:inline-block">
                        • {currentFeature.category}
                      </span>
                    </motion.div>

                    {/* Big Clean Feature Title with Kinetic Slide */}
                    <div className="overflow-hidden">
                      <motion.h2
                        id="feature-view-headline"
                        variants={{
                          hidden: { opacity: 0, y: 28, filter: 'blur(14px)' },
                          visible: {
                            opacity: 1,
                            y: 0,
                            filter: 'blur(0px)',
                            transition: { duration: 1.15, ease: [0.16, 1, 0.3, 1] },
                          },
                        }}
                        className="font-display font-light text-4xl sm:text-5xl lg:text-[54px] xl:text-6xl text-white tracking-tight leading-[1.08] select-none"
                      >
                        {currentFeature.title}
                      </motion.h2>
                    </div>

                    {/* Luminous accent underline beam */}
                    <motion.div
                      variants={{
                        hidden: { scaleX: 0, opacity: 0 },
                        visible: {
                          scaleX: 1,
                          opacity: 1,
                          transition: { duration: 1.25, delay: 0.25, ease: [0.16, 1, 0.3, 1] },
                        },
                      }}
                      style={{
                        originX: 0,
                        background: `linear-gradient(90deg, ${currentFeature.accentColor} 0%, rgba(255,255,255,0.15) 75%, transparent 100%)`,
                      }}
                      className="h-[2px] w-36 sm:w-48 mt-3 rounded-full"
                    />

                    {/* Paragraph 1 */}
                    <motion.p
                      id="feature-view-p1"
                      variants={{
                        hidden: { opacity: 0, y: 18, filter: 'blur(10px)' },
                        visible: {
                          opacity: 1,
                          y: 0,
                          filter: 'blur(0px)',
                          transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
                        },
                      }}
                      className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-[16.5px] text-zinc-300 font-light leading-relaxed max-w-xl select-none"
                    >
                      {currentFeature.paragraph1}
                    </motion.p>

                    {/* Paragraph 2 */}
                    <motion.p
                      id="feature-view-p2"
                      variants={{
                        hidden: { opacity: 0, y: 18, filter: 'blur(10px)' },
                        visible: {
                          opacity: 1,
                          y: 0,
                          filter: 'blur(0px)',
                          transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
                        },
                      }}
                      className="mt-3.5 sm:mt-4 text-sm sm:text-base lg:text-[16.5px] text-zinc-400 font-light leading-relaxed max-w-xl select-none"
                    >
                      {currentFeature.paragraph2}
                    </motion.p>

                    {/* Feature Micro-Badges */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 14 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
                        },
                      }}
                      className="mt-5 flex flex-wrap items-center gap-2 select-none"
                    >
                      {currentFeature.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-white/75 tracking-wide backdrop-blur-sm"
                        >
                          <span
                            className="w-1 h-1 rounded-full"
                            style={{ backgroundColor: currentFeature.accentColor }}
                          />
                          {tag}
                        </span>
                      ))}
                    </motion.div>

                    {/* Bottom Action Controls: Back button (first) & Next Feature button (second) */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 16 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
                        },
                      }}
                      className="mt-7 sm:mt-9 flex items-center gap-3.5 select-none"
                    >
                      {/* Back button (First) */}
                      <button
                        id="feature-back-to-overview-btn"
                        type="button"
                        onClick={() => setIsFeaturesExploreActive(false)}
                        className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-xs font-mono tracking-widest text-white/80 hover:text-white uppercase transition-all duration-300 cursor-pointer shadow-md active:scale-95"
                        aria-label="Back to overview"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
                        <span>BACK</span>
                      </button>

                      {/* Next Feature button (Second) with luminous shimmer beam */}
                      <button
                        id="feature-next-btn"
                        type="button"
                        onClick={() => {
                          setActiveFeatureIndex((prev) => (prev + 1) % TALOS_FEATURES.length);
                        }}
                        className="group relative overflow-hidden inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white text-black hover:bg-white/95 font-medium text-xs font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-[0_0_24px_rgba(255,255,255,0.22)] active:scale-95"
                        aria-label="Next feature"
                      >
                        {/* Shimmer sweep */}
                        <motion.span
                          animate={{ x: ['-100%', '220%'] }}
                          transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-black/15 to-transparent skew-x-12 pointer-events-none"
                        />
                        <span className="relative z-10">NEXT FEATURE</span>
                        <ArrowRight className="relative z-10 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>

                      {/* Subtle Keyboard hint */}
                      <span className="hidden sm:inline-block text-[10px] font-mono text-white/35 tracking-widest uppercase ml-1">
                        (← / →)
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

              {/* PHONE COLUMN (GLIDES FLUIDLY FROM DEAD CENTER TO RIGHT IN FEATURES VIEW) */}
              <motion.div
                layout="position"
                id="products-phone-stage-wrapper"
                transition={{
                  layout: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
                }}
                className={`relative flex flex-col items-center justify-center z-20 pointer-events-auto col-span-1 lg:row-start-1 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isFeaturesExploreActive
                    ? 'lg:col-start-8 lg:col-end-13'
                    : 'lg:col-start-5 lg:col-end-9'
                }`}
              >
                <motion.div
                  id="products-phone-stage"
                  style={{
                    y: combinedProductStageY,
                    opacity: combinedProductStageOpacity,
                  }}
                  animate={{
                    scale: isFeaturesExploreActive ? 1.05 : 1,
                    y: isFeaturesExploreActive ? [0, -6, 0] : 0,
                  }}
                  transition={{
                    scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                    y: isFeaturesExploreActive
                      ? { duration: 4.8, repeat: Infinity, ease: 'easeInOut' }
                      : { duration: 0.6 },
                  }}
                  className="relative flex flex-col items-center justify-center mx-auto"
                >
                  {/* Dynamic Chromatic Ambient Halo behind phone during feature mode */}
                  <AnimatePresence>
                    {isFeaturesExploreActive && (
                      <motion.div
                        key={`phone-halo-${activeFeatureIndex}`}
                        initial={{ opacity: 0, scale: 0.75 }}
                        animate={{ opacity: 0.65, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.75 }}
                        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute -inset-12 sm:-inset-16 rounded-full pointer-events-none blur-3xl z-0"
                        style={{
                          background:
                            activeFeatureIndex === 0
                              ? 'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.32) 0%, rgba(59, 130, 246, 0.12) 50%, transparent 75%)'
                              : activeFeatureIndex === 1
                              ? 'radial-gradient(circle at 50% 50%, rgba(52, 211, 153, 0.35) 0%, rgba(16, 185, 129, 0.14) 50%, transparent 75%)'
                              : 'radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.32) 0%, rgba(236, 72, 153, 0.12) 50%, transparent 75%)',
                        }}
                      />
                    )}
                  </AnimatePresence>

                  <div className="relative z-10">
                    <FloatingPhoneVideo
                      combinedOpacity={combinedKernelOpacity}
                      hideLabel={isFeaturesExploreActive}
                      isFeaturesActive={isFeaturesExploreActive}
                      activeFeaturePreset={currentFeature.phonePreset}
                      activeFeatureInterval={currentFeature.phoneInterval}
                      activeCycle={currentFeature.cycle}
                      activeMinutes={currentFeature.minutes}
                      activeSeconds={currentFeature.seconds}
                      activeFeatureIndex={activeFeatureIndex}
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* RIGHT COLUMN: "VIEW THE FEATURES" BUTTON (TO THE RIGHT OF THE PHONE) IN OVERVIEW MODE */}
              <AnimatePresence>
                {!isFeaturesExploreActive && (
                  <motion.div
                    key="overview-right-cta"
                    id="products-right-column"
                    style={{
                      y: combinedCtaY,
                      opacity: combinedCtaOpacity,
                    }}
                    initial={{ opacity: 0, scale: 0.85, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      filter: 'blur(14px)',
                      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                    }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-20 flex items-center justify-center pointer-events-auto w-full pt-6 lg:pt-0 col-span-1 lg:col-start-9 lg:col-end-13 lg:row-start-1 select-none [transform:translateZ(8px)]"
                  >
                    <ExploreLibraryButton
                      id="view-the-features-btn"
                      onClick={() => setIsFeaturesExploreActive(true)}
                      ariaLabel="View the Features"
                      lineOne="VIEW THE"
                      lineTwo="FEATURES"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </LayoutGroup>
      </motion.div>
    </div>
  );
}
