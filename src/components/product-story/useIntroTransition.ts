import { MotionValue, useTransform } from 'motion/react';
import {
  BACKGROUND_DIM_MAX,
  BACKGROUND_ENTRANCE,
  BACKGROUND_SCALE,
  INTRO,
  PHONE_SCALE,
  PHONE_TRANSLATE_Y_PX,
  STAGE_SCRIM_MAX,
  type ScrollRange,
} from './productStory.config';

export interface IntroTransition {
  backgroundScale: MotionValue<number>;
  backgroundY: MotionValue<number>;
  backgroundOpacity: MotionValue<number>;
  backgroundDim: MotionValue<number>;
  stageScrimOpacity: MotionValue<number>;
  phoneOpacity: MotionValue<number>;
  phoneScale: MotionValue<number>;
  phoneY: MotionValue<number>;
  phoneVideoOpacity: MotionValue<number>;
}

/**
 * Derives every intro-sequence value from the section's scroll progress.
 * This is the only place that maps scroll → visuals. With reduced motion the
 * ranges collapse so every value sits at its end state from the first frame.
 */
export function useIntroTransition(
  progress: MotionValue<number>,
  reducedMotion: boolean,
  /** 0→1 entrance of the opening video frame (1 = fully in). */
  entrance: MotionValue<number>
): IntroTransition {
  const map = (range: ScrollRange, from: number, to: number) =>
    reducedMotion
      ? ([[0, 1], [to, to]] as const)
      : ([[range[0], range[1]], [from, to]] as const);

  const [scaleIn, scaleOut] = map(INTRO.backgroundScale, BACKGROUND_SCALE.from, BACKGROUND_SCALE.to);
  const [bgFadeIn, bgFadeOut] = map(INTRO.backgroundFadeOut, 1, 0);
  const [dimIn, dimOut] = map(INTRO.backgroundDim, 0, BACKGROUND_DIM_MAX);
  const [scrimIn, scrimOut] = map(INTRO.stageScrim, 0, STAGE_SCRIM_MAX);
  const [phoneOpIn, phoneOpOut] = map(INTRO.phoneFadeIn, 0, 1);
  const [phoneScIn, phoneScOut] = map(INTRO.phoneSettle, PHONE_SCALE.from, PHONE_SCALE.to);
  const [phoneYIn, phoneYOut] = map(
    INTRO.phoneSettle,
    PHONE_TRANSLATE_Y_PX.from,
    PHONE_TRANSLATE_Y_PX.to
  );
  const [pvIn, pvOut] = map(INTRO.phoneVideoFadeIn, 0, 1);

  const introScale = useTransform(progress, [...scaleIn], [...scaleOut]);
  const introFade = useTransform(progress, [...bgFadeIn], [...bgFadeOut]);

  const entranceScale = useTransform(
    entrance,
    [0, 1],
    reducedMotion ? [1, 1] : [BACKGROUND_ENTRANCE.scaleFrom, 1]
  );
  const entranceY = useTransform(
    entrance,
    [0, 1],
    reducedMotion ? [0, 0] : [BACKGROUND_ENTRANCE.yFromPx, 0]
  );
  const entranceOpacity = useTransform(
    entrance,
    [0, reducedMotion ? 1 : BACKGROUND_ENTRANCE.opacityEnd],
    reducedMotion ? [1, 1] : [0, 1]
  );

  return {
    backgroundScale: useTransform(
      [introScale, entranceScale],
      ([intro, enter]) => (intro as number) * (enter as number)
    ),
    backgroundY: entranceY,
    backgroundOpacity: useTransform(
      [introFade, entranceOpacity],
      ([fade, enter]) => (fade as number) * (enter as number)
    ),
    backgroundDim: useTransform(progress, [...dimIn], [...dimOut]),
    stageScrimOpacity: useTransform(progress, [...scrimIn], [...scrimOut]),
    phoneOpacity: useTransform(progress, [...phoneOpIn], [...phoneOpOut]),
    phoneScale: useTransform(progress, [...phoneScIn], [...phoneScOut]),
    phoneY: useTransform(progress, [...phoneYIn], [...phoneYOut]),
    phoneVideoOpacity: useTransform(progress, [...pvIn], [...pvOut]),
  };
}
