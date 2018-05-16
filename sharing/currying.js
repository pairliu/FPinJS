const curry = fn => 
  fn.length === 0 ? fn() : p => curry(fn.bind(null, p));

  const make3 = (a, b, c) => String(100*a + 10*b + c);
  const f1 = curry(make3);
  const result = f1(6)(5)(8);
  console.log("anything?", result);