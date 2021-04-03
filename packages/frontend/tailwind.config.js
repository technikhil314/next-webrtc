module.exports = {
  purge: [],
  darkMode: "class", // or 'media' or 'class'
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridAutoRows: {
        "350px": "350px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
