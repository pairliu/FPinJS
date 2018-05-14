
//Tacit style / Pointfree style 
console.log(["123.45", "67.8", "90"].map(parseFloat));
console.log(["123.45", "67.8", "90"].map(parseInt));
//Approach 1 to fix it: 
// console.log(["123.45", "-67.8", "90"].map(x => parseInt(x)));
//Approach 2: 
// const unary = fn => (...args) => fn(args[0]);
// console.log(["123.45", "-67.8", "90"].map(unary(parseInt)));