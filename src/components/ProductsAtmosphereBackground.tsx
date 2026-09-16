import { motion, MotionValue, useMotionValue, useSpring, useTransform } from 'motion/react';
import { SunsetParticleField } from './SunsetParticleField';

interface ProductsAtmosphereBackgroundProps {
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
  /** Flips the background vertically so its top/bottom mirror the
   * non-flipped version — used on the Agronomic Insights panel so its top
   * edge visually continues Qrome Products' bottom edge as they slide past
   * each other, rather than the same orientation repeating. */
  flip?: boolean;
}

// The exact same atmospheric background (neutral gray glow, matching the
// Talos app's own RadialGlow recipe) used across the whole "Qrome Products"
// story beat — the static Qrome content and the Agronomic Insights
// horizontal-scroll content both render this so the two share one
// continuous background with no seam.
export function ProductsAtmosphereBackground({
  mouseX: externalMouseX,
  mouseY: externalMouseY,
  flip = false,
}: ProductsAtmosphereBackgroundProps) {
  const internalMouseX = useMotionValue(0);
  const internalMouseY = useMotionValue(0);
  const activeMouseX = externalMouseX || internalMouseX;
  const activeMouseY = externalMouseY || internalMouseY;

  const springConfig = { damping: 26, stiffness: 100, mass: 0.75 };
  const smoothX = useSpring(activeMouseX, springConfig);
  const smoothY = useSpring(activeMouseY, springConfig);

  const bgDisplaceX = useTransform(smoothX, [-1, 1], [22, -22]);
  const bgDisplaceY = useTransform(smoothY, [-1, 1], [16, -16]);

  const glowDisplaceX = useTransform(smoothX, [-1, 1], [35, -35]);
  const glowDisplaceY = useTransform(smoothY, [-1, 1], [25, -25]);

  const lightReflectionX = useTransform(smoothX, [-1, 1], ['25%', '75%']);
  const lightReflectionY = useTransform(smoothY, [-1, 1], ['20%', '80%']);

  return (
    <motion.div
      id="products-background-parallax-layer"
      style={{
        x: bgDisplaceX,
        y: bgDisplaceY,
        scaleY: flip ? -1 : 1,
      }}
      className="absolute -inset-[8%] pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Top-Right Neutral Glow Bloom with enhanced parallax */}
      <motion.div
        style={{
          x: glowDisplaceX,
          y: glowDisplaceY,
          background:
            'radial-gradient(ellipse 75% 60% at 75% 15%, rgba(160, 160, 160, 0.30) 0%, rgba(120, 120, 120, 0.18) 30%, rgba(80, 80, 80, 0.10) 60%, transparent 85%)',
        }}
        className="absolute -top-[12%] -right-[8%] w-[90vw] h-[80vh] pointer-events-none"
      />

      {/* Ambient Soft Ray Flare */}
      <motion.div
        style={{
          x: glowDisplaceX,
          y: glowDisplaceY,
          background:
            'radial-gradient(circle at 60% 25%, rgba(200, 200, 200, 0.18) 0%, rgba(140, 140, 140, 0.10) 45%, transparent 75%)',
        }}
        className="absolute top-0 right-[12%] w-[50vw] h-[55vh] pointer-events-none opacity-80"
      />

      {/* Dynamic Specular Highlight tracking cursor */}
      <motion.div
        style={{
          background: useTransform(
            [lightReflectionX, lightReflectionY],
            ([lx, ly]) =>
              `radial-gradient(circle at ${lx} ${ly}, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.04) 35%, transparent 70%)`
          ),
        }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Neutral Dark Base (matches the Talos app's near-black #050505) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 25% 65%, rgba(30, 30, 30, 0.88) 0%, rgba(12, 12, 12, 0.95) 55%, #050505 100%)',
        }}
      />

      {/* Subtle Organic Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 45%, rgba(5, 5, 5, 0.70) 90%, #050505 100%)',
        }}
      />

      {/* Dynamic 3D Depth Particle System (Foreground Bokeh, Golden Spores, Orbiting Pollen Motes) */}
      <SunsetParticleField mouseX={activeMouseX} mouseY={activeMouseY} />
    </motion.div>
  );
}
