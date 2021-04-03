module.exports = {
  purge: [],
  darkMode: "class", // or 'media' or 'class'
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridAutoRows: {
        "1fr": "minmax(350px, 1fr)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
