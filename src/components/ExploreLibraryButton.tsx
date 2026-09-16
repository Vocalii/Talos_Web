import { useState } from 'react';
import { motion } from 'motion/react';

interface ExploreLibraryButtonProps {
  onClick?: () => void;
  className?: string;
  id?: string;
  ariaLabel?: string;
  lineOne?: string;
  lineTwo?: string;
  /** 'primary' is the full treatment (outer breathing ring, floating bob,
   * brighter glass). 'secondary' drops the outer ring and float animation
   * and dims the glass down a notch, so grouped tertiary actions read as
   * clearly subordinate to a primary CTA using the same component. */
  variant?: 'primary' | 'secondary';
}

export function ExploreLibraryButton({
  onClick,
  className = '',
  id = 'explore-the-library-btn',
  ariaLabel = 'Explore the Genetic Library',
  lineOne = 'EXPLORE THE',
  lineTwo = 'LIBRARY',
  variant = 'primary',
}: ExploreLibraryButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isSecondary = variant === 'secondary';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: isSecondary ? 0 : [-4, 4, -4],
      }}
      transition={{
        opacity: { duration: 1.2, delay: 0.3 },
        scale: { duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
        y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
      }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      {/* Main Interactive Button */}
      <motion.button
        id={id}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
        className="group relative flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 rounded-full"
        aria-label={ariaLabel}
      >
        {/* Outer Concentric Breathing Ring with signature open arc gap —
            primary only; secondary buttons skip it for a flatter, quieter look. */}
        {!isSecondary && (
          <motion.div
            animate={{
              rotate: 360,
              scale: isHovered ? 1.03 : [1, 1.02, 1],
              opacity: isHovered ? 0.8 : [0.45, 0.6, 0.45],
            }}
            transition={{
              rotate: { duration: isHovered ? 30 : 50, repeat: Infinity, ease: 'linear' },
              scale: isHovered
                ? { duration: 0.25 }
                : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
              opacity: isHovered
                ? { duration: 0.25 }
                : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute -inset-3.5 sm:-inset-4.5 pointer-events-none flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              className="w-32 h-32 sm:w-36 sm:h-36"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="0.75"
                strokeDasharray="210 50"
                strokeLinecap="round"
                className="transition-all duration-300 group-hover:stroke-white/80 group-hover:stroke-[0.9]"
              />
            </svg>
          </motion.div>
        )}

        {/* Secondary variant: a plain thin static ring instead of the
            animated breathing one, just enough to still read as a button. */}
        {isSecondary && (
          <div
            className="absolute -inset-1.5 rounded-full border border-white/15 group-hover:border-white/30 transition-colors duration-300 pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Glassmorphic Core: true glass recipe (blur + subtle gradient + hairline border) */}
        <motion.div
          animate={{
            scale: isHovered ? 1.015 : isSecondary ? 1 : [1, 1.02, 1],
            boxShadow: isHovered
              ? '0 20px 50px rgba(0,0,0,0.85), 0 0 1px rgba(255,255,255,0.4), inset 0 1px 0 rgba(255,255,255,0.14)'
              : isSecondary
                ? '0 8px 20px rgba(0,0,0,0.45), 0 0 1px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.05)'
                : [
                    '0 12px 34px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
                    '0 14px 38px rgba(0,0,0,0.65), 0 0 1px rgba(255,255,255,0.25), inset 0 1px 0 rgba(255,255,255,0.10)',
                    '0 12px 34px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
                  ],
          }}
          transition={{
            scale: isHovered ? { duration: 0.3 } : { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            boxShadow: isHovered ? { duration: 0.3 } : { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
          className={`glass relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center p-2.5 text-center overflow-hidden ${isSecondary ? 'opacity-80' : ''}`}
        >
          {/* Subtle Radial Surface Light Glow (glass sheen) */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none opacity-40 group-hover:opacity-90 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle at 32% 26%, rgba(255,255,255,0.16) 0%, transparent 60%)',
            }}
            aria-hidden="true"
          />

          {/* Hover brightening wash — kept as a separate layer so it never
              fights the .glass class's own background shorthand */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none bg-white/0 group-hover:bg-white/[0.05] transition-colors duration-300"
            aria-hidden="true"
          />

          {/* Centered Typography */}
          <span className={`relative font-display font-medium text-[8.5px] sm:text-[9.5px] tracking-[0.24em] uppercase leading-none transition-colors duration-200 ${isSecondary ? 'text-white/50 group-hover:text-white/70' : 'text-white/70 group-hover:text-white/90'}`}>
            {lineOne}
          </span>
          <span className={`relative font-display font-semibold text-[9.5px] sm:text-[10.5px] tracking-[0.28em] uppercase mt-1.5 leading-none ${isSecondary ? 'text-white/80' : 'text-white'}`}>
            {lineTwo}
          </span>
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
