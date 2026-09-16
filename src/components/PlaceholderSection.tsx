import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import { motion, AnimatePresence, MotionValue, useMotionValue, useSpring, useTransform } from 'motion/react';
import { X, Sparkles, ShieldCheck } from 'lucide-react';
import { LiquidPullText } from './LiquidPullText';
import { ExploreLibraryButton } from './ExploreLibraryButton';

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
    brand: 'PIONEER® BRAND',
    name: 'QROME® PRODUCTS',
    description:
      'The most optimized balance of insect protection and agronomic performance in the Pioneer portfolio. Two modes of action above and two below, for effective insect control, as well as a 7.7 bu/A yield advantage over SmartStax® technology in 2020 on-farm trials.[3]',
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
  const [isHotspotOpen, setIsHotspotOpen] = useState(false);
  const setIsFeaturesExploreActive = (active: boolean) => onFeaturesExploreActiveChange?.(active);

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

  // 3D Tilt transforms across Section 3 layers
  const stageTiltRotateX = useTransform(smoothY, [-1, 1], [4.5, -4.5]);
  const stageTiltRotateY = useTransform(smoothX, [-1, 1], [-5.5, 5.5]);

  // Text layer: subdued displacement and counter-rotation to significantly reduce tilt on the headline/copy for optimal readability
  const textTiltRotateX = useTransform(smoothY, [-1, 1], [-3.6, 3.6]);
  const textTiltRotateY = useTransform(smoothX, [-1, 1], [4.4, -4.4]);
  const textDisplaceX = useTransform(smoothX, [-1, 1], [-2.5, 2.5]);
  const textDisplaceY = useTransform(smoothY, [-1, 1], [-2, 2]);

  // Orbit ring tilt angle
  const orbitTiltX = useTransform(smoothY, [-1, 1], [-8, 8]);
  const orbitTiltY = useTransform(smoothX, [-1, 1], [10, -10]);

  // 3D Kernel Drag / Spin Physics
  const [kernelDragRotationY, setKernelDragRotationY] = useState(0);
  const [kernelDragRotationX, setKernelDragRotationX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startRotRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentProduct = PRODUCTS[selectedProductIndex];

  // Drag handlers for 3D kernel rotation
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
    startRotRef.current = { x: kernelDragRotationX, y: kernelDragRotationY };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;
    setKernelDragRotationY(startRotRef.current.y + deltaX * 0.7);
    setKernelDragRotationX(Math.max(-30, Math.min(30, startRotRef.current.x - deltaY * 0.4)));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleContainerMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!externalMouseX) {
      const rect = e.currentTarget.getBoundingClientRect();
      const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normalizedY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      internalMouseX.set(normalizedX);
      internalMouseY.set(normalizedY);
    }

    if (isDragging) {
      handlePointerMove(e.clientX, e.clientY);
    }
  };

  // Kernel mouse-tilt additions
  const kernelTiltX = useTransform(smoothY, [-1, 1], [9, -9]);
  const kernelTiltY = useTransform(smoothX, [-1, 1], [-12, 12]);

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
      onMouseUp={handlePointerUp}
      onTouchMove={(e) => {
        if (isDragging && e.touches[0]) {
          handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchEnd={handlePointerUp}
      className="relative w-full h-full min-h-screen overflow-hidden select-none flex items-center justify-center [perspective:1400px]"
    >
      {/* The shared atmospheric background is rendered once, persistently,
          by the parent (ParallaxExperience) — this component is
          foreground content only. */}

      {/* =========================================================================
          3D TILTED MAIN CONTENT STAGE CONTAINER
          ========================================================================= */}
      <motion.div
        id="products-3d-stage"
        style={{
          y: entryProgress ? 0 : (contentY || 0),
          opacity: contentOpacity || 1,
          rotateX: stageTiltRotateX,
          rotateY: stageTiltRotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-12 lg:px-16 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 flex flex-col justify-center min-h-[580px] lg:min-h-[640px] pointer-events-none"
      >
        {/* Top & Middle Grid: Left Text Column + Center 3D Interactive Kernel */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 my-auto translate-y-5 sm:translate-y-7 lg:translate-y-9 [transform-style:preserve-3d]">
          {/* LEFT COLUMN: HERO HEADLINE, DESCRIPTION & LEARN MORE (SUBDUED TILT FOR READABILITY) */}
          <motion.div
            id="products-left-column"
            style={{
              x: textDisplaceX,
              y: combinedTextColY,
              opacity: combinedTextColOpacity,
              rotateX: textTiltRotateX,
              rotateY: textTiltRotateY,
            }}
            className="w-full lg:w-[48%] xl:w-[46%] text-left z-20 pointer-events-auto [transform:translateZ(8px)] relative"
          >
            {/* Headline / description / CTA — fades and pulls back when the
                features panel is active, mirroring how the Contenders
                section's own text recedes in Explore Mode. */}
            <motion.div
              animate={{
                opacity: isFeaturesExploreActive ? 0 : 1,
                x: isFeaturesExploreActive ? -60 : 0,
                filter: isFeaturesExploreActive ? 'blur(12px)' : 'blur(0px)',
                scale: isFeaturesExploreActive ? 0.94 : 1,
                pointerEvents: isFeaturesExploreActive ? 'none' : 'auto',
              }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProduct.id}
                  initial="hidden"
                  animate={isRevealed ? 'visible' : 'hidden'}
                  exit="exit"
                >
                  {/* Brand & Product Headline with enhanced shadow and 3D depth */}
                  <h2
                    id="product-section-headline"
                    className="font-display font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase text-white leading-[1.1] drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] select-none"
                  >
                    <motion.span
                      variants={productHeadlineVariants}
                      className="block drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] will-change-[filter,opacity,transform]"
                    >
                      <LiquidPullText
                        text={currentProduct.brand}
                        maxPull={1}
                        maxBlur={5}
                        radius={120}
                        lerpFactor={0.12}
                      />
                    </motion.span>
                    <motion.span
                      variants={productHeadlineVariants}
                      className="block mt-1 sm:mt-2 text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] origin-left will-change-[filter,opacity,transform]"
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
                    className="mt-5 sm:mt-7 text-sm sm:text-base font-light text-white/75 tracking-[0.02em] leading-relaxed max-w-xl drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)] will-change-[filter,opacity,transform] select-none"
                  >
                    {currentProduct.description}
                  </motion.p>

                  {/* View The Features Action */}
                  <motion.div
                    variants={productCtaVariants}
                    className="mt-6 sm:mt-8 will-change-[filter,opacity,transform]"
                  >
                    <ExploreLibraryButton
                      id="view-the-features-btn"
                      onClick={() => setIsFeaturesExploreActive(true)}
                      ariaLabel="View the Features"
                      lineOne="VIEW THE"
                      lineTwo="FEATURES"
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* In-place Features Panel — replaces the old modal dialog.
                Scroll stays locked to this section (see the effect above)
                and the panel slides/blurs into the same space the headline
                just vacated, instead of opening a full-screen overlay. */}
            <AnimatePresence>
              {isFeaturesExploreActive && (
                <motion.div
                  key="features-panel"
                  initial={{ opacity: 0, x: 44, scale: 0.94, filter: 'blur(16px)' }}
                  animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: 32, scale: 0.95, filter: 'blur(10px)' }}
                  transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  className="absolute inset-0 text-white pointer-events-auto flex flex-col"
                >
                  {/* Panel Header — same treatment as the headline it replaces */}
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/70">
                      {currentProduct.brand}
                    </span>
                    <h3 className="mt-1 font-display font-medium text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide text-white leading-[1.1] drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]">
                      {currentProduct.name}
                    </h3>
                  </div>

                  {/* Key Agronomic Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 mb-5">
                    <div>
                      <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider">Above-Ground</div>
                      <div className="mt-1 font-display font-medium text-lg sm:text-xl text-white">
                        {currentProduct.modesAbove} Modes
                      </div>
                      <div className="text-[10px] text-white/50">Targeted insect action</div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider">Below-Ground</div>
                      <div className="mt-1 font-display font-medium text-lg sm:text-xl text-white">
                        {currentProduct.modesBelow} Modes
                      </div>
                      <div className="text-[10px] text-white/50">Corn rootworm protection</div>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider">Yield Advantage</div>
                      <div className="mt-1 font-display font-medium text-lg sm:text-xl text-white">
                        {currentProduct.yieldAdvantage}
                      </div>
                      <div className="text-[10px] text-white/50">vs {currentProduct.comparisonTech}</div>
                    </div>
                  </div>

                  {/* Key Features List */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-medium uppercase tracking-wider text-white/60">
                      Technology Highlights
                    </h4>
                    {currentProduct.keyFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-light text-white/80">
                        <ShieldCheck className="w-4 h-4 text-white/70 mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Placeholder Action Buttons — same component as "View
                      The Features" but the 'secondary' variant (no outer
                      breathing ring, no float, dimmer glass) so this trio
                      reads as clearly subordinate to the primary CTA. */}
                  <div className="mt-6 flex items-center gap-4 sm:gap-6">
                    <div className="scale-[0.85] sm:scale-[0.9] origin-left -mr-2 sm:-mr-3">
                      <ExploreLibraryButton
                        id="view-specs-btn"
                        ariaLabel="View Specs"
                        lineOne="VIEW"
                        lineTwo="SPECS"
                        variant="secondary"
                      />
                    </div>
                    <div className="scale-[0.85] sm:scale-[0.9] origin-left -mr-2 sm:-mr-3">
                      <ExploreLibraryButton
                        id="compare-traits-btn"
                        ariaLabel="Compare Traits"
                        lineOne="COMPARE"
                        lineTwo="TRAITS"
                        variant="secondary"
                      />
                    </div>
                    <div className="scale-[0.85] sm:scale-[0.9] origin-left">
                      <ExploreLibraryButton
                        id="find-a-dealer-btn"
                        ariaLabel="Find A Dealer"
                        lineOne="FIND A"
                        lineTwo="DEALER"
                        variant="secondary"
                      />
                    </div>
                  </div>

                  {/* Footnote citation */}
                  <div className="mt-6 text-[10px] text-white/40 leading-relaxed">
                    <span className="font-medium text-white/60">{currentProduct.footnote}</span> Data based on
                    2020 on-farm trial comparisons. Individual results may vary based on weather, soil
                    composition, and local pest pressure. Always read and follow all label directions.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* CENTER / RIGHT COLUMN: 3D INTERACTIVE KERNEL & ORBIT RADAR */}
          <motion.div
            style={{
              y: combinedProductStageY,
              opacity: combinedProductStageOpacity,
            }}
            className="w-full lg:w-[52%] xl:w-[54%] relative flex flex-col items-center justify-center min-h-[360px] sm:min-h-[440px] lg:min-h-[480px] z-20 [transform-style:preserve-3d]"
          >
            {/* Top Micro Label: DRAG KERNEL TO DISCOVER */}
            <motion.div
              style={{
                x: textDisplaceX,
                y: combinedPromptY,
                opacity: combinedPromptOpacity,
              }}
              className="text-center mb-2 z-30 select-none pointer-events-none [transform:translateZ(25px)] will-change-transform"
            >
              <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.28em] text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                DRAG KERNEL TO DISCOVER
              </span>
            </motion.div>

            {/* Floating Interactive 3D Kernel Stage */}
            <div
              className="relative w-full max-w-[420px] sm:max-w-[480px] aspect-[1/1] flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto [transform-style:preserve-3d]"
              onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
              onTouchStart={(e) => {
                if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
              }}
            >
              {/* Backlight Ambient Glow with 3D depth and radiant expansion */}
              <motion.div
                style={{
                  scale: combinedGlowScale,
                  opacity: combinedGlowOpacity,
                  background:
                    'radial-gradient(ellipse 60% 65% at 55% 45%, rgba(245, 158, 11, 0.32) 0%, rgba(16, 185, 129, 0.16) 40%, transparent 70%)',
                }}
                className="absolute inset-0 rounded-full pointer-events-none [transform:translateZ(-10px)] origin-center will-change-transform"
              />

              {/* Elliptical Dashed Orbit Ring with Tracking Nodes and 3D dynamic tilt */}
              <motion.div
                style={{
                  rotateX: orbitTiltX,
                  rotateY: orbitTiltY,
                  scale: combinedOrbitScale,
                  opacity: combinedOrbitOpacity,
                  rotateZ: combinedOrbitRotateZ,
                }}
                className="absolute inset-0 w-full h-full pointer-events-none z-10 [transform:translateZ(15px)] [transform-style:preserve-3d] origin-center will-change-transform"
              >
                <svg
                  viewBox="0 0 500 500"
                  className="w-full h-full pointer-events-none overflow-visible"
                >
                  {/* 3D Tilted Dashed Orbit Ring */}
                  <ellipse
                    cx="250"
                    cy="255"
                    rx="185"
                    ry="48"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.60)"
                    strokeWidth="1.3"
                    strokeDasharray="3 7"
                    className="drop-shadow-[0_0_8px_rgba(255,255,255,0.45)]"
                    style={{
                      transform: `rotate(${kernelDragRotationX * 0.15 - 5}deg)`,
                      transformOrigin: '250px 255px',
                    }}
                  />

                  {/* Left Orbit Node Point */}
                  <circle
                    cx="72"
                    cy="253"
                    r="3.5"
                    fill="#ffffff"
                    className="drop-shadow-[0_0_10px_rgba(255,255,255,0.95)]"
                  />

                  {/* Right Orbit Node Point */}
                  <circle
                    cx="428"
                    cy="257"
                    r="3.5"
                    fill="#ffffff"
                    className="drop-shadow-[0_0_10px_rgba(255,255,255,0.95)]"
                  />
                </svg>
              </motion.div>

              {/* 3D ROTATABLE KERNEL MESH CONTAINER WITH INTEGRATED TILT & DRAG */}
              <motion.div
                style={{
                  rotateY: useTransform(combinedKernelRotateY, (val) => val + kernelDragRotationY),
                  rotateX: useTransform(combinedKernelRotateX, (val) => val + kernelDragRotationX),
                  y: combinedKernelY,
                  scale: combinedKernelScale,
                  opacity: combinedKernelOpacity,
                  transformStyle: 'preserve-3d',
                }}
                className="relative w-[210px] sm:w-[260px] md:w-[290px] h-[280px] sm:h-[350px] md:h-[390px] flex items-center justify-center select-none [transform:translateZ(40px)] origin-center will-change-transform"
              >
                {/* Photorealistic SVG Kernel Silhouette & Lighting */}
                <svg
                  viewBox="0 0 400 520"
                  className="w-full h-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.95)]"
                >
                  <defs>
                    {/* Realistic Golden Corn Kernel Gradient */}
                    <radialGradient id="kernelBaseGradTilt" cx="62%" cy="40%" r="65%">
                      <stop offset="0%" stopColor="#ffef99" />
                      <stop offset="20%" stopColor="#e8bf48" />
                      <stop offset="50%" stopColor="#ab8c29" />
                      <stop offset="78%" stopColor="#67581b" />
                      <stop offset="100%" stopColor="#252410" />
                    </radialGradient>

                    {/* Warm Right/Top Highlight Glaze */}
                    <linearGradient id="kernelSunHighlightTilt" x1="20%" y1="0%" x2="100%" y2="80%">
                      <stop offset="0%" stopColor="#fff8db" stopOpacity="0.85" />
                      <stop offset="35%" stopColor="#f7d057" stopOpacity="0.65" />
                      <stop offset="70%" stopColor="#c29623" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#1a1806" stopOpacity="0.9" />
                    </linearGradient>

                    {/* Tip Cap Shading Gradient (Botanical base) */}
                    <linearGradient id="kernelTipCapGradTilt" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#55513c" />
                      <stop offset="45%" stopColor="#2e312b" />
                      <stop offset="85%" stopColor="#1c201a" />
                      <stop offset="100%" stopColor="#0d100d" />
                    </linearGradient>

                    {/* Specular Rim Light */}
                    <linearGradient id="kernelRightRimTilt" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="70%" stopColor="transparent" />
                      <stop offset="88%" stopColor="#fde68a" stopOpacity="0.6" />
                      <stop offset="98%" stopColor="#ffffff" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>

                    {/* Soft Shadow Filter */}
                    <filter id="kernelGlowTilt" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Kernel Back Glow Silhouette */}
                  <path
                    d="M 200 95 C 275 92 315 135 310 215 C 305 295 270 375 235 410 C 215 430 190 440 178 418 C 145 380 95 300 90 220 C 85 140 125 98 200 95 Z"
                    fill="none"
                    stroke="rgba(245, 158, 11, 0.45)"
                    strokeWidth="10"
                    filter="url(#kernelGlowTilt)"
                  />

                  {/* Main Authentic Corn Kernel Body */}
                  <path
                    d="M 200 95 C 275 92 315 135 310 215 C 305 295 270 375 235 410 C 215 430 190 440 178 418 C 145 380 95 300 90 220 C 85 140 125 98 200 95 Z"
                    fill="url(#kernelBaseGradTilt)"
                  />

                  {/* Surface Shading & Crown Curvature Dent */}
                  <path
                    d="M 160 100 C 190 115 220 115 250 102 C 240 145 225 255 215 340 C 200 325 178 245 160 100 Z"
                    fill="rgba(20, 25, 10, 0.42)"
                  />

                  {/* Warm Sunset Highlights Overlay */}
                  <path
                    d="M 200 95 C 275 92 315 135 310 215 C 305 295 270 375 235 410 C 215 430 190 440 178 418 C 145 380 95 300 90 220 C 85 140 125 98 200 95 Z"
                    fill="url(#kernelSunHighlightTilt)"
                  />

                  {/* Bottom Botanical Tip Cap Feature */}
                  <path
                    d="M 182 395 C 195 405 210 405 228 395 C 220 422 205 440 196 448 C 188 440 178 420 182 395 Z"
                    fill="url(#kernelTipCapGradTilt)"
                    stroke="#1a1c15"
                    strokeWidth="0.8"
                  />

                  {/* Right Edge Rim Lighting */}
                  <path
                    d="M 200 95 C 275 92 315 135 310 215 C 305 295 270 375 235 410 C 215 430 190 440 178 418 C 145 380 95 300 90 220 C 85 140 125 98 200 95 Z"
                    fill="url(#kernelRightRimTilt)"
                  />
                </svg>

                {/* CONCENTRIC RADAR TARGET FOCAL POINT WITH 3D POP */}
                <motion.div
                  style={{
                    scale: combinedHotspotScale,
                    opacity: combinedHotspotOpacity,
                  }}
                  className="absolute top-[52%] left-[49%] -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer pointer-events-auto group [transform:translateZ(20px)] origin-center will-change-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsHotspotOpen(true);
                  }}
                  title="Click to inspect internal trait structure"
                >
                  <div className="relative flex items-center justify-center w-12 h-12">
                    {/* Outer Concentric Target Ring */}
                    <div className="absolute inset-0 rounded-full border border-white/50 animate-ping opacity-35" />
                    <div className="absolute inset-1 rounded-full border border-white/70 shadow-[0_0_12px_rgba(255,255,255,0.7)]" />

                    {/* Middle Concentric Ring */}
                    <div className="absolute inset-3 rounded-full border border-white/90" />

                    {/* Solid White Center Core Dot */}
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)] group-hover:scale-125 transition-transform duration-200" />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* =========================================================================
          KERNEL TRAIT HOTSPOT INSPECTION MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isHotspotOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="relative w-full max-w-lg bg-[#041209] border border-zinc-400/40 rounded-2xl p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
            >
              <button
                id="close-hotspot-modal-btn"
                onClick={() => setIsHotspotOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close hotspot inspector"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                <span>Genomic Trait Hotspot</span>
              </div>

              <h3 className="mt-2 font-display font-black text-2xl uppercase text-white">
                Cellular Vigor & Defense Node
              </h3>

              <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
                This seed core contains Pioneer’s proprietary trait packaging with enhanced pericarp
                density, targeted insect-resistant proteins, and moisture retention pathways isolated
                from millions of digital simulation runs.
              </p>

              <div className="mt-5 p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs font-mono text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Current Hybrid:</span>
                  <span className="text-zinc-200 font-bold">{currentProduct.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Active Insect Modes:</span>
                  <span className="text-zinc-200 font-bold">
                    {currentProduct.modesAbove + currentProduct.modesBelow} Total
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">3D Kernel Control:</span>
                  <span className="text-white">Drag anywhere to rotate 360°</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
