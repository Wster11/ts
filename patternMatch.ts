type P = Promise<"stwang">;

// 利用extends 进行模式匹配做类型变量
// Typescript 类型的模式匹配是通过 extends 对类型参数做匹配，结果保存到通过 infer 声明的局部类型变量里，
// 如果匹配就能从该局部变量里拿到提取出的类型。
type PGetValueType<P> = P extends Promise<infer Value> ? Value : never;

type ValueType = PGetValueType<P>;

// 数组类型

// 获取数组第一个元素的类型
type Arr = [1, 2, 3];

type GetFirst<T> = T extends [infer First, ...unknown[]] ? First : never;

type FirstRes = GetFirst<Arr>;

/**
 * any 和 unknown的区别
 * any 和 unknown都表示任意类型， 但是unknown只能接收任意类型的值，
 * 而any除了可以接收任意类型的值，还可以赋值给任意类型的值（never除外）
 * 类型体操中，经常用unknown接收和匹配任何类型，很少把任意类型赋值给某个类型变量
 */

type GetLast<T> = T extends [...unknown[], infer Last] ? Last : never;

type LastRes = GetLast<Arr>;

type PopArr<T> = T extends []
  ? []
  : T extends [...infer Rest, unknown]
  ? Rest
  : never;

type PopRes = PopArr<Arr>;

type ShiftArr<T> = T extends []
  ? []
  : T extends [unknown, ...infer Rest]
  ? Rest
  : never;

type ShiftRes = ShiftArr<Arr>;

// 字符串类型

type StartWith<
  Str extends string,
  Prefix extends string
> = Str extends `${Prefix}${string}` ? true : false; // 请注意代表的是类型

type StartWithResult = StartWith<"stwang", "st">;

type Replace<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${Suffix}`
  : Str;

type ReplaceRes = Replace<"hello, world", "world", "stwang">;

type TrimStrRight<Str extends string> = Str extends `${infer Rest}${
  | " "
  | "\n"
  | "\t"}`
  ? TrimStrRight<Rest> // 循环调用
  : Str;

type TrimStrRightRes = TrimStrRight<"stwang    ">;

type TrimStrLeft<Str extends string> = Str extends `${
  | " "
  | "\n"
  | "\t"}${infer Rest}`
  ? TrimStrLeft<Rest>
  : Str;

type TrimStrLeftRes = TrimStrLeft<"   stwang">;

// TrimStrRight 和 TrimStrLeft结合就是Trim

type Trim<Str extends string> = TrimStrLeft<TrimStrRight<Str>>;

type TrimRes = Trim<"  stwang  ">;

// 函数也可以模式匹配

type GetParameters<Func extends Function> = Func extends (
  ...args: infer Args
) => unknown
  ? Args
  : never;

interface Params {
  name: string;
}

type GetName = (name: Params) => string;

type FuncParamsType = GetParameters<GetName>;

type GetReturnType<Func extends Function> = Func extends (
  unknown
) => infer ReturnType
  ? ReturnType
  : never;

type ReturnTypeRes = GetReturnType<GetName>;

class Stwangs {
  name: string;

  constructor() {
    this.name = "Stwangs";
  }

  hello(this: Stwangs) {
    return "hello, I'm " + this.name;
  }
}

const st = new Stwangs();
st.hello();
// call 调用的时候，this 就变了，但这里却没有被检查出来 this 指向的错误
st.hello.call({ xxx: 11 });
// 可以在方法声明时指定 this 的类型：

// 获取函数的this类型
type GetThisParams<T> = T extends (this: infer ThisType, ...args: any[]) => any
  ? ThisType
  : never;

type ThisResult = GetThisParams<typeof st.hello>;

// 构造器
// 构造器和函数的区别，构造器是用来创建对象的，所以可以被New
// 同样的我们可以用模式匹配提取构造器的参数和返回值类型

interface Person {
  name: string;
}

interface PersonConstructor {
  new (name: string): Person;
}

type GetInstanceType<Constructor extends new (...args: any) => any> =
  Constructor extends new (...args: any) => infer Instance ? Instance : never;

type Instance = GetInstanceType<PersonConstructor>;

type GetConstructorParams<T extends new (...args: any) => any> = T extends new (
  ...args: infer Args
) => any
  ? Args
  : never;

type InstanceParams = GetConstructorParams<PersonConstructor>;

// 索引类型
// 通过 keyof Props 取出 Props 的所有索引构成的联合类型
// 判断ref是否在其中

type GetRefProps<Props> = "ref" extends keyof Props
  ? Props extends { ref?: infer Value | undefined }
    ? Value
    : never
  : never;

type RefValue = GetRefProps<{ name: "stwang"; ref?: string }>;

/**
 * SUMMARY:
 *
 * TypeScript类型的模式匹配是通过类型extends的一个模式类型,
 * 把需要提取的部分放到通过infer声明的局部变量里，后面可以从这个
 * 局部变量拿到类型做后续各种类型处理
 *
 * 模式匹配在数组，字符串，函数，构造器，索引类型,Promise类型等各种类型中
 * 都有大量的应用！
 */
