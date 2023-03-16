const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    // exclude node_modules
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  // pass all js files through Babel
  resolve: {
    extensions: ['*', '.js'],
  },
}
