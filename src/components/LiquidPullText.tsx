import React, { useEffect, useRef, useMemo } from 'react';

interface LiquidPullTextProps {
  text: string;
  className?: string;
  maxPull?: number;
  maxBlur?: number;
  radius?: number;
  lerpFactor?: number;
  letterClassName?: string;
  /**
   * false renders the same layout with no mouse physics or a11y label —
   * for static decorative copies (e.g. a glow layer behind the real text).
   */
  interactive?: boolean;
  /**
   * While the cursor is away, periodically glides a virtual cursor across the
   * text so the letters play the exact hover effect (pull, blur, glint) on
   * their own.
   */
  idleShine?: boolean;
}

interface LetterPhysics {
  currentX: number;
  currentY: number;
  currentBlur: number;
  currentRotate: number;
  currentScaleX: number;
  currentScaleY: number;
  targetX: number;
  targetY: number;
  targetBlur: number;
  targetRotate: number;
  targetScaleX: number;
  targetScaleY: number;
  centerX: number;
  centerY: number;
  wasDisplaced: boolean;
}

export const LiquidPullText: React.FC<LiquidPullTextProps> = ({
  text,
  className = '',
  maxPull = 1.0,
  maxBlur = 5.0,
  radius = 120,
  lerpFactor = 0.12,
  letterClassName = '',
  interactive = true,
  idleShine = false,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const physicsRef = useRef<LetterPhysics[]>([]);
  const isNearRef = useRef(false);
  const isLoopRunningRef = useRef(false);
  const sweepingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // Split into words so wrapping behaves naturally
  const words = useMemo(() => text.split(' '), [text]);

  // Total character count excluding spaces
  const totalLetters = useMemo(() => {
    return words.reduce((acc, word) => acc + word.length, 0);
  }, [words]);

  // Initialize or resize physics objects
  useEffect(() => {
    const physics: LetterPhysics[] = [];
    for (let i = 0; i < totalLetters; i++) {
      physics.push({
        currentX: 0,
        currentY: 0,
        currentBlur: 0,
        currentRotate: 0,
        currentScaleX: 1,
        currentScaleY: 1,
        targetX: 0,
        targetY: 0,
        targetBlur: 0,
        targetRotate: 0,
        targetScaleX: 1,
        targetScaleY: 1,
        centerX: 0,
        centerY: 0,
        wasDisplaced: false,
      });
    }
    physicsRef.current = physics;
  }, [totalLetters]);

  // Recalculate letter centers without causing layout thrashing during mouse movement
  const updateLetterBounds = () => {
    const physics = physicsRef.current;
    const els = letterRefs.current;
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      if (el && physics[i]) {
        const rect = el.getBoundingClientRect();
        // Measure un-transformed center
        physics[i].centerX = rect.left + rect.width / 2 - physics[i].currentX;
        physics[i].centerY = rect.top + rect.height / 2 - physics[i].currentY;
      }
    }
  };

  useEffect(() => {
    // Initial bounds calculation after paint
    const timer = setTimeout(updateLetterBounds, 50);
    return () => clearTimeout(timer);
  }, [totalLetters]);

  // Promote the letters to their own compositor layers as soon as the cursor
  // is near (BEFORE the first displacement), so the first hover doesn't stall
  // while the browser builds layers; release them once everything is at rest.
  const setLayers = (on: boolean) => {
    const els = letterRefs.current;
    for (let i = 0; i < els.length; i++) {
      if (els[i]) els[i]!.style.willChange = on ? 'transform, filter' : '';
    }
  };

  // Physics animation tick
  const startLoopIfNeeded = () => {
    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;

    const tick = () => {
      const physics = physicsRef.current;
      const els = letterRefs.current;
      let hasDisplacement = false;

      for (let i = 0; i < physics.length; i++) {
        const p = physics[i];
        const el = els[i];
        if (!p || !el) continue;

        // Smooth liquid lerp towards targets
        p.currentX += (p.targetX - p.currentX) * lerpFactor;
        p.currentY += (p.targetY - p.currentY) * lerpFactor;
        p.currentBlur += (p.targetBlur - p.currentBlur) * lerpFactor;
        p.currentRotate += (p.targetRotate - p.currentRotate) * lerpFactor;
        p.currentScaleX += (p.targetScaleX - p.currentScaleX) * lerpFactor;
        p.currentScaleY += (p.targetScaleY - p.currentScaleY) * lerpFactor;

        const isCurrentlyDisplaced =
          Math.abs(p.currentX) > 0.02 ||
          Math.abs(p.currentY) > 0.02 ||
          p.currentBlur > 0.04 ||
          Math.abs(p.currentRotate) > 0.02;

        if (isCurrentlyDisplaced) {
          hasDisplacement = true;
          p.wasDisplaced = true;
          el.style.transform = `translate3d(${p.currentX.toFixed(2)}px, ${p.currentY.toFixed(2)}px, 0) rotate(${p.currentRotate.toFixed(2)}deg) scale(${p.currentScaleX.toFixed(3)}, ${p.currentScaleY.toFixed(3)})`;
          const glintBrightness = (1 + (p.currentBlur / (maxBlur || 1)) * 0.35).toFixed(2);
          const blurVal = p.currentBlur > 0.05 ? `blur(${p.currentBlur.toFixed(2)}px)` : '';
          el.style.filter = blurVal ? `${blurVal} brightness(${glintBrightness})` : `brightness(${glintBrightness})`;
        } else if (p.wasDisplaced) {
          // Cleanly reset DOM styles when settled back to rest
          el.style.transform = '';
          el.style.filter = '';
          p.wasDisplaced = false;
        }
      }

      if (hasDisplacement || isNearRef.current) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        isLoopRunningRef.current = false;
        setLayers(false);
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !interactive) return;

    const resetTargets = () => {
      const physics = physicsRef.current;
      for (let i = 0; i < physics.length; i++) {
        if (physics[i]) {
          physics[i].targetX = 0;
          physics[i].targetY = 0;
          physics[i].targetBlur = 0;
          physics[i].targetRotate = 0;
          physics[i].targetScaleX = 1;
          physics[i].targetScaleY = 1;
        }
      }
      startLoopIfNeeded();
    };

    // Sets every letter's targets for a pointer at (mouseX, mouseY). Used by
    // the real cursor and by the idle-shine virtual cursor alike.
    const applyPointer = (mouseX: number, mouseY: number) => {
      const physics = physicsRef.current;

      for (let i = 0; i < physics.length; i++) {
        const p = physics[i];
        if (!p) continue;

        const dx = mouseX - p.centerX;
        const dy = mouseY - p.centerY;
        const dist = Math.hypot(dx, dy);

        if (dist < radius && dist > 0.001) {
          const norm = dist / radius;
          // Smooth, organic liquid bell curve (smoothstep)
          const proximity = 1 - norm;
          const curve = proximity * proximity * (3 - 2 * proximity);

          const angle = Math.atan2(dy, dx);
          // Letters pull towards the cursor coordinates
          p.targetX = Math.cos(angle) * (curve * maxPull);
          p.targetY = Math.sin(angle) * (curve * maxPull);

          // Dynamic liquid blur proportional to displacement
          p.targetBlur = curve * maxBlur;

          // Subtle organic stretch and tilt towards the cursor direction (only if displacement enabled)
          p.targetRotate = maxPull > 0 ? (dx / radius) * 1.5 * curve : 0;
          p.targetScaleX = maxPull > 0 ? 1 + Math.abs(Math.cos(angle)) * curve * 0.015 : 1;
          p.targetScaleY = maxPull > 0 ? 1 + Math.abs(Math.sin(angle)) * curve * 0.015 : 1;
        } else {
          p.targetX = 0;
          p.targetY = 0;
          p.targetBlur = 0;
          p.targetRotate = 0;
          p.targetScaleX = 1;
          p.targetScaleY = 1;
        }
      }

      startLoopIfNeeded();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const margin = radius + 30;

      // Quick bounding check to avoid processing when cursor is distant
      if (
        e.clientX < rect.left - margin ||
        e.clientX > rect.right + margin ||
        e.clientY < rect.top - margin ||
        e.clientY > rect.bottom + margin
      ) {
        if (isNearRef.current) {
          isNearRef.current = false;
          resetTargets();
        }
        return;
      }

      if (!isNearRef.current) {
        isNearRef.current = true;
        sweepingRef.current = false; // a real cursor takes over
        setLayers(true);
        // Re-verify centers on re-entry in case layout shifted
        updateLetterBounds();
      }

      applyPointer(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      isNearRef.current = false;
      resetTargets();
    };

    // Idle shine: a virtual cursor glides left-to-right through the text
    // every few seconds. Skipped while a real cursor is near, while off-screen
    // / tab hidden, and for reduced motion.
    let idleTimer: number | undefined;
    let sweepRaf = 0;
    let observer: IntersectionObserver | undefined;
    if (idleShine && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const FIRST_DELAY_MS = 2800;
      const EVERY_MS = 7000;
      const SWEEP_MS = 2400;
      let visible = true;
      observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      observer.observe(container);

      const runSweep = () => {
        updateLetterBounds();
        const rect = container.getBoundingClientRect();
        const fromX = rect.left - radius * 0.6;
        const toX = rect.right + radius * 0.6;
        const y = rect.top + rect.height / 2;
        const start = performance.now();
        sweepingRef.current = true;
        setLayers(true);

        const frame = (now: number) => {
          if (!sweepingRef.current) return; // a real cursor took over
          const t = Math.min(1, (now - start) / SWEEP_MS);
          const eased = t * t * (3 - 2 * t);
          if (t >= 1) {
            sweepingRef.current = false;
            resetTargets();
            return;
          }
          applyPointer(fromX + (toX - fromX) * eased, y);
          sweepRaf = requestAnimationFrame(frame);
        };
        sweepRaf = requestAnimationFrame(frame);
      };

      const schedule = (delay: number) => {
        idleTimer = window.setTimeout(() => {
          if (visible && !document.hidden && !isNearRef.current && !sweepingRef.current) {
            runSweep();
          }
          schedule(EVERY_MS);
        }, delay);
      };
      schedule(FIRST_DELAY_MS);
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', updateLetterBounds);

    return () => {
      window.clearTimeout(idleTimer);
      cancelAnimationFrame(sweepRaf);
      observer?.disconnect();
      sweepingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', updateLetterBounds);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [maxPull, maxBlur, radius, lerpFactor, interactive, idleShine]);

  let letterIndexCounter = 0;

  return (
    <span
      ref={containerRef}
      className={`inline-block pointer-events-auto cursor-default ${className}`}
      aria-label={interactive ? text : undefined}
    >
      {interactive && <span className="sr-only">{text}</span>}
      <span aria-hidden="true" className="inline-block" style={{ letterSpacing: 'inherit' }}>
        {words.map((word, wordIndex) => {
          return (
            <React.Fragment key={wordIndex}>
              <span className="inline-block whitespace-nowrap" style={{ letterSpacing: 'inherit' }}>
                {word.split('').map((char, charIndex) => {
                  const currentIdx = letterIndexCounter++;
                  return (
                    <span
                      key={charIndex}
                      ref={(el) => {
                        letterRefs.current[currentIdx] = el;
                      }}
                      className={`inline-block select-none ${letterClassName}`}
                      style={{
                        transformOrigin: 'center center',
                        WebkitTextStroke: '0.25px rgba(255, 255, 255, 0.22)',
                        letterSpacing: 'inherit',
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
              {wordIndex < words.length - 1 && (
                <span className="inline-block w-[0.45em]">&nbsp;</span>
              )}
            </React.Fragment>
          );
        })}
      </span>
    </span>
  );
};
