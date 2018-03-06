# 问题列表

> TODO list 做完了。 发现了一些问题。

## 复杂的对象引用

- 对象的引用赋值太多，太乱。 比如：
  * 在scope里引用了 seed
  * 在directive中引用了seed
  * 在seed

## 单个对象的方法太过冗长。 seed.js directive-parser.js

- seed.js 文件200多行。 作者的seed.js文件长达384行
- directive-parser文件也100多行。
- 导致的问题就是单个文件承载了太多逻辑， 逻辑膨胀无法理解。
- 主要问题在seed.js

## 混乱的对象方法赋值和调用。

- directive
  * directive-parser 里给directive赋值
  * seed里面也给directive赋值。
  * 方法的调用也是比较混乱。 有时候在directive文件，有时候在seed.js

- seed._bindings[key].refreshDependencies 调用
  * seed.js 里有
  * each.js 中也有

