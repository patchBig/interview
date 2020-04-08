# The Basic of JavaScript Generators

ES6 generator functions are those that can stop their execution in the middle and resume execution further from the same point. These functions do not return a single value; instead,they're capable of returning multiple values.They're based on the concept of iterators.

Generator functions can pause and be resumed one or multiple times, which makes them interesting and very different from normal functions. While the function is paused, it allows other functions and code to execute. By default, generators are asynchronous.

## Generators start

Once the iterator has been created, we need to trigger this iterator to fetch data from the generator. We can continue execution on the function by calling the next method on the returned iterator to retrieve the value from the generator function.Each time the next() function is called on the iterator, it executes the function until it reaches the next yield keyward. After each yield, it stops processing further.

```js
function* customGenerator() {
  yield 1;
  yield 2;
}

let getIterator = customGenerator();

let firstValue = getIterator.next();

console.log(firstValue);
// Output is: { value: 1, done: false}

let secondValue = getIterator.next();

console.log(secondValue);  

// Output is: { value: 2, done: false}

nextValue = getIterator.next();
console.log(nextValue);  
// Output is: { value: undefined, done: true }
```

## Using the Return Keyword in Generators 

A generator function can have a return statement. As soon as the generator function encounters the return keyword. it updates the done flag to true, and even if we have more yield keywords in the function, the generator will be considered complete.

```js
function* customGenerator() {
    yield 1;
    return 5;
    yield 2;
}

let getIterator = customGenerator();

let nextValue = null;

nextValue = getIterator.next();
console.log(nextValue);
// Output is: { value: 1, done: false }

nextValue = getIterator.next();
console.log(nextValue);
// Output is: { value: 5, done: true }

nextValue = getIterator.next();
console.log(nextValue);  
// Output is: { value: undefined, done: true }
```

## Passing Value to the "Next" function

We've seen that when we pass a value to yield keyword, it returns the value to the calling function next. However, generators enable two-way communication. The next function can pass data to the generators too.

```js

function* customGenerator() {
    let x = yield 1;
    yield x + 1
}

let getIterator = customGenerator();

let nextValue = null;

nextValue = getIterator.next();
console.log(nextValue);  
// Output is: { value: 1, done: false }

nextValue = getIterator.next(10);
console.log(nextValue);  
// Output is: { value: 11, done: false }

nextValue = getIterator.next();
console.log(nextValue);
// Output is: { value: undefined, done: true }
```

When next(10) is invoked:

1. The parameter passed is substituted in place of yield 1.

    So effectively, line 3 in the generator becomes `let x = 10.`

2. It further executes the function until encountering the next yield.

3. It substitutes the value of x with and returns the resulting value (10 + 1)

Output: {value: 11, done: false}

On the following call of next():

1. Since there is no further yield keyword, it returns undefined as the return value.
2. And since the generator is complete, the done flag is set to true.

Output: {value: undefined, done: false}

## Working with for ... of Loops

Since the generator functions return iterators, these iterators can be used inside a for ... of loop. The iterator will iterate through all the values present in the generator function. Parameters passed to the yield keyword will be passed as a value to the iterator.

```js
function* customGenerator() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    yield 6;
}

for(let val of customGenerator()) {
    console.log(val);
}

// Output: 1 2 3 4 5 6
```

文章出处：
[The Basics of JavaScript Generators【JavaScript 生成器基础】](https://medium.com/better-programming/the-basics-of-javascript-generators-f89c9b0e8d72)
