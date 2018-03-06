# 7a0172d60 auto parse dependency for computed properties!!!!!

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