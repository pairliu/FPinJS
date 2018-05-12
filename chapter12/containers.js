const VALUE = Symbol("Value");

class Container {
  constructor(x) {
    this[VALUE] = x;
  }

  map(fn) {
    return fn(this[VALUE]);
  }

  static of (x) {
    return new Container(x);
  }

  toString() {
    return `${this.constructor.name}(${this[VALUE]})`;
  }

  valueOf() {
    return this[VALUE];
  }
}

//map(fn)返回的仍然是个container（而且是同一类型的container），这种就是Functor
class Functor extends Container {
  static of (x) {
    return new Functor(x);
  }

  map(fn) {
    return Functor.of(fn(this[VALUE]));
  }
}
//Functor有点类似于Promise了，前者用map，后者用then （其实很多讨论是将Promise做成真正的Monad）
//Functor还不允许产生side effect，抛出异常，或者除了生成一个被容器包含的值的操作之外的其他任何操作
//所以需要一些其他的结构来处理

class Nothing extends Functor {
  isNothing() {
    return true;
  }

  toString() {
    return "Nothing()";
  }

  map(fn) {
    return this;
  }
}

class Just extends Functor {
  isNothing() {
    return false;
  }

  map(fn) {
    return Maybe.of(fn(this[VALUE]));
  }
}

class Maybe extends Functor {
  constructor(x) {
    return x === undefined || x === null ? new Nothing() : new Just(x);
  }

  static of (x) {
    return new Maybe(x);
  }

  orElse(v) {
    return this.isNothing() ? v : this.valueOf();
  }
}

const plusOne = x => x + 1;
console.log(Maybe.of(2209).map(plusOne).map(plusOne).toString());
console.log(Maybe.of(null).map(plusOne).map(plusOne).toString());

//下面进入Monad
const fakeSearchForSomething = key => {
  if (key % 2 === 0) {
    return {
      key,
      some: "whatever",
      other: "more data"
    };
  } else {
    throw new Error("Not found");
  }
};

const findSomething = key => {
  try {
    const something = fakeSearchForSomething(key);
    return Maybe.of(something);
  } catch (e) {
    return Maybe.of(null);
  }
};

const getSome = something => Maybe.of(something.map(getField("some")));
const getSomeFromSomething = key => getSome(findSomething(key));
//这里有个问题是getSomeFromSomething(key)返回的是个Maybe(Maybe())，有多层包装
//所以Monad就是额外提供了个能去掉多余的Wrapper的函数，通常叫unwrap()或者flatten()
class Monad extends Functor {
  static of (x) {
    return new Monad(x);
  }

  map(fn) {
    return Monad.of(fn(this[VALUE]));
  }

  unwrap() {
    //有了这个对那种连续有几个Wrapper的可以解决。但是对那种间隔的则无法解决了。所有有下面的chain
    const myValue = this[VALUE];
    return myValue instanceof Container ? myValue.unwrap() : this; //使用递归来不断unwrap
  }

  chain(fn) { //将不是Monad的在map的同时转成Monad，从而可以unwrap （又称为flatMap()）
    return this.map(fn).unwrap();
  }

  ap(m) {
    return m.map(this.valueOf());
  }
}

//然后这里的例子则是演示了将function包装在Monad中的情况，因为函数也是头等公民，自然应该可以包装
//所以上面定义了个ap(m)操作来处理这个 （但没理解）
const add = x => y => x + y;
Monad.of(2).map(add);

class Left extends Monad {
  isLeft() {
    return true;
  }

  map(fn) {
    return this;
  }
}

class Right extends Monad {
  isLeft() {
    return false;
  }

  map(fn) {
    return Either.of(null, fn(this[VALUE]));
  }
}

class Either extends Monad {  //包装了两个值
  constructor(left, right) {
    return right === undefined || right === null ? new Left(left) : new Right(right);
  }

  static of (left, right) {
    return new Either(left, right);
  }
}