module.exports = {
  "**/*.js?(x)": (filenames) => {
    let concatedFileNames = filenames
      .map((filename) => `"${filename}"`)
      .join(" ");
    return [
      `prettier --write ${concatedFileNames}`,
      `eslint --fix ${concatedFileNames}`,
    ];
  },
  "**/*.js": (filenames) => {
    let concatedFileNames = filenames
      .map((filename) => `"${filename}"`)
      .join(" ");
    return [
      `prettier --write ${concatedFileNames}`,
      `eslint --fix ${concatedFileNames}`,
    ];
  },
};
