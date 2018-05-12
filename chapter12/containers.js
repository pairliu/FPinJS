const VALUE = Symbol("Value");

class Container {
  constructor(x) {
    this[VALUE] = x;
  }

  map(fn) {
    return fn(this[VALUE]);
  }

  static of(x) {
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
  static of(x) {
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

  static of(x) {
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
  static of(x) {
    return new Monad(x);
  }

  map(fn) {
    return Monad.of(fn(this[VALUE]));
  }

  unwrap() {
    //有了这个对那种连续有几个Wrapper的可以解决。但是对那种间隔的则无法解决了。所有有下面的chain
    const myValue = this[VALUE];
    return myValue instanceof Container ? myValue.unwrap() : this; //使用递归来不断unwrap （这里竟然是instanceof Container来判断的，倒确实是多态的从而可以吧，但又如何保证它是有unwrap()函数呢？）
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

  static of(left, right) {
    return new Either(left, right);
  }
}

const Tree = (value, left, right) => (destructure, __) => destructure(value, left, right);
const EmptyTree = () => (__, destructure) => destructure();
//__只是个placeholder，表示如果传入两个参数，另一个就被忽略了。所以Tree和EmptyTree是对应的
//执行Tree(value, left, right)函数，返回个函数（也就是一棵非空树的表示），接受一个destructure()函数！
//执行EmptyTree()，返回一棵空树的表示，也接受一个destructure()函数
//destructure()要作为参数传进去，而且必须提供两个版本
//一些函数，可以被认为是它的方法（如果用OO的术语的话）
const treeRoot = tree => tree((value, left, right) => value, () => null);   //两个版本的destructure
const treeLeft = tree => tree((value, left, right) => left, () => null);
const treeRigth = tree => tree((value, left, right) => right, () => null);  //写完三个，理解了为啥叫destructure了
const treeIsEmpty = tree => tree(() => false, () => true);
//上面这个的意思就是如果传入的tree是个Tree的话，那么() => false就是destructure()，另一个被忽略了，那自然返回个false
//如果tree是个EmptyTree，那么右边的起作用，返回true

//下面是将tree转成个对象，自己开始写了下，还差不太远
const treeToObject = tree => tree(
  (value, left, right) => {
    const leftBranch = treeToObject(left);
    const rightBranch = treeToObject(right);
    let obj = { value };
    if (leftBranch) obj.left = leftBranch;
    if (rightBranch) obj.right = rightBranch;
    return obj;
  },
  () => null
);

const treeSearch = (tree, node) => tree(
  (value, left, right) => {
    if (value === node) return true;   //这种节点的比较也是用===  （下面的大小比较表明是普通值吧。后面有个用comparator的版本）
    // else return treeSearch(left, node) || treeSearch(right, node);  //这句是普通的树，书上说是二叉树，所以左边的都小的
    else node < value ? treeSearch(left, node) : treeSearch(right, node);
  },
  () => false
);

const treeInsert = (newValue, tree) =>
  tree(
    (value, left, right) =>
      newValue <= value
        ? Tree(value, treeInsert(newValue, left), right)
        : Tree(value, left, treeInsert(newValue, right)),
    () => Tree(newValue, EmptyTree(), EmptyTree())
  );

//所以，怎么初始化一棵树呢？
const myTree = Tree(
  22,
  Tree(
    9,
    Tree(4, EmptyTree(), EmptyTree()),
    Tree(12, EmptyTree(), EmptyTree())
  ),
  Tree(
    60,
    Tree(56, EmptyTree(), EmptyTree()),
    EmptyTree()
  )
);

let myTree2 = EmptyTree();
myTree2 = treeInsert(22, myTree);
myTree2 = treeInsert(9, myTree);
myTree2 = treeInsert(60, myTree);
myTree2 = treeInsert(12, myTree);
myTree2 = treeInsert(4, myTree);
myTree2 = treeInsert(56, myTree);