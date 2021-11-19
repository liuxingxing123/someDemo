const path = require('path')
const webpack = require('webpack');
const miniSVGDataURI = require('mini-svg-data-uri')
//--save-dev == -D  devDependencies
//--save == -S == 后面不接参数  dependencies

const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',//打包类型  development 开发环境 | production 生产环境
  devtool:'eval-cheap-module-source-map',
  entry: {
    main: './src/index.js'//入口文件
  },
  output: {
    path: path.resolve(__dirname, 'dist'),//打包后的路径
    filename: 'bundle.js',//打包后的文件名
    // 静态文件打包后的路径及文件名（默认是走全局的，如果有独立的设置就按照自己独立的设置来。） [name] 表示原来的文件名，[hash] 表示散列值，[ext] 表示文件后缀
    assetModuleFilename: 'assets/[name]_[hash][ext]',
    clean:true,//在 webpack 5.20.0+ 的版本中，内置了清除输出目录内容的功能，只要在 output 选项中配置一个参数即可
  },
  module: {
    rules: [
      {
        test: /\.s?css$/i,
        use: ['style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              modules: true// 默认是 false ***
            }
          },
          //上面 importLoaders 设置为 2，表示匹配到样式文件时，都会去执行一开始的两个 loader，也就是 'sass-loader' 以及 'postcss-loader'. modules 设置为 true，则保证了样式模块的独立性，不会被互相覆盖
          'sass-loader', 'postcss-loader'],
          sideEffects: true  //摇树的作用范围
          // package.json 中的配置：sideEffects: false（全都摇）
          // 规则配置中的字段：sideEffects: true（控制全局文件不被摇掉）
          /* 在package.json中我们将 sideEffects 设置为 false 后，所有的文件都会被 Tree Shaking，通过import "./styles/reset.css" 这样的形式引入的 CSS 就会被当作无用代码处理掉。
          为了解决这个问题，可以在 loader 的规则配置中，添加 sideEffects: true ，告诉 Webpack 这些文件不要 Tree Shaking。注意：这个字段在所有模块的规则都可以配置。 */
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        type: 'asset',
        generator: {
          filename: 'images/[name]_[hash][ext]'// 独立的配置
        },
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8kb （低于8kb都会压缩成 base64）
          }
        }
      },
      {
        test: /\.svg$/i,
        type: 'asset',
        generator: {
          filename: 'icons/[name]_[hash][ext]',
          dataUrl (content) {
            content = content.toString()
            return miniSVGDataURI(content)// 通过插件提供的编码算法处理文件
          }
        },
        parser: {
          dataUrlCondition: {
            maxSize: 2 * 1024 // 2kb （低于2kb都会压缩）
          }
        },
      },
      {
        test: /\.(otf|ttf|eot|woff2?|svg)$/i,
        type: 'asset',
        generator: {
          filename: 'fonts/[name]_[hash][ext]'// 独立的配置
        }
      },
      {
        test: /\.(txt|xml)$/i,
        type: 'asset/source',
        generator: {
          filename: 'others/[name]_[hash][ext]'// 独立的配置
        }
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader:'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),// 在打包之前，清除输入目录下的文件
    new HtmlWebpackPlugin({
      template:'./src/public/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    open: true, // 开启服务器时，自动打开页面
    compress: true, // 开启 gzip 压缩
    port: 7000, // 自定义端口号
    static: {
      directory: path.join(__dirname, 'dist'),// 指定被访问html页面所在目录的路径
      publicPath: '/',// 服务器访问静态资源的默认路径，优先级高于 output.publicPath
    },
    hot: true,// 开启热更新
    liveReload:true
  },
  //在生产环境下，Webpack 默认会添加 Tree Shaking 的配置，因此只需写一行 mode: 'production' 即可  根据环境的不同进行配置以后，还需要在 package.json 中，添加字段：**sideEffects: false，**告诉 Webpack 哪些代码可以处理。 
  /* sideEffects 默认为 true， 告诉 Webpack ，所有文件都有副作用，他们不能被 Tree Shaking。
  sideEffects 为 false 时，告诉 Webpack ，没有文件是有副作用的，他们都可以 Tree Shaking。
  sideEffects 为一个数组时，告诉 Webpack ，数组中那些文件不要进行 Tree Shaking，其他的可以 Tree Shaking。 */
  optimization: {
    usedExports:true
  }
}
// Webpack 中的 module、chunk、bundle 究竟是什么？
/* 
module：不同文件类型的模块。Webpack 就是用来对模块进行打包的工具，这些模块各种各样，比如：js 模块、css 模块、sass 模块、vue 模块等等不同文件类型的模块。这些文件都会被 loader 转换为有效的模块，然后被应用所使用并且加入到依赖关系图中。相对于一个完整的程序代码，模块化的好处在于，模块化将程序分散成小的功能块，这就提供了可靠的抽象能力以及封装的边界，让设计更加连贯、目的更加明确。而不是将所有东西都揉在一块，既难以理解也难以管理。

chunk：数据块。

a. 一种是非初始化的：例如在打包时，对于一些动态导入的异步代码，webpack 会帮你分割出共用的代码，可以是自己写的代码模块，也可以是第三方库（node_modules 文件夹里的），这些被分割的代码文件就可以理解为 chunk。

b. 还有一种是初始化的：就是写在入口文件处 (entry point) 的各种文件或者说模块依赖，就是 chunk ，它们最终会被捆在一起打包成一个 main.js （当然输出文件名你可以自己指定），这个 main.js 可以理解为 bundle，当然它其实也是 chunk。

bundle：捆绑好的最终文件。如果说，chunk 是各种片段，那么 bundle 就是一堆 chunk 组成的“集大成者”，比如上面说的 main.js 就属于 bundle。当然它也类似于电路上原先是各种散乱的零件，最终组成一个集成块的感觉。它经历了加载和编译的过程，是源文件的最终版本。
*/