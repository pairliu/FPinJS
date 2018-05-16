const pipeline = (...fns) => (...args) => {          
  let result = fns[0](...args);              
  for (let i = 1; i < fns.length; i++) {
      result = fns[i](result);
  }
  return result;
};

const pipeline2 = (...fns) => 
  fns.reduce((result, fn) => (...args) => fn(result(...args)));   

//定义一些函数
function getDir(path) {
    const fs = require("fs");
    const files = fs.readdirSync(path);
    return files;
}

const filterByText = (text, arr) => arr.filter(v => v.endsWith(text));

const filterJs = arr => filterByText(".js", arr);   //partial application. 

const count = arr => arr.length;

console.log(pipeline(getDir, filterJs, count)("/Users/jliu4/Dev/Learning/FPinJS/sharing"));