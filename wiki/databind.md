# vue 数据绑定原理

  > 数据绑定模块。最通俗的就是大家都知道的`Object.defineProperty`。但是这个只是vue最最基础的数据绑定。它实现了最原始的从data到view的数据映射。但是还有许多其他问题。比如对于vue里的v-for， angular里的ng-repeat是怎么渲染的。组件之前的嵌套怎么实现， 子组件修改了父组件的数据怎么反馈到父组件并且重新触发父组件使用了这个数据的标签重新渲染。 这个都是在看源码之前所没有想过的。

## 杂记

- 将deps对应的directive绑定到deps上的变量data上。 这样当data改变的时候，就可以直接调用directive的update事件

## data flow

### new instance

  ```javascript
  // sample.js for developer
  import Vue from 'vue'
  const app = new Vue({
    el: '#app',
    data: {
      a: 1,
      b: 2
    }
  })
  ```

  - [vue data] => [vue._bindings] => [vue directive] => [dom update]
  - 在HTML里new一个新的vue实例，并向其中传入初试数据

### vue inner logic

  - 递归调用compileNode，创建directive和data数据之间的绑定关系
  - `Object.defineProperty`

  ```javascript
  Object.defineProperty(this.scope, variable, {
    get: () => this._bindings[variable].value,
    set: (newVal) => {
      this._bindings[variable].value = newVal
      this._bindings[variable].directives.forEach( (directive)=> {
        directive.update(newVal)
      })
    }
  })
  ```

  - 通过`Object.defineProperty`重新定义传入的数据`object`， 当`object`属性重新赋值时会调用`set`事件。这个时候会触发`vue`的`directive`，然后通过`directive`操作`dom`完成视图更新。

### data bind

  ```javascript
  if(directive.bind) directive.bind.call(directive, bindingValue);

  if(bindingValue) directive.update(bindingValue)
  ```

  > copy by Object reference.

  - origin data will be update when vue innsert logic change data

### 待解决问题：

- each 里的checkbox              ,状态改变怎么反馈到对todos依赖的那些指令上