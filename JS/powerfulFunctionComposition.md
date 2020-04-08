# How to use powerful function composition in Javascript

## Function composition

Fuctionn composition is based on the use of monadic(unary) carried and preferably pure functions

```js
const monadic = one => one + 1

const notMonadic = (one, two) => one + two;

const curry = one => two => one + two
```

Function composition is a quite simple use of mutiple functions where each functin receive input and hands over its output to the next function:

```js
const plusOne = a => a + 1;
const plusTwo = a => a + 2;

const composedPlusThree = a => plusTwo(plusOne(a))

composedPlusThree(3)
```

Define higher-order functions compose and composePipe:

```js
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)
const composePipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

const PlusA = s => s + 'A'
const PlusB = s => s + 'B'

const composed1 = s => compose(PlusA, PlusB)(s)
const composed2 = s => composePipe(PlusA, PlusB)(s)

composed1('');  // BA
composed2('');  // AB

const composedPointFree = compose(PlusA, PlusB)
console.log(composedPointFree('') === composed1(''));  // true
```

This is possible because compose(plusA, plusB) is a higher-order function. compose return a function that used to defined your new expression.

There is another significant different between composition and objects. Objects hold internal data and status. They are stateful. Functions in functional programming, however, should be pure and stateless.

In functional programming, you are intended to follow separation of concerns to decouple execution of a task from its implementation by the use of inversion of control principle and functional monads.
(在函数式编程中，你将被引导遵循关注分离一个任务的解耦执行，通过控制单一原则的倒置和功能单一，从它的实际上。)

