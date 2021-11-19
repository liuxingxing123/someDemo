const KKB = require('./kkb')
const app = new KKB()

app.use(ctx => {
  console.log("tttt",ctx)
  ctx.response.body = '232'
})

app.listen(3000, () => {
  console.log("localhost:3000已启动...")
})