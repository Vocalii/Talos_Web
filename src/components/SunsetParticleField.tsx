import { useEffect, useRef } from 'react';
import { MotionValue } from 'motion/react';

interface Particle3D {
  x: number;
  y: number;
  z: number;
  baseVx: number;
  baseVy: number;
  baseVz: number;
  radius: number;
  color: string;
  glowColor: string;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  isBokeh: boolean;
  orbitAngle?: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitYOffset?: number;
}

interface SunsetParticleFieldProps {
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
}

export function SunsetParticleField({ mouseX: motionMouseX, mouseY: motionMouseY }: SunsetParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;

    // Mouse velocity & position tracking for 3D turbulence
    const mouseState = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      normalizedX: 0,
      normalizedY: 0,
      speed: 0,
      lastMoveTime: 0,
    };

    const handleResize = () => {
      if (!canvas) return;
      dpr = window.devicePixelRatio || 1;
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Neutral drifting motes, matching the Talos app's monochrome palette
    // (varying only in brightness, not hue).
    const colorPalette = [
      { base: 'rgba(255, 255, 255, ', glow: 'rgba(255, 255, 255, 0.55)' },
      { base: 'rgba(220, 220, 220, ', glow: 'rgba(200, 200, 200, 0.45)' },
      { base: 'rgba(180, 180, 180, ', glow: 'rgba(160, 160, 160, 0.50)' },
      { base: 'rgba(240, 240, 240, ', glow: 'rgba(230, 230, 230, 0.65)' },
      { base: 'rgba(150, 150, 150, ', glow: 'rgba(130, 130, 130, 0.40)' },
      { base: 'rgba(200, 200, 200, ', glow: 'rgba(180, 180, 180, 0.35)' },
    ];

    // Create layered particles with 3D Z-depth
    const particleCount = 55;
    const particles: Particle3D[] = [];
    const fov = 500; // 3D Camera Field of View

    for (let i = 0; i < particleCount; i++) {
      const isBokeh = Math.random() < 0.28; // 28% foreground/midground out-of-focus bokeh
      const isOrbiting = i < 16; // 16 particles gently orbiting around kernel locus
      const colorScheme = colorPalette[Math.floor(Math.random() * colorPalette.length)];

      // Z depth ranges from -250 (far background) to +450 (close foreground)
      const z = Math.random() * 700 - 250;
      const baseAlpha = isBokeh ? Math.random() * 0.35 + 0.15 : Math.random() * 0.45 + 0.35;
      const radius = isBokeh ? Math.random() * 3.5 + 3.0 : Math.random() * 1.5 + 0.8;

      particles.push({
        x: (Math.random() - 0.5) * (width * 1.3),
        y: (Math.random() - 0.5) * (height * 1.3),
        z,
        baseVx: (Math.random() - 0.5) * 0.35,
        baseVy: -Math.random() * 0.45 - 0.15, // gentle buoyant upward drift
        baseVz: (Math.random() - 0.5) * 0.2,
        radius,
        color: colorScheme.base,
        glowColor: colorScheme.glow,
        alpha: baseAlpha,
        baseAlpha,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        isBokeh,
        orbitAngle: isOrbiting ? Math.random() * Math.PI * 2 : undefined,
        orbitRadius: isOrbiting ? Math.random() * 140 + 80 : undefined,
        orbitSpeed: isOrbiting ? (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1) : undefined,
        orbitYOffset: isOrbiting ? (Math.random() - 0.5) * 120 : undefined,
      });
    }

    // Subscribe to external motion values if present
    const unsubscribeX = motionMouseX?.on('change', (val) => {
      mouseState.normalizedX = val;
    });
    const unsubscribeY = motionMouseY?.on('change', (val) => {
      mouseState.normalizedY = val;
    });

    let time = 0;

    const render = () => {
      time += 0.016;

      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.5;

      // Smoothly interpolate mouse parallax offset
      const mouseParallaxX = mouseState.normalizedX * 45;
      const mouseParallaxY = mouseState.normalizedY * 35;

      // Sort particles by Z-depth for correct back-to-front rendering
      particles.sort((a, b) => a.z - b.z);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Organic pulsation & flickering
        p.pulsePhase += p.pulseSpeed;
        const pulse = Math.sin(p.pulsePhase) * 0.25 + 0.75;

        // Position updates
        if (p.orbitAngle !== undefined && p.orbitRadius !== undefined && p.orbitSpeed !== undefined) {
          // Orbiting particle around kernel center (approx center-right of section)
          p.orbitAngle += p.orbitSpeed;
          const kernelAnchorX = width > 1024 ? width * 0.22 : 0; // offset towards right column on desktop
          p.x = kernelAnchorX + Math.cos(p.orbitAngle) * p.orbitRadius * 1.3;
          p.z = Math.sin(p.orbitAngle) * p.orbitRadius;
          p.y += p.baseVy * 0.6;
          if (p.y < -height * 0.6) p.y = height * 0.6;
        } else {
          // Free floating floating drift
          p.x += p.baseVx + Math.sin(time + p.pulsePhase) * 0.2;
          p.y += p.baseVy;
          p.z += p.baseVz;

          // Boundary wrapping in 3D space
          const halfW = width * 0.7;
          const halfH = height * 0.7;
          if (p.x < -halfW) p.x = halfW;
          if (p.x > halfW) p.x = -halfW;
          if (p.y < -halfH) p.y = halfH;
          if (p.y > halfH) p.y = -halfH;
          if (p.z < -250) p.z = 450;
          if (p.z > 450) p.z = -250;
        }

        // 3D Perspective Projection with Mouse Parallax Camera Shift
        // Perspective formula: scale = fov / (fov + z)
        const adjustedZ = p.z;
        const scale = fov / Math.max(10, fov - adjustedZ);

        // Z-axis parallax velocity multiplier: closer particles move significantly more with mouse
        const zDepthFactor = (adjustedZ + 250) / 700; // 0 (far) to 1 (near)
        const parallaxOffsetX = mouseParallaxX * (0.3 + zDepthFactor * 1.5);
        const parallaxOffsetY = mouseParallaxY * (0.3 + zDepthFactor * 1.5);

        const screenX = centerX + (p.x + parallaxOffsetX) * scale;
        const screenY = centerY + (p.y + parallaxOffsetY) * scale;

        // Screen boundaries check
        if (screenX < -60 || screenX > width + 60 || screenY < -60 || screenY > height + 60) {
          continue;
        }

        const currentRadius = Math.max(0.5, p.radius * scale * pulse);
        const currentAlpha = Math.min(0.95, Math.max(0.05, p.alpha * pulse * (0.4 + zDepthFactor * 0.6)));

        // Drawing optical particle
        ctx.save();

        if (p.isBokeh || scale > 1.3) {
          // Soft Out-of-Focus Bokeh Circle
          const gradient = ctx.createRadialGradient(
            screenX,
            screenY,
            0,
            screenX,
            screenY,
            currentRadius * 2.8
          );
          gradient.addColorStop(0, `${p.color}${currentAlpha * 0.85})`);
          gradient.addColorStop(0.4, `${p.color}${currentAlpha * 0.45})`);
          gradient.addColorStop(1, `${p.color}0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(screenX, screenY, currentRadius * 2.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Crisp Glowing Micro Mote / Ember
          ctx.shadowColor = p.glowColor;
          ctx.shadowBlur = Math.min(18, currentRadius * 5);
          ctx.fillStyle = `${p.color}${currentAlpha})`;

          ctx.beginPath();
          ctx.arc(screenX, screenY, currentRadius, 0, Math.PI * 2);
          ctx.fill();

          // High-luminance white core for larger particles
          if (currentRadius > 1.8) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.75})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, currentRadius * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (unsubscribeX) unsubscribeX();
      if (unsubscribeY) unsubscribeY();
    };
  }, [motionMouseX, motionMouseY]);

  return (
    <canvas
      ref={canvasRef}
      id="sunset-particle-field-canvas"
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      aria-hidden="true"
    />
  );
}
