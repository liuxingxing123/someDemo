import { getApps } from "."
import { importHtml } from "./import-html"
import { getNextRoute, getPreRoute } from "./rewrite-router"

export const handleRouter = async () => {
  const apps = getApps()
  //先卸载上一个应用  再加载下一个应用
  const preApp = apps.find(item=>getPreRoute().startsWith(item.activeRule))
  const app = apps.find(item => getNextRoute().startsWith(item.activeRule))
  
  if (preApp) {//如果有上一个应用则先销毁
    await unmount(preApp)
  }
  //2.匹配子应用
  //2.1  获取到当前的路由路径
  console.log(window.location.pathname)
  //2.2  去apps里面找到子应用
  
  if (!app) return;
  //3.加载子应用
  const container = document.querySelector(app.container)
  const {
    template,
    getExternalScripts,
    execScripts
  } = await importHtml(app.entry)
  container.appendChild(template)

  //配置全局环境变量
  window.__POWERED_BY_QIANKUN__ = true
  window.__INJECTED_PUBLID_PATH_BY_QIANKUN__ = app.entry+'/'
  const appExports = await execScripts()
  app.bootstrap = appExports.bootstrap
  app.mount = appExports.mount
  app.unmount = appExports.unmount

  await bootstrap(app)
  await mount(app)
  //4.渲染子应用
}

async function bootstrap (app) {
  app.bootstrap&&(await app.bootstrap())
}
async function mount (app) {
  app.mount && (await app.mount({
    container:document.querySelector(app.container)
  }))
}
async  function unmount (app) {
  app.unmount&&(await app.unmount({
    container:document.querySelector(app.container)
  }))
}