//引入相关变量
var path = require('path');
module.exports = {
  build: {
    //标识生产环境
    env: require('./prod.env'),
    //生产根目录
    assetsRoot: path.resolve(__dirname, '../dist'),
    //设置生产环境静态资源文件夹
    assetsSubDirectory: 'static',
    //设置生产环境文件引用路径
    assetsPublicPath: '/'
  },
  dev: {
    //标识开发环境
    env: require('./dev.env'),
    //开发根目录
    assetsRoot: path.resolve(__dirname,'../'),
    //服务端口
    port: 9999,
    //设置开发环境静态资源文件夹
    assetsSubDirectory: 'static',
    //设置开发环境文件引用路径
    assetsPublicPath: '/'
  }
}
