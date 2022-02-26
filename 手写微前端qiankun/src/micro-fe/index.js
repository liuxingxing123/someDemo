import { handleRouter } from "./handle-router"
import { rewriteRouter } from "./rewrite-router"
const _apps = []

export const getApps = () => _apps

export const registerMicroApps = (apps) => {
  _apps = apps
}

export const start = () => {
  //开始微前端的运行原理
  
  rewriteRouter()
  //初始化执行匹配
  handleRouter()
}