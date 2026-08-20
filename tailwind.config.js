/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}'
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        workspace: {
          'primary': '#7c3aed',
          'primary-content': '#ffffff',
          'secondary': '#aa3bff',
          'secondary-content': '#ffffff',
          'accent': '#06b6d4',
          'accent-content': '#ffffff',
          'neutral': '#2e2938',
          'neutral-content': '#f8f7fb',
          'base-100': '#ffffff',
          'base-200': '#f8f7fb',
          'base-300': '#e5e4ec',
          'base-content': '#08060d',
          'info': '#0284c7',
          'success': '#16a34a',
          'warning': '#d97706',
          'error': '#dc2626'
        }
      }
    ]
  }
}
