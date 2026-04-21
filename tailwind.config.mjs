/** @type {import('tailwindcss').Config} */

const cssVar = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors driven by CSS variables in global.css
        background: cssVar('--c-bg'),
        surface: cssVar('--c-surface'),
        'surface-dim': cssVar('--c-surface-dim'),
        'surface-variant': cssVar('--c-surface-variant'),
        'on-background': cssVar('--c-on-bg'),
        'on-surface': cssVar('--c-on-surface'),
        'on-surface-variant': cssVar('--c-on-surface-variant'),
        primary: cssVar('--c-primary'),
        'primary-container': cssVar('--c-primary-container'),
        secondary: cssVar('--c-secondary'),
        'surface-tint': cssVar('--c-surface-tint'),
        outline: cssVar('--c-outline'),
        'outline-variant': cssVar('--c-outline-variant'),
        error: cssVar('--c-error'),
      },
      fontFamily: {
        headline: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        body: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        label: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { DEFAULT: '0px', lg: '0px', xl: '0px', full: '0px' },
    },
  },
  plugins: [],
};
