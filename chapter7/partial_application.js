//第一个层次是直接使用这个技术
//首先假设有个任意函数
const nonsense = (a, b, c, d, e) => `${a}${b}${c}${d}${e}`;
//下面就是个应用
const fix2And5 = (a, c, d) => nonsense(a, 22, c, d, 1960);

//第二个层次就是怎么定义个通用的HOF
//首先是用eval()的方式来做，实质就是拼字符串，比较ugly
const range = (start, stop) => new Array(stop - start).fill(0).map( (v, i) => start + i);

const partialByEval = (fn, ...args) => {
    const rangeArgs = range(0, fn.length);   //定义了个从0升序的数组作为参数列表的下标
    const leftList = rangeArgs.map(v => (args[v] === undefined ? `x${v}` : null))
                              .filter(v => !!v)
                              .join(",");    //形成了剩余参数列表的字符串
    const rightList = rangeArgs.map(v => (args[v] === undefined ? `x${v}` : args[v]))
                               .join(",");
    return eval(`(${leftList}) => ${fn.name}(${rightList})`);
}

//下面这个是好的，但是几乎无法理解  :)  
const partialByClosure = (fn, ...args) => {
    //这里主要是要产生个通用的函数，从而可以自己调用自己，所以额外定义了一个，去掉了fn的参数
    //然后args1其实就是对应着传入的args；而args2就是未来要进一步接受的参数列表
    const partialize = (...args1) => (...args2) => {
        for (let i = 0; i < args1.length && args2.length; i++) {
            if (args1[i] === undefined) {
                args1[i] = args2.shift();
            }
        }
        const allParams = [...args1, ...args2];
        return (allParams.includes(undefined) || allParams.length < fn.length  //说明还有没应用的参数，所以返回partialize(...allParams)
            ? partialize : fn)(...allParams);                                  //否则返回fn(...allParams)
    };
    return partialize(...args);
};

const f1 = partialByClosure(nonsense, undefined, 2, undefined, 4);
const f2 = f1(undefined, 3);
console.log(f2(1, 5));

const partialCurryByBind = fn => {
    return fn.length === 0 ? fn() : (...ps) => partialCurryByBind(fn.bind(null, ...ps));
}

const partialCurryByClosure = fn => {
    const curryize = (...args1) => (...args2) => {
        const allParams = [...args1, ...args2];
        return (allParams.length < func.length ? curryize : fn)(...allParams);
    }
    return curryize();
}