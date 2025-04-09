const { heroui } = require('@heroui/react')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            50: "#E6F1FE",
            100: "#CCE3FD",
            200: "#99C7FB",
            300: "#66AAF9",
            400: "#338EF7",
            500: "#006FEE",
            600: "#005BC4",
            700: "#004493",
            800: "#002E62",
            900: "#001731",
            DEFAULT: "#4A3AFF",
            foreground: "#ffffff",

          },
          default: {
            50: "#FAFAFA",
            100: "#F4F4F5",
            200: "#E4E4E7",
            300: "#D4D4D8",
            400: "#A1A1AA",
            500: "#71717A",
            600: "#52525B",
            700: "#3F3F46",
            800: "#27272A",
            900: "#18181B",
            DEFAULT: "#71717A",
            foreground: "#000000",
          },
          focus: "#BEF264",
        }
      }
    }
  })],
}
