module.exports = {
  darkMode: "class", // or 'media' or 'class'
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridAutoRows: {
        "350px": "350px",
      },
      zIndex: {
        "-1": -1,
      },
      translate: {
        "-screen": "-100vw",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
