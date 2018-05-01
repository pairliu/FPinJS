const search = (arr, key) => {
    if (arr.length === 0) {
        return false;
    } else if (arr[0] === key) {
        return true;
    } else {
        return search(arr.slice(1), key);
    }
}

const search2 = (arr, key) => {
    arr.length === 0 ? false : (arr[0] === key ? true : search2(arr.slice(1), key));    //如果返回值是true/false，可以进一步简化！就是下面的search3
}

const search3 = (arr, key) => {
    arr.length && (arr(0) === key || search3(arr.slice(1), key));    //实在太难懂了
}

//需要熟练一下布尔逻辑了
//a && b则在a为false时返回false，a为true时返回b
//a || b则在a为true时返回true，否则返回b  （对写代码来说，应该是反过来思考，如果需要第一个为true时返回true，那么需要用||。上面也一样）

const power = (base, pow) => {
    if (pow === 0) return 1;
    if (pow === 1) return base;
    if (pow % 2 === 1) return base * power(base, pow - 1);
    else return power(base * base, power / 2);
}

//书上的quicksort倒是利用filter和spread，创造了大量的新数组，所以跟常见的不同。倒是符合FP的思想，不过性能堪忧吧

//一个动态规划的例子，然后又利用memoization
// let makeChange = (n, bills) => {
//     if (n < 0) return 0;
//     else if (n === 0) return 1;
//     else if (bills.length === 0) return 0;
//     else return (makeChange(n, bills.slice(1)) + makeChange(n - bills[0], bills));    //关键在这里
// }

const memoize3 = fn => {
    let cache = {};
    return (...args) => {
        let strX = JSON.stringify(...args);
        // return cache[key] ? cache[key] : (cache[key] = fn(...args));     
        return strX in cache ? cache[strX] : (cache[strX] = fn(...args));        //判断一个key是否是对象的property，用key in obj！
    }
}

const makeChange = memoize3((n, bills) => {   //怎么memoize之后输出是6了，而不是969了？
    if (n < 0) return 0;
    else if (n === 0) return 1;
    else if (bills.length === 0) return 0;
    else return (makeChange(n, bills.slice(1)) + makeChange(n - bills[0], bills))
});

console.log(makeChange(64, [100, 50, 20, 10, 5, 2, 1]));

const mapR = (arr, cb) => (
    arr.length === 0 ? [] : [cb(arr[0])].concat(mapR(arr.slice(1), cb))    //这个将一个元素形成数组的方式还挺有趣：[cb(arr[0])]
)