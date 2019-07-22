module.exports = {
  "extends": ["airbnb-base", "plugin:jest/recommended"],
  "env": {
    "jest/globals": true
  },
  "plugins": ["jest"],
  "rules": {
    "arrow-parens": ["error", "always"],
    "no-param-reassign": ["error", { "props": false }]
  }
};
