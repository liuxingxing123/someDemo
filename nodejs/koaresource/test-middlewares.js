//同步
/* const add = (x,y)=>x+y
const square = z=>z**2
const compose = (...[first, ...others]) =>(...args)=> {
  let ret = first(...args)
  others.forEach(fn => {
    ret = fn(ret)
  })
  return ret
}
const fn = compose(add, square)
console.log(fn(1,2)) */

//异步
function compose (middlewares) {
  return function () {
    return dispatch(0)
    function dispatch (i) {
      let fn = middlewares[i]
      if (!fn) {
        return Promise.resolve()
      }
      return Promise.resolve(fn(function next () {
        return dispatch(i+1)
      }))
    }
  }
}

async function fn1 (next) {
  console.log('fn1')
  await next()
  console.log('end fn1')
}

async function fn2 (next) {
  console.log('fn2')
  await delay()
  await next()
  console.log('end fn2')
}

function fn3 (next) {
  console.log('fn3')
}

function delay () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    },2000)
  })
}
const middlewares = [fn1, fn2, fn3]
const finalFn = compose(middlewares)
finalFn()