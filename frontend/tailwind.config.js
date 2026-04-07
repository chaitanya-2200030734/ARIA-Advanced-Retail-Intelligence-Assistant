import defaultConfig from 'tailwindcss/defaultConfig'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1C1814',
        cream: {
          DEFAULT: '#F5F2ED',
          dark: '#EDE9E0',
        },
        amber: {
          DEFAULT: '#C97B2E',
          pale: '#FBF4EB',
          light: '#F4DFC0',
        },
        forest: {
          DEFAULT: '#2A4A35',
          pale: '#EBF3EE',
          light: '#C8DAD0',
        },
        rust: {
          DEFAULT: '#B94E2D',
          pale: '#FDF0ED',
          light: '#F5D0C5',
        },
        slate: {
          DEFAULT: '#3A5068',
          pale: '#EBF1F6',
          light: '#C8D7E3',
        },
        stone: '#8A8278',
        'ink-light': '#3D3830',
        border: '#D8D2C8',
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
        14: '14px',
        16: '16px',
      },
    },
  },
  plugins: [],
}
