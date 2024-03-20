import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';


export default {
  mode: 'development', // or 'production' for production mode
  devtool: 'source-map',
  entry: { background: './background/interceptor.js', }, // Entry point of your background script
  output: {
    path: path.resolve('dist'), // Output directory
    filename: '[name].js', // Output filename
  },
  watch: true,
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {from: path.resolve('manifest.json'), to: path.resolve('dist')}
      ]
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/, // Apply the loader to all JavaScript files
        exclude: /node_modules/, // Exclude node_modules directory
        use: {
          loader: 'babel-loader', // Use babel-loader for transpiling JavaScript files
          options: {
            presets: ['@babel/preset-env'], // Use @babel/preset-env preset for compiling ES6+ to ES5
          },
        },
      },
    ],
  },
};
