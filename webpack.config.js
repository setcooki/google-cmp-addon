const path = require("path");

module.exports = (env, argv) => {
  return {
    mode: "development",
    entry: {
      index: path.resolve(__dirname, "./dist/esm/index.js")
    },
    output: {
      path: path.resolve(__dirname, "./dist/umd"), // builds to ./dist/umd/
      filename: "[name].js",
      library: "gcmp",
      libraryTarget: "umd",
      globalObject: "this"
    },
    optimization: {
      minimize: true
    },
    module: {
      rules: [{test: /\.t|js$/, use: "babel-loader"}]
    }
  };
};
