function fact(n) {
  if (n === 0) {
    return 1;
  } else {
    return n * fact(n - 1);
  }
}

function fact2(n) {
  if (n === 0) {
    return 1;
  } else {
    const aux = fact2(n - 1);
    return n * aux;
  }
}

function factC(n, cont) {
  if (n === 0) {
    return cont(1);
  } else {
    return factC(n - 1, x => cont(n * x)); //传进来的参数就是剩余部分的结果，也就可以当做factC(n-1)的结果
  }
}

console.log(factC(7, x => x)); //这种方式是固定的吗？好像挺固定的

const fib = n => {
  if (n <= 1) return n;
  else return fib(n - 2) + fib(n - 1);
}

const fibC = (n, cont) => {
  if (n <= 1) return cont(n);
  else return fibC(n - 2, x => fibC(n - 1, y => cont(x + y))); //两个结果，所以最后是cont(x + y)
}

console.log(fibC(7, x => x));

const traverseDom2 = (node, depth = 0) => {
  console.log(`${"| ".repeat(depth)}<${node.nodeName.toLowerCase()}>`);
  Array.from(node.children).forEach(
    child => traverseDom2(child, depth + 1)
  );
};

//首先将之转成完全递归的方式 （怎么转呢？哦，就是有个专门处理loop的方式，之前mapLoop用过，但当时觉得那个不完全对，所以没注意）
const traverseDom3 = (node, depth = 0) => {
  console.log(`${"| ".repeat(depth)}<${node.nodeName.toLowerCase()}>`);

  const traverseChildren = (children, i = 0) => {
    if (i < children.length) {
      traverseDom3(children[i], depth + 1);
      return traverseChildren(children, i + 1); // loop //奥妙，这就是怎么将一个循环转成递归的方式
    }
    return; //这个是终结条件，这里是直接返回
  };

  return traverseChildren(Array.from(node.children));
};

//然后变成continuation
const traverseDom3C = (node, depth = 0, cont = () => {}) => {  //这个递归不返回值，所以这里是没有参数！（也就只有这两种情况了，没返回值，和有一个返回值，又不可能有多个）
  console.log(`${"| ".repeat(depth)}<${node.nodeName.toLowerCase()}>`);

  const traverseChildren = (children, i = 0) => {
    if (i < children.length) {
      //循环的递归调用不算；主递归之后的则放到continuation中！
      traverseDom3C(children[i], depth + 1, () => traverseChildren(children, i + 1));
    }
    return cont();
  };

  return traverseChildren(Array.from(node.children));
};

//现在转变成了TC，那需要Thunk和Trampoline来解决栈溢出的问题了
//Trampoline接受一个函数，然后不停执行之，直到结果不是个函数为止
const trampoline = fn => {
  while (typeof fn === 'function') {
    fn = fn();
  }
  return fn;
}

const sumAll = n => (n === 0 ? 0 : n + sumAll(n - 1));

const sumAllC = (n, cont) => (n === 0 ? cont(0) : sumAllC(n - 1, p => cont(n + p)));

const sumAllT = (n, cont) => n === 0 ? () => cont(0) : () => sumAllT(n - 1, v => () => cont(v + n));

const sumAllTT = n => trampoline(sumAllT(n, x => x));
// console.log(sumAll(100000));
// console.log(sumAllC(10000, x => x));
console.log(sumAllTT(10000000));

