import { useState, useRef, MouseEvent } from 'react';
import { motion } from 'motion/react';

interface CinematicDownloadButtonProps {
  id?: string;
  onClick?: () => void;
  className?: string;
}

export function CinematicDownloadButton({
  id = 'btn-get-early-access',
  onClick,
  className = '',
}: CinematicDownloadButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5, pxX: 0, pxY: 0 });
  const [isRippling, setIsRippling] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const pxX = e.clientX - rect.left;
    const pxY = e.clientY - rect.top;
    const x = Math.max(0, Math.min(1, pxX / rect.width));
    const y = Math.max(0, Math.min(1, pxY / rect.height));
    setMousePos({ x, y, pxX, pxY });
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    handleMouseMove(e);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    setIsRippling(true);
    setTimeout(() => setIsRippling(false), 700);
    onClick?.();
  };

  return (
    <div className={`relative group inline-block select-none ${className}`}>
      {/* 1. Deep Atmospheric Volumetric Nebula Glow (Behind button) */}
      <div
        className="absolute -inset-8 sm:-inset-10 rounded-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: isHovered
            ? 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(16, 185, 129, 0.45) 0%, rgba(5, 150, 105, 0.22) 45%, transparent 75%)'
            : 'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(16, 185, 129, 0.20) 0%, rgba(5, 150, 105, 0.08) 40%, transparent 70%)',
          filter: 'blur(28px)',
          opacity: isHovered ? 1 : 0.65,
          transform: isHovered ? 'scale(1.12)' : 'scale(1)',
        }}
        aria-hidden="true"
      />

      {/* 2. Secondary Warm Amber Kernel Core Glow (Pioneer TALOS Genetic Accent) */}
      <div
        className="absolute -inset-4 sm:-inset-6 rounded-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: isHovered
            ? 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.12) 50%, transparent 80%)'
            : 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
          filter: 'blur(18px)',
          opacity: isHovered ? 0.9 : 0.4,
        }}
        aria-hidden="true"
      />

      {/* 3. Main Interactive Button Shell */}
      <motion.button
        ref={buttonRef}
        id={id}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.96 }}
        className="relative overflow-hidden cursor-pointer rounded-full px-10 sm:px-14 py-4 sm:py-5 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 transition-shadow duration-500"
        style={{
          boxShadow: isHovered
            ? '0 24px 65px -10px rgba(0, 0, 0, 0.85), 0 0 35px rgba(16, 185, 129, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.3)'
            : '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 15px rgba(16, 185, 129, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
        aria-label="Get early access"
      >
        {/* Base Optical Glass Substrate */}
        <div
          className="absolute inset-0 rounded-full transition-colors duration-500"
          style={{
            background: isHovered
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.10) 0%, rgba(10, 18, 14, 0.85) 50%, rgba(5, 10, 8, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(10, 12, 11, 0.8) 50%, rgba(5, 5, 5, 0.9) 100%)',
            backdropFilter: 'blur(20px) saturate(140%)',
            WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          }}
          aria-hidden="true"
        />

        {/* Static Hairline Border with Specular Rim & subtle glow */}
        <div
          className="absolute inset-0 rounded-full border pointer-events-none transition-all duration-400"
          style={{
            borderColor: isHovered ? 'rgba(52, 211, 153, 0.55)' : 'rgba(255, 255, 255, 0.20)',
            boxShadow: isHovered
              ? 'inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 0 20px rgba(52, 211, 153, 0.28)'
              : 'inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          }}
          aria-hidden="true"
        />

        {/* 4. Subdued Cursor Specular Sheen (Soft, low-contrast ambient glass wash) */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-500"
          style={{
            opacity: isHovered ? 0.6 : 0,
            background: `radial-gradient(circle 180px at ${mousePos.pxX}px ${mousePos.pxY}px, rgba(255, 255, 255, 0.09) 0%, rgba(52, 211, 153, 0.06) 35%, rgba(16, 185, 129, 0.02) 65%, transparent 100%)`,
          }}
          aria-hidden="true"
        />

        {/* 5. Cinematic Anamorphic Lens Flare (Horizontal blade streak across button) */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.2 }}
          animate={{
            opacity: isHovered ? [0.45, 0.7, 0.55] : 0,
            scaleX: isHovered ? 1 : 0.3,
          }}
          transition={{
            opacity: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
            scaleX: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
          className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[1px] pointer-events-none mx-auto w-[80%]"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(52, 211, 153, 0.15) 20%, rgba(255, 255, 255, 0.65) 50%, rgba(45, 212, 191, 0.15) 80%, transparent 100%)',
            boxShadow: '0 0 10px 1px rgba(52, 211, 153, 0.45)',
            filter: 'blur(0.3px)',
          }}
          aria-hidden="true"
        />

        {/* 6. Centered Anamorphic Flare Hotspot (Subtle ambient glint) */}
        <motion.div
          animate={{
            opacity: isHovered ? [0.3, 0.65, 0.3] : 0,
            scale: isHovered ? [0.9, 1.1, 0.9] : 0.6,
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-300/25 blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-white/80 shadow-[0_0_6px_#fff]" />
          </div>
        </motion.div>

        {/* 7. Click Shockwave Ripple */}
        {isRippling && (
          <motion.span
            initial={{ scale: 0.2, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="absolute rounded-full border border-emerald-300 bg-emerald-400/20 pointer-events-none"
            style={{
              width: 140,
              height: 140,
              left: mousePos.pxX - 70,
              top: mousePos.pxY - 70,
            }}
            aria-hidden="true"
          />
        )}

        {/* 8. Biotech Corner Calibration Notches (Fine Instrumentation Aesthetic) */}
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 pointer-events-none opacity-40 group-hover:opacity-90 transition-opacity duration-300"
          aria-hidden="true"
        >
          <span className="w-1.5 h-[1.5px] bg-emerald-400/80 rounded-full" />
          <span className="w-1 h-[1.5px] bg-white/60 rounded-full" />
        </span>

        {/* 9. Button Label */}
        <div className="relative z-10 flex items-center justify-center">
          <span className="font-display font-medium text-sm sm:text-base tracking-[0.18em] sm:tracking-[0.22em] uppercase text-white transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Get Early Access
          </span>
        </div>

        {/* Biotech Right Calibration Notch */}
        <span
          className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-end gap-0.5 pointer-events-none opacity-40 group-hover:opacity-90 transition-opacity duration-300"
          aria-hidden="true"
        >
          <span className="w-1.5 h-[1.5px] bg-emerald-400/80 rounded-full" />
          <span className="w-1 h-[1.5px] bg-white/60 rounded-full" />
        </span>
      </motion.button>
    </div>
  );
}
