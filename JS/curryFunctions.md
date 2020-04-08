# JavaScript ES6 curry functions with practical examples

## Basic example

```javascript
const sum = x => y => x + y
```

Just realize that you are simply returning everything that is behind the first arrow. JavaScript has first class functions.

## First class functions

In short, in functional programming JavaScript has first class functions because it supports functions as arguments and return values.

```js
const someFunction = () => console.log('Hello World')

const firstClass = functionAsArgument => functionAsArgument()

const firstClass2 = () => someFunction;
```