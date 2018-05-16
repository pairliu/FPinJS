const memoize = fn => {
  let cache = {};
  return (...args) => {
    // let key = JSON.stringify(...args);
    let key = JSON.stringify(args);
    return (key in cache ? cache[key] : (cache[key] = fn(...args)));
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

console.log(fib(40)); 

// fib = memoize(fib);
// console.log(fib(45));