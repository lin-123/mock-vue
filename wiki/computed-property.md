# 7a0172d60 auto parse dependency for computed properties!!!!!

> 计算属性

## 实现原理
  - computed properties 就是每次scope里面的数据变了都要重新算一次这些properties
  - 将computed中的scope变量添加到deps数组中
    * 注册依赖

        ```javascript
        Seed.prototype._parseDeps = function (binding) {
            depsObserver.on('get', function (dep) {
                if (!dep.dependents) {
                    dep.dependents = []
                }
                dep.dependents.push.apply(dep.dependents, binding.instances)
            })
            binding.value()
            depsObserver.off('get')
        }
        ```

  - 在scope[key].set中调用bindings[key].dependencies 这些properties就好了


- 这种写法是为了能够将completed作为计算属性来用

    <!-- app.js -->
    ``` javascript
      scope.completed = {get: function () {
          return scope.total() - scope.remaining
      }}
    ```

    <!-- seed.js -->
    ``` javascript
    Seed.prototype._updateBinding = function (key, value) {

      var binding = this._bindings[key],
          type = binding.type = typeOf(value)

      // preprocess the value depending on its type
      if (type === 'Object') {
          if (value.get) { // computed property
              this._computed.push(binding)
              binding.isComputed = true
              value = value.get
          } else { // normal object
              // TODO watchObject
          }
      } else if (type === 'Array') {
          watchArray(value)
          value.on('mutate', function () {
              binding.emitChange()
          })
      }
      ...
    }
    ```

