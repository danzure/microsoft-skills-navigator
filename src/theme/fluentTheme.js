import { createLightTheme, createDarkTheme } from '@fluentui/react-components';

/**
 * Custom Fluent UI color ramp based on Azure branding.
 * Defines shades from 10 (darkest) to 160 (lightest).
 */
export const azureBrandRamp = {
  10: '#020305',
  20: '#111723',
  30: '#16263d',
  40: '#193253',
  50: '#1b3f6a',
  60: '#1b4c82',
  70: '#18599b',
  80: '#0078d4', // Primary Azure Blue
  90: '#2886de',
  100: '#3e94e8',
  110: '#51a2f1',
  120: '#63b0fa',
  130: '#7bbfdf',
  140: '#94ccf6',
  150: '#afd9f9',
  160: '#cce6fd',
};

/**
 * Custom Light Theme integrating Azure branding with Fluent 2 light neutrals and typography.
 */
export const customLightTheme = {
  ...createLightTheme(azureBrandRamp),
  colorNeutralBackgroundCanvas: '#f5f5f5',
  fontFamilyBase: "'Segoe UI Variable Text', 'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
  fontFamilyMonospace: "'Cascadia Code', 'Cascadia Mono', Consolas, monospace",
};

/**
 * Custom Dark Theme integrating Azure branding with Fluent 2 dark neutrals and typography.
 */
export const customDarkTheme = {
  ...createDarkTheme(azureBrandRamp),
  colorNeutralBackgroundCanvas: '#1f1f1f',
  fontFamilyBase: "'Segoe UI Variable Text', 'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
  fontFamilyMonospace: "'Cascadia Code', 'Cascadia Mono', Consolas, monospace",
};
