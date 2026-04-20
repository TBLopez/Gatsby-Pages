/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'on-background': '#e2e2e2',
        secondary: '#99d688',
        'surface-variant': '#353535',
        'on-surface': '#e2e2e2',
        'surface-dim': '#131313',
        surface: '#131313',
        'surface-tint': '#00e639',
        background: '#000000',
        'on-surface-variant': '#b9ccb2',
        primary: '#ebffe2',
        'primary-container': '#00ff41',
        outline: '#84967e',
        'outline-variant': '#3b4b37',
        error: '#ffb4ab',
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
