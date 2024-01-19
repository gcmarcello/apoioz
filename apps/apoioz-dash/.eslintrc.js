/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...require("@repo/config/lint/next.eslintrc"),
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
