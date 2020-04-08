# 即使你是五岁的小孩，也能把 Async/Await 和 Promises 解释给你听

Anyone who calls themselves a JavaScript developer has had to, at one point, work with either callback functions, Promises, or more recently, Async/Await syntax. If you've been in the game long enough, then you've probably seen the translation from the days where nested callbacks were the only way to do asynchronous JavaScript.

When I first learning and writing JavaScript, there were already a billion guides and tutorials out there explaining how to use them. Yet, many of them were just explaining how to convert between callbacks to Promises, or Promises to Async/Await. Admittedly, for many, that is probably more than enough for them to get along and write code.

## What dose "Asynchronous" mean

Whilst there's still the same number of things to do, you can hopefully see how this would be much faster and more efficient. This is exactly the same core concept as asynchronous programming: **you never want to sit around purely waiting for something whilst there are other things you can spend your effort on.**

And we all know that in programming, **waiting** happens pretty damn often -- whether it be waiting for an HTTP Response from a server, filesystem I/O, etc. But your CPU's execution cycles are precious and should always be spend activity doing something, and not waiting around: hence,
**Asynchronous Programming**.

As for the asynchronous functions, first I'll quickly explain how JavaScript's type system handles asynchronicity: basically, all results (including void ones) from asynchronous operations must be wrapped in a Promise type.

In order to have a function return a Promise, you can either

- Explicitly return a Promise i.e.** return new Promise(......)**;
- Add async to the function signature
- *or both of the above.*

if you don't declare a function as async, then by default JavaScript takes that to mean it is a synchronous function -- and synchronous means no waiting! (this also means you can't use await at the top level script outside of a function at all).

```js
function chopCarrots() {
  let k = 0;
  for (let i=0; i<10000; i++) {
    for (let j=0; j<10000; j++) {
      k = Math.pow(k, i * j) / k
    }
  }
  console.log("Done chopping carrots!");
}

function chopOnions() {
  let k = 0;
  for (let i=0; i<10000; i++) {
    for (let j=0; j<10000; j++) {
      k = Math.pow(k, i * j) / k
    }
  }
  console.log("Done chopping onions!");
}

function addOnions() {
  console.log('Add Onions to pot!');
}

function addCarrots() {
  console.log('Add Carrots to pot!');
}

async function letPotKeepBoiling(time) {
  return new Promise((resolve) => setTimeout(() => {
    console.log("Pot has boiled for ", time, " minutes");
    resolve();
  }, time * 100));
}

async function boilPot() {
  return new Promise((resolve) => setTimeout(() => {
    console.log("Done boiling pot!");
    resolve();
  }, 5000));
}

async function makeSoup() {
  const pot = boilPot();
  chopCarrots();
  chopOnions();
  await pot;
  addCarrots();
  await letPotKeepBoiling(5);
  addOnions();
  await letPotKeepBoiling(10);
  console.log("Your vegetable soup is ready!");
}

makeSoup();
```

## What about explicit Promises

Keep in mind, **the async/await methods are based on promises themselves and hence the two methods are fully compatible.**

Explicit Promise are, in my opinion, the half-way between using old-style callbacks and the new sexy async/await syntax. Alternatively, you can also think of the sexy async/await syntax as nothing more than implicit Promise. After all, async/await came after Promises, which itself came after callbacks.

## Async function vs. a function that returns a Promise

```js
function fn(obj) {
  const someProp = obj.someProp
  return Promise.resolve(someProp)
}

async function asyncFn(obj) {
  const someProp = obj.someProp
  return Promise.resolve(someProp)
}

asyncFn().catch(err => console.error('Catched')) // => 'Catched'
fn().catch(err => console.error('Catched')) // => TypeError: Cannot read property 'someProp' of undefined
```

As you can see, both of the functions above have the same body in which we try access a property of an argument that is undefined in both cases. the only difference between the two functions is that asyncFn is declared with the async keyword.

This means that JavaScript will make sure that the asyncFn will return with a Promise (either resolved or rejected) even if an error occured in it, in our case calling our .catch() block.

## Promise methods

### Promise.all(iterable)

```js
const promise1 = Promise.resolve(1);
const promise2 = 2;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(() => resolve(3), 1000);
});
Promise.all([promise1, promise2, promise3])
  .then((values) => {
    console.log(values);
  });
```

If some of them are rejected, then we won't get any resolved value. Instead we will get whatever error value is returned by the rejected promises. It will stop at the first rejected promise and send that value to the callback of catch function.

```js
const promise1 = Promise.resolve(1);
const promise2 = Promise.reject(2);
const promise3 = new Promise((resolve, reject) => {
  setTimeout(() => reject(3), 1000);
});
Promise.all([promise1, promise2, promise3])
  .then((values) => {
    console.log(values);
  })
  .catch(error => {
    console.log(error);
  });
```

### Promise.allSettled

Promise.allSettled returns a promise that resolves after all the given promises are resolved or rejected. It takes an iterable object with a collection of promises, for example, an array of promises. The resolved value of the returned promise is an array of the final status of each promise.

```js
const promise1 = Promise.resolve(1);
const promise2 = Promise.reject(2);
const promise3 = new Promise((resolve, reject) => {
  setTimeout(() => reject(3), 1000);
});
Promise.allSettled([promise1, promise2, promise3])
  .then((values) => {
    console.log(values);
  })
```

For example, the code above will log `{status: 'fulfilled', value: 1}, {status: 'rejected', reason: 2}, {status: 'rejected', reason: 3}`

### Promise.reject

Promise.reject returns a promise that's rejected with a reason. It's useful to reject a promise with an object that's an instance of Error.

### Promise.resolve

Promise.resolve returns a promise that's resolved to the value that's passed into the argument of the resolve function.
