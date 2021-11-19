import Header from './components/header.js';
import Sidebar from './components/sidebar.js';
import Content from './components/content.js';

const icon1 = require('./assets/icons/bindBug.svg')
const icon2 = require('./assets/icons/running.png')

const img1 = require('./assets/images/cancel.png')
const img2 = require('./assets/images/created.png')
const img3 = require('./assets/images/jurisdiction.jpg')
const img4 = require('./assets/images/online.png')

const text = require('./assets/others/jenkins部署.txt')

const iconfont1 = require('./assets/fonts/iconfont.ttf')
const iconfont2 = require('./assets/fonts/iconfont.woff')
const iconfont3 = require('./assets/fonts/iconfont.eot')
// const reset = require('./assets/styles/reset.css')
// console.log('css', reset)

// import './assets/styles/reset.css'
console.log("完成webpack配置111ss")
console.log(text)
import './assets/styles/color.scss'

import createImg from "./assets/js/createImg.js";
// src/index.js
import * as math from './libs/math';
import * as string from './libs/string';

export { math, string };

const dom = document.getElementById('root');

// 第一张图的创建
createImg(dom)

/* 

预获取 prefetch：在浏览器加载完必要的资源后，空闲时就会去获取可能需要的资源。

预加载 preload：预先加载当前页面可能需要的资源，它与必要资源并行请求。

*/
//import(/* webpackPrefetch: true */ './assets/js/click')
function getComponent() {
  return import(/* webpackChunkName: "lodash" */ 'lodash').then(({ default: _ }) => {
    let element = document.createElement('div');
    element.innerHTML = _.join(['Hello', 'webpac3434k'], ' ');
    return element;
  });
}

document.addEventListener('click', () => {
  getComponent().then(element => {
    document.body.appendChild(element);
  });
});
// 第二张图的创建
// insert an image
const image = new Image()
image.src = img1
image.classList.add('avatar')
root.append(image)

dom.innerHTML += '<p class="iconfont icon-mianxingshezhi">This a text111243.</p>';
console.log('icon-png',icon2)
console.log('icon-svg',icon1)
console.log('png',img1)
// header
new Header(dom);
// side-bar
new Sidebar(dom);
// content
new Content(dom);