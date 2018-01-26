var path = require('path')

module.exports = {
  entry: './client/index.js', // the starting point for our program
  output: {
    path: __dirname + '/public', // the absolute path for the directory where we want the output to be placed
    filename: 'bundle.js' // the name of the file that will contain our output - we could name this whatever we want, but bundle.js is typical
  },
  context: __dirname,
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
      },
      {
        test: /(\.css|\.scss)$/,
        include: path.join(__dirname, 'node_modules'),
        loaders: ['style-loader', 'css-loader']
      }
    ]
  }
}
