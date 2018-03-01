# vue 数据绑定原理

## data flow
```javascript
new Vue({
  el: '#app',
  data: {
    a: 1,
    b: 2
  }
})
```
- [vue data] => [vue._bindings] => [vue directive] => [dom update]

## core

> `Object.defineProperty`

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

## data bind

> copy by Object reference.

- origin data will be update when vue innsert logic change data
