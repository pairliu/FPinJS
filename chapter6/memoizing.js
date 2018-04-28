const myPut = (text, name, tStart, tEnd) =>
  console.log(`${name} - ${text} ${tEnd - tStart} ms`);

const myGet = () => new Date();

const addTiming = (fn, getTime = myGet, output = myPut) => {
  return (...args) => {
    let start = getTime();
    try {
      let result = fn(...args);
      let end = getTime();
      myPut("normal exit", fn.name, start, end);
      return result;
    } catch (error) {
      let end = getTime();
      myPut("exceptional exit", fn.name, start, end);
      throw error;
    }
  }
}

function fib(n) {
  if (n===0) {
    return 0;
  } else if (n===1) {
    return 1;
  } else {
    return fib(n-2) + fib(n-1);
  }
}

const memorizing = fn => {
  let cache = {};
  return x => (x in cache ? cache[x] : (cache[x] = fn(x)));
}

const withoutOptimize = addTiming(fib);
withoutOptimize(20);
withoutOptimize(30);
withoutOptimize(30);
withoutOptimize(40);
withoutOptimize(40);

const withOptimize = addTiming(memorizing(fib));
withOptimize(20);
withOptimize(30);
withOptimize(30);
withOptimize(40);
withOptimize(40); //没有完全优化，只有memorizing(fib)返回的函数被cache了！


fib = memorizing(fib);  
const finalOptimize = addTiming(fib);
withOptimize(50);
withOptimize(60);
withOptimize(70); //这才是正确的用法！

const memoMoreArgs = fn => {
  let cache = {};
  return (...args) => {
    // let key = JSON.stringify(...args);
    let key = JSON.stringify(args);
    return (key in cache ? cache[key] : (cache[key] = fn(...args)));
  }
}