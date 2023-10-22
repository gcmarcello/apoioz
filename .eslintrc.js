/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  "extends": "next/core-web-vitals",
  overrides: [
    {
      files: ["**/frontend/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: ["**/*.service"],
          },
        ],
      },
    },
  ]
}
