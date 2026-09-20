import type { ReactNode } from 'react';
import { StageBackdrop } from './StageBackdrop';
import { STAGE_BACKGROUND } from './productStory.config';

/**
 * The pinned viewport for the standalone preview section, painted with the
 * Talos AI-feedback backdrop. `overflow-hidden` lives here (on the sticky
 * element itself) — never on an ancestor, which would break sticky.
 */
export function StickyStage({ children }: { children: ReactNode }) {
  return (
    <div
      className="sticky top-0 h-[100svh] w-full overflow-hidden"
      style={{ backgroundColor: STAGE_BACKGROUND.base }}
    >
      <StageBackdrop />
      {children}
    </div>
  );
}
