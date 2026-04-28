/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./sections/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      // Big-screen breakpoints for large displays
      hd: { raw: "(min-width: 1920px) and (min-height: 1080px)" }, // Explicitly target 1920x1080+ panels
    },
    extend: {
      colors: {
        teal: "#007E7E",
        darkGrey: "#3A3A3A",
        white: "#FFFFFF",
        footerBg: "#3A3A3A",
        tealBg: "#007E7E1A",
        tealShadow: "oklch(77.7% 0.152 181.912)",
        peach: "#FFEDD5",
        darkBrown: "#9A3412",
        pistachio: "#DCFCE7",
        darkGreen: "#166534",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-25%)" },
        },
      },
      animation: {
        marquee: "marquee 15s linear infinite",
      },
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
        noto: ["Noto Sans", "sans-serif"],
        roboto: ["Roboto"],
        noto: ['"Noto Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
