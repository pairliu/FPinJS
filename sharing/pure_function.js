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
roundFix(3.14159); // accum  0.00000    result 3    
roundFix(2.71828); // accum  0.14159    result 3
roundFix(2.71828); // accum -0.14013    result 2
roundFix(3.14159); // accum  0.57815    result 4
roundFix(2.71828); // accum -0.28026    result 2
roundFix(2.71828); // accum  0.43802    result 3
roundFix(2.71828); // accum  0.15630    result 3

const roundFix2 = (accum, n) => {
  let nRounded = accum > 0 ? Math.ceil(n) : Math.floor(n);
  accum += n - nRounded;
  return {accum, nRounded};
}

let accum = 0;
let result = roundFix2(accum, 3.14159);
accum = result.accum;
console.log(accum.toFixed(5), result.nRounded);