import * as path from "path";

import * as webpack from "webpack";

const autoprefixer = require("autoprefixer");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const cssnano = require("cssnano");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpackConfig: webpack.Configuration = {
  cache: false,
  entry: {
    "background-script": path.join(__dirname, "src/background_script/index.ts"),
    "content-script": path.join(__dirname, "src/content_script/index.ts"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(scss)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [autoprefixer(), cssnano()],
            },
          },
          { loader: "sass-loader" },
        ],
      },
      {
        loader: "file-loader",
        exclude: [/\.(html?)$/, /\.(ts|tsx|js|jsx)$/, /\.css$/, /\.scss$/, /\.json$/],
        query: {
          name: "[hash].[ext]",
          outputPath: "media/",
          publicPath: "build/",
        },
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist/build"),
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: "public",
          from: "**/*",
          to: path.join(__dirname, "dist/"),
        },
      ],
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      src: path.resolve(__dirname, "src"),
    },
  },
  stats: "minimal",
};

export default webpackConfig;
