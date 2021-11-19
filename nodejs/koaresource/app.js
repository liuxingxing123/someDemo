const Koa = require('koa')
const app = new Koa()
// app.use((ctx, next) => {
//   ctx.body = [
//     {name:'tom'}
//   ]
//   next()
// })
// const router = {}
// app.use((ctx, next) => {
//   const expire = Date.now() + 100
//   while (Date.now() < expire)
//   console.log('url' + ctx.url)
//   router['/html'] = ctx => {
//     ctx.type = 'text/html;charset=utf-8'
//     ctx.body=`<b>我的名字是:${ctx.body[0].name}</b>` 
//   }
//   const fun = router[ctx.url]
//   fun && fun(ctx)
// })

const router = require('koa-router')()
app.use(require('koa-static')(__dirname + '/'))

app.use(async (ctx,next) => {
  const start = Date.now()
  await next ()
  const end = Date.now()
  console.log(`请求${ctx.url} 耗时${parseInt(end-start)}ms`)
})

app.use(async (ctx, next) => {
  const expire = Date.now() + 100
  while (Date.now() < expire)
  ctx.body = [
    {name:'jerry'}
  ]
})
router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title:'koa2 json'
  }
})

app.use(router.routes())

app.listen(3000, () => {
  console.log('start...')
})