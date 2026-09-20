import { useEffect, useRef } from 'react';
import { getCanvasDpr } from '../utils/canvasDpr';

interface Particle {
  x: number;
  y: number;
  baseVx: number;
  baseVy: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  glowColor: string;
  alpha: number;
  targetAlpha: number;
  pulseSpeed: number;
  isBokeh: boolean;
  hasStarGlint: boolean;
  twinklePhase: number;
  twinkleSpeed: number;
  isCosmicStream: boolean;
  mass: number;
}

interface InteractiveSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  color: string;
}

interface ParticleFieldProps {
  /** When false the animation loop stops (e.g. section scrolled off-screen). */
  active?: boolean;
  /** Particle cap below 768px wide (default 22; 44 up to 1024px; 76 above). */
  compactMax?: number;
}

export function ParticleField({ active = true, compactMax = 22 }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  const resumeRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = getCanvasDpr();
    let width = 0;
    let height = 0;

    // Mouse state with smooth damping
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      prevX: -1000,
      prevY: -1000,
      speed: 0,
      active: false,
      radius: 220, // expanded aerodynamic influence radius
    };

    const handleResize = () => {
      if (!canvas) return;
      // Mobile browsers fire `resize` as the URL bar collapses while scrolling;
      // reallocating the canvas each time causes visible jank, so ignore
      // small height-only changes.
      if (width && window.innerWidth === width && Math.abs(window.innerHeight - height) < 160) return;
      dpr = getCanvasDpr();
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Color palette refined with more pure diamond starlight and soft platinum tones to keep the header and scene clean
    const palette = [
      // Pure diamond starlight (dominant)
      { base: 'rgba(255, 255, 255, ', glow: 'rgba(255, 255, 255, 0.45)' },
      // Crisp silver-white
      { base: 'rgba(240, 248, 245, ', glow: 'rgba(220, 240, 235, 0.30)' },
      // Subtle mint highlight (soft, desaturated)
      { base: 'rgba(167, 243, 208, ', glow: 'rgba(110, 231, 183, 0.22)' },
      // Delicate celestial emerald whisper
      { base: 'rgba(52, 211, 153, ', glow: 'rgba(52, 211, 153, 0.20)' },
      // Icy crystalline stardust
      { base: 'rgba(204, 251, 241, ', glow: 'rgba(153, 246, 228, 0.22)' },
    ];

    // Rich cinematic density: 55-80 particles balanced for performance and visual grandeur
    const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 22000) + 36, window.innerWidth < 768 ? compactMax : window.innerWidth < 1024 ? 44 : 76);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      // 45% of particles are concentrated in the right-side cosmic nebula spray
      const isCosmicStream = i < Math.floor(particleCount * 0.45);
      const isBokeh = Math.random() < 0.16; // soft atmospheric bokeh motes
      const hasStarGlint = !isBokeh && Math.random() < 0.18; // sparkling cross-diffraction glint

      const colorScheme = palette[Math.floor(Math.random() * palette.length)];

      let radius: number;
      if (isBokeh) {
        radius = Math.random() * 2.2 + 2.6; // 2.6px - 4.8px soft orb
      } else if (hasStarGlint) {
        radius = Math.random() * 0.9 + 1.2; // 1.2px - 2.1px glittering star
      } else {
        radius = Math.random() * 0.9 + 0.5; // 0.5px - 1.4px fine stardust speck
      }

      // Position logic: cosmic stream particles are clustered in the right/upper-right nebula
      let initialX: number;
      let initialY: number;
      let baseVx: number;
      let baseVy: number;

      if (isCosmicStream) {
        // Biased heavily toward right quadrant (0.52W to 1.05W, 0.05H to 0.75H)
        initialX = width * (0.50 + Math.random() * 0.52);
        initialY = height * (Math.random() * 0.78);
        // Gentle diagonal drift into the scene from the nebula
        baseVx = -(Math.random() * 0.28 + 0.08);
        baseVy = Math.random() * 0.18 - 0.04;
      } else {
        // Uniform distribution for ambient room atmosphere
        initialX = Math.random() * width;
        initialY = Math.random() * height;
        // Subtle upward organic float
        baseVx = (Math.random() - 0.5) * 0.20;
        baseVy = -(Math.random() * 0.24 + 0.06);
      }

      particles.push({
        x: initialX,
        y: initialY,
        baseVx,
        baseVy,
        vx: 0,
        vy: 0,
        radius,
        baseRadius: radius,
        color: colorScheme.base,
        glowColor: colorScheme.glow,
        alpha: Math.random() * 0.45 + 0.20,
        targetAlpha: Math.random() * 0.65 + 0.25,
        pulseSpeed: Math.random() * 0.016 + 0.006,
        isBokeh,
        hasStarGlint,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.015,
        isCosmicStream,
        mass: radius * 1.5,
      });
    }

    // Dynamic sparks generated by mouse interactions
    const sparks: InteractiveSpark[] = [];

    const addSpark = (x: number, y: number, count = 1) => {
      for (let i = 0; i < count; i++) {
        if (sparks.length > 45) sparks.shift();
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.8 + 0.4;
        const isWhiteGlint = Math.random() > 0.25;
        const color = isWhiteGlint ? 'rgba(255, 255, 255, ' : 'rgba(167, 243, 208, ';
        sparks.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.25,
          radius: Math.random() * 0.9 + 0.6,
          alpha: 0.85,
          decay: Math.random() * 0.035 + 0.02,
          color,
        });
      }
    };

    // Event listeners
    const onMouseMove = (e: MouseEvent) => {
      mouse.active = true;
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      const dx = mouse.targetX - mouse.prevX;
      const dy = mouse.targetY - mouse.prevY;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);
      mouse.prevX = mouse.targetX;
      mouse.prevY = mouse.targetY;

      // Spawn shimmering stardust trail when cursor glides across the hero
      if (mouse.speed > 7 && Math.random() < 0.45) {
        addSpark(mouse.targetX, mouse.targetY, 1);
      }
    };

    const onMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const onClick = (e: MouseEvent) => {
      addSpark(e.clientX, e.clientY, 5);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.active = true;
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        if (Math.random() < 0.4) {
          addSpark(mouse.targetX, mouse.targetY, 2);
        }
      }
    };

    const onTouchEnd = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('click', onClick, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // Helper: Draw subtle 4-point star flare on sparkling stardust
    const drawStarGlint = (c: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number) => {
      const glintLength = r * 3.6;
      c.save();
      c.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
      c.lineWidth = 0.75;

      c.beginPath();
      // Horizontal flare
      c.moveTo(x - glintLength, y);
      c.lineTo(x + glintLength, y);
      // Vertical flare
      c.moveTo(x, y - glintLength);
      c.lineTo(x, y + glintLength);
      c.stroke();

      // Soft center core
      c.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      c.beginPath();
      c.arc(x, y, r * 0.7, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    // Animation frame timing
    let time = 0;

    // Main animation loop. Stops rescheduling while `active` is false (the
    // last frame stays on the canvas) and is restarted by the effect below.
    let running = true;
    const render = () => {
      if (!activeRef.current) {
        running = false;
        return;
      }
      ctx.clearRect(0, 0, width, height);
      time += 0.018;

      // Smooth cursor interpolation
      if (mouse.targetX > -500) {
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      // 1. Ambient Nebula Glow on the right side of the canvas
      // Softer, subtle ambient glow located lower down away from the header
      const nebulaX = width * 0.88 + (mouse.x > 0 ? (mouse.x - width * 0.5) * 0.03 : 0);
      const nebulaY = height * 0.44 + (mouse.y > 0 ? (mouse.y - height * 0.5) * 0.03 : 0);
      const nebulaRadius = Math.max(width * 0.36, 300);

      const nebulaGrad = ctx.createRadialGradient(
        nebulaX,
        nebulaY,
        0,
        nebulaX,
        nebulaY,
        nebulaRadius
      );
      nebulaGrad.addColorStop(0, 'rgba(16, 185, 129, 0.025)');
      nebulaGrad.addColorStop(0.40, 'rgba(5, 150, 105, 0.012)');
      nebulaGrad.addColorStop(0.75, 'rgba(4, 47, 46, 0.004)');
      nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = nebulaGrad;
      ctx.beginPath();
      ctx.arc(nebulaX, nebulaY, nebulaRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Interactive Cursor Halo (clean, neutral, and subtle)
      if (mouse.active && mouse.x > 0 && mouse.y > 0) {
        const haloGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius * 1.2
        );
        haloGrad.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
        haloGrad.addColorStop(0.4, 'rgba(167, 243, 208, 0.015)');
        haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Process and Render Main Atmospheric Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Interaction with mouse: aerodynamic repulsion + gentle rotational vortex
        if (mouse.x > -500 && mouse.y > -500) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const maxDist = mouse.radius;

          if (distSq < maxDist * maxDist && distSq > 4) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / maxDist) * 1.8;
            const nx = dx / dist;
            const ny = dy / dist;

            // Push outward gently
            p.vx += (nx * force * 1.2) / p.mass;
            p.vy += (ny * force * 1.2) / p.mass;

            // Swirl turbulence around cursor
            p.vx += (-ny * force * 0.45) / p.mass;
            p.vy += (nx * force * 0.45) / p.mass;

            // Luminous activation on interaction
            p.targetAlpha = Math.min(1, p.targetAlpha + 0.05);
          }
        }

        // Apply friction/damping to return to natural drift
        p.vx *= 0.93;
        p.vy *= 0.93;

        // Position update
        p.x += p.baseVx + p.vx;
        p.y += p.baseVy + p.vy;

        // Wrap around boundaries gracefully with cosmic respawn logic
        if (p.x < -30) {
          p.x = width + 20;
          p.y = p.isCosmicStream ? Math.random() * height * 0.8 : Math.random() * height;
          p.vx = 0;
          p.vy = 0;
        } else if (p.x > width + 30) {
          p.x = -20;
          p.vx = 0;
          p.vy = 0;
        }

        if (p.y < -30) {
          p.y = height + 20;
          p.x = p.isCosmicStream ? width * (0.55 + Math.random() * 0.45) : Math.random() * width;
          p.vx = 0;
          p.vy = 0;
        } else if (p.y > height + 30) {
          p.y = -20;
          p.x = p.isCosmicStream ? width * (0.55 + Math.random() * 0.45) : Math.random() * width;
          p.vx = 0;
          p.vy = 0;
        }

        // Twinkle sinusoidal brightness modulation
        p.twinklePhase += p.twinkleSpeed;
        const twinkleMod = (Math.sin(p.twinklePhase) + 1) * 0.5; // 0 to 1

        // Base breathing alpha
        p.alpha += (p.targetAlpha - p.alpha) * p.pulseSpeed;
        if (Math.abs(p.targetAlpha - p.alpha) < 0.04) {
          p.targetAlpha = Math.random() * 0.55 + 0.20;
        }

        // Soften and fade particles gracefully if they drift near the top header (y < 130px)
        let headerFade = 1;
        if (p.y < 140) {
          headerFade = Math.max(0, (p.y - 35) / 105);
        }

        const currentAlpha = Math.min(1, Math.max(0.02, p.alpha * (0.65 + twinkleMod * 0.45) * headerFade));

        // If completely faded near header, skip drawing
        if (currentAlpha < 0.03) continue;

        // Render Bokeh Orb, Star Glint, or Fine Stardust Dot
        if (p.isBokeh) {
          // Soft atmospheric bokeh with radial falloff
          const bokehGrad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.radius * 2.2
          );
          bokehGrad.addColorStop(0, `${p.color}${currentAlpha * 0.85})`);
          bokehGrad.addColorStop(0.45, `${p.color}${currentAlpha * 0.35})`);
          bokehGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = bokehGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.hasStarGlint && twinkleMod > 0.72) {
          // High-luminance star glint with diffraction flare
          drawStarGlint(ctx, p.x, p.y, p.radius, currentAlpha);
        } else {
          // Clean pinpoint stardust speck
          ctx.fillStyle = `${p.color}${currentAlpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          // Subtle glow aura on larger motes
          if (p.radius > 1.4) {
            ctx.fillStyle = p.glowColor;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 2.0, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 4. Connective celestial affinity lines between neighboring cosmic particles near cursor
        if (mouse.x > -500 && mouse.y > -500) {
          for (let j = i + 1; j < Math.min(i + 8, particles.length); j++) {
            const p2 = particles[j];
            const pDistSq = (p.x - p2.x) ** 2 + (p.y - p2.y) ** 2;
            if (pDistSq < 6500) {
              const mouseDistToMidpoint = Math.hypot(
                (p.x + p2.x) / 2 - mouse.x,
                (p.y + p2.y) / 2 - mouse.y
              );
              if (mouseDistToMidpoint < mouse.radius * 0.95) {
                const lineAlpha = (1 - pDistSq / 6500) * 0.12 * (1 - mouseDistToMidpoint / (mouse.radius * 0.95));
                ctx.strokeStyle = `rgba(220, 252, 240, ${lineAlpha})`;
                ctx.lineWidth = 0.75;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }
        }
      }

      // 5. Render Dynamic Interactive Sparks (Stardust trails)
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `${s.color}${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * s.alpha, 0, Math.PI * 2);
        ctx.fill();

        // Extra diamond glint on fast sparks
        if (s.radius > 0.8 && s.alpha > 0.4) {
          ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    resumeRef.current = () => {
      if (running) return;
      running = true;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('click', onClick);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    activeRef.current = active;
    if (active) resumeRef.current();
  }, [active]);

  return (
    <canvas
      id="interactive-particle-canvas"
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
}
