/**
 * 原始数据类型
 */

// 布尔
let isDone: Boolean = false;
// 数值
let num: number = 12;
// 字符串
let str: string = "hello ts";
// 空值  js 没有空值(void)的概念 在ts中用void表示没有任何返回值的函数
function alertName(): void {
  alert("my name is stwang");
}
// 声明void变量没什么用 你只能将它赋值为null 或者 undefined
let empty: void = undefined;
let emptyNull: void = null;
// undefined 和 null 是所有类型的子类型 就是说 undefined 类型的变量，可以赋值给 number 类型的变量：
let u: undefined = undefined;
let n: null = null;

/**
 * 任意值类型
 * 如果是一个普通类型，在赋值过程中改变类型是不被允许的：
 * 在任意值上访问任何属性都是允许的和赋值
 */

let anyThing: any = "";

/**
 * 类型推倒
 * TypeScript 会在没有明确的指定类型的时候推测出一个类型，这就是类型推论。
 * 如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查：
 */

let likeNum = "seven"; // 初始化被赋值
likeNum = 8; // Type 'number' is not assignable to type 'string'

let myName; // 类型推倒为any
myName = 1;
myName = "stwang";

/**
 * 联合类型 Union Types
 * 表示取值可以为多种类型中的一种
 * 访问联合类型的属性或方法 只能访问此联合类型的所有类型里共有的属性或方法：
 * 联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型
 */

let unionTypes: string | number = 666;
unionTypes = "six six six";

function getSomething(something: number | string): string {
  return something.toString(); // 访问 string 和 number 的共有属性是没问题
}

/**
 * 对象的类型-----接口
 * 接口一般首字母大写
 * interface
 * 可选属性 ?
 * 任意属性 [propName: string]: any;
 * 只读属性 readonly ，只读的约束存在于第一次给{对象}赋值的时候，而不是第一次给只读属性赋值的时候：
 */

interface Person {
  readonly id: number;
  name: string;
  age?: number; // 可选属性
  [propName: string]: string | number; // 任意属性,当定义任意属性的时候 确定属性和可选属性得知需要是其的子类型
}

let tom: Person = {
  id: 0,
  name: "tom",
  age: 19
};

let amy: Person = {
  id: 1,
  name: "amy"
};

/**
 * 数组的类型
 * 在 TypeScript 中，数组类型有多种定义方式，比较灵活。
 * 数组的项中不允许出现其他的类型
 */

// 类型+中括号
let ageList: number[] = [6];
// 数组泛型
let list: Array<number> = [6];
// 接口数组
interface NumberArray {
  [index: number]: number;
}
let numList: NumberArray = [1, 2];
// 类数组（Array-like Object）不是数组类型，比如 arguments：
// 事实上常用的类数组都有自己的接口定义，如 IArguments, NodeList, HTMLCollection 等
interface Arg {
  [index: number]: number;
  length: number;
  callee: Function;
}

function sum() {
  // arguments 实际上是一个类数组，不能用普通的数组的方式来描述，而应该用接口
  let arg: Arg = arguments;
}

//any 在数组中的应用
let ls: any[] = ["xcatliu", 25, { website: "http://xcatliu.com" }];

/**
 * 函数的类型
 * 不过事实上，上面的代码只对等号右侧的匿名函数进行了类型定义，而等号左边的 mySum，
 * 是通过赋值操作进行类型推论而推断出来的。
 */

// 函数声明
function des(a: number, b: number) {
  return a - b;
}
// 函数表达式
let desFunc = function (a: number, b: number) {
  return a - b;
};

// 注意，输入多余的（或者少于要求的）参数，是不被允许的
// des(1,2,3)

// 如果需要我们手动给 desFunc 添加类型，则应该是这样：
// 注意不要混淆了 TypeScript 中的 => 和 ES6 中的 =>。
// 在 TypeScript 的类型定义中，=> 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。
// 在 ES6 中，=> 叫做箭头函数，应用十分广泛，

// 采用函数表达式|接口定义函数的方式时，对等号左侧进行类型限制，
// 可以保证以后对函数名赋值时保证参数个数、参数类型、返回值类型不变。
let desF: (a: number, b: number) => number = function (a: number, b: number) {
  return a - b;
};

// 接口定义函数
interface SourceFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SourceFunc = function (a: string, b: string) {
  return a.search(b) !== -1;
};

// 可选参数
// 需要注意 可选参数后面不允许再出现必需参数
function buildName(firstName: string, lastName?: string) {
  return firstName + lastName;
}

buildName("Wang");

// 参数默认值
function getName(firstName: string, lastName: string = "Cat") {
  return firstName + lastName;
}

getName("Wang");

// 剩余参数
// ES6 中，可以使用 ...rest 的方式获取函数中的剩余参数（rest 参数）：
// 事实上，items 是一个数组。所以我们可以用数组的类型来定义它：
function push(array: any[], ...items: any[]) {
  items.forEach(function (item) {
    array.push(item);
  });
}

let a: any[] = [];
push(a, 1, 2, 3);

// 函数重载 重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。

// 利用联合类型实现 缺点 就是不能够精确的表达，输入为数字的时候，输出也应该为数字，
// 输入为字符串的时候，输出也应该为字符串
function reverse(x: string | number): string | number | void {
  if (typeof x === "number") {
    return Number(x.toString().split("").reverse().join(""));
  } else if (typeof x === "string") {
    return x.split("").reverse().join("");
  }
}
// 使用重载定义多个 reverse 的函数类型：
function reverses(x: string): string;
function reverses(x: number): number;
// 函数的实现
function reverses(x: string | number): string | number | void {
  if (typeof x === "number") {
    return Number(x.toString().split("").reverse().join(""));
  } else if (typeof x === "string") {
    return x.split("").reverse().join("");
  }
}

/**
 * 类型断言
 * 值 as 类型
 * <类型> 值
 * 在 tsx 语法（React 的 jsx 语法的 ts 版）中必须使用前者，即 值 as 类型。
 * 统一使用 值 as 类型 这样的语法
 */

// 用途

// 将联合类型断言为其中的一个类型
// 当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，
// 我们只能访问此联合类型的所有类型中共有的属性或方法：

interface Cat {
  name: string;
  run(): void;
}

interface Fish {
  name: string;
  swim(): void;
}

function getAnName(x: Cat | Fish) {
  return x.name; // 只能获取其共有属性
}

// 而有时候，我们确实需要在还不确定类型的时候就访问其中一个类型特有的属性或方法
// 使用类型断言，将 x 断言成 Fish： 这样就可以解决访问 animal.swim 时报错的问题了。
// 需要注意的是，类型断言只能够「欺骗」TypeScript 编译器，
// 无法避免运行时的错误，反而滥用类型断言可能会导致运行时错误：

function isFish(x: Cat | Fish) {
  if (typeof (x as Fish).swim === "function") {
    return true;
  }
  return false;
}

// 将一个父类断言为更加具体的子类

// 类继承
class ApiError extends Error {
  code: number = 0;
}

class HttpError extends Error {
  statusCode: number = 200;
}
// 接口继承
interface ApiError extends Error {
  code: number;
}
interface HttpError extends Error {
  statusCode: number;
}

// 接口继承只能用类型断言 类继承还可以用instanceof
function isApiError(error: Error) {
  if (typeof (error as ApiError).code === "number") {
    return true;
  }
  return false;
}

// 将任何一个类型断言为 any
// 理想情况下，TypeScript 的类型系统运转良好，每个值的类型都具体而精确。
// 当我们引用一个在此类型上不存在的属性或方法时，就会报错：

//但有的时候，我们非常确定这段代码不会出错，比如下面这个例子：

(window as any).a = "a";

// 它极有可能掩盖了真正的类型错误，所以如果不是非常确定，就不要使用 as any。

// 总结
// 联合类型可以被断言为其中一个类型
// 父类可以被断言为子类
// 任何类型都可以被断言为 any
// any 可以被断言为任何类型

// 类型断言 VS 类型声明

function getData(key: string): any {
  return (window as any).cache[key];
}

interface Dog {
  name: string;
  bark(): void;
}

let xh = getData("dog") as Dog; // 我们使用 as Dog 将 any 类型断言为了 Dog 类型。

xh.bark();

// 类型声明的方式将 xb 声明为 Dog，然后再将 any 类型的 getCacheData('tom') 赋值给 Dog 类型的 xb
let xb: Dog = getData("dog");
xb.bark();

// xh xb 在接下来的代码中都变成了 Cat 类型。

// 区别

interface Animal {
  name: string;
}
interface Cat {
  name: string;
  run(): void;
}

const animal: Animal = {
  name: "toms"
};
// let toms1:Cat = animal  //Property 'run' is missing in type 'Animal' but required in type 'Cat'.
let toms = animal as Cat;

// 深入的讲，它们的核心区别就在于：

// animal 断言为 Cat，只需要满足 Animal 兼容 Cat 或 Cat 兼容 Animal 即可
// animal 赋值给 tom，需要满足 Cat 兼容 Animal 才行

// 类型断言 vs 泛型

// 泛型 是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。
// 通过给 getCacheData 函数添加了一个泛型 <T>，
// 我们可以更加规范的实现对 getCacheData 返回值的约束，
// 这也同时去除掉了代码中的 any，是最优的一个解决方案。
function getCacheData<T>(key: string): T {
  return (window as any).cache[key];
}

interface Cat {
  name: string;
  run(): void;
}

const xm = getCacheData<Cat>("xm");
xm.run();

// 内置对象
// ECMAScript 的内置对象 Error Boolean Date RegExp等
// DOM 和 BOM 的内置对象 Document HTMLElement Event NodeList等 

