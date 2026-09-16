import { useState } from 'react';
import { motion, MotionValue, AnimatePresence } from 'motion/react';
import { Check, Bell } from 'lucide-react';

interface PlaceholderSection2Props {
  contentY?: MotionValue<string>;
  contentOpacity?: MotionValue<number>;
}

function AppleLogoIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8.93-2.85-.9.04-1.99.6-2.61 1.34-.55.63-.99 1.66-.86 2.69 1 .08 2.02-.51 2.54-1.18z" />
    </svg>
  );
}

function GooglePlayLogoIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M3.609 1.814C3.375 2.062 3.24 2.443 3.24 2.953v18.093c0 .51.135.892.37 1.14l.061.058 10.134-10.134v-.24L3.67 1.756l-.061.058z"
        fill="#00D2FF"
      />
      <path
        d="M17.18 15.344l-3.376-3.375v-.24l3.376-3.375.076.044 3.998 2.272c1.142.648 1.142 1.71 0 2.36l-3.998 2.27-.076.044z"
        fill="#FFCE00"
      />
      <path
        d="M13.804 11.969L3.609 22.164c.376.4.996.447 1.696.05l11.875-6.745-3.376-3.5z"
        fill="#FF3A44"
      />
      <path
        d="M13.804 11.969l3.376-3.5L5.305 1.724C4.605 1.327 3.985 1.374 3.61 1.774l10.194 10.195z"
        fill="#00E676"
      />
    </svg>
  );
}

export function PlaceholderSection2({ contentY, contentOpacity }: PlaceholderSection2Props) {
  const [notifiedStore, setNotifiedStore] = useState<string | null>(null);

  const handleNotify = (storeName: string) => {
    setNotifiedStore(storeName);
    setTimeout(() => {
      setNotifiedStore(null);
    }, 3000);
  };

  return (
    <div
      id="placeholder-section-2-container"
      style={{
        background:
          'radial-gradient(ellipse 90% 75% at 50% 45%, #141414 0%, #0a0a0a 55%, #050505 100%)',
      }}
      className="relative w-full h-full min-h-screen overflow-hidden select-none flex flex-col items-center justify-center text-center px-6"
    >
      <motion.div
        style={{
          y: contentY || 0,
          opacity: contentOpacity || 1,
        }}
        className="relative z-10 max-w-4xl w-full mx-auto flex flex-col items-center"
      >
        {/* Main Headline matching picture */}
        <h2
          id="download-app-headline"
          className="font-display font-bold text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] text-white tracking-[-0.035em] leading-[1.06] text-center"
        >
          Download the app
          <br />
          to get started
        </h2>

        {/* Buttons Row */}
        <div
          id="app-store-buttons-container"
          className="mt-10 sm:mt-12 flex flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap"
        >
          {/* Apple App Store Button */}
          <button
            id="btn-soon-app-store"
            onClick={() => handleNotify('App Store')}
            className="group relative flex items-center gap-3.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl glass hover:bg-white/10 transition-all duration-200 cursor-pointer active:scale-95"
            aria-label="Soon on App Store"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-white/70 group-hover:text-white transition-colors duration-200">
              <AppleLogoIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-left">
              <div className="text-[11px] sm:text-xs font-medium text-white/50 leading-tight">
                Soon on
              </div>
              <div className="text-sm sm:text-base font-semibold text-white leading-tight mt-0.5">
                App Store
              </div>
            </div>
          </button>

          {/* Google Play Store Button */}
          <button
            id="btn-soon-google-play"
            onClick={() => handleNotify('Google Play')}
            className="group relative flex items-center gap-3.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl glass hover:bg-white/10 transition-all duration-200 cursor-pointer active:scale-95"
            aria-label="Soon on Google Play"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <GooglePlayLogoIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-left">
              <div className="text-[11px] sm:text-xs font-medium text-white/50 leading-tight">
                Soon on
              </div>
              <div className="text-sm sm:text-base font-semibold text-white leading-tight mt-0.5">
                Google Play
              </div>
            </div>
          </button>
        </div>

        {/* Toast notification feedback on button click */}
        <AnimatePresence>
          {notifiedStore && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium shadow-lg shadow-black/40"
            >
              <Check className="w-3.5 h-3.5 text-zinc-200" />
              <span>We'll notify you when available on {notifiedStore}!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
