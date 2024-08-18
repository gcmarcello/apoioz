module.exports = {
  ...require("@repo/config/tailwind.config"),
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/packages/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/odinkit/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "selector",
};
