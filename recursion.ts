// 递归循环做复用

type test = Promise<Promise<Promise<Record<string, any>>>>;

// 递归就是把问题分解成很小的部分，通过函数不断调用自身来解决一个个小问题，直到满足条件是就完成了问题的求解

// Promise递归

type DeepPromiseValueType<P extends Promise<unknown>> = P extends Promise<
  infer ValueType
>
  ? ValueType extends Promise<unknown>
    ? DeepPromiseValueType<ValueType>
    : ValueType
  : never;

// 简写, T为传入进来的类型参数，不再约束类型参数必须是 Promise，这样就可以少一层判断。
type DeepPromiseValueTypeS<T> = T extends Promise<infer ValueType>
  ? DeepPromiseValueTypeS<ValueType>
  : T;
// 获取到PValueType的值为string
type PValueType = DeepPromiseValueType<
  Promise<Promise<Promise<Record<string, number>>>>
>;

// 数组类型递归
type arr = [1, 2, 3, 4, 5, 4, "sttest"];

// 数组提取重新构造，对数组数量有限制
type ReverseArr<Arr extends unknown[]> = Arr extends [
  infer One,
  infer Two,
  infer Three,
  infer Four,
  infer Five
]
  ? [Five, Four, Three, Two, One]
  : never;

// 递归来实现数组数量不定的类型参数, 每次传入的Arr都是反转一位数字的
type ReverseArrS<Arr extends unknown[]> = Arr extends [infer One, ...infer Rest]
  ? // 循环调用反转数组
    [...ReverseArrS<Rest>, One]
  : Arr;

type ReverseArrType = ReverseArrS<[1, 2, 3]>;

// 判断两个类型相同
type IsEqual<A, B> = (A extends B ? true : false) &
  (B extends A ? true : false);

// Includes查找是否包含某个元素, 在ts中类型比较要用extends判断是否相同
type Includes<Arr extends unknown[], FindItem> = Arr extends [
  infer One,
  ...infer Rest
]
  ? IsEqual<One, FindItem> extends true
    ? true
    : Includes<Rest, FindItem>
  : false;

type IncludeResult = Includes<arr, 4>;

// 删除数组中的类型， 存在多个都删除, ts中用extends 判断两个类型是否相同
type RemoveItem<
  Arr extends unknown[],
  Item,
  Result extends unknown[] = []
> = Arr extends [infer First, ...infer Rest]
  ? IsEqual<First, Item> extends true
    ? RemoveItem<Rest, Item, Result>
    : RemoveItem<Rest, Item, [...Result, First]>
  : Result;

type RemoveItemResult = RemoveItem<arr, 4>;

// Build Array
type BuildArray<
  Len extends number,
  Ele = unknown,
  Arr extends unknown[] = []
> = Arr["length"] extends Len ? Arr : BuildArray<Len, Ele, [...Arr, Ele]>;

type FiveArray = BuildArray<5>;

// 字符串类型递归
// 这种方式只能替换单个
type ReplaceStr<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${Suffix}`
  : Str;

type Str = ReplaceStr<"stwang", "n", "w">;

// 在类型体操里, 遇到数量不确定的问题，要条件反射的想到递归

type ReplaceAll<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${ReplaceAll<Suffix, From, To>}`
  : Str;

type name = "stwang stwang stwang";

// 把所有的s换成w
type ReplaceName = ReplaceAll<name, "s", "w">;

// StringToUnion  'abcd' => a | b | c |d
// 字符串转联合类型， 相同的字符串会合并
type stwang = "abcd";

type ToUnion<Str extends string> =
  Str extends `${infer One}${infer Two}${infer Three}${infer Four}`
    ? One | Two | Three | Four
    : never;

type stwangUnion = ToUnion<stwang>;

// 数量不确定的情况下要用递归实现， 一个一个的去处理

type ToUnionS<Str extends string> = Str extends `${infer First}${infer Rest}`
  ? First | ToUnionS<Rest>
  : never;

type StrToUnionS = ToUnionS<"stwang">;

// ReverseStr 字符串反转, 这里不是很好理解
// `${ReverseStr<Rest, `${First}${Result}`>}`，会递归执行，直到满足条件后返回Result
type ReverseStr<
  Str extends string,
  Result extends string = ""
> = Str extends `${infer First}${infer Rest}`
  ? `${ReverseStr<Rest, `${First}${Result}`>}`
  : Result;

type ReverseRes = ReverseStr<"stwang123">;

// 对象的递归
// 单层对象增加readonly修饰符
type ToReadonlyS<T> = {
  readonly [Key in keyof T]: T[Key];
};

type ReadOnlyObj = ToReadonlyS<{ name: string; sex: 0 | 1 }>;

// 如果索引类型的层数不确定，就要想到递归
// 因为 ts 的类型只有被用到的时候才会做计算。
// 所以可以在前面加上一段 Obj extends never ? never 或者 Obj extends any 等，从而触发计算：

type DeepReadOnly<Obj extends Record<string, any>> = Obj extends any
  ? {
      readonly [Key in keyof Obj]: Obj[Key] extends object
        ? Obj[Key] extends Function
          ? Obj[Key]
          : DeepReadOnly<Obj[Key]>
        : Obj[Key];
    }
  : never;

type DeepObjReadOnly = DeepReadOnly<{
  name: {
    info: {
      age: string;
    };
  };
}>;

/**
 * SUMMARY:
 * 递归是把问题分解成一个个子问题，通过解决一个个子问题来解决问题， 形式就是
 * 不通过不断的调用函数自身，直到满足条件即可。
 *
 * 在ts中，高级类型也支持递归，遇到数量不确定的问题 要条件反射的想到递归
 * 高级类型的特点是传入类型参数，经过一系列类型运算逻辑后，返回新的类型。
 */
