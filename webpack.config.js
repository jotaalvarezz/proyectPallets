/* const webpack = require("@nativescript/webpack");

module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack
  webpack.chainWebpack((config) => {
    config.resolve.alias.set("axios", "axios/dist/axios");

    // Agregar polyfill para 'crypto'
    config.resolve.fallback.set("crypto", require.resolve("crypto-browserify"));
  });

	return webpack.resolveConfig();
}; */

const webpack = require("@nativescript/webpack");

module.exports = (env) => {
  webpack.init(env);

  // Acceder a la configuración de Webpack
  const config = webpack.resolveConfig();

  // Modificar alias
  config.resolve.alias = {
    ...config.resolve.alias,
    axios: "axios/dist/axios",
  };

  // Agregar los polyfills para módulos de Node.js
  config.resolve.fallback = {
    ...config.resolve.fallback,
    buffer: require.resolve("buffer/"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    util: require.resolve("util/"),
    vm: require.resolve("vm-browserify"),
  };

  // Retornar la configuración modificada
  return config;
};
