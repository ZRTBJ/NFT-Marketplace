module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      height: {
        361: "361px",
      },
    },
  },
  plugins: [],
  variants: {
    margin: ["responsive", "hover"],
  },
};
