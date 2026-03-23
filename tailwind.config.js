/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
    "./providers/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FDEF56",
        secondary: "#00AEB5",
        background: "#013037",
        dark: "#1F1F1F",
        muted: "#6D8686",
        surface: "#09515D",
        accent: "#B8F2F4",
        white: "#FFFFFF",
        "brand-dark": "#0D2B2B",
        "brand-yellow": "#FBE74C",
        "brand-teal": "#00C9B1",
      },
      fontFamily: {
        lexendLight: ["LexendDeca-Light"],
        lexendRegular: ["LexendDeca-Regular"],
        lexendMedium: ["LexendDeca-Medium"],
        lexendSemiBold: ["LexendDeca-SemiBold"],
        lexendBold: ["LexendDeca-Bold"],
        lexendBlack: ["LexendDeca-Black"],
        lexendThin: ["LexendDeca-Thin"],
        lexendExtraLight: ["LexendDeca-ExtraLight"],
        lexendExtraBold: ["LexendDeca-ExtraBold"],
      },
    },
  },
  plugins: [],
};
