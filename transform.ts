// 类型别名
type ttt = Promise<number>;

// infer用于类型提取, 然后存到一个变量，相当于局部变量

type GetValueType<P> = P extends Promise<infer Value> ? Value : never;

type ValueRes = GetValueType<Promise<1000>>;

// 类型参数用于接受具体的类型, 在类型运算中也相当于局部变量

type isTwo<T> = T extends number ? true : false;

type Two = isTwo<"222">;

// 但是，严格来说这三种也都不叫变量，因为它们不能被重新赋值, 不能按变量比较

// TypeScript 的 type、infer、类型参数声明的变量都不能修改，想对类型做各种变换产生新的类型就需要重新构造。

/**
 * 数组类型重新构造
 */

// push
type Push<Arr extends unknown[], Ele> = [...Arr, Ele];

type PushRes = Push<[1, 2, 3], 4>;

// splice

type UnShift<Arr extends unknown[], Ele> = [Ele, ...Arr];

type UnShiftRes = UnShift<[2, 3, 4], 1>;

type tuple1 = [1, 2];

type tuple2 = ["bei", "jing"];

// expected [[1,'bei'], [2, 'jing']]

type Zip<
  One extends [unknown, unknown],
  Two extends [unknown, unknown]
> = One extends [infer OneFirst, infer OneSecond]
  ? Two extends [infer TwoFirst, infer TwoSecond]
    ? [[OneFirst, TwoFirst], [OneSecond, TwoSecond]]
    : []
  : [];

type ZipRes = Zip<tuple1, tuple2>; // good

type tuple3 = ["1", "2", "3"];

type tuple4 = ["hello", "world", "!"];

// 递归调用构造新类型
type Zip2<One extends unknown[], Two extends unknown[]> = One extends [
  infer OneFirst,
  ...infer OneRest
]
  ? Two extends [infer TwoFirst, ...infer TwoRest]
    ? [[OneFirst, TwoFirst], ...Zip2<OneRest, TwoRest>]
    : []
  : [];

type Zip2Res = Zip2<tuple3, tuple4>;

/**
 * 字符串类型重新构造
 */

// type stwang to Stwang

type CapitalizeStr<Str extends string> = Str extends `${infer A}${infer Rest}`
  ? `${Uppercase<A>}${Rest}`
  : Str;

type Stwang = CapitalizeStr<"stwang">;

// 从已有的字符串类型提取出一部分字符串，经过一些系列转换,构造成一个新的字符串类型
//  sttest_sttest_sttest to sttestSttestSttest

type CamelCase<Str extends string> =
  Str extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${CamelCase<Rest>}`
    : Str;

type CamelRes = CamelCase<"sttest_sttest_sttest">;

// DropSubStr 可以修改自然可以删除

type Hello = "Hello Typescript World";

type Sub = "Typescript";

type DropSubStr<
  Str extends string,
  Sub extends string
> = Str extends `${infer Prefix}${Sub}${infer Suffix}`
  ? `${Prefix}${Suffix}`
  : Str;

type DropSubStrRes = DropSubStr<Hello, Sub>;

// 函数重新构造

type getName = (name: string) => string;

// 类型参数Func是待处理的函数类型, Arg为需要添加的参数类型
// 通过模式匹配提取参数到infer声明的局部变量Args, 提取返回值变量到ReturnType中

type AppendArgument<Func extends Function, Arg> = Func extends (
  ...args: infer Args
) => infer ReturnType
  ? (...args: [...Args, Arg]) => ReturnType
  : never;

type getInfo = AppendArgument<getName, string>;

// 索引类型重新构造

type Mapping<Obj extends object> = {
  // 每个属性都会经过这个构造, 注意是类型
  [Key in keyof Obj]: [Obj[Key], Obj[Key], Obj[Key]];
};

type MapRes = Mapping<{
  a: 1;
  b: 2;
}>;

// UppercaseKey

type UppercaseKey<Obj extends object> = {
  // 除了可以对Value进行修改，也可以对Key进行修改，使用as, 这叫做重映射
  // Key & string, 取Key的类型为string的
  [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key];
};

type UpperKeyRes = UppercaseKey<{ name: "sttest"; age: "27" }>;

// TypeScript 提供了内置的高级类型 Record 来创建索引类型：指定Key为string的进行转换
type UppercaseKeyWithRecord<Obj extends Record<string, any>> = {
  [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key];
};

type UppercaseKeyWithRecordRes = UppercaseKeyWithRecord<{
  name: "name";
  age: 20;
  10: "10";
}>;

// ToReadonly
type ToReadonly<Obj> = {
  readonly [Key in keyof Obj]: Obj[Key];
};

type ReadOnlyRes = ToReadonly<[1, 2, 3, 4]>;

// ToPartial 可选

type ToPartial<Obj> = {
  [Key in keyof Obj]?: Obj[Key];
};

type ToPartialRes = ToPartial<{ name: "stwang"; age: 19 }>;

// ToMutable

type ToMutable<T> = {
  -readonly // 移除readOnly属性
  [Key in keyof T]: T[Key];
};

type ToMutableRes = ToMutable<{
  readonly name: string;
  age: number;
}>;

type ToRequired<T> = {
  [Key in keyof T]-?: T[Key];
};

type ToRequiredRes = ToRequired<{
  name?: string;
  age?: number;
}>;

// 过滤值的类型
type FilterByValueType<Obj extends Record<string, any>, ValueType> = {
  [Key in keyof Obj as Obj[Key] extends ValueType ? Key : never]: Obj[Key];
};

interface Person {
  name: string;
  age: number;
  hobby: string[];
}

type FilterResult = FilterByValueType<Person, string | number>;

/**
 * SUMMARY:
 * 
 * TypeScript支持type、infer、类型参数来保存任意类型，相当于变量的作用
 * 但也其实不能叫做变量，因为他们是不可变的，除非构造出新的类型，并且可以在
 * 构造类型的过程中，对原类型进行一些过滤和变换。
 * 
 * 数组、字符串、函数、索引类型等都可以用这种方式对原类型做变换产生新的类型。
 * 其中索引类型有专门的语法叫做映射类型，对索引做修改的 as 叫做重映射。
 * 
 */

