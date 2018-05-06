const sum = (x, y) => x + y;
const average = arr => arr.reduce(sum, 0) / arr.length;
const getField = attr => obj => obj[attr];
const curry =  fn => fn.length === 0 ? fn() : p => curry(fn.bind(null, p));
const flipTwo = fn => (p1, p2) => fn(p2, p1);
const demethodize = fn => (arg0, ...args) => fn.apply(arg0, args);
const pipeline = (...fns) => fns.reduce((result, fn) => (...args) => fn(result(...args)));

let markers = [
    {name: "UY", lat: -34.9, lon: -56.2},
    {name: "AR", lat: -34.6, lon: -58.4},
    {name: "BR", lat: -15.8, lon: -47.9},
    {name: "BO", lat: -16.5, lon: -68.1}
];

const myMap = curry(flipTwo(demethodize(Array.prototype.map)));
const getLat = curry(getField)("lat");
const getAllLats = curry(myMap)(getLat);
let averageLat = pipeline(getAllLats, average);
console.log(averageLat(markers));

//最开始冒出个错误：RangeError: Maximum call stack size exceeded
//是因为curry函数定义错误了，定义成如下了：
//const curry = fn => fn.length === 0 ? fn() : curry(p => fn.bind(null, p));