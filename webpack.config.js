const webpack = require("@nativescript/webpack");

module.exports = (env) => {
  webpack.init(env);

  // Learn how to customize:
  // https://docs.nativescript.org/webpack
  webpack.chainWebpack((config) => {
    // Solo mantener el alias básico de axios
    config.resolve.alias.set("axios", "axios/dist/axios");
  });

  return webpack.resolveConfig();
};
