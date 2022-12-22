// 联合类型可简化

type Union = "a" | "b" | "c";

type UnionUpperCaseA<Item extends string> = Item extends "a"
  ? Uppercase<Item>
  : Item;

type UnionA = UnionUpperCaseA<Union>;

// 可以看到我们的参数约定为string, 条件判断中的类型也为 'a',  但是传入的为联合类型.
// 这就是typescript对联合类型在条件类型使用时的特殊处理，会把联合类型的每一个类型传入，做类型运行，最后合并返回
// 这和联合类型遇到字符串时的处理一样：

type UnionStr = `${Union} str`; // 每个元素单独处理，合并str

// typescript之所以这样处理联合类型也是容易理解的，因为联合类型的每个元素都是互不相关的，

// CamelCaseUnion

type CamelcaseUnion<Item extends string> =
  Item extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${CamelcaseUnion<Rest>}`
    : Item;

type strCamel = CamelcaseUnion<"aa_bb_cc_dd">;

type unionCamel = CamelcaseUnion<"a_a" | "b_b" | "c_c" | "d_d">;

// 没错，对联合类型的处理和对单个类型的处理没什么区别
// TypeScript 会把每个单独的类型拆开传入。不需要像数组类型那样需要递归提取每个元素做处理。

type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never;

// A extends A 主要是为了触发分布式条件类型, 让A的每个类型单独传入
// [B] extends [A] 这样不直接写 B 就可以避免触发分布式条件类型，那么 B 就是整个联合类型。
// B 是联合类型整体，而 A 是单个类型，自然不成立，而其它类型没有这种特殊处理，A 和 B 都是同一个，怎么判断都成立。
// 其中有两个点比较困惑，我们重点记一下：

// 当 A 是联合类型时：

// A extends A 这种写法是为了触发分布式条件类型，让每个类型单独传入处理的，没别的意义。

// A extends A 和 [A] extends [A] 是不同的处理，前者是单个类型和整个类型做判断，后者两边都是整个联合类型，因为只有 extends 左边直接是类型参数才会触发分布式条件类型。
// [B] extends [A] 如果相同的话，表示A、B一样，A则没有触发分布式条件类型，A就不是联合类型
// 理解了这两点，分布式条件类型就算掌握了。

//是不是在心里会问：什么鬼？这段逻辑是啥？

//这就是分布式条件类型带来的认知成本。

type IsUnionRes = IsUnion<"1" | "2" | "3">;
type IsUnionRes1 = IsUnion<[1, 2, 3]>;

type TestUnion<A, B = A> = A extends A ? { a: A; b: B } : never;
type TestUnionRes = TestUnion<"a" | "b">;
// AB 都是联合类型，为什么值还不一样？
// 因为条件类型中如果左边的类型是联合类型，会把每一个元素单独传入做计算，而右边则不会
// 所以 A 是 'a' 的时候，B 是 'a' | 'b'， A 是 'b' 的时候，B 是 'a' | 'b'

type BEM<
  Block extends string,
  Element extends string[],
  Modifiers extends string[]
> = `${Block}__${Element[number]}--${Modifiers[number]}`;

type BemRes = BEM<"cui", ["button", "switch"], ["chat"]>;

// 数组转联合类型的写法
type union = ["aaa", "bbb"][number];

// 全排列组合
// AllCombinations
// 希望传入 'A' | 'B' 的时候，能够返回所有的组合： 'A' | 'B' | 'BA' | 'AB'。

// 这种只能实现22组合
// 任何两个类型的组合有四种：A、B、AB、BA
// 然后构造出来的字符串再和其他字符串组合。
type Combinations<A extends string, B extends string> =
  | A
  | B
  | `${A}${B}`
  | `${B}${A}`;

type CombinationsRes = Combinations<"AB", "CD">;

// 所以全组合的高级类型就是这样：
// 这里利用到了分布式条件类型的特性，通过 A extends A 来取出联合类型中的单个类型。
type AllCombinations<A extends string, B extends string = A> = A extends A
  ? Combinations<A, AllCombinations<Exclude<B, A>>>
  : never;

type ALl = AllCombinations<"A" | "B" | "C">;

/**
 * SUMMARY
 *
 * 联合类型中的每个类型都是相互独立的, TypeScript对他做了特殊处理，也就是遇到了字符串类型，
 * 条件类型时，会把每个元素单独传入做计算，最后把每个类型的计算结果合并成联合类型。
 *
 * 条件类型左边是联合类型的时候就会触法这种处理，叫做分布式条件类型。
 *
 * 有两点特别要注意：
 * A extends A 不是没意义，意义是取出联合类型中的单个类型放入 A
 * A extends A 才是分布式条件类型， [A] extends [A] 就不是了，只有左边是单独的类型参数才可以。
 */
