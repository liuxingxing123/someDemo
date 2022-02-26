import { fetchResource } from "./fetch-resource"

export const importHtml = (url) => {
  //请求获取子应用的资源  HTML、css、js
  const html = await fetchResource(url)
  const template = document.createElement('div')
  template.innerHTML = html
  //获取所有script标签的代码数组
  const scripts = template.querySelectorAll('script')
  function getExternalScripts(){
    return Promise.all(Array.from(scripts).map(script => {
      const src = script.getAttribute('src')
      if (!src) {
        return Promise.resolve(script.innerHTML)
      } else {
        return fetchResource(src.startsWith('http')?src:`${url}${src}`)
      }
    }))
  }

  async function execScripts () {
    const scripts = await getExternalScripts()
    //手动构造CommonJs模块环境
    const module = { exports: {} }
    const exports = module.exports
    scripts.forEach(eval)
    return module.exports 
  }
  //
  return {
    template,
    getExternalScripts,
    execScripts
  }
}