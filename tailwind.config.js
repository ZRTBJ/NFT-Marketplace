module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "dark-background": "#161423",
        "light-background": "#FFFFFF",
        "primary-color": "#8D2CCB",
        "color-grey": "#C8C8C8",
        "color-brown": "#6B4D00",
        "color-gold": "#D69C07"
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      height: {
        361: "361px",
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin")],
  variants: {
    margin: ["responsive", "hover"],
  },
};
