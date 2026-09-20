import { useRef, useState } from 'react';
import { useScroll, useSpring } from 'motion/react';
import { FeaturesOverlay } from './FeaturesOverlay';
import { ProductStoryStage } from './ProductStoryStage';
import { StickyStage } from './StickyStage';
import { SCROLL_SPRING, getStoryLayout } from './productStory.config';
import { useIsDesktop } from './useIsDesktop';
import { useNearViewport } from './useLazyVideo';

/**
 * Standalone version of the story (its own tall section + sticky stage +
 * scroll progress). Used for `/?preview=product-story`. On the real page the
 * story is embedded in ParallaxExperience's track via <ProductStoryStage>.
 *
 * All timing/scale/dim values live in productStory.config.ts.
 */
export function ProductStorySection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);
  const isNear = useNearViewport(sectionRef);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const compact = !useIsDesktop();

  return (
    <section
      ref={sectionRef}
      aria-label="Product showcase"
      style={{ height: `${getStoryLayout(compact).storyVh}vh` }}
      className="relative w-full bg-[#050505]"
    >
      <StickyStage>
        <ProductStoryStage
          progress={progress}
          isNear={isNear}
          compact={compact}
          onViewFeatures={() => setFeaturesOpen(true)}
        />
      </StickyStage>
      <FeaturesOverlay open={featuresOpen} onClose={() => setFeaturesOpen(false)} />
    </section>
  );
}
