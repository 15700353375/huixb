//引用相关依赖
var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var utils = require('./utils');

var webpackConfig = merge(baseWebpackConfig,{
  //输出文件名
  output: {
    filename: utils.assetsPath('js/[name].[hash].js'),
    chunkFilename: utils.assetsPath('js/[name].[hash].js')//给require.ensure用
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [ 'style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(scss|sass)$/,
        use: [ 'style-loader', 'css-loader', '-loadersass-loader']
      }
    ]
  }
});
module.exports = webpackConfig
