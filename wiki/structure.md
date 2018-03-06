# vue structure

> vue 结构

## `seed` vue instance.

### public property
  - `destroy`
  - `scope` outer interface
  - `scope.$[methods]` awful assignment by preference
    * $seed
    * $destroy
    * $dump
    * $on
    * $emit
    * $index
    * $parent

### inner property
  - `_bindings`
  - `_options` config some options
  - `_dump`


## `bindings` vue inner copy
  - 保存vue所有的data。 `bindings[key].value`
  - 保存data和directive之间的关系. `bindings[key].directives`
  - 保存data和依赖于data的directive的关系. `bindings[key].depencies`

## `directives` 指令： 数据和视图之间的桥梁
  - `update` 更新视图。 包括更新页面的显示， 更新dom事件绑定。 被动更新视图，当指令绑定的数据重新赋值的时候触发更新
  - `bind` 绑定视图，通常做初始化操作。但是使用是在seed.js里。
  - `refresh` 刷新视图。 主动刷新视图。由代码逻辑主动触发视图更新
  - `filters`

## `filters` 过滤器
  - 对于接收的参数做一个前置的处理
