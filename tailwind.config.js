/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#4093D6',
        "primary-100": '#D7F1FF',
        "primary-200": '#94CEFC',
        accent: '#f97316',
        success: '#BDECB6',
        paleGreen: '#D9F2D9',
        danger: '#FE0202',
        muted: '#EBEBEB',
        background: {
          DEFAULT: '#F6F9FC',
          dark: '#0f172a',
        },
      },
      fontFamily: {
        arimo: ['Arimo-Regular'],
      },
    },
  },
  plugins: [],
}

