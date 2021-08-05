const colors = require('tailwindcss/colors')

module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        gray: colors.trueGray,
        indigo: colors.indigo,
        red: colors.rose,
        yellow: colors.amber,
        blue: colors.blue,
        pink: colors.pink,
        purple: colors.purple,
        green: colors.green,
        teal: colors.teal,
        cyan: colors.cyan,
      },
      fontFamily: {
        'gochi': ['Gochi Hand']
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
      require('@tailwindcss/forms'),
  ],
}
