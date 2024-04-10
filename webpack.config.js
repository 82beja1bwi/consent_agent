import path from 'path'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
  mode: 'development', // or 'production' for production mode
  devtool: 'source-map',
  entry: {
    background: './src/background/background.js', // Entry point of your background script
    // content: './src/content/content.js', // Entry point of your content script,
    popup: './src/popup/popup.js' // Entry point of your popup HTML file
  },
  output: {
    path: path.resolve('dist'), // Output directory
    filename: '[name].js' // Output filename
  },
  watch: true,
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve('manifest.json'), to: path.resolve('dist') },
        {
          from: path.resolve('src/popup/popup.html'),
          to: path.resolve('dist')
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/, // Apply the loader to all JavaScript files
        exclude: /node_modules/, // Exclude node_modules directory
        use: {
          loader: 'babel-loader', // Use babel-loader for transpiling JavaScript files
          options: {
            presets: ['@babel/preset-env'] // Use @babel/preset-env preset for compiling ES6+ to ES5
          }
        }
      },
      {
        test: /\.html$/, // Match HTML files
        use: ['html-loader'] // Use html-loader for processing
      }
    ]
  }
}
