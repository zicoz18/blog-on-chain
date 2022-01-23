const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      red: '#06f152',
      'ptpGreen': '#06f152',
      'ptpBlue': '#0076E9',
      'ptpBlack': '#040B15',
      'ptpWeirdGreen': '#BFFAE1',
      'ptpWeirdBlue': '#00A8AA',
    },
  },
  plugins: [],
}
