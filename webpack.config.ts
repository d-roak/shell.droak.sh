import * as path from 'path';
import * as webpack from 'webpack';
import 'webpack-dev-server';

const config: webpack.Configuration = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/index.ts'),
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    }]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist', 'js')
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
