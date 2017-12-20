const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
      index: './src/index.js'
  },
  output: {
    filename: '[name].js',
    chunkFilename: "[id].js",
    path: path.resolve(__dirname, 'dist')
  },
  watch:true,
  module: {
    rules: [
      // Convert js files
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: "babel-loader"
      },
      // Extract css files
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: "style-loader", 
          use: "css-loader"
        })
      },
      // Optionally extract less files
      // or any other compile-to-css language
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({
          fallback:"style-loader", 
          use:"css-loader!less-loader"
        })
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract({
          fallback:"style-loader",
          use:"css-loader!sass-loader"
        })
      },
      // You could also use other loaders the same way. I. e. the autoprefixer-loader
      { 
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
        loader: "url-loader?limit=10000&mimetype=application/font-woff" 
      },
      { 
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
        loader: "file-loader" 
      }
    ]
  },
  // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("common"),
    new ExtractTextPlugin({
      filename: "[name].css", 
      disable: false, 
      allChunks: true
    }),
    new UglifyJsPlugin(),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    })
  ]
};