import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import { motion, AnimatePresence, MotionValue, useMotionValue, useSpring, useTransform } from 'motion/react';
import { X, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';

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
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
}

export function PlaceholderSection({
  contentY,
  contentOpacity,
  mouseX: externalMouseX,
  mouseY: externalMouseY,
}: PlaceholderSectionProps) {
  // Active product state
  const [selectedProductIndex, setSelectedProductIndex] = useState(2);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [isHotspotOpen, setIsHotspotOpen] = useState(false);

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
          y: contentY || 0,
          opacity: contentOpacity || 1,
          rotateX: stageTiltRotateX,
          rotateY: stageTiltRotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-12 lg:px-16 py-8 sm:py-12 flex flex-col justify-between min-h-[580px] lg:min-h-[640px] pointer-events-none"
      >
        {/* Top & Middle Grid: Left Text Column + Center 3D Interactive Kernel */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 my-auto [transform-style:preserve-3d]">
          {/* LEFT COLUMN: HERO HEADLINE, DESCRIPTION & LEARN MORE (SUBDUED TILT FOR READABILITY) */}
          <motion.div
            id="products-left-column"
            style={{
              x: textDisplaceX,
              y: textDisplaceY,
              rotateX: textTiltRotateX,
              rotateY: textTiltRotateY,
            }}
            className="w-full lg:w-[48%] xl:w-[46%] text-left z-20 pointer-events-auto [transform:translateZ(8px)]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProduct.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Brand & Product Headline with enhanced shadow and 3D depth */}
                <h2
                  id="product-section-headline"
                  className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-[3.8rem] xl:text-[4.4rem] tracking-tight uppercase text-white leading-[0.94] drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
                >
                  <span className="block drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">{currentProduct.brand}</span>
                  <span className="block mt-1 sm:mt-2 text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                    {currentProduct.name}
                  </span>
                </h2>

                {/* Body Paragraph */}
                <p
                  id="product-section-description"
                  className="mt-5 sm:mt-7 text-xs sm:text-sm md:text-[15px] lg:text-[16px] font-normal text-zinc-200/90 leading-relaxed max-w-xl drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]"
                >
                  {currentProduct.description}
                </p>

                {/* LEARN MORE Action Link */}
                <div className="mt-6 sm:mt-8">
                  <button
                    id="product-learn-more-btn"
                    onClick={() => setIsLearnMoreOpen(true)}
                    className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white hover:text-amber-300 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                  >
                    <span>LEARN MORE</span>
                    <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-amber-300 group-hover:translate-x-1.5 transition-all duration-200" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* CENTER / RIGHT COLUMN: 3D INTERACTIVE KERNEL & ORBIT RADAR */}
          <div className="w-full lg:w-[52%] xl:w-[54%] relative flex flex-col items-center justify-center min-h-[360px] sm:min-h-[440px] lg:min-h-[480px] z-20 [transform-style:preserve-3d]">
            {/* Top Micro Label: DRAG KERNEL TO DISCOVER */}
            <motion.div
              style={{
                x: textDisplaceX,
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-2 z-30 select-none pointer-events-none [transform:translateZ(25px)]"
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
              {/* Backlight Ambient Glow with 3D depth */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none [transform:translateZ(-10px)]"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 65% at 55% 45%, rgba(245, 158, 11, 0.32) 0%, rgba(16, 185, 129, 0.16) 40%, transparent 70%)',
                }}
              />

              {/* Elliptical Dashed Orbit Ring with Tracking Nodes and 3D dynamic tilt */}
              <motion.div
                style={{
                  rotateX: orbitTiltX,
                  rotateY: orbitTiltY,
                }}
                className="absolute inset-0 w-full h-full pointer-events-none z-10 [transform:translateZ(15px)] [transform-style:preserve-3d]"
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
                  rotateY: useTransform(kernelTiltY, (val) => val + kernelDragRotationY),
                  rotateX: useTransform(kernelTiltX, (val) => val + kernelDragRotationX),
                  transformStyle: 'preserve-3d',
                }}
                className="relative w-[210px] sm:w-[260px] md:w-[290px] h-[280px] sm:h-[350px] md:h-[390px] flex items-center justify-center select-none [transform:translateZ(40px)]"
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
                <div
                  className="absolute top-[52%] left-[49%] -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer pointer-events-auto group [transform:translateZ(20px)]"
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
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM CAROUSEL CONTROLS: CIRCULAR NUMBERED PILLS (1, 2, 3) (3D Z-DEPTH)
            ========================================================================= */}
        <motion.div
          style={{
            x: textDisplaceX,
          }}
          className="w-full flex items-center justify-center mt-4 sm:mt-6 z-30 pointer-events-auto [transform:translateZ(30px)]"
        >
          <div className="flex items-center gap-5 sm:gap-7" role="tablist" aria-label="Pioneer Products">
            {PRODUCTS.map((prod, index) => {
              const isActive = index === selectedProductIndex;
              return (
                <button
                  key={prod.id}
                  id={`product-carousel-btn-${prod.id}`}
                  onClick={() => setSelectedProductIndex(index)}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-display font-bold text-base sm:text-xl transition-all duration-300 cursor-pointer focus:outline-none ${
                    isActive
                      ? 'border-2 border-white bg-black/40 text-white shadow-[0_0_25px_rgba(255,255,255,0.35)] scale-105'
                      : 'border border-white/30 bg-black/20 text-white/50 hover:border-white/70 hover:text-white/80 hover:bg-black/35'
                  }`}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Select ${prod.name}`}
                >
                  <span>{prod.id}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* =========================================================================
          PRODUCT DETAILS MODAL: "LEARN MORE"
          ========================================================================= */}
      <AnimatePresence>
        {isLearnMoreOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-[#06150d] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              {/* Background ambient glow */}
              <div
                className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none opacity-40"
                style={{
                  background: 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)',
                }}
              />

              {/* Close Button */}
              <button
                id="close-learn-more-modal-btn"
                onClick={() => setIsLearnMoreOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="pr-10">
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-emerald-400">
                  {currentProduct.brand}
                </span>
                <h3 className="mt-1 font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
                  {currentProduct.name}
                </h3>
              </div>

              {/* Key Agronomic Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">Above-Ground</div>
                  <div className="mt-1 font-display font-bold text-xl sm:text-2xl text-emerald-300">
                    {currentProduct.modesAbove} Modes
                  </div>
                  <div className="text-[10px] text-zinc-400">Targeted insect action</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">Below-Ground</div>
                  <div className="mt-1 font-display font-bold text-xl sm:text-2xl text-emerald-300">
                    {currentProduct.modesBelow} Modes
                  </div>
                  <div className="text-[10px] text-zinc-400">Corn rootworm protection</div>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="text-[11px] font-mono text-amber-300/80 uppercase">Yield Advantage</div>
                  <div className="mt-1 font-display font-bold text-xl sm:text-2xl text-amber-300">
                    {currentProduct.yieldAdvantage}
                  </div>
                  <div className="text-[10px] text-zinc-400">vs {currentProduct.comparisonTech}</div>
                </div>
              </div>

              {/* Key Features List */}
              <div className="space-y-2.5 my-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Technology Highlights
                </h4>
                {currentProduct.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Footnote citation */}
              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-zinc-400/80 leading-relaxed">
                <span className="font-semibold text-zinc-300">{currentProduct.footnote}</span> Data based on
                2020 on-farm trial comparisons. Individual results may vary based on weather, soil
                composition, and local pest pressure. Always read and follow all label directions.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              className="relative w-full max-w-lg bg-[#041209] border border-amber-500/40 rounded-2xl p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
            >
              <button
                id="close-hotspot-modal-btn"
                onClick={() => setIsHotspotOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close hotspot inspector"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-widest">
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
                  <span className="text-amber-300 font-bold">{currentProduct.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Active Insect Modes:</span>
                  <span className="text-emerald-300 font-bold">
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
