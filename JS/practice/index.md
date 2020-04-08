# For loop vs map

For seems to be faster or much faster for big dataset. The syntax is friendly for entry level develops.

On other hand using map syntax is very nice nad clean. Values you use are not mutable so your initial data are safe.

对于简单标量基本类型值，如“abc”，如果要访问它的 length 属性或 String.prototype 方法，JavaScript 引擎会自动对该值进行封装（既用相应类型的封装对象来包装它）来实现对这些属性和方法的访问。

回调函数是 JavaScript 异步的基本单元，但是随着 JavaScript 越来越成熟，对于回调表达异步流程的方式是非线性的，非顺序的，这使得正确推导这样的代码难度很大。难于理解的代码是坏代码，会导致坏 BUG。

消息是双向传递的-yield... 作为一个表达式可以发出消息响应 next(...) 调用，next(...) 也可以向暂停的 yield 表达式发送值。

Application logic on the server is handled with Node.js. The NPM ecosystem seems to have a package for everything. so assembling exactly what I need and plugging it into Read Write Serve is a straightforward task. Sending mail, interfacing with payment gateways, accessing databases, and all the other server-side APIs that I write don't require heavy lifting.

My database server is MariaDB, the rebranded fork of MySQL adopted by open-source community. When I need to store unstructured JSON, I rely on PostgreSQL, because I can perform queries directly on specific JSON properties -- it's a bit like MongoDB, but with the familiarity of SQL syntax.

了解迭代器的背景，让我们把注意力转回生成器上，可以把生成器看作一个值的生产者，我们通过迭代器接口的 next() 调用一次提取出一个值。

当执行一个生成器，就得到一个迭代器。

生成器中的迭代器里面也有 Symbol.iterator 函数，基本上这个函数做的就是 return this。换句话说 生成器的迭代器也是一个 iterable!

如果生成器内有 try...finally 语句，它将总是运行，即使生成器已经外部结束。如果需要清理资源的话，这一点非常有用。

how you should not write code - javascript

this is an article from mini-series of How you should not write code. If you know to write code and want to write better code. Please follow someone like Robert Martin.

I often see question on Reddit or Quora along the lines of "How do I know if I'll
