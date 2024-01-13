/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      animation: {
        enter: "fadeInRight 300ms ease-out",
        leave: "fadeOutLeft 300ms ease-in forwards",
      },
      keyframes: {
        fadeInRight: {
          "0%": {
            opacity: "0",
            transform: "translate(2rem)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(0)",
          },
        },
        fadeOutLeft: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
      },
      spacing: {
        "13/16": "81.25%",
      },
      screens: {
        xs: "576px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
