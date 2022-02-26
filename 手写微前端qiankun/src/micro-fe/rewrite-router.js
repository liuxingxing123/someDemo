import { handleRouter } from './handle-router'
let preRoute = ''
let nextRoute = window.location.pathname
export const getPreRoute = ()=>preRoute
export const getNextRoute = () => nextRoute

export const rewriteRouter = () => {
  //1.监视路由变化  
  //hash路由   window.onhashchange
  //history路由   history.go   history.back history.forward 使用popstate事件 
  window.addEventListener('popstate', () => {
    //console.log('监听到popstate变化了')
    preRoute = nextRoute
    nextRoute = window.location.pathname
    handleRouter()
  })
  //pushState  replaceState需要通过函数重写的方式进行劫持
  const rawPushState = window.history.pushState
  window.history.pushState = (...args) => {
    preRoute = window.location.pathname
    rawPushState.apply(window.history, args)
    nextRoute = window.location.pathname
    //console.log('监听到pushState变化了')
    handleRouter()
  }
  const rawReplaceState = window.history.replaceState
  window.history.replaceState = (...args) => {
    preRoute = window.location.pathname
    rawReplaceState.apply(window.history, args)
    nextRoute = window.location.pathname
    //console.log('监听到replaceState变化了')
    handleRouter()
  }
}