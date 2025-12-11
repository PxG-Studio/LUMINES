/**
 * Nocturna Dark Theme
 * The official IDE theme for WISSIL
 */

import { colors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";
import { radii } from "../tokens/radii";
import { shadows } from "../tokens/shadows";
import { typography } from "../tokens/typography";

export const NocturnaDarkTheme = {
  name: "nocturna-dark",
  colors,
  spacing,
  radii,
  shadows,
  typography
};

export type NocturnaDarkTheme = typeof NocturnaDarkTheme;

