const colors = require('tailwindcss/colors')

module.exports = {
    purge: {
    content: ['./public/**/*.html', './src/**/*.vue'],
    options: {
      safelist: [
          'bg-red-100',
          'bg-yellow-100',
          'bg-green-100',
          'bg-cyan-100',
          'bg-teal-100',
          'bg-indigo-100',
          'bg-pink-100',
          'bg-purple-100',
          'bg-blue-100',
          'bg-gray-100',
          'bg-red-500',
          'bg-yellow-500',
          'bg-green-500',
          'bg-cyan-500',
          'bg-teal-500',
          'bg-indigo-500',
          'bg-pink-500',
          'bg-purple-500',
          'bg-blue-500',
          'bg-gray-500',
          'text-red-500',
          'text-yellow-500',
          'text-green-500',
          'text-cyan-500',
          'text-teal-500',
          'text-indigo-500',
          'text-pink-500',
          'text-purple-500',
          'text-blue-500',
          'text-gray-500',
      ],
    }
  },
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
