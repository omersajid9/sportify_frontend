/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/**/*.{js,jsx,ts,tsx}", // Recursively include all files in the app directory
    "./components/**/*.{js,jsx,ts,tsx}", // Recursively include all files in the components directory
  ],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}