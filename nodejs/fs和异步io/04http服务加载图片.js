const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  const { url, method ,headers} = req
  if (url === '/' && method === 'GET') {
    fs.readFile('./file/index.html', (err, data)=>{
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain;charset=utf-8' })
        res.end('500 服务器错误')
        return;
      }
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      res.end(data)
    })
  } else if (url === '/users'&& method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({name:'tom',age:20}))
  } else if (method === 'GET' && headers.accept.indexOf('image/*') !== -1 && url!=='/favicon.ico') {
    console.log(url)
fs.createReadStream('./file'+url).pipe(res)
  }else {
    res.statusCode = 400
    res.setHeader('Content-Type', 'text/plain;charset=utf-8')
    res.end('404 页面未找到')
    res
  }
})

server.listen(3000)