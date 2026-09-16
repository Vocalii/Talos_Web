import { useState } from 'react';
import { motion } from 'motion/react';

interface ExploreLibraryButtonProps {
  onClick?: () => void;
  className?: string;
}

export function ExploreLibraryButton({
  onClick,
  className = '',
}: ExploreLibraryButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [-4, 4, -4],
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
        id="explore-the-library-btn"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
        className="group relative flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400/60 rounded-full"
        aria-label="Explore the Genetic Library"
      >
        {/* Outer Concentric Breathing Ring with signature open arc gap */}
        <motion.div
          animate={{
            rotate: 360,
            scale: isHovered ? 1.03 : [1, 1.02, 1],
            opacity: isHovered ? 0.95 : [0.75, 0.9, 0.75],
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
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="1.1"
              strokeDasharray="210 50"
              strokeLinecap="round"
              className="transition-all duration-300 group-hover:stroke-white group-hover:stroke-[1.3]"
            />
          </svg>
        </motion.div>

        {/* Compact Glassmorphic Core: refined size & tasteful hover */}
        <motion.div
          animate={{
            scale: isHovered ? 1.015 : [1, 1.025, 1],
            boxShadow: isHovered
              ? '0 12px 36px rgba(0,0,0,0.75), 0 0 24px rgba(16,185,129,0.38), inset 0 0 18px rgba(255,255,255,0.18)'
              : [
                  '0 8px 26px rgba(0,0,0,0.55), 0 0 10px rgba(16,185,129,0.12), inset 0 0 12px rgba(255,255,255,0.06)',
                  '0 10px 30px rgba(0,0,0,0.65), 0 0 20px rgba(16,185,129,0.26), inset 0 0 16px rgba(255,255,255,0.11)',
                  '0 8px 26px rgba(0,0,0,0.55), 0 0 10px rgba(16,185,129,0.12), inset 0 0 12px rgba(255,255,255,0.06)',
                ],
            borderColor: isHovered
              ? 'rgba(255, 255, 255, 0.98)'
              : [
                  'rgba(255, 255, 255, 0.82)',
                  'rgba(255, 255, 255, 0.96)',
                  'rgba(255, 255, 255, 0.82)',
                ],
          }}
          transition={{
            scale: isHovered ? { duration: 0.22 } : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
            boxShadow: isHovered ? { duration: 0.22 } : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
            borderColor: isHovered ? { duration: 0.22 } : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[1.35px] bg-[#020b06]/42 group-hover:bg-[#020b06]/62 backdrop-blur-md group-hover:backdrop-blur-xl flex flex-col items-center justify-center p-2.5 text-center transition-[background-color,backdrop-filter] duration-300"
        >
          {/* Subtle Radial Surface Light Glow */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none opacity-30 group-hover:opacity-75 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.24) 0%, transparent 65%)',
            }}
            aria-hidden="true"
          />

          {/* Centered Typography: EXPLORE THE LIBRARY */}
          <span className="font-display font-bold text-[8.5px] sm:text-[9.5px] tracking-[0.24em] text-white/90 group-hover:text-white uppercase leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-colors duration-200">
            EXPLORE THE
          </span>
          <span className="font-display font-extrabold text-[9.5px] sm:text-[10.5px] tracking-[0.28em] text-white uppercase mt-1.5 leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            LIBRARY
          </span>
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
