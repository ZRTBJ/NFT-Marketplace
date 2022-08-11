const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "dark-background": "#161423",
        "light-background": "#F9F5FF",
        "primary-color": "#8D2CCB",
        "primary-color-1": "#7D33A4",
        "color-grey": "#C8C8C8",
        "color-brown": "#6B4D00",
        "color-gold": "#D69C07",
        "color-ass": "#585858",
        "color-ass-1": "#787C8C",
        "color-ass-2": "#868686",
        "color-asss-3": "#9F9F9F",
        "color-ass-4": "#D0D0D0",
        "color-ass-5": "#353535",
        "color-ass-6": "#D9D9D9",
        "color-ass-7": "#C7C7C7",
        "color-ass-8": "#646A80",
        "color-ass-9": "#828282",
        "color-dark-1": "#211E38",
        "color-blue": "#2081E2",
        "color-yellow": "#FEDA03",
        "color-primary-1": "#31224E",
        "social-icon-bg": "rgba(154, 90, 255, 0.1)",

        //mvp-1.1 colors for light theme

        light: "#F9F5FF",
        light1: "#FDFDFD",
        txtblack: "#303548",
        textSubtle: "#7D849D",
        "danger-1": "#FF3C3C",
        "info-1": "#46A6FF",
        "success-1": "#32E865",

        primary: {
          50: "#231B39",
          100: "#30224F",
          200: "#3E2965",
          300: "#4B307B",
          400: "#583791",
          500: "#653EA7",
          600: "#7245BD",
          700: "#804CD3",
          800: "#8D53E9",
          900: "#9A5AFF",
        },
        secondary: {
          50: "#2A2129",
          100: "#3E2F2F",
          200: "#523C34",
          300: "#664A3A",
          400: "#7A5740",
          500: "#8F6546",
          600: "#A3724C",
          700: "#B78051",
          800: "#CB8D57",
          900: "#FFA800",
        },

        "white-shade": {
          600: "#9499AE",
          700: "#9499AE",
          800: "#DDDDDD",
          900: "#ffffff",
        },
        danger: {
          500: "#281623",
          600: "#5D1C25",
          700: "#811F25",
          800: "#A42326",
          900: "#C82727",
        },
        success: {
          500: "#182628",
          600: "#1D5C37",
          700: "#208040",
          800: "#24A44A",
          900: "#27C854",
        },
        warning: {
          500: "#2D2728",
          600: "#735F36",
          700: "#A2843F",
          800: "#D0A949",
          900: "#FFCF52",
        },
        information: {
          500: "#1B1B36",
          600: "#2B2F6F",
          700: "#353D95",
          800: "#3F4BBB",
          900: "#4A59E1",
        },
        "black-shade": {
          800: "#232032",
          900: "#161423",
        },
      },
      fontFamily: {
        sans: ["Satoshi-Regular", ...defaultTheme.fontFamily.sans],
        roboto: ["Roboto", "sans-serif"],
        "satoshi-bold": ["Satoshi-Bold", "sans-serif"],
        poppins: "Poppins, sans-serif",
      },
      height: {
        361: "361px",
      },
      boxShadow: {
        main: "5px 5px 12px rgba(177, 177, 177, 0.1)",
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin")],
  variants: {
    margin: ["responsive", "hover"],
  },
};
