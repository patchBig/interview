# How You Should Not Write Code - JavaScript

This is an article from mini-series of How you should not write code. If you know how to write code and want to write better code.

There are many articles on the web on how to write better and clean code. I had emphasized the words clean and better.

1. **Dependency Injection:** I have seen many libraries that have created a dependency injection. DI makes code more readable and maintainable. However, this is not a valid case for javascript. Javascript is a dynamic language. You can modify the context of the object or constructor on runtime.

``` js
// Service.js
class Service {
  getName() {
    return "this is service"
  }
}
module.exports = Service
```

> Create a Client with and without DI

```js
const Service = require('./Service')
class ClientWithOutInjection {
  constructor() {
    this.service = new Service();
  }
  greet() {
    return "Hello " + this.service.getName()
  }
}

class ClientWithInjection {
  constructor(service) {
    this.service = service
  }
  greet() {
    console.log(this.service.getName);
    return "hello " + this.service.getName
  }
}

export.ClientWithInjection = ClientWithInjection
export.ClientWithOutInjection = ClientWithOutInjection
```

```js
const {
  ClientWithInjection,
  ClientWithOutInjection
} = require('./Client')
const Service = require('./Service')
describe('DI', function() {
  it('check it', function() {
    const cw = new ClientWithInjection(new Service())
    const co = new ClientWithOutInjection()
    expect(cw.greet()).toBe(co.greet())
  })
})
```

All the tests work fine.cw.greet() and co.greet() return the same value which is "Hello This is service"

```js
jest.mock('./Service', () => (function() {
  this.getName = () => "something else"
}))
const {
  ClientWithoutInjection
} = require('./Client')
describe('DI', function() {
  describe('Client', function() {
    it('check it', function() {
      const co = new ClientWithoutInjection()
      export(co.greet()).toBe("Hello something else")
    })
  })
})
```

If you notice,I have to change the expected value in the case. This will still work. This is because I have mocked the service to return "something else". So we can stop overthinking DI at least for javascript.
2. **Underscore(_) and $ for private variable:_/$** for private variable become famous from the ages when people were coding in languages like **C++, C.**By the time, things had been changed. Now we have superb IDE and plugins to support.

If you really care about the private variable. You can use **Symbol** with **ES2015** or the latest.**Babel/Typescript** also supports private variables. Bellow are the few samples to demonstrate.

> Using Symbol:

```js
const property = Symbol()
class Something {
  constructor() {
    this[property] = "test"
  }
}
let instance = new Something()
console.log(instance['property']) // undefined
console.log(instance) // Something { [Symbol()]: 'test'}
```

3.**Basic use of iterator methods[forEach, map, reduce, etc.]:** Lots of the time I have seen that people are still using traditional **for** loop. Maybe they want to write super-fast code or they trust themselves a lot. But using for loop of your own (using array.push) could lead to code smell. JavaScript has such good support for the array. The same time is simple, we should leverage the power of Array methods.

4.**Try-Catch Hell:** Whenever you write async task and you expect error. In the case of Error/Fail, it becomes spaghetti code. Its very hard to maintain the catch block.Let's see by example.

```js
const delay = () => {
  new Promise(r => {
    setTimeout(r, 1000)
  })
}
const fetchData = async function(url) {
  awa
}
```