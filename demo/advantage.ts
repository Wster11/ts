/**
 * 类型别名  常用于联合类型
 **/
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;

function getName(n: NameOrResolver): Name {
  if (typeof n === "string") {
    return n;
  } else {
    return n();
  }
}

/**
 * 字符串字面量类型 字符串字面量类型用来约束取值只能是其中字符串的某一个
 * 注意类型别名和字符串字面量类型都是用type 关键字定义
 */
type EventNames = "click" | "touch" | "scroll";

function handleEvent(ele: Element, event: EventNames) {
  // do something
}

handleEvent(document.getElementById("id"), "dbclick"); // error dbclick": Unknown word
handleEvent(document.getElementById("app"), "click"); // 上例中，我们使用 type 定了一个字符串字面量类型 EventNames，它只能取三种字符串中的一种。

/**
 * 元组（Tuple）
 * 数组合并了相同类型的对象，元组合并了不通类型的对象
 */

let adTom: [number, string] = [12, "tom"];

// 当赋值或访问一个已知索引的元素时，会得到正确的类型：

let tupTom: [number, string];
tupTom[0] = 12;
tupTom[1] = "tom";

tupTom[0].toFixed(2);
tupTom[1].slice(1);

// 也可以只赋值其中一项
tupTom[0] = 18;
// 但是当直接对元组类型的变量进行初始化或者赋值的时候，需要提供所有元组类型中指定的项

// 越界的元素  当添加越界的元素时，它的类型会被限制为元组中每个类型的联合类型：

tupTom.push(true); //  type 'boolean' is not assignable to parameter of type 'string | number'

/**
 * 枚举
 * Enum
 * 枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定为红绿蓝等。
 * 使用enum 关键字定义
 */

enum Days {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat
}

// 枚举成员会从0开始赋值

console.log(Days["Mon"] === 1);

// 手动赋值

enum Types {
  Error = 0,
  Success = 200,
  Break // 未手动赋值的枚举项会接着上一个枚举项递增。
}

console.log(Types.Success, Types);

// 常数项 constant member 和计算所得项 computed member

enum Color {
  Red,
  Yellow,
  Blue = "blue".length
}

// 常量枚举

const enum Direction {
  Left,
  Right,
  Down,
  Up
}

// 常数枚举与普通枚举的区别是，它会在编译阶段被删除，并且不能包含计算成员。

const enum Size {
  Big,
  Small,
  Normal = "normal".length // const enum member initializers can only contain literal values and other computed enum values
}

// 外部枚举
// declare 定义的类型只会用于编译时的检查，编译结果中会被删除。
// 同时使用 declare 和 const 也是可以的：
// 外部枚举与声明语句一样，常出现在声明文件中。

declare enum Directions {
  Up,
  Down,
  Left,
  Right
}

var directions = [Directions.Down, Directions.Up];

console.log(directions);

/**
 * 类 Class
 */

// ES6中类的用法
// 使用 class 定义类，使用 constructor 定义构造函数。

// 原生属性和方法
class Animal {
  public name: string;
  constructor(name) {
    this.name = name;
  }
  sayHi() {
    return `my name is ${this.name}`;
  }
}

let an = new Animal("jack");
an.sayHi();

// 类的继承 使用extends实现继承, 子类调用super关键字来调用父类的构造函数和方法

class Cat extends Animal {
  constructor(name) {
    super(name); // 调用父类的constructor构造函数
    console.log(this.name);
  }
  say() {
    console.log("Meow", super.sayHi());
  }
}

let c = new Cat("tom");
c.say();

// 存取器
// 使用getter和 setter可以改变属性的赋值和读取行为

class Car {
  constructor(name) {
    this.name = name;
  }
  get name() {
    return "Jack";
  }
  set name(value) {
    console.log("setter: " + value);
  }
  static isCar(car) {
    // 使用static定义的方法为为静态方法，他们不需要实例化，而是直接通过类来调用
    return car instanceof Car;
  }
}

let car = new Car("car");
car.name; // jack
car.name = "stwang"; // setter stwang

// 静态方法 static
Car.isCar(car);

// ES7中类的用法

// 实例属性

// ES6中的实例属性只能通过this.xxx = ''来定义
// ES7 可以直接在类里面定义
// class Animal {
//   name = 'Jack';

//   constructor() {
//     // ...
//   }
// }

// let a = new Animal();
// console.log(a.name); // Jack

// 静态属性

// static name = ''

/**
 * ts中类的用法
 */

// public private 和 protected

// ts提供3中修饰符 分别是 public、private 和 protected

// public 的属性是公有的，在任何地方都可以访问到，默认所有属性和方法都是public

// private 修饰的属性和方法是私有的, 不能在声明他的类的外部使用

// protected 修饰的属性和方法是受保护的，和private类似，区别是他在子类中也可以访问

class Person {
  public name: string;
  private code: string;
  protected sex: string;
  public constructor(name, code) {
    this.name = name;
  }
}

let stwang = new Person("stwang", "130");
stwang.name; // stwang
stwang.name = "tom"; // 上面的例子中，name 被设置为了 public，所以直接访问实例的 name 属性是允许的。
stwang.code; // Property 'code' is private and only accessible within class
stwang.sex; // Property 'sex' is protected and only accessible within class 'Person' and its

class Black extends Person {
  constructor(name, code) {
    super(name, code);
    this.code; // Property 'code' is private and only accessible within class
    this.sex; // protected 修饰的属性可以在子类访问
  }
}

// private constructor 表示该类不可以被实例化

// protected constructor 表示该类只可以被继承

// 参数属性

// readonly 只读属性关键字，只允许出现在属性声明或索引签名或构造函数中。
// readonly name
// 注意如果 readonly 和其他访问修饰符同时存在的话，需要写在其后面。

// public readonly name

// 抽象类
// 抽象类不允许实例化
// abstract 用于定义抽象类和其中的抽象方法。
// 抽象类中的抽象方法必须由子类实现

abstract class Ai {
  public name;
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

// sayHi 方法必须由子类实现
class Bi extends Ai {
  constructor(name) {
    super(name);
  }
  sayHi() {}
}

// 类的类型

class Req {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
  sayHi(): string {
    return `${this.name} say hi`;
  }
}

let req: Req = new Req("bi");
