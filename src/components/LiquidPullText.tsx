import React, { useEffect, useRef, useMemo } from 'react';

interface LiquidPullTextProps {
  text: string;
  className?: string;
  maxPull?: number;
  maxBlur?: number;
  radius?: number;
  lerpFactor?: number;
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
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const physicsRef = useRef<LetterPhysics[]>([]);
  const isNearRef = useRef(false);
  const isLoopRunningRef = useRef(false);
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
          el.style.filter = `blur(${p.currentBlur.toFixed(2)}px)`;
          el.style.willChange = 'transform, filter';
        } else if (p.wasDisplaced) {
          // Cleanly reset DOM styles when settled back to rest
          el.style.transform = '';
          el.style.filter = '';
          el.style.willChange = '';
          p.wasDisplaced = false;
        }
      }

      if (hasDisplacement || isNearRef.current) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        isLoopRunningRef.current = false;
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
        // Re-verify centers on re-entry in case layout shifted
        updateLetterBounds();
      }

      const physics = physicsRef.current;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

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

    const handleMouseLeave = () => {
      isNearRef.current = false;
      resetTargets();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', updateLetterBounds);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', updateLetterBounds);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [maxPull, maxBlur, radius, lerpFactor]);

  let letterIndexCounter = 0;

  return (
    <span
      ref={containerRef}
      className={`inline-block pointer-events-auto cursor-default ${className}`}
      aria-label={text}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block">
        {words.map((word, wordIndex) => {
          return (
            <React.Fragment key={wordIndex}>
              <span className="inline-block whitespace-nowrap">
                {word.split('').map((char, charIndex) => {
                  const currentIdx = letterIndexCounter++;
                  return (
                    <span
                      key={charIndex}
                      ref={(el) => {
                        letterRefs.current[currentIdx] = el;
                      }}
                      className="inline-block select-none"
                      style={{ transformOrigin: 'center center' }}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
              {wordIndex < words.length - 1 && (
                <span className="inline-block w-[0.26em]">&nbsp;</span>
              )}
            </React.Fragment>
          );
        })}
      </span>
    </span>
  );
};
