const tailCall = n => {
  n && tailCall(n - 1); // until n is zero
}
// tailCall(10000);

const sumAll = n => (n === 0 ? 0 : n + sumAll(n - 1));

const sumAllC = (n, cont) => (n === 0 ? cont(0) : sumAllC(n - 1, p => cont(n + p)));

// console.log(sumAllC(10000, x => x));

const sumAllT = (n, cont) => {
  if (n === 0) {
    return () => cont(0);
  } else {
    return () => sumAllT(n - 1, p => () => cont(n + p));
  }
}

// console.log(sumAllT(10000, x => x));

const trampoline = fn => {   //哦，这里参数虽然是fn，但其实不一定是个函数，如果不是函数，就直接返回了
  while (typeof fn === 'function') {
    fn = fn();
  }
  return fn;
}

const sumAllTT = n => trampoline(sumAllT(n, x => x));
console.log(sumAllTT(1000000));