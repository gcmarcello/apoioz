/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...require("@repo/config/.eslintrc.js"),
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
