const path = require("path");

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "/lib"),
  resolve: {
    extensions: [".js"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  output: {
    library: "analytics",
    libraryTarget: "umd",
    filename: "analytics.js"
  }
};
