//设置全局变量
process.env.NODE_ENV = 'production';
//引入相关依赖
var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.pro.conf');

//路径为文件夹，自动引入index文件
var config = require('../config');
//删除模块，可以在打包的时候删除原来dist中的文件
var rm = require('rimraf');
//解析模块的时候，nodejs出现的loadding，只有Mac ok
var ora = require('ora');
//输出文字颜色控制
var chalk = require('chalk');

var spinner = ora('building for production...');
spinner.start();

rm(path.join(config.build.assetsRoot,config.build.assetsSubDirectory),function(error){
  if(error){
    throw error;
  }

  webpack(webpackConfig,function(error, status){
    if(error){
      throw error;
    }
    process.stdout.write(status.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n');
  });
})

