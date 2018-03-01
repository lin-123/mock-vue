# scope handler

## [5acc8a29] computed properties!!!

- each should notify user when call array method such as push, pop, shift etc.
- set up a chain for data dependency. dependency will be trigger when then source data update
- 通过注册依赖directive来实现指定的更新。 对于each的array有watch array方法可以监控。 对于each里面的CheckBox怎么监控它的变化的。

## [88513c07] array watcher

- better array watcher. just update dom fragement which's data source changed
- [x] done

## my mistake
- [x] set seed data by set object reference other than copy by object property
- [x] fix seed.destroy
``` javascript
destroy() {
  // 这里有问题， 把scope也删掉了
  // clean scene: call directives unbind
  for( let bindKey in this._bindings) {
    this._bindings[bindKey].directives.forEach(directive => {
      if(!directive.unbind) return;
      directive.unbind()
    })
    // cannot delete this, beacuse this scope varaible bind
    // delete this._bindings[bindKey]
  }

  if(this._options.parentSeed) delete this._options.parentSeed[constance.child + this.el.id]
  // rm dom
  this.el.parentNode.removeChild(this.el)
}
```

## [ca62c95a] break directives into individual files
- [x] break directives into individual files


## [52272487] event delegation in sd-each
> [javascript: 事件委托解析](http://www.imooc.com/article/16468)
- [ ] delegate event to current seed's parentNode which in sd-each
  * [x] no seed.each parameter
  * [ ] cannot check delegate


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

