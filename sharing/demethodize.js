const demethodize1 = fn => (arg0, ...args) => fn.apply(arg0, args);
const demethodize2 = fn => (arg0, ...args) => fn.call(arg0, ...args);
const demethodize3 = fn => (...args) => fn.bind(...args)();
const demethodize4 = Function.prototype.bind.bind(Function.prototype.call);            //http://www.intelligiblebabble.com/clever-way-to-demethodize-native-js-methods 

const testSplit = demethodize4(String.prototype.split);
console.log(testSplit('abc,def,g', ','));