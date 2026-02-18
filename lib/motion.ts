import { WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

/**
 * LIQUID_SPRING: A heavy, smooth spring for "liquid" feeling transitions.
 * High damping and low stiffness prevents jitter and creates a sophisticated flow.
 */
export const LIQUID_SPRING: WithSpringConfig = {
    damping: 18,
    stiffness: 90,
    mass: 1.2,
};

/**
 * BOUNCY_SPRING: For energetic feedback that feels reactive but controlled.
 */
export const BOUNCY_SPRING: WithSpringConfig = {
    damping: 12,
    stiffness: 150,
    mass: 1,
};

/**
 * UI Constants
 */
export const STAGGER_DELAY = 100;
export const ENTRANCE_DURATION = 600;

export const ENTRANCE_TIMING: WithTimingConfig = {
    duration: ENTRANCE_DURATION,
};
