import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        ink: '#0a110d',
        forest: '#10271e',
        evergreen: '#183a2d',
        moss: '#748276',
        cream: '#f3efe5',
        paper: '#fbf8f0',
        oat: '#ded5c4',
        brass: '#b7a65a',
        acid: '#d9e36b'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Arial', 'sans-serif'],
        display: ['var(--font-display)', 'Arial', 'sans-serif']
      },
      letterSpacing: {
        label: '.16em',
        display: '-.065em'
      },
      boxShadow: {
        lift: '0 24px 70px rgba(10, 17, 13, .14)',
        drawer: '-28px 0 80px rgba(10, 17, 13, .24)'
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(.22, 1, .36, 1)'
      },
      maxWidth: {
        editorial: '1440px'
      }
    }
  },
  plugins: []
};

export default config;
