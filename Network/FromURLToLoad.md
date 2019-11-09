# 从输入URL到页面加载发生了什么

具体来说有以下几个过程：

1. [DNS 解析](./FromURLToLoad/DNSAnalysis.html)
2. [TCP 连接](./FromURLToLoad/TCPLink.html)
3. [发送 http 请求](./FromURLToLoad/SendRequest.html)
4. [服务器处理请求并返回 HTTP 报文](./FromURLToLoad/HandleRequest.html)
5. [浏览器渲染解析页面](./FromURLToLoad/ClientAnalyze.html)
6. 连接结束

参考链接:
- [从输入URL到页面加载发生了什么](https://segmentfault.com/a/1190000006879700)
- [http 缓存](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching_FAQ)
- [简述TCP连接的建立与释放](https://zhuanlan.zhihu.com/p/24860403)
- [TCP 的特性](https://hit-alibaba.github.io/interview/basic/network/TCP.html)
- [图解SSL/TLS协议](http://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html)
- [socket连接和http连接的区别](https://blog.csdn.net/wwd0501/article/details/52412396)
- [WebSocket 是什么原理？为什么可以实现持久连接？](https://www.zhihu.com/question/20215561)
- [GET 和 POST 到底有什么区别？](https://www.zhihu.com/question/28586791)
- [http 状态码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
- [Rendering: repaint, reflow/relayout, restyle](https://www.phpied.com/rendering-repaint-reflowrelayout-restyle/)
- [翻译计划-重绘重排重渲染](https://xdlrt.github.io/2016/11/05/2016-11-05/)
