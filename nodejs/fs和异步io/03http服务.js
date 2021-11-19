const http = require('http')
const server = http.createServer((req, res) => {
  console.log('there is a request')
  res.end('a response from server')
})

server.listen(3000)