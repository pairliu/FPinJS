//用reduce来模拟map
const myMap = (arr, fn) => arr.reduce((acc, val) => acc.concat(fn(val)), []);

const arr = [1, 2, 3, 4, 5];
console.log(arr.map(x => x * 2));
console.log(myMap(arr, x => x * 2));

//用reduce来模拟filter
const myFilter = (arr, fn) => arr.reduce((acc, val) => (fn(val) ? acc.concat(val) : acc), []);

//区别find()/findIndex()和includes()/indexOf()

//用reduce来模拟find()
const myFind = (arr, fn) => arr.reduce(
    (acc, val) => (acc === undefined && fn(val) ? val : acc), 
    undefined
); //所以找到了以后acc不是undefined了，就不会被改变了

//用reduce来模拟some
const mySome = (arr, fn) => arr.reduce(
    (acc, val) => acc || fn(val), 
    false
);

//用reduce来模拟every
const myEvery = (arr, fn) => arr.reduce(
    (acc, val) => acc && fn(val), 
    true
)