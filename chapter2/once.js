function once(fn) {
  let done = false;
  return (...args) => {
    if (!done) {
      done = true;
      return fn(...args);   //或者不需要return
    }
  }
}

function onceWithGoodReturn(fn) {    //这样每次调用都会返回同一个结果
  let done = false;
  let result;
  return (...args) => {
    if (!done) {
      done = true;
      result = fn(...args);
    }
    return result;
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

const onceWithIIFE2 = (function() {
  let done = false;
  return fn => (...args) => {
    if (!done) {
      done = true;
      fn(...args);
    }
  }
})();

function test(a, b) {
  console.log("a: " + a + " b: " + b);
}

// once(test('h', 'e'));
// once(test('h', 'e'));
// once(test('h', 'e'));    //这样写根本不对。test()直接调用了

const testOnce = once(test);    //这样调用一次，返回了一个函数对象，引用了一个done的实例
testOnce("h", "e");
testOnce("h", "e");
testOnce("h", "e");

// const testOnce2 = onceWithIIFE(test);
const testOnce2 = onceWithIIFE2(test);
testOnce2("h", "o");
testOnce2("h", "o");
testOnce2("h", "o");
