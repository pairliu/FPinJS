const nonsense = (a, b, c, d, e) => `${a}${b}${c}${d}${e}`;
const fix2And5 = (a, c, d) => nonsense(a, 22, c, d, 1960);
console.log(fix2And5(4, 6, 9));
console.log(fix2And5(5, 8, 9));

const partial = (fn, ...args) => {
  const partialize = (...args1) => (...args2) => {
      for (let i = 0; i < args1.length && args2.length; i++) {
          if (args1[i] === undefined) {
              args1[i] = args2.shift();
          }
      }
      const allParams = [...args1, ...args2];
      return (allParams.includes(undefined) || allParams.length < fn.length  
          ? partialize : fn)(...allParams);                                  
  };
  return partialize(...args);
};

const f1 = partial(nonsense, undefined, 2, undefined, 4);
const f2 = f1(undefined, 3);
// const f2 = partial(f1, undefined, 3);
console.log(f2(1, 5));