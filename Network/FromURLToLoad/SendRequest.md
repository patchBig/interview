### HTTPS 请求

HTTPS 在传输数据之间需要客户端与服务器进行一个握手(TLS/SSL握手)，在握手过程中将确立双方加密传输数据的密码信息。TLS/SSL 使用了非对称加密，对称加密以及 hash 等。

1. 客户端给出协议版本号，一个客户端生成的随机数（Client random），以及客户端支持的加密方法
2. 服务器端确认双方使用的加密方法，并给出数字证书，以及一个服务器生成的随机数（Server random）。
3. 客户端确认证书有效，然后生成一个新的随机数（Premaster secret），并使用数字证书中的公钥，加密这个随机数，发送给服务器端。
4. 服务器使用自己的私钥，获取客户端发来的随机数（即 Premaster secret）。
5. 客户端和服务器端根据约定的加密方法，使用前面的三个随机数，生成“对话密钥”(session key)，用来加密接下来的整个对话过程。

#### 私钥的作用

- 生成对话密钥一共需要三个随机数
- 握手之后的对话使用“对话密钥”加密(对称加密)，服务器的公钥和私钥只用于加密和解密“对话密钥”（非对称加密），无其他作用。
- 服务器公钥放在服务器的数字证书之中。

#### session 的恢复

1. session ID
    每次对话都有一个编号(session ID)。如果对话中断，下次重连的时候，只要客户端给出这个编号，且服务器有这个编号的记录，双方就可以重新使用已有的“对话密钥”，而不必重新生成一把。
    session ID 是目前所有浏览器都支持的方法，但是他的缺点在于 session ID 往往只保留在一台服务器上
2. session ticket
    客户端不再发送 session ID，而是发送一个服务器在上一次对话中发送过来的 session ticket。这个 session ticket 是加密的，只有服务器才能解密。当服务器收到 session ticket 以后，解密后就不必重新生成对话密钥了。
