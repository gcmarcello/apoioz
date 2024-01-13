/**
 * @type {import("eslint").Linter.Config}
 */

module.exports = {
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  extends: ["next/babel", "next/core-web-vitals"],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  globals: {
    React: true,
    JSX: true,
  },
  ignorePatterns: [".eslintrc.js"],
  /**
     * plugins: ["no-front-services"], 
    rules: {
      "no-front-services/no-front-services": "error",
    },
     * */
};
