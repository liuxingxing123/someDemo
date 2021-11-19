// webpack.common.config.js
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const miniSVGDataURI = require('mini-svg-data-uri')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//--save-dev == -D  devDependencies
//--save == -S == 后面不接参数  dependencies


module.exports = {
  // 入口文件
  entry: './src/index.ts',
  externals: ['lodash'], // 忽略 lodash 的打包 (该选项常用于库的开发)
  // 输出文件
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    assetModuleFilename: 'assets/[name]_[hash][ext]',
    clean: true,
    library: {
      name: 'library', // library name
      type: 'umd', // umd, var, this, commonjs, commonjs2, amd, system
    }
  },
  // 模块
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/i,
        use: [
          MiniCssExtractPlugin.loader,
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
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  // 插件
  plugins: [
    new MiniCssExtractPlugin(),
    new HTMLWebpackPlugin({
      template:'./src/public/index.html'
    }),
  ]
};