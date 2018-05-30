//引用相关依赖
var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var CopyWebpackPlugin = require("copy-webpack-plugin");
var baseWebpackConfig = require('./webpack.base.conf');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


var config = require('../config');
var utils = require('./utils');
var env = config.build.env;

var webpackConfig = merge(baseWebpackConfig,{
   //输出文件名
  output: {
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')//给require.ensure用
  },
  module:{
    rules:[
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ["css-loader"]
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: ["css-loader", "less-loader"]
        })
      },
      {
        test: /\.(scss|sass)$/,
        use: ExtractTextPlugin.extract({
          use: ["css-loader", "sass-loader"]
        })
      }
    ]
  },
  plugins: [
    // 打包的时候，设置全局变量，方便dev开发环境和生产环境
    new webpack.DefinePlugin({
        'process.env': env
    }),
    new ExtractTextPlugin({
      filename:'static/css/app.css', //命名打包Css文件
      allChunks:true //所有模块css打包
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor' ,// 指定公共 bundle 的名字。
      filename: 'static/js/commons.[chunkhash].js',   // 公共chunk的文件名
      minChunks: function (module) { //遇到css文件，不提取公共模块，因为已经使用ExtractTextPlugin
        if(module.resource && (/^.*\.(css|scss|less)$/).test(module.resource)) {
          return false;
        }

        return module.context && module.context.indexOf("node_modules") !== -1;
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',   //提取webpack Runtime的辅助代码，防止common代码hash改变，使缓存失效
      chunks: ['vendor'], //指定入口提取模块的公共模块
      minChunks: Infinity //立马生成模块
    }),
    new CopyWebpackPlugin([//复制static文件到生产目录
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new webpack.optimize.UglifyJsPlugin()
  ]
});

module.exports = webpackConfig
