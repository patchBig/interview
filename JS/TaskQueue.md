# 从 Promise 来看 JavaScript 中的 Event Loop、Tasks 和 Microtasks

```javascript
(function test() {
    setTimeout(function() {console.log(4)}, 0);
    new Promise(function executor(resolve) {
        console.log(1);
        for(var i = 0; i < 1000; i++) {
            i = 999 && resolve()
        }
        console.log(2)
    }).then(function() {
        console.log(5);
    });
    console.log(3)
})()
```

输出的结果是 1，2，3，5，4 而非 1，2，3，4，5 ？

其中，得到Promise的实例promise的时候，executor 作为参数传给 Promise 的构造函数同步执行。所以输出了数字 1 和 2。

构造函数执行完后，我们得到了 promise（它是 resolved）。

调用 promise.then，callback 被添加到 microtasks 的队列中。

console.log(3)执行完后，当前执行栈为空，则开始执行 microtasks。
