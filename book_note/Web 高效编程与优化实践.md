# 读书笔记

## 第二章 JS 优化

### Effective 前端 5：减少前端代码耦合

- 写代码的原则是要低耦合，高内聚。所谓的内聚就是说如果一个模块的职责功能十分紧密，不可分割，那么他就是高内聚的。
- 如果需要传递的参数比较多，这个时候就可以考虑把它封装成一个类。
- 事件还可以直接用于两个模块或者组件间的通信，当两个模块关系比较紧密，共同完成一个功能时，那么可以 require 进来，但是当两个模块功能比较独立，每个模块完成自己的功能，并且完成后需要通知另一个模块相应的做些修改，那么就可以用事件的机制通知其他模块相应的做些修改，即一个模块 trigger 一个自定义事件，另一个模块监听这个事件。
  
### Effective 前端 6：JS 书写优化

- 指明变量类型
- 函数的返回类型应该是确定的；如果类型确定，解释器也不用去做一些额外的工作，可以加快运行速度。否则可能会触发“优化回滚”，即编译器已经给这个函数编译成一个函数了，但是突然发现类型变了，有得回滚到通用的状态，然后再重新生成新的函数。

## 第三章 页面优化

- 首先用 JS 做了些逻辑，还触发了样式变化，style 把应用的样式规则计算好之后，把影响到的页面元素进行重新布局（叫做 Layout），再把它画到内存中的一个画布中，Paint 成了像素，最后吧这个画布刷新到屏幕上去，叫做 composite，形成一帧。
- 减少 Layout；能使用 transform 就不要使用 position/width/height 做动画，另外要减少 Layout 的影响范围
- 简化 DOM 结构
- 使用响应式图片 picture img source srcset media source 还可以使用 webp 格式文件
- 一个页面展示太多图片，那么页面的 onloaded 时间将会较长，并且由于并行加载资源数是有限的，图片太多会导致放在 body 后面的 JS 解析比较慢，页面将较长时间处于不可交互状态。所以不能一下子把全部图片都放出来，这对于手机上的流量也是不利的。
- 将 src 的属性写成了 "about: black"。这是因为不能随便写一个不存在的地址，否则控制台会报错：加载失败；如果写成空或者不写。就会认为 src 就是当前页面。如果写成 about: blank，大家相安无事。并且不同浏览器兼容性好。
- gzip 压缩，只需要在 Nginx 的配置里面添加 gzip on  就可以开启压缩了。
- 第一次请求的时候，Nginx 的 http 响应头里面返回了 HTML 的最近修改时间；在第二次请求的时候，浏览器会把这个 Last-Modified 带上，变成 If-Modified-Since 字段；这样 Nginx 就可以读取本地文件信息里的修改时间和这个进行比较，一旦时间一致或者在此之前，返回 304，告诉客户端从缓存中取。
- 手动控制缓存时间，就是使用 Cache-Control。max-age 的优先级要大于 last-modified。如果要强制不缓存，则把 expires 时间改成 0。
- 设置缓存的作用一个是把 200 变成 304，避免资源重新传输，第二个是让浏览器直接从缓存读取，连 http请求都不用了。
- Nginx 开启 etag 只需要在 server 配置里面加上一行， etag on。etag 就是对文件做一个校验和。第一次访问的时候，响应头里面返回这个文件的 etag，浏览器第二次访问的时候，把 etag 带上，添加在 If-None-Match 字段，Nginx 根据这个 etag 和新渲染的文件计算出的 etag 进行比较，如果相等则返回 304。由于 etag 是要使用少数的字符表示一个不定大小的文件，所以 etag 是有重合的风险的。使用 etag 的代价是增加了服务器的计算负担，特别是当文件比较大的时候。

### 用好 Chrome Devtools

- console.table 可以用来查看数组和对象，非常清爽
- console.dir 能递归打印 DOM 对象的所有属性
- 用 %c 可以在控制台打印带样式的提示语 console.log('%c 你颠三倒四 %s', 'background: #222', '>>')
- 检查没有用到的 CSS/JS；打开 devtools 的 Coverage 标签栏，没有用到的用红色表示，用到的用绿色表示；用媒体查询去加载不同的 CSS; `<link ref="stylesheet" href="large.css" media="screen and (min-width:500px)">`
- console.trace 向 Web 控制台输出一个堆栈跟踪
- F10 下一步；F8 跳到下一个断点；command + ; step into 进入函数执行；shift + command/ctrl + ; step out 跳出当前函数

## h5 优化实践

### 使用 h5 的 history 改善 ajax 列表请求

- 当用户单击前进后退按钮会触发 window.onpopstate 事件，window.history.pushState(state, title, url) 其中 state 为一个 object，用来存放当前页面的数据，title 标题没有多大的作用，url 为当前页面的 url，一旦更改这个 url，浏览器地址栏的地址也会发生变化。popState 只能建ring自己调用 push 进去的。如果不是自己 push 的，那么就不会触发 popstate 事件。

### 使用 service Worker 做一个 PWA 离线应用

- 先注册一个 Worker，然后后台就会启动一条线程，可以在这条线程启动的时候去加载一些资源缓存起来，然后监听 fetch 事件，在这个事件里拦截页面的请求，先看下缓存是否有，如果有直接返回，否则正常加载。或者一开始不缓存，每个资源请求后再拷贝一份缓存起来，然后下一次请求的时候缓存里就有了。
- Service Worker 和 Cookie 一样是有 Path 路径概念的，如果设定一个 cookie 为time 的 path=/page/A，在 /page/B 这个页面是不能获取到这个 cookie 的，如果设置 cookie 的 path 为根目录 /，则所有页面都能获取到。类似的，如果注册的时候使用的 js 路径为 /page/sw.js，那么这个 Service Worker 只能管理 /page 路径下的页面和资源，而不能处理 /api 路径下，所以一般吧 Service Worker 注册到顶级目录，这样 Service Worker 就能接管页面的所有资源了。`navigator.serviceWorker.register('/sw-3.js')`

## 第五章 前端与计算机基础

### TCP 三次握手

- 向目标端口发送了一个TCP 包，带上标识位 SYN，表示要建立一个连接，并指明包开始的序列号 seq（单位为字节），以后传送的字节编号都是以这个作为起点。
- 进行回复，发送了一个 SYN + ACK 的报文段，表示同意建立连接。
- 收到 SYN 之后发送一个 ACK，同事改变接收窗口，完成三次握手。

### 接收窗口

— 它根据自身网络情况设置不同大小的值用来控制对方发送速度，避免对方发送太快，导致网络拥塞。

### 关闭连接

- 请求方觉得不用再请求数据了，于是要把连接关闭了，它向响应方发送一个 FIN 的报文。等待 30s 才关闭的是因为 HTTP 请求的 Connection: keep-alive 字段的影响，因为同一个域可能要请求多个资源，不能一个请求完了就把  连接关闭了。人如果不关闭又占用端口号资源，端口号最多只有 65535 个。
- 响应方接收后向请求方发送一个 ACK，这个时候连接出于半关闭的状态，即请求方不能向响应方发送数据了，但是响应方还可以向请求方发送。
- 响应方也要把连接关闭了，于是它向请求方发送 FIN。
- 请求方接收后，就发送 ACK，此时连接完全关闭，然后主动关闭方将进入 TIME_WAIT 状态。

### MSS 和 TIME_WAIT

- TIME_WAIT 时间为 2MSL，MSL 的意思是 Maximum Server Live-time，即报文端的最大生存时间，标准建议为2 分钟，实际实现有的为 30s。在 TIME_WAIT 状态下，上一次建立连接的套接字(socket) 将不可再重新启用，也就是同一个网卡/IP 不可再建立同样端口号的连接，如果再重新创建系统将会报错，主要是为了避免有些报文段在网络上滞留，被对方收到的时候恰好又启用了一个完全一样的套接字，那么就会被认为是这个链接的数据。
- 可以在创建 socket 的时候，指定 SO_REUSEADDR 的选项，这样就不用等待 TIME_WAIT 的时间了。
- 另外还有一个时间叫 RTT（Round Trip Time），即一个报文段的往返时间

### TCP 为什么要握手三次

- 三次握手并不能保证双方完全的信任对方，即使是四次、五次也是同样的道理，至少有一方式无法信任另一方，另外一方一想到对方可能不信它，它也会变得不信对方。

### 为什么挥手要四次

- 前两次挥手让连接出于半关闭状态，此时主动关闭方不可再向被动关闭方发送数据，而被动关闭方可继续向主动关闭方发送数据。

### 四层传输协议

- 物理层(物理帧，带上目的主机的物理地址) -> 网络层(IP/ARP，带上目的主机的 IP 地址) -> 传输层(TCP/UDP，带上目的主机的端口号) -> 应用层(HTTP、SSH、WS，最后应用层收到数据)
- 在广域网是用的 IP 地址进行报文转发，而到了局域网需要靠物理地址发送给对应的主机。IP 是点到点，负责发送到对应的主机，而 TCP 是端到端，即根据端口号，负责发送给对应的应用程序。

### Nagle 算法

- 核心思想是：等数据积累多了再一起发出去，大概等待 200 ms 这样可以提高网络的吞吐量。但是在现代，带宽和速度已经不是太大的问题，如果每个请求都要延迟 200ms，会造成实时性比较差。所以通常是要把 Nagle 算法禁止，可以在创建套接字的时候设置 TCP_NODELAY 标志位。

### Cookie

- 服务可以通过 Set-Cookie 通知客户端设置 cookie，而客户端可以用 Cookie 字段告知服务器现在的 Cookie 数据是怎么样的。

### WebSocket 连接建立

- 首先还是先建立 TCP 连接，完成后客户端发送一个 upgrade 的 HTTP 请求。
- 服务端收到后统一握手，返回 Switching Protocols，连接建立。

### Websocket 和 WebRTC

- websocket 是为了解决实时传送消息的问题，当然也可以传送数据，但是不保证传送的效率和质量，而 WebRTC 可用于可靠地传输音视频数据、文件等。并且可以建立 P2P 连接，不需要服务端进行转发数据。虚拟电话、在线面试等现在很多都是采用 WebRTC 实现。

### 理解 HTTPS 连接的前几毫秒发生了什么

- HTTPS 要解决问题就是中间人攻击。
- 域名污染，当我们访问一个域名时需要先进行域名解析，即向 DNS 服务器请求某个域名的 IP 地址。在经过 DNS 的中间链点可能会抢答，返回给你一个错误的 IP 地址，这个 IP 地址就指向中间人的机器。
- APR 欺骗，广域网的传输用的是 IP 地址，而在局域网用的是物理地址，例如路由器需要知道连接它的设备的物理地址他才可以把数据包给你，它会通过一个 ARP 的广播，向所有设备查询某个 IP 地址的物理地址是多少。

### 弄懂为什么 0.1 + 0.2 不等于 0.3

#### 反码和补码

公式：

- 正数的补码 = 反码
- 负数的补码 = 反码 + 1

> 内存中都是使用补码来计算的

用临界值的计算来举例

- -2   -> 原码 1000 0010 -> 反码 1111 1101 -> 补码 1111 1110
- -126 -> 原码 1111 1110 -> 反码 1000 0001 -> 补码 1000 0010
- 补码的运算结果：1000 0000（该类数字没有原码和补码）

##### Byte 的数据范围

- 最大的正数：0111 1111 -> 2^7 - 1 = 127
- 最大的负数：1000 0000 -> -2^7 = -128

##### 存储结构

- 单精度：符号1位，阶码8位，尾数23位
- 双精度：符号1位，阶码11位，尾数52位

##### 存储方式

一个十进制的小数在进行存储时，首先要将整数部分与小数部分都转换成二进制。然后再整理成类似科学计数法的形式，即移动小数点，使得小数点的左边只有一位，并且只可能为1（因为是二进制），*小数点右侧的部分即为尾数部分*，*移动小数点的位数将会被记录在指数部分中。*

##### 移码

- 对于绝对值大于2的数，这个时候我们向左移动小数点，对应的指数为正数
- 对于一个绝对值小于1的数，这个时候向右移动小数点，对应的指数为负数

以 float 为例，指数的长度是8，原有带符号位的 8 个 bit 的存储范围是 -128~127，也就是说可以记录 -128 次方到 127 次方之间的所有指数值。如果忽略符号位，把它也当做一个数据的存储位，那么范围就是 0~255，我们取这个数的一半作为修正值，即：127，把每次移动小数点后获取的指数值加上 127.

- 小数点向左移动3位，对应的指数为 +3，存入指数部分的值即为 130 的二进制表示
- 小数点向右移动2位，对应的指数为 -2，存入指数部分的值即为 125 的二进制表示

##### 小数在内存中的存储表示

99.9 的二进制表示：1100011.111001100110011001100110011001100110011001101。现在需要将小数点向左移动 6 位，对应的指数值为 +6。此时小数点右侧的位数为 51 位，这些将会被存放在尾数部分，如果使用 double 类型就可以将数据全部记录，但是如果使用 float 类型，由于尾数部分只有 23 位，所以只能记录部分的数据，误差也就产生了！

整理一下，符号位为 0，指数部分 6 + 127 = 133，尾数部分直接丢进去，能装多少装多少，以 float 为例，最终表示为：0 10000101 10001111100110011001100

- JS 能表示的最大整数为 Number.MAX_SAFE_INTEGER，能表示最大正数为 Number.MAX_VALUE。
计算机是使用味精致存储数据的，整数也是同样的道理，整数可以分成短整型、基本型和长整型，占用的存储空间分别为16位、32位和64位。如果操作系统是 32 位的，那么使用长整型将会慢于短整型，应为一个数它需要分两次取。
- 32 位有符号整型的存储方式，第一位 0 表示正数，1 表示负数，剩下的 31 位表示数值，所以 32 位有符号整数最大值为：2 ^ 31 - 1 = 2 147 489 647。
- 十进制的 0.75 可以表示成 7.5 \* 10 ^ -1，同样地在二进制里面，0.75 可以表示成: 0.75 = 1.1 \* 2 ^ -1
- 0.75 用二进制表示：小数部分不停乘 2，得到整数部分正序就是小数的二进制。整数部分不停除以 2，取余逆序就是整数部分的二进制。
- 如果需要更精确的表示，只需要保留更长的有效位数。这也是双精度的 double 比单精度的 float 更精确的原因。
- 浮点数存储：一个二进制浮点数存储分为三部分：1. 符号位 S 2. 指数部分 3.尾数部分

浮点数相加，需要先比较阶码是否一致，如果一致则尾数直接相加，如果不一致，需要先対阶，小阶向大阶看起，即把小阶的指数调成和大阶的一致，然后把他的尾数向右移相应的尾数。向右移以为导致尾数需要进行截断，由于最后一位刚好是 0，所以这里直接舍弃，如果是 1，那么尾数加 1，类似于十进制的四舍五入，避免误差积累。

### 为什么 JS 的最大正数是 1.79e308

这个数其实就是双精度浮点数所能表示最大正值。

```javascript
Math.pow(2, 11) - 1 - 1023
> 1024

Math.pow(2, 1024)
> 1.79e308
```

### 为什么 JS 的最大正整数不是正常的 64 位的长整型所能表示的 19 位

因为 JS 的正整数是用的尾数的长度表示的，由于尾数是 52 位，加上整数一位，他所能表示的最大的整数为：
pow(2, 53) - 1.

为什么 JS 要用这种方式呢？因为 JS 的整型和浮点型在计算过程中可以随时自动切换，整数在 JS 里面也是用浮点数的结构存储的，放在了尾数的部分。

### 怎么判断两个小数是否相等

判断两个小时是否相等要用它们的差值和一个很小的小数进行比较，如果小于这个小数，则认为两者相等，ES6 新增了一个 Math.EPSILON 属性。例如 0.1 + 0.2 是否等于 0.3 应该这么操作：

```js
0.1 + 0.2 - 0.3 < Number.EPSILON   // true
```

## 明白 WebAssembly 与程序编译

### 机器码

计算机智能运行机器码，机器码是一串二进制的数字

----

局部变量是放在栈里面的，而 new 出来是放在内存堆里面的。

### 编译和解释

在编译型语言里面，代码需要经过以下步骤转成机器码

可读文本 -(语法分析)-> 汇编语言 -(翻译)-> 可运行机器码

先把代码文本进行词法分析，语法分析，语义分析，转成汇编语言，其实解释型语言也是需要进过这些步骤的。通过词法分析识别单词，例如知道了 var 是一个关键词，people 这个单词是自定义的变量名字；语法分析把单词组成语句，例如知道了定义了一个变量，写一个赋值表达式，还有一个 for 循环；而语义分析是看逻辑合不合法，例如如果赋值给了 this 常量，编译器就会报错。
然后再把汇编翻译成机器码，汇编和机器码是两个比较接近的语言，只是汇编不需要去记住哪个数字代表哪个指令。

编译型语言需要在运行之前生成机器码，所以它的执行速度比较快，比解释性的要快若干倍，缺点是由于它生成的机器码是依赖于那个平台的，所以可执行的二进制文件无法子另一个平台运行，需要再重新编译。

相反，解释型为了达到一次书写，处处运行的目的，它不能先编译好，只能在运行的时候，根据不同的平台再一行行解释成机器码，导致运行速度要明显低于编译型语言。

### WASM 对写 JS 的提示

WASM 为什么非得是强类型的呢？因为它要转成汇编，汇编里面就得是强类型，这个对于 JS 解释器也是一样的，如果一个变量一下子是数字，一下子又变成字符串，那么解释器就得做额外的工作，例如把原本的变量销毁再创建一个新的变量，同时代码可读性也会变差。

所以提倡：

- 定义变量的时候要告诉解释器变量的类型；
- 不要随便改变变量的类型；
- 函数返回值类型是要确定的。

## 理解 JS 与多线程

### OS 的任务调度

1. 交互式进程
需要有大量的交互，如 vi 编辑器，大部分时间处于休眠状态，但是要求响应要快。
2. 批处理进程
运行在后台，如编译程序，需要占用大量的系统资源，但是可以慢点。
3. 实时进程
需要立即响应并执行，如视频播放器软件，它的优先级最高。

### 任务调度方式

- 实时进程或者说它的实时线程的优先级最高，先来先运行，直到执行完了，才执行下一个实时进程。
- 对于普通线程使用时间片轮询，每个线程分配一个时间片，当前线程用完这个时间片还没执行完，就排到当前优先级一样的线程队列的队尾。

### 线程同步

由于 Web Workers 是不可以操作 DOM 的。线程同步主要是靠锁来实现的，锁可以分成三种：

1. 互斥锁
在改变某个 DOM 元素的高度时，先把这块代码的执行给锁住了，只有执行完了才能释放这把锁，其他线程运行到这里的时候也要去申请那把锁，但是由于这把锁没有被释放，所以她就堵塞在那里了，只有等到锁被释放了，它才能拿到这把锁再继续加锁。
互斥锁使用太多会导致性能下降，因为线程堵塞在那里，它要不断地查那个锁能不能用了，所以要占用 CPU。
2. 读写锁
读写锁限制可同时读，但不可同时写。同理只要有一个线程在写，另外的线程就不能读。
3. 条件变量
条件变量是为了解决生产者和消费者的问题，由于用互斥锁和读写锁会到站i线程一直堵塞在那里占用 CPU，而使用信号通知的方式可以先让堵塞的线程进入睡眠方式，等生产者生产出东西后通知消费者，唤醒它进行消费。

### JS 没有线程同步的概念

JS 的多线程无法操作 DOM，没有 window 对象，每个线程的数据都是独立的，主线程传给子线程的数据也是通过拷贝复制，同样的子线程给主线程的数据也是通过拷贝复制，而不是共享同一块内存区域。

## 学会 JS 与面向对象

面向对象是对世界物件的抽象和封装。

### 面向对象的特点

面向对象有三个主要的特点：封装、继承和多态

#### 面向对象编程原则和设计模式

1. 单例模式

确保一个类仅有一个实例，并提供一个访问它的全局访问点

##### 不透明的，知道的人可以通过 Singleton.getInstance() 获取对象，不知道的需要研究代码

```js
// 1:
function getSingleton(name) {
  this.name = name;
  this.instance = ''
}

getSingleton.getName = function() {
  return this.name
}

getSingleton.getInstance = function(name) {
  if(!this.instance) {
    this.instance = new getSingleton(name);
  }
  return this.instance
}

// 2: 闭包的方式

function getSingleton(name) {
  this.name = name;
  this.instance = null
}

getSingleton.prototype.getName = function() {
  return this.name
}

getSingleton.prototype.getInstance = (function(){
  var instance = null
  return function(name) {
    if (!this.instance) {
      this.instance = getSingleton(name)
    }
    return instance
  }
})
```

##### 透明的

```js
function getSingleton(name) {
  this.name = name
}

getSingleton.prototype.getName = function() {
  return this.name;
}
var Singleton = (function() {
  let instance = null;
  return function(name) {
    if(!instance) {
      instance = new getSingleton(name)
    }
    return instance
  }
})
```

##### 惯性单例模式；只有当触发创建实例对象的时候，实例对象才能被创建。

```js
var getSingleton = (function(fn) {
  let instance = null
  return function() {
    return instance || (instance = fn.apply(this, arguments))
  }
})()

var  createMask = function() {
  let mask = document.createElement('div');
  mask.style.position = 'fixed'
  mask.style.top = '0'
  mask.style.left = '0'
  mask.style.bottom = '0'
  mask.style.right = '0'
  mask.style.background = '#000'
  mask.style.opacity = '0.7'
  mask.style.display = 'none'
  mask.style.zIndex = '98'
  document.body.appendChild('mask)

  mask.onClick = function() {
    this.style.display = 'none'
  }
  return mask
}

var createLogin = function() {
  // 创建div元素
  var login = document.createElement('div');
  // 设置样式
  login.style.position = 'fixed';
  login.style.top = '50%';
  login.style.left = '50%';
  login.style.zIndex = '100';
  login.style.display = 'none';
  login.style.padding = '50px 80px';
  login.style.backgroundColor = '#fff';
  login.style.border = '1px solid #ccc';
  login.style.borderRadius = '6px';

  login.innerHTML = 'login it';

  document.body.appendChild(login);

  return login;
};

document.getElementById('btn').onClick = function() {
  var mask = getSingleton(createMask)()
  mask.style.display = 'block'
  var login = getSingleton(createLogin)()
  login.style.display = 'block'
}
```

2. 策略模式

定义一系列的算法，把它们一个个封装起来，并且使他们可以相互替换。

策略模式的优先如下：

- 策略模式利用组合、委托等技术和思想，有效的避免很多 if 条件语句
- 策略模式提供开放-封闭原则，使代码更容易理解和扩展
- 策略模式中的代码可以复用。

```js
var obj = {
  A: function(salary) {
    return salary * 4
  },
  B: function(salary) {
    return salary * 3
  },
  C: function(salary) {
    return salary * 2
  }
};
var calculateBonus = function(level, salary) { 
  return obj[level](salary)
}
```



```js
// 策略对象
var strategy = {
  isNotEmpty: function(value, errorMsg) {
    if(value === '') {
      return errorMsg
    }
  },
  minLength: function(value, length, errorMsg) {
    if(value.length < length) {
      return errorMsg
    }
  },
  mobileFormat: function(value, errorMsg) {
    if(!/(^1[3|5|9][0-9]{9}$)/.test(value)) {
      return errorMsg;
    }
  }
};
var Validator = function() {
  this.cache = [];  // 保存校验规则
}

Validator.prototype.add = function(dom, rules) {
  var self = this;
  for(var i = 0, rule; rule = rules[i++]; ) {
    (function(rule) {
      var strategyAry = rule.strategy.split(':');
      var errorMsg = rule.errorMsg;
      self.cache.push(function() {
        var strategy = strategyAry.shift();
        strategyAry.unshift(dom.value);
        strategyAry.push(errorMsg)
        return strategy[strategy].apply(dom, strategyAry);
      })
    })(rule)
  }
}
```

3. 观察者模式

观察者模式又叫发布订阅模式(Publish/Subscribe)，它定义了一种一对多的关系，让多个观察对象同事监听某一个主题对象，这个主题对象的状态发生变化时就会通知所有的观察者对象，使得他们能够自动更新自己。

使用观察者的好处：

  1. 支持简单的广播通信，自动通知所有已经订阅过的对象
  2. 页面载入后，目标对象很容易与观察者存在一种动态的关联，增加了灵活性
  3. 目标对象与观察者之间的抽象耦合关系能够单独扩展以及重用

```js
var Event = function() {
  var obj = {
    events: {}
  };
  obj.on = function(key, event) {
    if (!obj.events[key]) {
      obj.events[key] = []
    }
    obj.events[key].push(event)
  }
  obj.once = function(key, event) {
    obj.events[key] = [];
    this.on(key, event)
  }
  obj.trigger = function(key, params) {
    if(!obj.events[key]) return key + ' undefined';
    obj.events[key].forEach(item => {
      if (Object.prototype.toString.call(item) !== '[object Function]') return false;
      item.call(this, params)
    })
  }
  obj.off = function(key) {
    obj.events[key] = []
  }
  return obj
}
```

```typescript
export interface Listener {
  cb: Function;
  once: boolean;
}

export interface EventsType {
  [eventName: string]: Listener[];
}

export default class OnFire {

  static ver = '__VERSION__';

  // 所有事件的监听器
  es: EventsType = {};

  on(eventName: string, cb: Function, once: boolean = false) {
    if (!this.es[eventName]) {
      this.es[eventName] = [];
    }

    this.es[eventName].push({
      cb,
      once,
    });
  }

  once(eventName: string, cb: Function) {
    this.on(eventName, cb, true);
  }

  fire(eventName: string, ...params: any[]) {
    const listeners = this.es[eventName] || [];

    let l = listeners.length;

    for (let i = 0; i < l; i ++) {
      const { cb, once } = listeners[i];

      cb.apply(this, params);

      if (once) {
        listeners.splice(i, 1);
        i --;
        l --;
      }
    }
  }

  off(eventName?: string, cb?: Function) {
    // clean all
    if (eventName === undefined) {
      this.es = {};
    } else {
      if (cb === undefined) {
        // clean the eventName's listeners
        delete this.es[eventName];
      } else {
        const listeners = this.es[eventName] || [];
        // clean the event and listener
        let l = listeners.length;
        for (let i = 0; i < l; i ++) {
          if (listeners[i].cb === cb) {
            listeners.splice(i, 1);
            i --;
            l --;
          }
        }
      }
    }
  }

  // cname of fire
  emit(eventName: string, ...params: any[]) {
    this.fire(eventName, ...params);
  }
}
```

## 了解 SQL

### Web SQL

#### 关系数据库

关系数据库是由一张张的二维表组成的，SQL 是一种操作关系型 DB 的语言，支持创建表，插入表、修改和删除等等，还提供非常强大的查询功能。

关系型数据库支持非常复杂的查询，可以联表查询、使用正版表达式查询，嵌套查询，还可以写一个独立的 SQL 脚本；缺点是不方便横向扩展，例如给数据库表添加一个字段，如果数据量达到亿级，那么操作的复杂性将会是非常可观。海量数据用 SQL 联表查询，性能会非常差。关系型数据库为了保持事务的一致性特定，难以应对高并发。

#### 非关系型数据库

1. key-value 型，如 Redis/IndexedDB，value 可以为任意数据类型
2. JSON/document 型，如 MongoDB，value 按照一定格式，可对 value 的字段做索引，IndexDB 也支持。

在一般非关系型数据库里面，每个数据存储的类型都可以不一样，即每个 key 对应的 value 的 JSON 字段格式可以不一致，所以不存在添加字段的问题，而相同的字段可以创建索引，提高查询效率

## 学习常用的前端算法与数据结构

使用递归的优点是代码简单易懂，缺点是效率上比不上非递归的实现。

给两个数组，需要找出第一个数组里面的重复值和非重复值，即有一个数组保存上一次状态的房源，而另一个数组是当前状态的新房源数据。找到的重复值需要保留，找到非重复值是要删掉的。

### 双重循环

对新数据的每个元素，判断老数据里面是否已经有了，如果有的话则说明是重复值，如果老数据循环一遍都没有找到，则说明是新数据。由于用到了双重循环，所以这个算法的时间复杂度是 O(n^2)，对于百级数据还好，对于千级数据可能会有压力，因为最坏的情况下要比较 1000000 次。

### 使用 set

```js
let lastHouse = new Set();
let remainHouses = [];
let newHouses = [];
if (lastHouse.has(house[i].id)) {
  remainHouses.push(house[i])
}
else {
  newHouses.push(house[i])
}
```

使用 Set 和使用 Array 的区别在于可以减少一重循环，调用 Set.prototype.has 的函数。Set 一般是使用 红黑树实现的，红黑树是一种平衡查找二叉树，它的查找时间复杂度为 O(logN)。所以时间浮渣度进行了改进。从 O(N) 变成了 O(logN)，而总体时间从 O(N^2) 变成了 O(N*logN)

### 使用 Map

```ecmascript 6
let lastHouse = new Map();

if (lastHouse.has(house.id))
```

哈希的查找复杂度为 O(1)，因此总的时间复杂度为 O(N)，Set/Map 都是这样，代价是哈希的存储时间通常为数据大小的两倍。

### 数组去重

1. 使用 Set + Array

```ecmascript 6
function uniqueArray(arr) {
  return Array.from(new Set(arr))
}
```

优点: 代码简洁，速度快，时间复杂度为 O(N)；
缺点: 需要一个额外的 Set 和 Array 的存储空间，空间复杂度为 O(N)。

2. 使用 splice 去重

优点：不需要使用额外的存储空间，空间复杂度为 O(1)
缺点：需要频繁的内存移动，双重循环，时间复杂度为 O(N^2)

splice 删除元素使用的是**内存移动**，并不是写一个 for 循环一个个复制，内存移动的速度还是很快的，1s 可以达到几个 G 级别。

3. 只用 Array

时间复杂度为 O(N^2)，空间复杂度为 O(N)

4. 使用 Object + Array

使用 Object[key] 进行哈希查找，所以它的时间复杂度为 O(N)，空间复杂度为 O(N)

### 节流函数

```js
function throttling(method, time) {
  if (typeof method.aId === undefined) {
    method.call(context);
    method.aId = 0
  }
  if (!method.aId) {
    method.aId = setTimeout(() => {
      method()
      method.aId = 0;
    }, time)
  }
}
```

### 图像处理

使用 CSS 的 filter 属性，支持吧图片置成灰色的

```css
img {
    filter: grayscale(100%);
}
```

用 canvas 获取图片数据

```js
let img = new Image()
img.src = './test.png'
img.onload = function() {
  ctx.drawImage(this, 10, 10)
}

function blackWhite() {
  let imgData = ctx.getImageData(10, 10, 31, 30)
  ctx.putImageData(imgData, 50, 10)
}

function getImgDataURL() {
  let data = ctx.toDataURL()
  console.log(data);
}
```

toDataURL 是 canvas 对象自身的方法，这个方法会将 canvas 的内容提取出一张图片（base64 编码）。是受同源策略限制的

## 同源策略和跨域

因为同源策略的限制，不同域名、协议或者端口无法直接进行 AJAX 请求。同源策略只针对于浏览器端，浏览器一旦检测到请求的结果的域名不一致后，会阻塞请求结果。这里注意，**跨域请求是可以发出去的，但是请求响应 response 被浏览器阻塞了**。

如果要带上 cookie 的话设置 xhr 的 withCredentials 属性为 true。

### CSRF 攻击

由于同源策略的限制，跨域的 AJAX 请求不会带上 cookie，然后 script/iframe/img 等标签却支持跨域的，所以在请求的时候是会带上 cookie 的。

防 CSRF 攻击的策略就是将 token 添加到请求的参数里面，也就是说每个需要验证身份的请求都要显式地带上 token 值，或者是写的请求不能支持 get。

### 跨越请求

1. 跨域资源共享 (CORS)

Access-Control-Allow-Origin 就是所谓的资源共享了，它的值 * 表示允许任意网站想这个接口请求数据，也可以设置成指定的域名。

2. JSONP

原理是浏览器告诉服务一个回调函数的名称，服务在返回的 script 里面调用这个回调函数，同时传入客户端需要的数据，这样返回的代码就能在浏览器上执行了。

JSONP 和 CORS 相比较，缺点是只支持 get 类型，无法支持 post 等其他类型，必须完全信任提供的服务的第三方，优点是兼容古董级别的浏览器。

3. 子域跨父域

子域跨父域是支持的，但是需要显式将子域的域名改成父域的。例如 mail.mysite.com 要访问 mysite.com 的 iframe 数据，那么要在 mail.mysite.com 脚本里需要执行如下代码：

```js
document.domain = 'mysite.com'
```

这样就可以和父域进行交互，但是向父域请求还是会跨域，因为这种更改 domain 只是支持 client side，并不是 client to server。

4. iframe 跨父窗口

父域无法直接读取不同源的 iframe 的 DOM 内容以及监听事件，但是 iframe 可以调用父窗口提供的 api。iframe 可以通过 window.parent 得到父窗口的 window 对象，然后父窗口定义一个全局对象宫 iframe 调用。

5. window.postMessage

通过 window.postMessage，父窗口向 iframe 传递一个消息，而 iframe 中监听消息事件。

postMessage 执行的上下文必须是接收信息的 window，传递两个参数，第一个是数据，第二个是目标窗口。

```js
window.onload = function() {
  window.frames[0].postMessage('hello, this is from http://localhost:8000/', 'http://server.com:9000/')
}

function receiveMessage(event) {
  let origin = event.origin || event.originalEvent.origin;
  if (origin !== 'http://localhost:8000') { return }
  console.log('receiveMessage: ', event.data);
}

window.addEventListener('message', receiveMessage);
```

iframe 也可以向父窗口发送消息

```js
window.parent.postMessage('hello, this is from http://server/com:9000', 'http://localhost:8000')
```

## 掌握前端本地文件操作和上传

[代码详情](https://codepen.io/yingzhe/pen/eYpGxjz?editors=0010)

文件的路径是一个假的路径，也及时说在浏览器中无法获取到文件的真实存放地址。同时 FormData 打印出来是一个空的 Object，但并不是说它的内容是空的，只是它对前端开发人员是透明的，无法查看、修改、删除里面的内容，只能 append 添加字段。

使用 FileReader 可以读取整个文件的内容，用户选择文件后，input.files 就可以得到用户选中的文件。

如果 xhr.send 是 FormData 类型，会自动设置 enctype。如果用默认表单提交上传文件的话就得在 form 上设置这个属性，因为上传文件只能使用 post 的这种编码。

### css 居中方式

1. 垂直居中

借助 table-cell 的垂直居中，给父容器添加如下代码：

```css
.my-container {
    display: table-cell;
    vertical-align: middle;
}
```

为了让中间的内容能够在 container 里上下居中，可以设置文字的 line-height 为 container 的高度，那么文字就上下居中了，由于照片和文字是垂直居中的，所以照片在 container 里也上下居中了。

```css
.my-container span {
    vertical-align: middle;
    line-height: 150px;
}
```

如果需要垂直居中一个比 div 里的比 div 高度小的照片，可以添加一个元素，让他的 line-height 等于 div 的高度。

还有一种方法是借助 absolute 定位和 margin: auto，

```css
.my-container {
    position: relative;
}
.my-container img {
    position:absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}
```

[照片居中布局](https://codepen.io/yingzhe/pen/rNOGRLz)

照片有一边和 container 一样高，另外一边按照照片的比例缩放，照片居中显示，超出的截断，这种应该叫占满布局，这种情况，只需要吧 left/right/bottom/top 设置一个很大的负值即可。

```html
<!--如果不设置容易的 line-height 为 0，下方将会有留白-->
<div class="my-container" style="border: 1px solid #ccc; width: 232px;line-height: 0">
    <img src="" alt="">
    <span>photo</span>
</div>
```

### 常用的 CSS 布局技术

#### 三栏布局-左右栏各 100px，中间随浏览器的宽度自适应

1. table 布局

设置 table 的宽度为 100%，三个 td，第一个和第三个固定宽度为 100px，那么中间那个就会自适应

2. float 布局

[flat 三栏布局](https://codepen.io/yingzhe/pen/rNOGRLz?editors=1100)

flex-shrink 的作用是定义收缩比例，容器内的子元素宽度若超出容器的宽度时，将按比例收缩子元素的宽度，使得宽度和等于容器的宽度。将前面三个 span/img 的 flex-shrink 设置为 0，而 p 的 flex-shrink 设置为 1，这样子使得溢出的宽度都在 p 标签减去，就能够达到 p 标签自适应的效果。

使用 flex 兼容 IE

```js
let div = document.createElement('div')
div.style.display = 'flex'
if(div.style.display !== 'flex' && div.style.display !== '-webkit-flex') {
  document.getElementsByTagName('body')[0].className += ' no-flex'
}
```

考虑到浏览器可能不支持 grid，那么你可以用 @supports

```css
@supports (display: grid) {
    div {
        display: grid;
    }
}

@supports not(display: grid) {
    div { float: left;}
}
```

## 明白移动端 click 及自定义事件

设置 viewport

```html
<meta name="viewport" content="width=device-width">
```

即把 viewport 设置成设备的实际像素，那么就不会有 300ms 的延迟。

如果设置 initial-scale=1.0，在 Chrome 上是可以生效的，但是 Safari 上不会。

```html
<meta name="viewport" content="initial-scale=1.0">
```

第三种是设置 CSS，这样也可以取消掉 300ms 延迟，Chrome 和 Safari 都可以生效。

```css
html {
    touch-action: manipulation;
}
```