// type script 没有加减乘除，那么怎么做数值运算呢？
// 利用数组长度做计数 Array['length']
// 利用构造不同的数组通过取length的方式来实现计数

// ADD
// 判断长度是否extends, 如果不想相等的继续build arr
type BuildArrayS<
  Length extends number,
  Ele extends unknown = unknown,
  Arr extends unknown[] = []
> = Arr["length"] extends Length
  ? Arr
  : BuildArrayS<Length, Ele, [...Arr, Ele]>;

// 通过合并两个数组然后取length， 来实现Add
type Add<Num1 extends number, Num2 extends number> = [
  ...BuildArrayS<Num1>,
  ...BuildArrayS<Num2>
]["length"];

type AddRes = Add<1, 5>;

// Subtract 减法利用extends rest去取
// 适用于Num1 > Num2的情况
type Subtract<
  Num1 extends number,
  Num2 extends number
> = BuildArrayS<Num1> extends [...BuildArrayS<Num2>, ...infer Rest]
  ? Rest["length"]
  : never;

type SubtractRes = Subtract<5, 1>;

// Multiply 乘法, 真有趣 is funny right
type Multiply<
  Num1 extends number,
  Num2 extends number,
  ResultArr extends unknown[] = []
> = Num2 extends 0
  ? ResultArr["length"]
  : Multiply<Num1, Subtract<Num2, 1>, [...BuildArrayS<Num1>, ...ResultArr]>;

type MultiplyRes = Multiply<5, 1>;

// Divide 除法

type Divide<
  Num1 extends number,
  Num2 extends number,
  countArr extends unknown[] = []
> = Num1 extends 0
  ? countArr["length"]
  : Divide<Subtract<Num1, Num2>, Num2, [unknown, ...countArr]>;

type DivideResult = Divide<30, 6>;

// 加减乘除做完， 利用数组长度去实现计数
// 求字符串的长度的高级类型， 但是字符串类型不能取length

type str1 = "hi,stang";

type StrLen<
  Str extends string,
  CountArr extends unknown[] = []
> = Str extends `${string}${infer Rest}`
  ? StrLen<Rest, [unknown, ...CountArr]>
  : CountArr["length"];

type str1Length = StrLen<str1>;

// 每次通过模式匹配，提取去掉一个字符串之后的字符串, 然后存入CountArr，计算字符串的个数

// GreaterThan 可以计数了，就可以进行数值的比较
type GreaterThan<
  Num1 extends number,
  Num2 extends number,
  CountArr extends unknown[] = []
> = Num1 extends Num2
  ? false
  : CountArr["length"] extends Num2
  ? true
  : CountArr["length"] extends Num1
  ? false
  : GreaterThan<Num1, Num2, [...CountArr, unknown]>;

type GreaterThanRes = GreaterThan<1, 4>;

// FibonacciLoop数列

type FibonacciLoop<
  PrevArr extends unknown[],
  CurrentArr extends unknown[],
  IndexArr extends unknown[] = [],
  Num extends number = 1
> = IndexArr["length"] extends Num
  ? CurrentArr["length"]
  : FibonacciLoop<
      CurrentArr,
      [...PrevArr, ...CurrentArr],
      [...IndexArr, unknown],
      Num
    >;

type Fibonacci<Num extends number> = FibonacciLoop<[1], [], [], Num>;

type FibonacciRes = Fibonacci<20>;

/**
 * SUMMARY:
 * TYPESCRIPT没有加减乘除操作，但是我们通过数组类型的构造和提取， 然后取长度的方式来实现数值运算。
 *
 */
