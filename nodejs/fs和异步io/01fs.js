const fs = require("fs")

//同步调用
const data = fs.readFileSync('./file/conf.js')
console.log(data.toString())

//异步调用
fs.readFile('./file/conf.js', (err, data) => {
  if (err) {
    throw err
  }
  console.log(data.toString())
})

//promisify
// const { promisify } = require('util')
// const readFile = promisify(fs.readFile)
// readFile('./file/conf.js').then(data=>console.log(data.toString()))

  (async ()=> {
    const fs = require("fs")
  const { promisify } = require('util')
  const readFile = promisify(fs.readFile)
  const data = await readFile('./file/conf.js')
  console.log(data.toString())
})()