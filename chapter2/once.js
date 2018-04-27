function once(fn) {
  let done = false;
  return (...args) => {
    if (!done) {
      done = true;
      return fn(...args);   //或者不需要return
    }
  }
}

function onceAndAfter(f, g) {
  let done = false;
  return (...args) => {
    if (!done) {
      done = true;
      f(...args);
    } else {
      g(...args);
    }
  }
}

const onceWithIIFE = (function() {
  let done = false;
  return (fn) => {
    return (...args) => {
      if (!done) {
        done = true;
        fn(...args);
      }
    }
  }
})();

function test(a, b) {
  console.log("a: " + a + " b: " + b);
}

once(test('h', 'e'));
once(test('h', 'e'));
once(test('h', 'e'));    //这样写根本不对。test()直接调用了

const testOnce = once(test);    //这样调用一次，返回了一个函数对象，引用了一个done的实例
testOnce("h", "e");
testOnce("h", "e");
testOnce("h", "e");
