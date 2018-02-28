# scope handler

## [ca62c95a] break directives into individual files
- [x] break directives into individual files

## [52272487] event delegation in sd-each
> [javascript: 事件委托解析](http://www.imooc.com/article/16468)
- [] delegate event to current seed's parentNode which in sd-each
  * no seed.each parameter


## [6d81bff63] compute value
> when todos array method be called, should refresh scope.todos bindings.
> directive value support function.

- [x] sd-text="function", will call function before
- [x] fix sd-each scope error

## [6d81bff63] better unbind/destroy
> clear all the memery of this vm
> so should bind this vm values to api

- [x] just delete some value. dont know how to detect

## [f1ed54bc8] nest controller

> multiple root controllers page can exist in one page
> a root controller can have many components

- [x] traversal root controller
- [x] recusive child controller, and new Seed instance
- [x] get parent scope data and root scope data

## [a6b7257] todo demo kinda works

- [x] add sd-checked directive
- [ ] fix each checkbox status not sync to parent seed todos
- [x] fix filter no arg

## [1d7a94e] emmitter
- `npm install component-emitter`
- update webpack.config.js
  ```
  ...
  const webpackConfig = {
    ...
    resolve: {
      alias: {
        'emitter$': 'component-emitter',
      }
    },
    ...
  }
  ...
  ```
- test emitter

## [08e7992] scope communication
- can use class extends, extends parent scope -- better
- [x] todo controller call todolist controller method
  * if child controller call parent controllers method, should bind to parent seed

## change format for directive class blabla

- [x] sd-on-click="changeMessage" => sd-on="click:changeMessage"
- [x] sd-controller and sd-each working

## add method to each directive

- [x] cache controllers
- [x] mount controllers when Seed bootstap

## todollist

- add method to components
  * [x] todo list add click listener

- directive
  * [x] add scope

- filters
  * [x] multiple filters

- 数据的遍历： v-for 仔细看
  * [x] 创建子的seed类来实现
  * [x] watch array

- data build and binding
  * [x] traversal by directive name, have bugs
  * [x] traversal by recusion dom, perfect

