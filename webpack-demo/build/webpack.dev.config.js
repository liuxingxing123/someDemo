const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge'); // 插件引入
const commonConfig = require('./webpack.common.config'); // 引入共用配置

const devConfig = {
  // 模式
  mode: 'development',
  // 性能优化 (tree shaking)
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all', // 同步 or 异步，
      //all ，它表示：不管同步还是异步，都会进行代码分离，但是请注意，如果你的共用模块不属于第三方库（也就是不能在 node_modules 中找到），而属于你自己写的一些代码模块，这些代码就会按照 cacheGroups 下的 default 配置打包。如果属于第三方库，就按照 cacheGroups 下的 defaultVendors 配置打包。
      minSize: 100, // 如果模块大小小于这个值，则不会被分割 
      //minRemainingSize: 0, // 最小可保存大小，开发模式下为 0，其他情况下等于 minSize，一般不用手动配置
      //minChunks: 1, // 如果模块被引用次数小于这个值，则不会被分割
      //maxAsyncRequests: 30, // 异步模块，一次最多被加载的次数
      //maxInitialRequests: 30, // 入口模块最多被加载的次数
      //enforceSizeThreshold: 50000, // 强制分割的大小阈值 50k
      cacheGroups: { // 缓存组
    // 打包第三方库
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/, // 正则匹配第三方库文件
          priority: -10, // 优先级
          reuseExistingChunk: true, // 如果一个模块已经被打包过了，那么这个模块也不会被打包
          filename:'[name].js'// 打包后的文件名
        },
    // 打包公共模块
        default: {
          minChunks: 2, // 被超过两个模块引用，才会被打包
          priority: -20, // 优先级
          reuseExistingChunk: true, // 如果一个模块已经被打包过了，那么这个模块也不会被打包
          filename: '[name].js' // 打包后的文件名
        },
      },
    }
  },
  // source-map
  devtool: 'eval-cheap-module-source-map',
  // 开发服务器
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),// 指定被访问html页面所在目录的路径
      publicPath: '/',// 服务器访问静态资源的默认路径，优先级高于 output.publicPath
    },
    compress: true,
    port: 5252,
    open: true,
    hot: true, // 代码变化后，自动刷新页面 (该参数可以不用手动添加，它已经被自动应用于 HMR 插件。)
    liveReload:true
  },
  plugins: [
    //new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = merge(commonConfig, devConfig); // 共用配置与开发配置合并
