function getDir(path) {
    const fs = require("fs");
    const files = fs.readdirSync(path);
    return files;
}

const filterByText = (text, arr) => arr.filter(v => v.endsWith(text));

const filterOdt = arr => filterByText(".js", arr);   //partial application. As it is the first, it is also curring

const count = arr => arr.length;

const pipeTwo = (f, g) => (...args) => g(f(...args)); 

const pipeline = (...fns) => (...args) => {          //这个还是符合之前的规律，就是(...fns)后面直接跟(...args)，表示该HOF接受多个函数，返回个函数，这个函数可以接受任意参数
    let result = fns[0](...args);                    //所以这里还是就是有个细节了！第一个参数接受任意参数，但后面的只能接受一个！  
    for (let i = 1; i < fns.length; i++) {
        result = fns[i](result);
    }
    return result;
};

const pipeline2 = (...fns) => 
    fns.reduce((result, fn) => (...args) => fn(result(...args)));   
//这个非常难理解
//首先形式跟通常的变了，因为不是后面直接跟着(...args)了
//第二，reduce()如果没有提供缺省值，则数组的第一个会被作为第一次调用的acc，然后少reduce一次
//第三，reduce()最后的返回值是个计算的结果，是一个值。而这里却是pipeline2调用的结果，需要的是一个函数，为什么？这就是这里搞的地方了，因为按后面的写法，reduce的每一轮结果都是一个函数
//第四，这时候才更清楚pipeline()这个函数的目的，就是生成个fn(fn-1(...f2(f1(...args))))这样的调用
//所以，整个过程是，第一个函数f1作为第一个result（接受任意参数），这时候第二个函数f2是fn参数，所以结果是返回了个接受...args参数的函数！并且其body是f2(f1(...args))
//第二次result那里是上次返回的函数，仍然是接受任意参数，而f3在fn那里了，所以结果仍然返回个接受任意参数的函数！并且其body是f3(result(...args))，也就是f3(f2(f1(...args)))
//清楚了
//不过这引发了一个思考，就是既然这些函数都在那了，为啥要pipeline呢？直接串在一起调用不就行了吗？
//比如count(filterOdt(getDir("../chapter6")))

const pipeline3 = (...fns) => {    //这个搞不对了
    if (fns.length === 1) {
        return fns[0](...args);
    }
    else if (fns.length === 2) {
        
    } else {
        let fn = fns.pop();
        return (...args) => fn(pipeline3(...fns));
    }
};

console.log(pipeline3(getDir, filterOdt, count)("E:/Dev/Playground/FPinJS/chapter6"));    
//想要也传文件扩展名作为参数遇到了困难，因为pipelining适用于相同数量的参数
//有没有可能改造下？好像不行，因为在pipeline上的每一个函数都是返回一个值，造成了下一个函数只能接受一个参数
// console.log(count(filterOdt(getDir("../chapter6/"))));

const tee = arg => {            //这个只接受一个参数？嗯，是的，因为用于pipeline，所以前面一个的返回值肯定只有一个
    console.log(arg);
    return arg;  
};

//tap是个更通用的情况，接受一个fn作为参数，这个fn又以输入x作为参数，从而产生任何side effect
//然后还要返回x，从而它可以作为pipeline中的下一个函数的输入
const tap = curry((fn, x) => (fn(x), x));  //奥妙。注意这里的逗号运算符
//如果不curry，明显更简单。。。
const tap2 = fn => x => (fn(x), x);   //这就是直接在定义时用符合curry的形式嘛

//讲了下怎么变成pointfree的，也就是没有function或者=>的函数定义
const countOdtFiles3 = path => pipeTwo(pipeTwo(getDir, filterOdt), count)(path);
const countOdtFiles4 = path => pipeTwo(getDir, pipeTwo(filterOdt, count))(path);
//变成pointfree的，就是去掉参数
const countOdtFiles3b = pipeTwo(pipeTwo(getDir, filterOdt), count);
const countOdtFiles4b = pipeTwo(getDir, pipeTwo(filterOdt, count));

//讲到具体怎么转变为pointfree，比如针对如下函数
const isNegativeBalance = v => v.balance < 0;
//这里面包含两部分，一部分是抽出balance这个属性，另一部分是跟0比较
const isNegativeBalance2 = pipeline(
    curry(getField)('balance'),          //这里应该可以直接写为getField("balance")吧
    curry(binaryOp(">"))(0)
)