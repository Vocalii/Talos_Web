import { useState } from 'react';
import { motion, useMotionValueEvent, type MotionValue } from 'motion/react';
import { ExploreLibraryButton } from '../ExploreLibraryButton';
import { LiquidPullText } from '../LiquidPullText';
import {
  exploreButtonVariants,
  headlineLineVariants,
  paragraphVariants,
  sectionContentVariants,
} from '../entranceVariants';
import { STORY_COPY } from './productStory.config';

/** Text leaves just before the handoff so it exits cleanly, not mid-slide. */
const EXIT_LEAD = 0.02;
/** Hysteresis when scrolling back up, so the text doesn't flicker at the edge. */
const REVEAL_HYSTERESIS = 0.03;

interface StoryOverlayProps {
  /** Local story progress (0–1). */
  progress: MotionValue<number>;
  /** Local progress at which the copy appears. */
  revealStart: number;
  /** Local progress at which the slide-up into Insights begins. */
  handoffAt: number;
  onViewFeatures: () => void;
}

/**
 * Headline, description and "VIEW THE FEATURES", held back until near the end
 * of the story. Uses the exact same time-based entrance/exit variants and
 * reveal-trigger pattern as the Contenders text + Explore The Library button
 * (see ../entranceVariants). Desktop: text left, button right, phone stays
 * centered. Compact: headline above the phone, button below it.
 */
export function StoryOverlay({ progress, revealStart, handoffAt, onViewFeatures }: StoryOverlayProps) {
  const [isRevealed, setIsRevealed] = useState(() => {
    const value = progress.get();
    return value >= revealStart && value < handoffAt - EXIT_LEAD;
  });

  useMotionValueEvent(progress, 'change', (value) => {
    setIsRevealed((previous) => {
      if (value >= revealStart && value < handoffAt - EXIT_LEAD) return true;
      if (value < revealStart - REVEAL_HYSTERESIS || value >= handoffAt) return false;
      return previous;
    });
  });

  const pointerEvents = isRevealed ? 'auto' : 'none';

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      <div className="relative mx-auto h-full max-w-7xl px-6 sm:px-12 lg:px-16 flex flex-col justify-between pt-32 pb-12 sm:pb-14 lg:grid lg:grid-cols-12 lg:items-center lg:py-0">
        <motion.div
          variants={sectionContentVariants}
          initial="hidden"
          animate={isRevealed ? 'visible' : 'hidden'}
          style={{ pointerEvents }}
          className="lg:col-start-1 lg:col-span-4 text-center lg:text-left"
        >
          <h2
            id="product-section-headline"
            className="font-display font-medium text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl tracking-wide uppercase text-white leading-[1.1] drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)] select-none"
            aria-label={STORY_COPY.headline}
          >
            {STORY_COPY.headlineLines.map((line) => (
              <motion.span
                key={line}
                variants={headlineLineVariants}
                className="block will-change-[filter,opacity,transform]"
              >
                <LiquidPullText
                  text={line}
                  maxPull={1}
                  maxBlur={5}
                  radius={120}
                  lerpFactor={0.12}
                />
              </motion.span>
            ))}
          </h2>
          <motion.p
            id="product-section-description"
            variants={paragraphVariants}
            className="mt-4 sm:mt-6 text-sm sm:text-base font-light text-white/75 tracking-[0.02em] leading-relaxed max-w-md mx-auto lg:mx-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] select-none will-change-[filter,opacity,transform]"
          >
            {STORY_COPY.description}
          </motion.p>
        </motion.div>

        {/* Phases in after the text (EXPLORE_BUTTON_ENTRANCE_DELAY), exactly
            like the Explore The Library button in the previous section. */}
        <motion.div
          variants={exploreButtonVariants}
          initial="hidden"
          animate={isRevealed ? 'visible' : 'hidden'}
          style={{ pointerEvents }}
          className="lg:col-start-9 lg:col-span-3 flex justify-end pr-2 sm:pr-8 lg:pr-0"
        >
          <ExploreLibraryButton
            id="view-the-features-btn"
            onClick={onViewFeatures}
            ariaLabel="View the Features"
            lineOne="VIEW THE"
            lineTwo="FEATURES"
          />
        </motion.div>
      </div>
    </div>
  );
}
