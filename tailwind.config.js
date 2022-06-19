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
        "primary-color-5": "#653EA7",
        "grey": "#232032",
        "color-grey": "#C8C8C8",
        "color-brown": "#6B4D00",
        "color-gold": "#D69C07"
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        "satoshi-bold": ['Satoshi-Bold', "sans-serif"],
        "satoshi-regular": ['Satoshi-Regular', "sans-serif"],
        'mulish': 'Mulish, sans-serif',
        'poppins': 'Poppins, sans-serif'
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
