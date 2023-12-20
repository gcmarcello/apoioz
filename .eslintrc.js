/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  extends: ["next/core-web-vitals"],
  plugins: ["no-front-services"], // Ensure the plugin name is correct
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "no-front-services/no-front-services": "error",
  },
};
