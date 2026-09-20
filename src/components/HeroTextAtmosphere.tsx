import { useEffect, useRef } from 'react';
import { getCanvasDpr } from '../utils/canvasDpr';

interface AtmosphericMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  colorType: 'platinum' | 'emerald' | 'pureWhite' | 'bokeh';
  driftPhase: number;
  driftSpeed: number;
  driftAmplitude: number;
}

interface HeroTextAtmosphereProps {
  active?: boolean;
  className?: string;
}

export function HeroTextAtmosphere({ active = true, className = '' }: HeroTextAtmosphereProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = getCanvasDpr();
    let isRunning = true;

    // Mouse coordinates relative to this container
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    const updateSize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const newWidth = Math.max(rect.width, 300);
      const newHeight = Math.max(rect.height, 120);

      if (Math.abs(width - newWidth) < 2 && Math.abs(height - newHeight) < 2) return;

      dpr = getCanvasDpr();
      width = newWidth;
      height = newHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    // Color definitions
    const colors = {
      pureWhite: {
        fill: (a: number) => `rgba(255, 255, 255, ${a})`,
        glow: (a: number) => `rgba(255, 255, 255, ${a * 0.4})`,
      },
      platinum: {
        fill: (a: number) => `rgba(226, 232, 240, ${a})`,
        glow: (a: number) => `rgba(203, 213, 225, ${a * 0.35})`,
      },
      emerald: {
        fill: (a: number) => `rgba(52, 211, 153, ${a})`,
        glow: (a: number) => `rgba(16, 185, 129, ${a * 0.5})`,
      },
    };

    // Calculate count based on width
    const particleCount = Math.min(
      Math.max(Math.floor((width * height) / 8000), 28),
      window.innerWidth < 768 ? 32 : 58
    );

    const particles: AtmosphericMote[] = [];

    const initParticle = (p?: Partial<AtmosphericMote>, forceBottom = false): AtmosphericMote => {
      const isBokeh = Math.random() < 0.16;
      const isEmerald = !isBokeh && Math.random() < 0.28;
      const isPureWhite = !isBokeh && !isEmerald && Math.random() < 0.45;

      let colorType: 'platinum' | 'emerald' | 'pureWhite' | 'bokeh' = 'platinum';
      if (isBokeh) colorType = 'bokeh';
      else if (isEmerald) colorType = 'emerald';
      else if (isPureWhite) colorType = 'pureWhite';

      let baseRadius: number;
      let baseAlpha: number;

      if (isBokeh) {
        baseRadius = Math.random() * 2.8 + 3.2; // 3.2px - 6.0px soft disc
        baseAlpha = Math.random() * 0.12 + 0.05; // very faint out-of-focus haze
      } else if (isEmerald) {
        baseRadius = Math.random() * 1.2 + 0.9;
        baseAlpha = Math.random() * 0.35 + 0.20;
      } else {
        baseRadius = Math.random() * 1.3 + 0.8;
        baseAlpha = Math.random() * 0.45 + 0.18;
      }

      const x = p?.x !== undefined ? p.x : Math.random() * width;
      const y = forceBottom
        ? height + Math.random() * 20
        : p?.y !== undefined
          ? p.y
          : Math.random() * height;

      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -(Math.random() * 0.28 + 0.14), // gentle upward thermal drift
        baseRadius,
        radius: baseRadius,
        alpha: baseAlpha * (Math.random() * 0.6 + 0.4),
        targetAlpha: baseAlpha,
        baseAlpha,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.025 + 0.015,
        colorType,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.012 + 0.006,
        driftAmplitude: Math.random() * 0.35 + 0.15,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(initParticle());
    }

    // Mouse listener on window to detect hover over text zone
    const handlePointerMove = (e: PointerEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const inX = e.clientX >= rect.left - 40 && e.clientX <= rect.right + 40;
      const inY = e.clientY >= rect.top - 40 && e.clientY <= rect.bottom + 40;

      if (inX && inY) {
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    };

    const handlePointerLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      if (!isRunning) return;

      const dt = Math.min((currentTime - lastTime) / 16.667, 2.0);
      lastTime = currentTime;

      if (!activeRef.current) {
        animId = requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.12 * dt;
        mouse.y += (mouse.targetY - mouse.y) * 0.12 * dt;
      } else {
        mouse.x += (-1000 - mouse.x) * 0.06 * dt;
        mouse.y += (-1000 - mouse.y) * 0.06 * dt;
      }

      // Render & update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Harmonic drift
        p.driftPhase += p.driftSpeed * dt;
        p.twinklePhase += p.twinkleSpeed * dt;

        const waveOffset = Math.sin(p.driftPhase) * p.driftAmplitude;
        p.x += (p.vx + waveOffset) * dt;
        p.y += p.vy * dt;

        // Subtle gentle mouse repulsion
        if (mouse.x > -500) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const repulseRadius = 90;

          if (distSq < repulseRadius * repulseRadius && distSq > 4) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / repulseRadius) * 0.65;
            p.x += (dx / dist) * force * dt;
            p.y += (dy / dist) * force * dt;
          }
        }

        // Screen boundary wrap with smooth fade
        if (p.y < -15) {
          particles[i] = initParticle(undefined, true);
          continue;
        }
        if (p.x < -20) p.x = width + 10;
        else if (p.x > width + 20) p.x = -10;

        // Vertical fade envelope (fades in from bottom, stays bright in middle, fades out at top)
        const verticalRatio = Math.max(0, Math.min(1, p.y / height));
        // Envelope: smooth cubic curve
        const verticalFade = Math.sin(verticalRatio * Math.PI);

        // Twinkle factor
        const twinkle = 0.8 + 0.35 * Math.sin(p.twinklePhase);
        const currentAlpha = Math.max(0, p.baseAlpha * verticalFade * twinkle);

        if (currentAlpha < 0.01) continue;

        // Drawing based on particle type
        if (p.colorType === 'bokeh') {
          // Soft out-of-focus background bokeh disk
          const rad = p.radius;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
          grad.addColorStop(0, `rgba(241, 245, 249, ${currentAlpha * 0.85})`);
          grad.addColorStop(0.4, `rgba(167, 243, 208, ${currentAlpha * 0.45})`);
          grad.addColorStop(1, 'rgba(16, 185, 129, 0)');

          ctx.beginPath();
          ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        } else {
          // Ambient crisp or emerald particle with soft glow
          const colorDef =
            p.colorType === 'emerald'
              ? colors.emerald
              : p.colorType === 'pureWhite'
                ? colors.pureWhite
                : colors.platinum;

          // Outer halo
          const haloRadius = p.radius * 2.8;
          const haloGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloRadius);
          haloGrad.addColorStop(0, colorDef.glow(currentAlpha));
          haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.arc(p.x, p.y, haloRadius, 0, Math.PI * 2);
          ctx.fillStyle = haloGrad;
          ctx.fill();

          // Core point
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = colorDef.fill(currentAlpha);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
}
