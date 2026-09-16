import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView, useScroll } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { PioneerLogo } from './PioneerLogo';
import { ParticleField } from './ParticleField';
import { NavDrawer } from './NavDrawer';
import { CookieModal } from './CookieModal';
import { LiquidPullText } from './LiquidPullText';

interface HeroSectionProps {
  onExploreNext?: () => void;
}

export function HeroSection({ onExploreNext }: HeroSectionProps = {}) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Scroll-triggered in-view check for content entrance
  const isContentInView = useInView(contentRef, {
    once: false,
    margin: "-5% 0px -5% 0px",
  });

  // Native window scroll tracking
  const { scrollY } = useScroll();

  // Internal smooth wheel gesture tracking for depth-of-field exploration
  const wheelOffset = useMotionValue(0);
  const smoothWheelOffset = useSpring(wheelOffset, { damping: 28, stiffness: 90 });

  // Effective scroll position combining window scroll + wheel gestures
  const effectiveScroll = useTransform(
    [scrollY, smoothWheelOffset],
    ([sy, wy]) => (sy as number) + (wy as number)
  );

  // Normalized cursor coordinates [-1, 1] relative to viewport center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth cinematic spring physics tuned for an active, immersive 3D response
  const springConfig = { damping: 28, stiffness: 105, mass: 0.7 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Noticeably stronger 3D Tilt angles for the stage (~3.5 to 4.5 deg)
  const stageRotateX = useTransform(smoothMouseY, [-1, 1], [3.5, -3.5]);
  const stageRotateY = useTransform(smoothMouseX, [-1, 1], [-4.5, 4.5]);

  // Deep Background Layer Parallax (counter displacement to create realistic depth)
  const bgTranslateX = useTransform(smoothMouseX, [-1, 1], [14, -14]);
  const bgTranslateY = useTransform(smoothMouseY, [-1, 1], [10, -10]);

  // Particle Midground Parallax
  const particlesTranslateX = useTransform(smoothMouseX, [-1, 1], [-7, 7]);
  const particlesTranslateY = useTransform(smoothMouseY, [-1, 1], [-5, 5]);

  // Foreground Content Layer Parallax (pronounced forward separation)
  const textTranslateX = useTransform(smoothMouseX, [-1, 1], [-8, 8]);
  const textTranslateY = useTransform(smoothMouseY, [-1, 1], [-6, 6]);

  // Dynamic light reflection hotspot coordinates (reactive illumination glint)
  const lightX = useTransform(smoothMouseX, [-1, 1], ['36%', '64%']);
  const lightY = useTransform(smoothMouseY, [-1, 1], ['36%', '64%']);

  // Depth-of-Field Scroll Speeds:
  // 1. Deep Background moves very slowly downwards and gains soft optical blur
  const bgScrollY = useTransform(effectiveScroll, [0, 500], [0, 50]);
  const bgDepthBlur = useTransform(effectiveScroll, [0, 380], ['blur(0px)', 'blur(2.5px)']);

  // 2. Background Particles drift upwards noticeably faster (differential rate creates depth)
  const particlesScrollY = useTransform(effectiveScroll, [0, 500], [0, -170]);
  const particlesScrollOpacity = useTransform(effectiveScroll, [0, 420], [1, 0.35]);

  // 3. Foreground Main Hero Text moves at an intermediate rate and softly eases out
  const textScrollY = useTransform(effectiveScroll, [0, 500], [0, 95]);
  const textScrollOpacity = useTransform(effectiveScroll, [0, 320], [1, 0]);
  const textScrollScale = useTransform(effectiveScroll, [0, 420], [1, 0.97]);

  // Combined positional values combining cursor parallax + scroll speed offsets
  const combinedBgY = useTransform(
    [bgTranslateY, bgScrollY],
    ([my, sy]) => (my as number) + (sy as number)
  );

  const combinedParticlesY = useTransform(
    [particlesTranslateY, particlesScrollY],
    ([my, sy]) => (my as number) + (sy as number)
  );

  const combinedTextY = useTransform(
    [textTranslateY, textScrollY],
    ([my, sy]) => (my as number) + (sy as number)
  );

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

    const handleWheel = (e: WheelEvent) => {
      const current = wheelOffset.get();
      const next = Math.max(0, Math.min(450, current + e.deltaY * 0.45));
      wheelOffset.set(next);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [mouseX, mouseY, wheelOffset]);

  return (
    <div
      ref={containerRef}
      id="pioneer-hero-section"
      className="relative w-full h-screen min-h-[640px] bg-[#020b06] overflow-hidden flex flex-col justify-between select-none [perspective:1400px]"
    >
      {/* 3D Tilted World Stage */}
      <motion.div
        id="hero-3d-stage"
        style={{
          rotateX: stageRotateX,
          rotateY: stageRotateY,
          transformStyle: 'preserve-3d',
        }}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        {/* Deep Background Layer with Depth-of-Field Blur & Counter-Parallax */}
        <motion.div
          id="hero-bg-layer"
          style={{
            x: bgTranslateX,
            y: combinedBgY,
            filter: bgDepthBlur,
          }}
          className="absolute -inset-[4%] z-0 scale-[1.06] pointer-events-none transition-[filter] duration-200"
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

          {/* Cinematic Dynamic Studio Key Lighting (Clean, neutral high-end studio sheen) */}
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

          {/* Volumetric Cosmic Nebula Haze on the right (Soft, subtle ambient haze) */}
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_88%_44%,_rgba(16,185,129,0.07)_0%,_rgba(6,78,59,0.03)_36%,_transparent_70%)] pointer-events-none mix-blend-screen"
            aria-hidden="true"
          />

          {/* Studio Floor Specular Wet Reflection Sheen at bottom */}
          <div
            className="absolute bottom-0 inset-x-0 h-48 bg-[radial-gradient(ellipse_at_76%_90%,_rgba(52,211,153,0.06)_0%,_rgba(6,78,59,0.02)_45%,_transparent_75%)] pointer-events-none mix-blend-screen"
            aria-hidden="true"
          />

          {/* Pure Obsidian Header Shading Mask to keep the header bar clean, dark, and clear of green tint */}
          <div
            className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#030303]/90 via-[#030303]/45 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Vignette & Atmospheric Gradients */}
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

        {/* Midground Atmospheric Particle Field Layer (Fast-floating depth-of-field rate) */}
        <motion.div
          style={{
            x: particlesTranslateX,
            y: combinedParticlesY,
            opacity: particlesScrollOpacity,
          }}
          className="absolute inset-0 z-10 pointer-events-none"
        >
          <ParticleField />
        </motion.div>
      </motion.div>

      {/* Top Header Bar */}
      <motion.header
        id="hero-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.2, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-30 w-full px-6 sm:px-10 lg:px-12 py-6 md:py-8 flex items-center pointer-events-auto will-change-[opacity,transform]"
      >
        <div className="flex items-center gap-6 sm:gap-8">
          {/* Hamburger Menu Toggle */}
          <button
            id="hamburger-menu-toggle"
            onClick={() => setIsNavOpen(true)}
            className="group flex flex-col justify-center items-start gap-1.5 w-8 h-8 focus:outline-none cursor-pointer"
            aria-label="Open navigation menu"
          >
            <span className="w-7 h-[2px] bg-white transition-all duration-300 group-hover:w-8 group-hover:bg-white/90" />
            <span className="w-7 h-[2px] bg-white transition-all duration-300 group-hover:w-8 group-hover:bg-white/90" />
            <span className="w-7 h-[2px] bg-white transition-all duration-300 group-hover:w-8 group-hover:bg-white/90" />
          </button>

          {/* Pioneer Brand Logo */}
          <PioneerLogo />
        </div>
      </motion.header>

      {/* Centered Hero Headlines with Enhanced 3D Parallax & Soft Entrance */}
      <main
        id="hero-main-content"
        className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 -mt-6 sm:-mt-10 pointer-events-none"
      >
        <motion.div
          ref={contentRef}
          style={{
            x: textTranslateX,
            y: combinedTextY,
            opacity: textScrollOpacity,
            scale: textScrollScale,
          }}
          className="max-w-7xl mx-auto w-full pointer-events-auto [transform:translateZ(20px)]"
        >
          {/* Massive Bold Headline with Softened Shadow */}
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 24, filter: 'blur(30px)', scale: 0.98 }}
            animate={
              isContentInView
                ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }
                : { opacity: 0, y: 24, filter: 'blur(30px)', scale: 0.98 }
            }
            transition={{
              duration: 2.8,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[9.5rem] tracking-tight uppercase text-white leading-[0.9] drop-shadow-[0_10px_35px_rgba(0,0,0,0.85)] will-change-[filter,opacity,transform]"
          >
            <LiquidPullText
              text="CALISTHENICS. REVOLUTIONIZED."
              maxPull={1}
              maxBlur={5}
              radius={120}
              lerpFactor={0.12}
            />
          </motion.h1>

          {/* Subtitle with Refined Subtle Tone */}
          <motion.p
            id="hero-subtitle"
            initial={{ opacity: 0, y: 18, filter: 'blur(20px)' }}
            animate={
              isContentInView
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 18, filter: 'blur(20px)' }
            }
            transition={{
              duration: 2.4,
              delay: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-4 sm:mt-6 md:mt-7 text-sm sm:text-base md:text-lg lg:text-xl font-normal text-zinc-100/85 tracking-wide max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] px-4 will-change-[filter,opacity,transform]"
          >
            From lab to field, it's corn seed development that will change farming.
          </motion.p>
        </motion.div>
      </main>

      {/* Bottom Footer Area with Cookie Preferences Pill */}
      <footer
        id="hero-footer"
        className="relative z-30 w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between pointer-events-auto"
      >
        {/* Cookie Preferences Pill Button */}
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

        {/* Empty placeholder on the right for symmetry */}
        <div className="w-24 hidden sm:block pointer-events-none" aria-hidden="true" />
      </footer>

      {/* Bottom Center Animated Pulsing Down-Arrow Scroll Indicator */}
      <motion.div
        id="scroll-down-indicator"
        style={{
          opacity: useTransform(effectiveScroll, [0, 80], [1, 0]),
          pointerEvents: useTransform(effectiveScroll, (v) => (v > 60 ? 'none' : 'auto')),
        }}
        className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 pointer-events-auto select-none"
      >
        <motion.button
          onClick={() => {
            if (onExploreNext) {
              onExploreNext();
            } else {
              const el = document.getElementById('contenders-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }}
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

      {/* Interactive Cookie Preferences Modal */}
      <CookieModal isOpen={isCookieModalOpen} onClose={() => setIsCookieModalOpen(false)} />
    </div>
  );
}
