// 给对象下的每一层增加扩展属性

type Obj = {
  age: number;
  name: string;
  info: {
    nick: string;
  };
};

// let a: Obj = {
//   age: 123,
//   name: 'syring',
//   sex: 0 // 添加新属性会报错
// }

// 单层的话，可以添加[key: string]: any 或者 & Record<string, any>
// 多层对象需要遍历

type DeepRecords<Obj extends Record<string, any>> = {
  [Key in keyof Obj]: Obj[Key] extends Record<string, any>
    ? DeepRecord<Obj[Key]> & Record<string, any>
    : Obj[Key];
} & Record<string, any>;

type DeepRecord<Obj extends Record<string, any>> = {
  [key in keyof Obj]: Obj[key] extends Record<string, any>
    ? DeepRecord<Obj[key]> & Record<string, any>
    : Obj[key];
} & Record<string, any>;

type A = DeepRecord<Obj>;

// 可索引签名可以让索引类型扩展任意数量的符合签名的索引，如果想给任意层级的索引每层都加上可索引签名就要递归处理了。



type test = keyof any;

// 当需要枚举很多种类型可能性的时候, 可以谁用类型动态编程生成。
type GenerateType<Keys extends keyof any> = {
  [Key in Keys]: {
    [Key2 in Key]: "desc" | "asc";
  } & {
    [Key3 in Exclude<Keys, Key>]: false;
  };
}[Keys];

type S = GenerateType<"name" | "age" | "sex">;

let s: S = {
  age:'asc',
  name: false,
  sex: false
}
