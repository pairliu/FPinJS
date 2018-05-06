let binaryOp = (op) => (x, y) => {
    if (op === '+') return x + y;
    else if (op === '*') return x * y;
    //其他省略了
}

//看了下书上，发现思维还是局限了。书上的这个更好
binaryOp = (op) => {
    if (op === '+') return (x, y) => x + y;
    else if (op === '*') return (x, y) => x * y;
}

const binaryOp2 = (op) => new Function("x", "y", `return x ${op} y`);   //不提倡的方式！

console.log([1, 3, 5, 7, 9, 11].reduce(binaryOp('+')));

const getField = (attr) => obj => obj[attr];   //这个似乎是专门用于map从而可以抽取出某个attribute

const demethodize1 = fn => (arg0, ...args) => fn.apply(arg0, args);
const demethodize2 = fn => (arg0, ...args) => fn.call(arg0, ...args);
const demethodize3 = fn => (...args) => fn.bind(...args)();
const demethodize4 = Function.prototype.bind.bind(Function.prototype.call);            //http://www.intelligiblebabble.com/clever-way-to-demethodize-native-js-methods 

const testSplit = demethodize4(String.prototype.split);
console.log(testSplit('abc,def,g', ','));

