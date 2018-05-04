const average = arr => arr.reduce((x, y) => x + y, 0) / arr.length;

console.log(average([1, 423, 4, 2]));

//这里不能用() =>了，必须用function()，可能是因为在prototype的时候不能跟lexical this合用
Array.prototype.average = function() {
    return this.reduce((x, y) => x + y, 0) / this.length;
};

console.log([22, 9, 60, 12, 4, 56].average());

//返回多个值时，自然要利用obj
const average3 = (arr) => {
    let result = arr.reduce(
        (acc, val) => ({sum: acc.sum + val, count: acc.count + 1}),
        {sum: 0, count: 0});
    return result.sum / result.count;
}

console.log(average([22, 9, 60, 12, 4, 56]));

//Tacit style的一个问题
console.log(["123.45", "-67.8", "90"].map(parseInt));
//一种解决方式是不用tacit style；后面还有一种解决方式是arity changing
console.log(["123.45", "-67.8", "90"].map(x => parseInt(x)));

//利用index的一个例子
const range = (start, stop) => (
    //为什么要fill(0)呢？因为缺省都是undefined，而undefined会被map()跳过
    new Array(stop - start).fill(0).map((v, i) => start + i)
);

//用reduce来模拟map
const myMap = (arr, fn) => arr.reduce((acc, val) => acc.concat(fn(val)), []);

//用reduce来模拟filter
const myFilter = (arr, fn) => arr.reduce((acc, val) => (fn(val) ? acc.concat(val) : acc), []);

//区别find()/findIndex()和includes()/indexOf()

//用reduce来模拟find()和findIndex()
const myFind = (arr, fn) => arr.reduce((acc, val) => (fn(val) ? val : acc), undefined); //这样会找到最后一个

const myFind2 = (arr, fn) => arr.reduce(
    (acc, val) => (acc === undefined && fn(val) ? val : acc), undefined
); //所以找到了以后acc不是undefined了，就不会被改变了

//用reduce来模拟some
const mySome = (arr, fn) => arr.reduce(
    (acc, val) => acc || fn(val), false
);

//用reduce来模拟every
const myEvery = (arr, fn) => arr.reduce(
    (acc, val) => acc && fn(val), true
)
//此外还有个none