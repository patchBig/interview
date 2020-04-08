// var myObj = {}
// Object.defineProperty(
//     myObj,
//     'a', {
//         enumerable: true,
//         value: 2
//     }
// )

// Object.defineProperty(
//     myObj,
//     'b', {
//         enumerable: false,
//         value: 3
//     }
// )

// console.log(myObj.propertyIsEnumerable('a'));
// console.log(myObj.propertyIsEnumerable('b'));

// console.log(Object.keys(myObj));
// console.log(Object.getOwnPropertyNames(myObj))

// var myArray = [ 1, 2, 3]
// var it = myArray[Symbol.iterator]()

// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());

// var myObj = {
//     a: 1,
//     b: 2
// }

// Object.defineProperty(myObj, Symbol.iterator, {
//     enumerable: false,
//     writable: false,
//     configurable: true,
//     value: function() {
//         var o = this;
//         var idx = 0;
//         var ks = Object.keys(o);
//         return {
//             next: function() {
//                 return {
//                     value: o[ks[idx++]],
//                     done: (idx > ks.length)
//                 }
//             }
//         }
//     }
// })

// var it = myObj[Symbol.iterator]();
// console.log(it.next())
// console.log(it.next())
// console.log(it.next())

// for(var v of myObj) {
//     console.log(v)
// }

// function Vehicle() {
//     this.engines = 1;
// }

// Vehicle.prototype.ignition = function() {
//     console.log('Turning on my engine.')
// }

// Vehicle.prototype.drive = function() {
//     this.ignition()
//     console.log('steering and moving forward')
// }

// function Car() {
//     var car = new Vehicle();
//     car.wheels = 4;
//     var vehDrive = car.drive;
//     car.drive = function() {
//         vehDrive.call(this)
//         console.log('rolling on all ' + this.wheels + ' wheels')
//     }
//     return car;
// }

// var myCar = new Car()
// myCar.drive()

// let Something = {
//     cool() {
//         this.greeting = 'Hello World';
//         this.count = this.count ? this.count + 1 : 1;
//     }
// }

// Something.cool()
// console.log(Something.greeting)
// console.log(Something.count)

// let Another = {
//     cool() {
//         Something.cool.call(this)
//     }
// }

// Another.cool()
// console.log(Another.greeting);
// console.log(Another.count);

// var myObj = {
//     get a() {
//         return this._a_;
//     },
//     set a(val) {
//         this._a_ = val * 2
//     }
// }

// let otherObj = Object.create(myObj);
// otherObj.a = 2;
// console.log(otherObj.a);
// console.log(otherObj);

// function Foo() {}
// var a = new Foo()
// console.log(Object.getPrototypeOf(a) === Foo.prototype)

// function NothingSpecial() {
//     console.log("Don't mind me!");
// }

// var a = new NothingSpecial()

// console.log(a)

// function Foo(name) {
//     this.name = name
// }

// Foo.prototype.myName = function() {
//     return this.name
// }

// var a = new Foo('a')
// var b = new Foo('b')

// console.log(a.myName())
// console.log(b.myName())

// function Foo() {}
// Foo.prototype = Object.create({})
// let a = new Foo()
// console.log(a.constructor === Foo)
// console.log(a.constructor === Object)

// class C {
//     constructor() {
//         this.num = Math.random();
//     }

//     rand() {
//         console.log("Random: " + this.num)
//     }
// }

// var c1 = new C()
// c1.rand()

// C.prototype.rand = function() {
//     console.log("Random: " + Math.round(this.num * 1000))
// }

// var c2 = new C()
// c2.rand()
// c1.rand()

// class P {
//     foo() { console.log("P.foo") }
// }

// class C extends P {
//     foo() {
//         super.foo()
//     }
// }

// var c1 = new C()
// c1.foo()

// var D = {
//     foo: function() { console.log('D.foo') }
// }
// var E = Object.create(D)
// E.foo = C.prototype.foo.toMethod(E, 'foo')
// E.foo()

// var a = new Array(3)
// var b = [undefined, undefined, undefined]
// var c = []
// c.length = 3;

// console.log(a)
// console.log(b)
// console.log(c)

// 如果传递给 JSON.stringify(..) 对象中定义了 toJSON() 方法，那么该方法会在字符串化前调用，以便将对象转换成安全的 JSON 值。

// var a = 'Hello World'
// console.log(~a.indexOf('lo'))

// if (~a.indexOf('lo')) {
//     console.log('+++++++')
// }

// console.log(~a.indexOf('---'))
// var a = '123'
// var b = Object(a)
// console.log(a == b)
// console.log( Object(a))

// function foo() {
//     bar: {
//         console.log('Hello');
//         break bar;
//         console.log('never runs')
//     }
//     console.log('World')
// }

// foo()

// let a = [] + {};
// let b = {} + []
// console.log(a)
// console.log(b)

// var a = {
//     index: 1
// }
// console.log(a)
// a.index++;

// var a, b = 3;
// console.log(a + b)

// var p3 = new Promise(function (resolve, reject) { resolve("B"); });
// var p1 = new Promise(function (resolve, reject) { resolve(p3); });
// p2 = new Promise(function (resolve, reject) { resolve("A"); }); p1.then(function (v) { console.log(v); }); p2.then(function (v) { console.log(v); });

// let p1 = Promise.resolve(42)
// let p2 = Promise.resolve(p1)

// console.log(p1 === p2)

// var p = Promise.resolve(42)
// p.then(function(v) {
//     return new Promise(function(resolve, reject) {
//         setTimeout(function() {
//             resolve(v * 2)
//         }, 2000)
//     })
// })
// .then(res => {
//     console.log(res)
// }, err => {
//     console.log(err);
//     return 43
// })
// .then(data => {
//     console.log(data)
// })

// var p = new Promise((res, rej) => {
//     res(Promise.reject('Oops'))
// })
// p.then(data => {
//     console.log(data)
// }, err => {
//     console.log('err: ',err)
// })

// var x = 1;
// function *foo() {
//     console.log('execute foo')
//     x++;
//     yield;
//     console.log("x: ", x);
// }
// function bar() {
//     x++;
// }
// var it = foo()  // 构造了一个迭代器
// it.next()
// console.log('first next');
// console.log(x)
// bar();
// console.log(x);
// it.next()

// function *foo(x, y) {
//     return x * y
// }

// var it = foo(6, 8)
// res = it.next()
// console.log(res);

// function *foo(x) {
//     var y = x * (yield 'hello')
//     return y;
// }
// let it = foo(5)
// let res = it.next();
// console.log(res)
// res = it.next(7)
// console.log(res);

// function *foo() {
//     var x = yield 2
//     z++;
//     var y = yield (x + 2)
// }
// var z = 1;
// var it1 = foo();
// var it2 = foo()

// var val1 = it1.next().value;    // val1: 2
// var val2 = it2.next().value;    // val2: 2

// val1 = it1.next(val2 * 2).value     // val1: 6, x: 4,  z:2
// val2 = it2.next(val1 * 2).value     // val2: 14, x: 12, z: 3

// it1.next(val2 / 2)  // x: 4, y: 7, z: 3
// it2.next(val1 / 4)  // x: 12, y: 1.5, z: 3

// var a = 1;
// var b = 2;

// function *foo() {
//     a++;
//     yield;
//     b = b * a;
//     a = (yield b) + 3
// }

// function *bar() {
//     b--;
//     yield;
//     a = b + (yield 8);
//     b = a * (yield 2)
// }

// function step(gen) {
//     var it = gen()
//     var last;
//     return function() {
//         last = it.next(last).value
//     }
// }

// var s1 = step(foo)
// var s2 = step(bar)

// s2()    // b:1, a:1
// s2()    // b:1, a:1
// s1()    // b:1, a:2
// s2()    // b:1, a:9

// s1()    // b:9, a:9
// s1()    // b:9, a:12
// s2()    // b:18, a:12
// console.log(a, b)

// var gim = (function() {
//   let nextVal;
//   return {
//     [Symbol.iterator]() {
//       return this;
//     },
//     next() {
//       if (nextVal === undefined) {
//         nextVal = 1;
//       } else {
//         nextVal = nextVal * 2 + 6;
//       }
//       return {
//         value: nextVal,
//         done: false
//       };
//     }
//   };
// })();

// for(var i of gim) {
//     console.log(i);
//     if(i > 500) {
//         break;
//     }
// }
// console.log(gim.next());
// for (var ret; (ret = gim.next()) && !ret.done; ) {
//   console.log(ret.value);
//   if (ret.value > 500) {
//     break;
//   }
// }

// var a = [1, 2, 3, 4, 5];
// var it = a[Symbol.iterator]();
// console.log(it.next().value);
// console.log(it.next().value);
// console.log(it.next().value);

// function* something() {
//   // 如果生成器内有 try...finally 语句，它将总是运行，即使生成器已经外部结束。如果需要清理资源的话，这一点非常有用。
//   try {
//     var nextVal;
//     while (true) {
//       if (nextVal === undefined) {
//         nextVal = 1;
//       } else {
//         nextVal = 3 * nextVal + 6;
//       }
//       yield nextVal;
//     }
//   } finally {
//     console.log("clearing up");
//   }
// }

// let it = something();
// for (var i of it) {
//   console.log(i);
//   if (i > 500) {
//     // it.return() 会立即终止生成器，这当然也会运行 finally 语句
//     console.log(it.return("Hello world").value);
//   }
// }

// const http = require('http');
// const options = {
//   host: 'http://192.168.0.108:8088/bigcourse/getWeekLessons',
// };
// const req = http.get(options);
// req.end();
// req.once('response', (res) => {
//   const ip = req.socket.localAddress;
//   const port = req.socket.localPort;
//   console.log(`Your IP address is ${ip} and your source port is ${port}.`);
// });

I 