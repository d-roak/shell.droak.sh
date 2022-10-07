import * as path from 'path';
import * as webpack from 'webpack';
import 'webpack-dev-server';

const config: webpack.Configuration = {
  context: path.resolve(__dirname, 'src'),
  devtool: 'inline-source-map',
  entry: './index.ts',
  mode: 'development',
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
    }]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/js')
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      "crypto": false,
      "fs": false,
      "path": false,
      "perf_hooks": false,
    }
  },
};

export default config;
