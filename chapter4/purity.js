const roundFix = (function() {
    let accum = 0;
    return n => {
        // reals get rounded up or down
        // depending on the sign of accum
        let nRounded = accum > 0 ? Math.ceil(n) : Math.floor(n);
        console.log("accum", accum.toFixed(5), " result", nRounded);     //toFixed(5)是保留五位小数点
        accum += n - nRounded;
        return nRounded;
    };
})();

//IIFE执行后返回的是个函数，它闭包中一直有accum的值，每次调用还会去改变它
roundFix(3.14159); // accum  0.00000    result 3    
roundFix(2.71828); // accum  0.14159    result 3
roundFix(2.71828); // accum -0.14013    result 2
roundFix(3.14159); // accum  0.57815    result 4
roundFix(2.71828); // accum -0.28026    result 2
roundFix(2.71828); // accum  0.43802    result 3
roundFix(2.71828); // accum  0.15630    result 3

//所以这个因为使用了内部状态从而不是纯函数了，怎么fix呢？将状态作为参数，copy，返回新的
const roundFix2 = (accum, n) => {
    let nRounded = accum > 0 ? Math.ceil(n) : Math.floor(n);
    accum += n - nRounded;
    return {accum, nRounded};
}

//下面是memoization的第一个例子，目的是为了表明如果是纯函数就可以利用memoization
const fib = (n) => (n <= 1) ? n : fib(n-2) + fib(n-1);

let cache = [];
const fib2 = (n) => {
    if (!cache[n]) {
        if (n == 0) {
            cache[0] = 0;
        } else if (n == 1) {
            cache[1] = 1;
        } else {
            cache[n] = fib2(n - 2) + fib2(n - 1);
        }
    }
    return cache[n];
}

//这种如果要测试，可以spy/mock在Math.random()上，从而控制其返回值
const getRandomLetter = () => {
    const min = "A".charCodeAt();
    const max = "Z".charCodeAt();
    //Math.random()返回0~1之间的伪随机数
    return String.fromCharCode(Math.floor(Math.random() * (1 + max - min)) + min);
};

//这种就只能property test了
const getRandomFileName = (fileExt = '') => {
    const NAME_LENGTH = 12;
    let namePart = new Array(NAME_LENGTH);
    for (let i = 0; i < NAME_LENGTH; i++) {
        namePart[i] = getRandomLetter();
    }
    return namePart.join("") + fileExt;
}

const getRandomFileName2 = (fileExt = "", randomLetterFunc) => {  //将这个函数注入进来
    const NAME_LENGTH = 12;
    let namePart = new Array(NAME_LENGTH);
    for (let i = 0; i < NAME_LENGTH; i++) {
        namePart[i] = randomLetterFunc();
    }
    return namePart.join("") + fileExt;
}

