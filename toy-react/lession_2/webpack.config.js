const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',

  entry: {
    main: './main.js'
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  devServer: {
    contentBase: path.join(__dirname, "dist")
  },

  module: {
    rules: [
      {
        test: /.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [[
              '@babel/plugin-transform-react-jsx',
              { pragma: 'ToyReact.createElement' }
            ]]
          }
        }
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],

  optimization: {
    minimize: false
  }
}