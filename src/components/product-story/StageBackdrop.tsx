import { STAGE_BACKGROUND, type StagePalette } from './productStory.config';

/**
 * The Talos AI-feedback-screen backdrop (gradient + overlay + top radial
 * glow). Absolutely positioned; render it as the first child of any
 * `relative`/`sticky` container so content stacks above it.
 *
 * `carryOver` adds the faint ruins strip at the top edge (only useful where
 * the backdrop directly follows the Contenders section).
 */
export function StageBackdrop({
  carryOver = true,
  palette = STAGE_BACKGROUND,
}: {
  carryOver?: boolean;
  palette?: StagePalette;
}) {
  const glow = palette.radialGlow;
  const strip = palette.carryOver;
  const fade = 'linear-gradient(to bottom, #000 0%, transparent 100%)';
  return (
    <>
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: palette.gradient,
          boxShadow: palette.boxShadow,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundColor: palette.overlay }}
        aria-hidden="true"
      />
      {carryOver && strip && (
        <img
          src={strip.src}
          alt=""
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-0 w-full object-cover object-center pointer-events-none"
          style={{
            height: `${strip.heightPct}%`,
            opacity: strip.opacity,
            maskImage: fade,
            WebkitMaskImage: fade,
          }}
        />
      )}
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
