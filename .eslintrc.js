module.exports = {
  extends: [
    "plugin:react/recommended",
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "react-app",
  ],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx"],
      },
    },
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "no-alert": 0,
    "no-console": ["error", { allow: ["error"] }],
    "react/prop-types": 0,
    "react/sort-prop-types": 0,
    "import/order": 0,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/no-children-prop": "error",
    "react/jsx-no-target-blank": "error",
    "react/jsx-key": "error",
    "react/jsx-tag-spacing": ["error"],
    "react/jsx-filename-extension": ["error"],
    "no-useless-constructor": ["error"],
    eqeqeq: ["error"],
    "default-case": "off",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/img-redundant-alt": "error",
    "jsx-a11y/alt-text": "error",
    "no-useless-concat": "error",
    "no-unused-vars": "error",
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1,
        maxEOF: 1,
        maxBOF: 0,
      },
    ],
    camelcase: 0,
    semi: ["error", "always"],
  },
  globals: {
    globalThis: true,
  },
  plugins: ["react", "react-hooks", "jsx-a11y", "import"],
  overrides: [
    {
      files: ["webpack/build.js", "webpack/start.js"],
      rules: {
        "no-console": "off",
      },
    },
  ],
  ignorePatterns: [
    "stories/**/*",
    "node_modules/**/*",
    "build/**/*",
    "canvasjs.min.jsx",
  ],
};
