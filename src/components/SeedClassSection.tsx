import { useState, useRef, MouseEvent } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'motion/react';
import { CookieModal } from './CookieModal';
import { NewClassModal } from './NewClassModal';

interface SeedClassSectionProps {
  scrollProgress?: MotionValue<number>;
  isActive?: boolean;
  contentY?: MotionValue<string>;
  contentOpacity?: MotionValue<number>;
  mouseRotateX?: MotionValue<number>;
  mouseRotateY?: MotionValue<number>;
}

// Interactive genomic node markers on the left of the seed
interface SeedNode {
  id: string;
  x: number; // percentage in SVG coordinate space (0-100)
  y: number;
  label: string;
  metric: string;
  sub: string;
  connections: string[];
}

const SEED_NODES: SeedNode[] = [
  {
    id: 'n1',
    x: 48,
    y: 28,
    label: 'Genomic Vigor',
    metric: 'AQUAmax® 9.9',
    sub: 'Isolated via 5M simulations',
    connections: ['n2', 'n3', 'n4'],
  },
  {
    id: 'n2',
    x: 36,
    y: 35,
    label: 'Yield Multiplier',
    metric: '+16.2 Bu/A',
    sub: 'Top 0.01% percentile',
    connections: ['n3', 'n5', 'n6'],
  },
  {
    id: 'n3',
    x: 44,
    y: 45,
    label: 'Root Architecture',
    metric: 'Deep Taproot IX',
    sub: 'Moisture retention index',
    connections: ['n4', 'n7'],
  },
  {
    id: 'n4',
    x: 52,
    y: 52,
    label: 'Cellular Density',
    metric: '99.98% Fill',
    sub: 'Superior test weight',
    connections: ['n7', 'n8'],
  },
  {
    id: 'n5',
    x: 26,
    y: 46,
    label: 'Drought Defense',
    metric: 'Level 10 Resilience',
    sub: 'Dryland performance',
    connections: ['n6', 'n9'],
  },
  {
    id: 'n6',
    x: 32,
    y: 58,
    label: 'Stalk Integrity',
    metric: '9.8 / 10 Standability',
    sub: 'Late season protection',
    connections: ['n7', 'n9', 'n10'],
  },
  {
    id: 'n7',
    x: 42,
    y: 65,
    label: 'Disease Immunity',
    metric: 'Multi-Pest Shield',
    sub: 'Qrome® bio-protection',
    connections: ['n8', 'n10'],
  },
  {
    id: 'n8',
    x: 50,
    y: 74,
    label: 'Pedicel Anchor',
    metric: 'Stress-Locked',
    sub: 'Zero harvest shatter',
    connections: ['n10', 'n11'],
  },
  {
    id: 'n9',
    x: 22,
    y: 62,
    label: 'Candidate Velocity',
    metric: '4.8M Screened',
    sub: '1 in 10,000 selected',
    connections: ['n10'],
  },
  {
    id: 'n10',
    x: 35,
    y: 78,
    label: 'Kernel Tip Cap',
    metric: 'Hydration Seal',
    sub: 'Rapid emergence vigor',
    connections: ['n11'],
  },
  {
    id: 'n11',
    x: 46,
    y: 86,
    label: 'Final Certification',
    metric: 'Pioneer® Bag Ready',
    sub: 'Elite 2026 Commercial Class',
    connections: [],
  },
];

export function SeedClassSection({
  scrollProgress,
  isActive,
  contentY,
  contentOpacity,
  mouseRotateX,
  mouseRotateY,
}: SeedClassSectionProps) {
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<SeedNode | null>(null);

  // Mouse move tilt for seed and background
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <div
      id="seed-class-section-container"
      onMouseMove={handleMouseMove}
      className="relative w-full h-full min-h-screen overflow-hidden select-none flex items-center justify-center"
    >
      {/* =========================================================================
          ATMOSPHERIC BACKGROUND (SUNSET AMBER HORIZON TO DEEP FOREST EMERALD)
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top Glowing Sunset Horizon Cloud & Light Bloom */}
        <div
          className="absolute -top-[15%] left-0 right-0 h-[65%] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 90% 60% at 65% 0%, rgba(229, 138, 45, 0.45) 0%, rgba(184, 93, 25, 0.32) 35%, rgba(109, 53, 17, 0.18) 65%, transparent 100%)',
          }}
        />

        {/* Ambient Warm Golden Haze on Top-Right */}
        <div
          className="absolute top-0 right-0 w-[60vw] h-[55vh] pointer-events-none opacity-60"
          style={{
            background:
              'radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.28) 0%, rgba(180, 83, 9, 0.15) 45%, transparent 75%)',
          }}
        />

        {/* Base Deep Emerald / Velvet Obsidian Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c1a12]/30 via-[#03150d]/80 to-[#010804] pointer-events-none" />

        {/* Organic Light Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, transparent 40%, rgba(1, 6, 3, 0.75) 90%, #010603 100%)',
          }}
        />

        {/* Floating Ambient Sparkle Particles */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${(i * 17) % 100}%`,
                y: `${(i * 23) % 100}%`,
                opacity: 0.2 + (i % 5) * 0.15,
                scale: 0.6 + (i % 3) * 0.4,
              }}
              animate={{
                y: [`${(i * 23) % 100}%`, `${((i * 23 + 40) % 100)}%`],
                opacity: [0.2, 0.7, 0.2],
              }}
              transition={{
                duration: 10 + (i % 8) * 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
            />
          ))}
        </div>
      </div>

      {/* =========================================================================
          MAIN CONTENT GRID: TYPOGRAPHY (LEFT) & SEED WITH RADAR (CENTER/RIGHT)
          ========================================================================= */}
      <motion.div
        style={{
          y: contentY || 0,
          opacity: contentOpacity || 1,
        }}
        className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-12 lg:px-16 py-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4"
      >
        {/* LEFT COLUMN: HERO HEADLINE & NARRATIVE */}
        <div className="w-full lg:w-[46%] text-left z-20 pointer-events-auto">
          {/* Staggered Heading Lines */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              id="seed-section-headline"
              className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[4.8rem] xl:text-[5.4rem] tracking-tight uppercase text-white leading-[0.92] drop-shadow-[0_12px_35px_rgba(0,0,0,0.85)]"
            >
              <span className="block">LESS THAN</span>
              <span className="block text-white">0.01% OF SEEDS</span>
              <span className="block">MAKE IT.</span>
            </h2>
          </motion.div>

          {/* Narrative Paragraph */}
          <motion.p
            id="seed-section-paragraph"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg lg:text-[17px] font-normal text-zinc-200/90 leading-relaxed max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            These are the very best of the best. They're the contenders that have survived the
            computer simulations, the lab tests, the field tests and the discerning breeders to make
            it into a Pioneer bag. It's our new class.
          </motion.p>
        </div>

        {/* CENTER/RIGHT COLUMN: LUMINOUS FLOATING SEED + CONSTELLATION MESH + RADAR CTA */}
        <div className="w-full lg:w-[54%] relative flex items-center justify-center min-h-[420px] sm:min-h-[520px] lg:min-h-[620px] z-20">
          {/* Floating Seed Container with 3D Mouse Parallax */}
          <motion.div
            style={{
              x: mousePos.x * 24,
              y: mousePos.y * 24,
              rotateX: -mousePos.y * 12,
              rotateY: mousePos.x * 14,
              transformStyle: 'preserve-3d',
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="relative w-full max-w-[540px] aspect-[4/5] flex items-center justify-center"
          >
            {/* Ambient Backlight Glow behind Seed */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 65% 75% at 55% 45%, rgba(245, 158, 11, 0.22) 0%, rgba(16, 185, 129, 0.12) 40%, transparent 70%)',
              }}
            />

            {/* SEED ILLUSTRATION / 3D GRAPHIC HYBRID */}
            <div className="relative w-[300px] sm:w-[380px] lg:w-[420px] h-[360px] sm:h-[460px] lg:h-[500px] flex items-center justify-center">
              {/* Golden Kernel Organic Silhouette with Rim Glow */}
              <svg
                viewBox="0 0 400 500"
                className="w-full h-full drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)]"
              >
                <defs>
                  {/* Organic Seed Surface Gradient */}
                  <linearGradient id="seedBodyGrad" x1="15%" y1="20%" x2="95%" y2="80%">
                    <stop offset="0%" stopColor="#22362b" stopOpacity="0.95" />
                    <stop offset="35%" stopColor="#3d4926" stopOpacity="0.95" />
                    <stop offset="65%" stopColor="#8d7224" stopOpacity="1" />
                    <stop offset="90%" stopColor="#dca835" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ffea9f" stopOpacity="1" />
                  </linearGradient>

                  {/* Golden Rim Light on Right Edge */}
                  <linearGradient id="seedRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="60%" stopColor="transparent" />
                    <stop offset="85%" stopColor="#f59e0b" stopOpacity="0.7" />
                    <stop offset="96%" stopColor="#fef08a" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                  </linearGradient>

                  {/* Internal Texture / Shading */}
                  <radialGradient id="seedDentShadow" cx="50%" cy="45%" r="40%">
                    <stop offset="0%" stopColor="#15241b" stopOpacity="0.9" />
                    <stop offset="60%" stopColor="#2b3b24" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>

                  {/* Node Glow Filters */}
                  <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur1" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur2" />
                      <feMergeNode in="blur1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Line Glow */}
                  <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Seed Outer Glow Halo */}
                <path
                  d="M 200 135 C 270 130 310 170 305 240 C 300 310 260 380 230 405 C 205 425 185 415 175 400 C 145 375 105 300 100 230 C 95 160 135 138 200 135 Z"
                  fill="none"
                  stroke="rgba(245, 158, 11, 0.35)"
                  strokeWidth="8"
                  filter="url(#nodeGlow)"
                />

                {/* Seed Body Path (Authentic Corn Seed Shape: Curved top dent, full flanks, tapered bottom tip) */}
                <path
                  d="M 200 135 C 265 132 300 170 295 240 C 290 310 250 375 225 398 C 208 414 188 406 178 394 C 150 370 110 305 108 235 C 104 165 140 138 200 135 Z"
                  fill="url(#seedBodyGrad)"
                  stroke="#453818"
                  strokeWidth="1.5"
                />

                {/* Seed Top Dent Contour & Central Embryo Dent Shading */}
                <path
                  d="M 175 138 C 200 148 230 146 250 140 C 240 180 220 280 210 350 C 195 340 175 260 175 138 Z"
                  fill="url(#seedDentShadow)"
                />

                {/* Right Edge Rim Lighting Layer */}
                <path
                  d="M 200 135 C 265 132 300 170 295 240 C 290 310 250 375 225 398 C 208 414 188 406 178 394 C 150 370 110 305 108 235 C 104 165 140 138 200 135 Z"
                  fill="url(#seedRimGrad)"
                  mixBlendMode="screen"
                />

                {/* =====================================================================
                    DIGITAL CONSTELLATION NODE NETWORK OVERLAY (LEFT SIDE OF SEED)
                    ===================================================================== */}
                {/* Connecting Wireframe Network Lines */}
                <g filter="url(#lineGlow)" className="opacity-90">
                  {SEED_NODES.map((node) =>
                    node.connections.map((targetId) => {
                      const targetNode = SEED_NODES.find((n) => n.id === targetId);
                      if (!targetNode) return null;
                      const x1 = (node.x / 100) * 400;
                      const y1 = (node.y / 100) * 500;
                      const x2 = (targetNode.x / 100) * 400;
                      const y2 = (targetNode.y / 100) * 500;
                      const isHovered = hoveredNode?.id === node.id || hoveredNode?.id === targetId;

                      return (
                        <g key={`${node.id}-${targetId}`}>
                          {/* Base Structural Line */}
                          <line
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={isHovered ? '#ffffff' : 'rgba(235, 245, 255, 0.65)'}
                            strokeWidth={isHovered ? '1.8' : '1.1'}
                            strokeDasharray={isHovered ? 'none' : '4 2'}
                          />

                          {/* Animated Flowing Data Pulse */}
                          <circle r={isHovered ? '2.5' : '1.5'} fill="#ffffff" filter="url(#nodeGlow)">
                            <animateMotion
                              path={`M ${x1} ${y1} L ${x2} ${y2}`}
                              dur={`${2.2 + ((node.x + targetNode.y) % 5) * 0.4}s`}
                              repeatCount="indefinite"
                            />
                          </circle>
                        </g>
                      );
                    })
                  )}
                </g>

                {/* Interactive Genomic Nodes (White Glowing Vertices) */}
                {SEED_NODES.map((node) => {
                  const cx = (node.x / 100) * 400;
                  const cy = (node.y / 100) * 500;
                  const isHovered = hoveredNode?.id === node.id;

                  return (
                    <g
                      key={node.id}
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className="cursor-pointer"
                    >
                      {/* Pulsing Outer Aura */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? '9' : '5.5'}
                        fill="none"
                        stroke={isHovered ? '#fef08a' : '#ffffff'}
                        strokeWidth="1.2"
                        opacity={isHovered ? '1' : '0.75'}
                        filter="url(#nodeGlow)"
                      >
                        <animate
                          attributeName="r"
                          values={isHovered ? '7;12;7' : '4;7;4'}
                          dur="2.4s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.8;0.3;0.8"
                          dur="2.4s"
                          repeatCount="indefinite"
                        />
                      </circle>

                      {/* Solid Center Core */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? '4.5' : '2.8'}
                        fill={isHovered ? '#ffffff' : '#f8fafc'}
                        filter="url(#nodeGlow)"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Interactive Tooltip Card when hovering a constellation node */}
              <div className="absolute -bottom-6 left-4 z-40 pointer-events-none">
                {hoveredNode && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="bg-[#06140e]/95 border border-emerald-400/50 backdrop-blur-xl px-4 py-2.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.85)] text-left min-w-[200px]"
                  >
                    <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                      {hoveredNode.label}
                    </div>
                    <div className="text-sm font-display font-black text-white mt-0.5">
                      {hoveredNode.metric}
                    </div>
                    <div className="text-[11px] text-zinc-300 mt-0.5">{hoveredNode.sub}</div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* =========================================================================
                "SEE THE NEW CLASS" RADIAL RADAR BUTTON (TOP-RIGHT ORBITAL CTA)
                ========================================================================= */}
            <div className="absolute -top-4 sm:-top-8 right-2 sm:right-6 lg:-right-4 z-30 pointer-events-auto">
              <button
                id="see-the-new-class-radar-btn"
                onClick={() => setIsNewClassModalOpen(true)}
                className="group relative w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full flex items-center justify-center focus:outline-none cursor-pointer"
                aria-label="See The New Class"
              >
                {/* Outermost Orbit Ring with Rotating Ticks */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-white/20 group-hover:border-amber-400/40 transition-colors pointer-events-none"
                  style={{
                    borderStyle: 'dashed',
                  }}
                />

                {/* Second Concentric Orbital Arc */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 rounded-full border-t border-r border-white/40 group-hover:border-amber-300 transition-colors pointer-events-none"
                />

                {/* Central Radar Target Disc */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#3d261a]/60 group-hover:bg-[#523320]/80 border border-white/40 group-hover:border-amber-300/80 backdrop-blur-md flex items-center justify-center p-3 text-center transition-all duration-300 shadow-[0_0_25px_rgba(0,0,0,0.6)] group-hover:shadow-[0_0_35px_rgba(245,158,11,0.35)]">
                  {/* Subtle Radar Sweep Line */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full pointer-events-none opacity-40 group-hover:opacity-75"
                    style={{
                      background:
                        'conic-gradient(from 0deg at 50% 50%, rgba(245, 158, 11, 0.4) 0deg, transparent 60deg, transparent 360deg)',
                    }}
                  />

                  {/* Center Bold Text: "SEE THE NEW CLASS" */}
                  <span className="relative z-10 font-display font-black text-[11px] sm:text-[12px] lg:text-[13px] tracking-wider uppercase text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    SEE THE NEW CLASS
                  </span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* =========================================================================
          BOTTOM FOOTER: COOKIE PREFERENCES PILL (EXACTLY MATCHING SCREENSHOT)
          ========================================================================= */}
      <div className="absolute bottom-4 sm:bottom-6 left-6 sm:left-12 z-30 pointer-events-auto">
        <button
          id="cookie-preferences-pill"
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
      </div>

      {/* Interactive Modals */}
      <CookieModal isOpen={isCookieModalOpen} onClose={() => setIsCookieModalOpen(false)} />
      <NewClassModal isOpen={isNewClassModalOpen} onClose={() => setIsNewClassModalOpen(false)} />
    </div>
  );
}
