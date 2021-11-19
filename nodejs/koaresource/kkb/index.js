const http = require('http')
const request = require('./request')
const response = require('./response')
const context = require('./context')

class KKB{
  listen (...args) {
    const server = http.createServer((req, res) => {
      let ctx = this.createContext(req, res)
      console.log(ctx)
      this.callback(ctx)
      res.end(ctx.body)
    })
    server.listen(...args)
  }
  createContext (req, res) {
    const ctx = Object.create(context)
    ctx.request = Object.create(request)
    ctx.response = Object.create(response)
    ctx.req = ctx.request.req = req
    ctx.res = ctx.response.re = res
    return ctx
  }
  use (callback) {
    this.callback = callback
  }
}

module.exports = KKB