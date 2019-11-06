# 浏览器解析渲染页面

The browser parses out the HTML source code (tag soup) and constructs a DOM tree - a data representation where every HTML tag has a corresponding node in the tree and text chunks between tags get a text node representation too. The node in the DOM tree is the documentElement (the <html> tag).

The browser parses the CSS code, make sense of it given the bunch of hacks that could be there and the number of -moz, -webkit and other extensions it doesn't understand and will bravely ignore. The Styling information cascades: the basic rules are in the User Agent stylesheets(the browser defaults), then there could be user stylesheets, author(as in author of the page) stylesheets - external, imported, inline, and finally styles that are coded into the style attributes of the HTML tag

Then comes the interesting part - constructing a render tree. The render tree is sort of like the DOM tree, but doesn't match it exactly. The render 
tree knows about styles, so if you're hiding a div with display:none, it won't be represented in the render tree. Same for the other invisible elements, like head and everything in it. On the other hand, there might be DOM elements that are represented with more than one node in the render tree - like text nodes for example where every line in a <p> needs a render node. A node in the render tree in called a frame, or a box(as in a  CSS box, according to the box model). Each a these nodes has the CSS box properties - width, height, border, margin, etc

Once the render tree is constructed, the browser can paint (draw) the render tree nodes on the screen.

Let's take an example.

HTML source

    <html>
        <head>
            <title>Beautiful page</title>
        </head>
        <body>
            <p>
                Once upon a time there was a looong paragraph...
            </p>
            <div style="display: none">
                Secret message
            </div>
            <div><img src="..." /></div>
        </body>
    </html>

The DOM tree that represents this HTML document basically has one node for each tag and one text node for each piece of text between nodes (for simplicity let's ignore the fact that whitespace is text nodes too):

    documentElement (html)
        head
            title
        body
            p
                [text node]
            
            div
                [text node]
            
            div
                img
            
            ...

The render tree would be the visual part of the DOM tree. It is missing stuff - the head and the hidden div, but it has additional nodes (aka frames, aka boxes) for the lines of text.

The root node of the render tree is the frame (the box) that contains all other elements. You can think of it as being the inner part of the browser window , as this is the restricted area where the page could spread. Technically WebKit calls the root node RenderVIew and it corresponds to the CSS initial containing block, which id basically the viewport rectangle from the top of the page(0,0) to (window.innerWidth, window.innerHeight)

Figuring out what and how exactly to display on the screen involves a recursive walk down (a flow) through the render tree.

## Repaint and reflows

there's always at least one initial page layout together with a paint ( unless, of course you prefer you pages blank :)). After that, changing the input information which was used to construct the render tree may result in one or both of these:

1. parts of the render tree (or the whole tree) will need to be revalidated and the node dimensions recalculated. This is called a reflow, or layout, or layouting.(or "relayout" which I made up so I have more "R"s in the title, sorry,my bad).Note that there's at least one reflow - the initial layout of the page.
2. parts of the screen will need to be updated, either because of changes in geometric properties of a node or because of stylistic changes, such as changing the background color. This screen update in called a repaint, or a redraw.

Repaints and reflows can be expansive, they can hurt the user experience, and make the UI appear sluggish.

## what triggers a reflow or a repaint

Anything that changes input information used to construct the rendering tree can cause a repaint or reflow, for example:

- Adding,removing, updating DOM nodes
- Hiding a DOM node with display: none (reflow and repaint) or visibility: hidden (repaint only,because no geometry changes)
- Moving,animating a DOM node on the page
- Adding a stylesheet, tweaking style properties
- User action such as resizing the window,changing the front size, or (oh ,OMG, no!) scrolling

Let's see a few example:

    ```js
        var bStyle = document.body.style;   // cache
        bStyle.padding = '20px';    // reflow, repaint
        bStyle.border = '10px solid red'    // another reflow and a  repaint
        bStyle.color = 'blue' //repaint only, no dimensions changed
        bStyle.backgroundColor = 'red'  // repaint
        bStyle.fontSize = '2px' // reflow, repaint

        document.body.appendChild(document.createTextNode('dude!'))
    ```

Some reflows may be more expensive than others. think of render tree - if you fiddle with a node way down the tree that is a direct descendant of the body, then you're  probably not invalidating a lot of other nodes. But what about when you animate and expand a div at the top of the page which then pushes down the rest of the page - that sounds expensive.

## Browsers are smart

The browser will setup a queue of the changes your scripts require and perform them in batches. This way several changes that each require a reflow will be combined and only one reflow will be computed. Browsers can add to the queued changes and the flush the queue once a certain number of changes is reached.

1. offsetTop, offsetLeft, offsetWidth, offsetHeight
2. scrollTop/Left/Width/Height
3. clientTop/Left/Width/Height
4. getComputedStyle(),or currentStyle in IE

All of these above are essentially requesting style information about a node, and any time you do it, the browser has to give you the most up-to-date value.In order to do so, it needs to apply all scheduled changes, flush the queue, bite the bullet and do the reflow.

For example, its a bad idea to set and get styles in a quick succession(in a loop), like:

    ```js
     // no=no!
    el.style.left = el.offsetLeft + 10 + 'px'
    ```

## Minimizing repaints and reflows

- Don't change individual styles, one by one.Best for sanity and maintainability is to change the class names not the styles.But that assumes static styles. If the styles are dynamic, edit the cssText property as opposed to touching the element and its style property for every little changes.

    // bad
    var left = 10,
        top = 10;
    el.style.left = left + "px";
    el.style.top  = top  + "px";

    // better
    el.className += " theclassname";

    // or when top and left are calculated dynamically...

    // better
    el.style.cssText += "; left: " + left + "px; top: " + top + "px;";

- Batch DOM changes and perform them "offline".Offline means not in the live DOM tree. You can:
  - use a documentFragment to hold temp changes,
  - clone the node you're about to update, work on the copy, then swap the original with the updated clone
  - hide the element with display: none (1 reflow, repaint), add 100 changes, restore the display(another reflow, repaint). This way you trade 2 reflows for potentially a hundred.

- Don't ask for computed styles excessively. If you need to work a computed value, take it once,cache to a local var and work the local copy.Revisiting the no-no example from above:

    // no-no!
    for(big; loop; here) {
        el.style.left = el.offsetLeft + 10 + "px";
        el.style.top  = el.offsetTop  + 10 + "px";
    }

    // better
    var left = el.offsetLeft,
        top  = el.offsetTop
        esty = el.style;
    for(big; loop; here) {
        left += 10;
        top  += 10;
        esty.left = left + "px";
        esty.top  = top  + "px";
    }

- In general, think about the render and how much of it will need revalidation after your change. For example using absolute positioning makes that element a child of the body in the render tree, so it won't affect too many other nodes when you animate it for example.Some of the other nodes may be in the area that needs repainting when you place you element on top of them, but they will not require reflow.

JS 的解析是由浏览器中的 JS 解析引擎完成的。JS 是单线程运行，也就是说，在同一时间内只能做一件事，所有的任务都需要排队，前一个任务结束吗，后一个任务才能开始。但是又存在某些任务比较耗时，如 IO 读写等，所以需要一种机制可以先执行排在后面的任务，这就是：同步任务和异步任务。JS 的执行机制就可以看做是一个主线程加上一个任务队列（task queue）。同步任务就是放在主线程上执行的任务，异步任务就是放在任务队列中的任务。所有的同步任务在主线程上执行，形成一个执行栈；异步任务有了运行结果就会在任务队列中放置一个事件；脚本运行时先依次执行栈，然后会从任务队列里提取事件，运行任务队列中的任务，这个过程是不断重复的，所以又叫做事件循环（Event loop）。

浏览器在解析过程中，如果遇到请求外部资源时，如图像，iconfont, JS 等，浏览器会重复过程下载资源，请求过程是异步的，并不会影响 HTML 文档进行加载，但是在文档加载过程中遇到 JS 文件，HTML 文档会挂起渲染过程，不仅要等到文档中 JS 文件加载完毕还要等待解析执行完毕，才会继续 HTML 的渲染过程。原因是因为 JS 有可能修改 DOM 结构，这就意味着 JS 执行完成前，后续所有资源的下载是没有必要的，这就是 JS 阻塞后续资源下载的根本原因。CSS 文件的加载不影响 JS 文件的加载，但是却影响 JS 文件的执行，JS 代码执行前浏览器必须保证 CSS 文件已经下载并加载完毕。
