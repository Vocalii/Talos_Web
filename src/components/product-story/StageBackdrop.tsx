import { STAGE_BACKGROUND } from './productStory.config';

/**
 * The Talos AI-feedback-screen backdrop (gradient + overlay + top radial
 * glow). Absolutely positioned; render it as the first child of any
 * `relative`/`sticky` container so content stacks above it.
 */
export function StageBackdrop() {
  const glow = STAGE_BACKGROUND.radialGlow;
  return (
    <>
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: STAGE_BACKGROUND.gradient,
          boxShadow: STAGE_BACKGROUND.boxShadow,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundColor: STAGE_BACKGROUND.overlay }}
        aria-hidden="true"
      />
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          width: glow.width,
          height: glow.height,
          left: glow.left,
          top: glow.top,
          background: glow.gradient,
        }}
        aria-hidden="true"
      />
    </>
  );
}
