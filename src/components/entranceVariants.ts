// Shared entrance/exit variants for the site's section text + circular CTA
// (originally the Contenders section's). Reused by the Product Story overlay
// so both sections animate in and out identically.

// Staggered entrance variants for Section 2 content reveal
export const sectionContentVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.14,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const headlineLineVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(30px)', scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 2.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(12px)',
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const paragraphVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(20px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 2.2,
      delay: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(8px)',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const featureListContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.6,
    },
  },
};

export const featureItemVariants = {
  hidden: { opacity: 0, x: -14, y: 8, filter: 'blur(16px)' },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    filter: 'blur(6px)',
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Roughly matches how long the headline/paragraph/feature-list stagger
// sequence above takes to visibly settle, so the Explore The Library button
// only starts phasing in once that text has already appeared — not at the
// same moment. Only applied on the one-time hidden -> visible entrance (see
// exploreButtonVariants below); toggling explore mode afterward uses its own
// separate, undelayed transition.
export const EXPLORE_BUTTON_ENTRANCE_DELAY = 1.1;

export const exploreButtonVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.9, filter: 'blur(16px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.4,
      delay: EXPLORE_BUTTON_ENTRANCE_DELAY,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exploreHidden: {
    opacity: 0,
    y: 0,
    scale: 0.8,
    filter: 'blur(8px)',
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
