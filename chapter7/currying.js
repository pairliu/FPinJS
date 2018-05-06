const curryByBind = fn => 
  fn.length === 0 ? fn() : p => curryByBind(fn.bind(null, p));
//如果函数的参数不是0，那么就返回只接受一个参数p的函数，而内部用递归，
//然后固定第一个参数p！
//如果函数参数个数为0，

const make3 = (a, b, c) => String(100*a + 10*b + c);
const f1 = curryByBind(make3);
const result = f1(6)(5)(8);
console.log("anything?", result);

const something = () => "abcd";
const f = curryByBind(something);
console.log(f);   //abcd
console.log(f()); //TypeError: f is not a function
//所以这个的缺陷是在参数为0时直接计算了，而不是仍然返回个函数
//当然了，对currying概念来说，没参数直接调用就好了，还currying个啥
//同理，对一个参数的，也完全不需要currying

//fn.length只能用于有固定参数个数的函数
//如果参数个数会变化，则需要传进去
const curryByBind2 = (fn, len = fn.length) => 
  len === 0 ? fn() : p => curryByBind2(fn.bind(null, p), len - 1);

