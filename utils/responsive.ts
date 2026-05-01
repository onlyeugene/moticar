import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device (e.g. iPhone 11/12/13/14/15)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

/**
 * Scales a size based on the screen width.
 * @param size The size to scale.
 */
export const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

/**
 * Scales a size based on the screen height.
 * @param size The size to scale.
 */
export const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;

/**
 * Scales a size based on both width and height (moderate scaling).
 * @param size The size to scale.
 * @param factor The factor to apply (default 0.5).
 */
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

/**
 * Responsive Font Size.
 * Scales the font size based on screen width and respects system font scale.
 * @param size The font size to scale.
 */
export const rf = (size: number) => {
  const fontScale = PixelRatio.getFontScale();
  const newSize = scale(size) * fontScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/** Shorthand for scale (width) */
export const s = scale;
/** Shorthand for verticalScale (height) */
export const vs = verticalScale;
/** Shorthand for moderateScale */
export const ms = moderateScale;

export const SCREEN_DIMENSIONS = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};
