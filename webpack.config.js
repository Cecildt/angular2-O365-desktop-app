var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {
  devtool: 'source-map',
  debug: true,

  entry: {
    '@angular': [
      'rxjs',
      'reflect-metadata',
      'zone.js'
    ],
    'common': ['es6-shim'],
    'app': './src/boot/boot.ts'
  },

  output: {
    path: __dirname + '/build/',
    publicPath: 'build/',
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js'    
  },

  resolve: {
    extensions: ['','.ts','.js','.json', '.css', '.html']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts',
        exclude: [ /node_modules/, /releases/ ]
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(css|html)$/,
        loader: 'raw'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=10000'
      }
    ]
  },
  plugins: [
    new CommonsChunkPlugin({ names: ['@angular', 'common'], minChunks: Infinity }),
    new webpack.ExternalsPlugin('commonjs', ['electron']),
    new DashboardPlugin()
  ],
  externals: [
    {
      // electron : "commonjs electron"
    }
  ],
  target:'electron-renderer'
};
