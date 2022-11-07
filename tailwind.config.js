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
        light3: "#F7F7F7",
        txtblack: "#303548",
        textSubtle: "#7D849D",
        textLight: "#5F6479",
        "danger-1": "#FF3C3C",
        "info-1": "#46A6FF",
        "success-1": "#32E865",
        divider: "#C7CEE5",
        "white-filled-form": "#E6E8EE",
        "border-primary": "#C7CEE6",

        primary: {
          50: "#E8F5FB",
          100: "#D1EBF7",
          200: "#BAE1F3",
          300: "#A3D7EF",
          400: "#8CCDEB",
          500: "#75C3E7",
          600: "#5EB9E3",
          700: "#47AFE0",
          800: "#30A5DC",
          900: "#199BD8",
        },
        secondary: {
          50: "#FDF7FF",
          100: "#F7E2FE",
          200: "#F3D3FE",
          300: "#EFC5FD",
          400: "#EBB6FD",
          500: "#E7A8FC",
          600: "#E299FC",
          700: "#DE8BFC",
          800: "#DA7CFB",
          900: "#D66EFB",
        },

        "white-shade": {
          600: "#9499AE",
          700: "#9499AE",
          800: "#DDDDDD",
          900: "#ffffff",
        },
        danger: {
          500: "rgba(255, 60, 60, 0.1)",
          600: "rgba(255, 60, 60, 0.4)",
          700: "rgba(255, 60, 60, 0.6)",
          800: "rgba(255, 60, 60, 0.8)",
          900: "#FF3C3C",
        },
        success: {
          500: "rgba(50, 232, 101, 0.2)",
          600: "rgba(50, 232, 101, 0.4)",
          700: "rgba(50, 232, 101, 0.6)",
          800: "rgba(50, 232, 101, 0.8)",
          900: "#32E865",
        },
        warning: {
          500: "rgba(236, 218, 60, 0.1)",
          600: "rgba(236, 218, 60, 0.4)",
          700: "rgba(236, 218, 60, 0.6)",
          800: "rgba(236, 218, 60, 0.8)",
          900: "#ECDA3C",
        },
        information: {
          500: "rgba(70, 166, 255, 0.2)",
          600: "rgba(70, 166, 255, 0.4)",
          700: "rgba(70, 166, 255, 0.6)",
          800: "rgba(70, 166, 255, 0.8)",
          900: "#46A6FF",
        },
        "black-shade": {
          800: "#7D849D",
          900: "#303548",
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
