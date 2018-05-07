const compose = (...fns) => pipeline(...(fns.reverse()));   
const compose2 = (...fns) => fns.reduceRight((result, fn) => (...args) => fn(result(...args)));
