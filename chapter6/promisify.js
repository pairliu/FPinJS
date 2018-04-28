const fs = require('fs');

const promisify = fn => (...args) => (
  new Promise((resolve, reject) => 
    fn(...args, (err, data) => (
      err ? reject(err) : resolve(data)
    ))));
//有点难理解就是：fn这种的args是包含cb的，粗看args应该也包含cb
//但是下面fn(...args, cb)表明args不包含。
//其实args不是fn的参数，而是经过promisify返回的参数，
//所以该函数的函数列表正是去掉cb的所有其他（目的就是不用cb嘛）

//另外，HOF是不是都是这种形式： fn => (...args)？
//基本是的。只是有些变形的情况：
//比如在once的里面，第一步是要定义个done本地变量，所以没法直接这么写
//但后面仍然是return (...args)
//又比如addTiming这种有injecting的，是(fn, getOp, putOp) 其实也是直接可以
//再比如，如果用了IIFE，就再多一层！
const promisifyWithIIFE = (function() {
  return fn => (...args) => (
    new Promise((resolve, reject) => (
      fn(...args, (err, data) => (
        err ? reject(err) : resolve(data)
      ))
    ))
  )
})();

//这种写法对debug也很艰苦。这也说明了这是定式，不可能出错！
const promisifyWithIIFEMore = (() => fn => (...args) => 
  new Promise((resolve, reject) => (
    fn(...args, (err, data) => 
      err ? reject(err) : resolve(data)
    )
  )
))();

const fspromise = promisifyWithIIFEMore(fs.readFile.bind(fs));
fspromise("./memoizing.js")
.then(data => console.log("SUCCESSFUL", data))
.catch(err => console.log("UNSUCCESSFUL", err));
