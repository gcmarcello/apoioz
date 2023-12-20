const rule = require("./rule");
module.exports = {
  rules: {
    "no-front-services": rule,
  },
  configs: {
    recommended: {
      plugins: ["no-front-services"],
      rules: {
        "no-front-services/no-front-services": "error",
      },
    },
  },
};
