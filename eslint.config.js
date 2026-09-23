// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    rules: {
      "import/namespace": "off",
      "react-hooks/set-state-in-effect": "off",
    },
    ignores: ["dist/*"],
  }
]);
