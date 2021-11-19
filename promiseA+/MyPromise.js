const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise{
  constructor(executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      // 如果有错误，就直接执行 reject
      this.reject(error)
    }
  }

  //存储状态的变量
  status = PENDING

  //成功之后的值
  value = null
  //失败之后的原因
  reason = null
  //存储成功的回调函数
  onFulfilledCallbacks = []
  //存储失败的回调函数
  onRejectedCallbacks = []
  //resolve和reject为什么使用箭头函数  用箭头函数可以直接让this指向当前实例对象
  //更改成功后的状态
  resolve = (value) => {
    //只有状态是等待  才执行状态修改
    if (this.status === PENDING) {
      //状态修改为成功
      this.status = FULFILLED
      this.value = value
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }
  static resolve (parameter) {
    if (parameter instanceof MyPromise) {
      return parameter
    }
    return new MyPromise(resolve => {
      resolve(parameter)
    })
  }
  //更改失败后的状态
  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.reason = reason
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }
  static reject (reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason)
    })
  }
  then (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function'?onFulfilled:value=>value
    onRejected = typeof onRejected === 'function'?onRejected:reason=>{throw reason}
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        queueMicrotask(() => {
          // ==== 新增 ====
        try {
          // 获取成功回调函数的执行结果
          const x = onFulfilled(this.value);
          // 传入 resolvePromise 集中处理
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error)
        }  
        })  
      } else if (this.status === REJECTED) {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2,x,resolve,reject)
          } catch (error) {
            reject(error)
          }
        })
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(promise2,x,resolve,reject)
            } catch (error) {
              reject(error)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(promise2,x,resolve,reject)
            } catch (error) {
              reject(error)
            }
          })
        })
      }
    })
    return promise2
  }
}

function resolvePromise (promise, x, resolve, reject) {
  if (promise === x) {
    return reject(new TypeError('The promise and the return value are the same'));
  }
  if (typeof x === 'object' || typeof x === 'function') {
    if (x === null) {
      return resolve(x)
    }
    let then
    try {
      then = x.then
    } catch (error) {
      return reject(error)
    }
    if (typeof then === 'function') {
      let called = false
      try {
        then.call(
          x,
          y => {
            if (called) return;
            called = true
            resolvePromise(promise,y,resolve,reject)
          },
          r => {
            if (called) return;
            called = true
            reject(r)
          }
        )
      } catch (error) {
        if (called) return
        reject(error)
      }
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}

MyPromise.deferred = function () {
  var result = {}
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve
    result.reject = reject
  })
  return result
}
module.exports = MyPromise