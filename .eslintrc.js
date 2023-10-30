/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  extends: ["next/core-web-vitals"],
  plugins: [
    /* "@typescript-eslint/eslint-plugin" */
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  overrides: [
    {
      files: ["**/(frontend)/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: ["**/*service"],
          },
        ],
      },
    },
  ],
};
