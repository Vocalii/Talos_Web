import { motion, type MotionValue } from 'motion/react';
import type { ReactNode } from 'react';

interface PhoneMockupProps {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  y: MotionValue<number>;
  /** Screen content (the phone video). Clipped to the screen area. */
  children: ReactNode;
  /** Sizing override (default: 78svh tall, capped at 700px). */
  sizeClassName?: string;
}

/**
 * Device shell: rounded chassis, clipped screen, and a bezel overlay layered
 * ABOVE the screen content. Height-driven sizing (capped to the viewport)
 * keeps a realistic ~9:19.5 aspect on desktop and mobile.
 */
export function PhoneMockup({
  opacity,
  scale,
  y,
  children,
  sizeClassName = 'h-[min(78svh,700px)]',
}: PhoneMockupProps) {
  return (
    <motion.div
      style={{ opacity, scale, y }}
      className={`relative z-20 ${sizeClassName} max-w-[78vw] aspect-[9/19.5] will-change-[transform,opacity]`}
    >
      {/* Soft ambient aura */}
      <div
        className="absolute -inset-16 rounded-full bg-white/[0.04] blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Side buttons */}
      <span className="absolute -left-[3px] top-[18%] h-8 w-[3px] rounded-l bg-zinc-700/80" aria-hidden="true" />
      <span className="absolute -left-[3px] top-[27%] h-14 w-[3px] rounded-l bg-zinc-700/80" aria-hidden="true" />
      <span className="absolute -right-[3px] top-[24%] h-20 w-[3px] rounded-r bg-zinc-700/80" aria-hidden="true" />

      {/* Chassis */}
      <div className="absolute inset-0 rounded-[2.75rem] bg-gradient-to-br from-[#2a2c30] via-[#141517] to-[#0c0d0f] p-2.5 border border-white/15 shadow-[0_40px_90px_rgba(0,0,0,0.85)]">
        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-black">
          {children}
        </div>
      </div>

      {/* Bezel overlay above the screen video */}
      <div className="absolute inset-0 z-10 rounded-[2.75rem] pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 rounded-[2.75rem] ring-1 ring-inset ring-white/10" />
        <div className="absolute inset-[10px] rounded-[2.2rem] ring-1 ring-inset ring-black/60" />
        {/* Dynamic Island */}
        <div className="absolute left-1/2 top-[2.4%] h-[2.4%] w-[28%] -translate-x-1/2 rounded-full bg-black" />
        {/* Glass glare */}
        <div className="absolute inset-[10px] rounded-[2.2rem] bg-gradient-to-br from-white/[0.07] via-transparent to-transparent" />
      </div>
    </motion.div>
  );
}
