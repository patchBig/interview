# 前言

在现代浏览器在使用CSS3动画时，以下四种情形绘制的效率较高，分别是：

- 改变位置
- 改变大小
- 旋转
- 改变透明度

## transform 是否可以避免重排重绘问题

css 的最终表现分成以下四步：Recalculate Style -> Layout -> Paint Setup and Paint -> Composite Layers

由于 transform 是位于 Composite Layers 层，而 width、left、margin 等则是位于 Layout 层，在 Layout 层发生的变化必定导致 Paint Setup and Paint -> Composite Layers，所以相对而言使用 Transform 实现的动画效果肯定比 left 这些流畅。

就算抛开这一角度，在另一方面浏览器也会针对 transform 等开启 GPU 加速。

***Recalculate Style***

重新计算样式，它计算的是 style，和 Layout 做的事情完全不同。Layout 计算的是一个元素的绝对的位置和尺寸，或者说是 "compute Layout"。

Recalculate 被触发的时候做的事情就是处理 JavaScript 给元素设置的样式而已。Recalculate Style 会计算 Render 树（渲染树），然后从根节点开始进行页面渲染，将 CSS 附加到 DOM 上的过程。

任何企图改变元素样式的操作都会触发 Rectangle。同 Layout 一样，他也是在 JavaScript 执行完成后才触发的。

***Layout***

计算页面上的布局，即元素在文档中的位置及大小，正如前面所述，Layout 计算的是布局位置信息。任何有可能改变元素位置或大小的样式都会触发这个 Layout 事件。

***Rasterizer***

光栅化，一般的安卓手机都会进行光栅化，光栅主要是针对图形的一个栅格化过程，低端手机在这部分的耗时还是蛮多的。

***Paint***

页面上显示的东西有任何的变动都会触发 Paint。包括拖动滚动条，鼠标选择中文字等这些完全不改变样式，只改变显示结果的动作都会触发 Paint。

Paint 的工作就是把文档中用户可见的那一部分展示给用户。Paint 是 Layout 和 Recalculate 的计算结果直接在浏览器视窗上绘制出来，它并不实现具体的元素计算。

***Image Decode***

图片解码，将图片解析到浏览器上显示的过程

***Image Resize***

图片的大小设置，图片加载解析后，若发现图片大小并不是实际的大小（CSS 改变了宽度），则需要 Resize。Resize 越大，耗时越久，所以尽量以图片的原始大小输出。

***Composite Layers***

最后合并图层，输出页面到屏幕。浏览器在渲染过程中会将一些含有特殊样式的 DOM 结构绘制与其他图层，有点类似于 PS 的图层概念。一张图片在 PS 是由多个图层组合而成，而浏览器最终显示的页面实际上也是有多个图层构成的。

下面这些因素都会导致新图层的创建：

- 进行 3D 或者透视变换的 CSS 属性
- 使用硬件加速视频解码的 video 元素
- 具有 3D （webGL）上下文或者硬件加速的 2D 上下文 的 Canvas 元素
- 组合型插件 （flash）
- 具有 CSS 透明度动画或者使用动画式 Webkit 变换的元素
- 具有硬件加速的 CSS 滤镜的元素

如果图层中某个元素需要绘制，那么整个图层都需要重绘。比如一个图层包含很多节点，其中有个 gif 图，gif 图的每一帧，都会重回整个图层的其他节点，然后生成最终的图层位图。所以这个需要通过特殊的方式来强制 gif 图属于自己的一个图层（translateZ(0) 或者 translate3d(0,0,0)），CSS3 的动画也是一样的（大部分浏览器自己会为 CSS3 动画的节点创建图层）

改变 transform 和 opacity 属性，就属于是影响图层的组合。现代浏览器都对变换和透明度采用硬件加速。

### 透明度不会触发重绘

在透明度变化后，CPU 在绘画时只是简单的降低之前已经画好的纹理的 alpha 值来达到效果，并不需要整体的重绘。不过这个前提是这个被修改 opacity 本身必须是一个图层，如果图层下还有其他节点，GPU 也会将他们透明化。

## 无线性能优化：Composite

![图片](../img/从%20Nodes%20到%20LayoutObjects.png)

### 从 Nodes 到 LayoutObjects

DOM 树中的每个 Node 节点都有一个对应的 LayoutObject。 LayoutObject 知道如何在屏幕上 Paint Node 的内容。

### 从 LayoutObject 到 PaintLayers

一般来说，拥有相同的坐标空间的 LayoutObjects，属于同一个渲染层（PaintLayer）。PaintLayer 最初是用来实现 stacking context（层叠上下文），以此来保证页面元素以正确的顺序合成（composite），这样才能正确的展示元素的重叠以及半透明元素等等。因此满足形成层叠上下文条件的 LayoutObject 一定会为其创建新的渲染层，当然还有其他的一些特殊情况，为一些特殊的 LayoutObjects 创建一个新的渲染层，比如 overflow != visible 的元素。根据创建 PaintLayer 的原因不同，可以将其分为常见的 3 类：

- NormalPaintLayer
  - 根元素（HTML）
  - 有明确的定位属性（relative、fixed、sticky、absolute）
  - 透明的（opacity 小于 1）
  - 有 CSS 滤镜（filter）
  - 有 CSS mask 属性
  - 有 CSS transform 属性（不为 none）
  - background-visibility 属性为 hidden
  - 有 CSS reflection 属性
  - 有 CSS column-count 属性（不为 auto）或者 CSS column-width 属性（不为 auto）
  - 当前有对于 opacity、transform、filter、backdrop-filter 应用动画

- overflowClipPaintLayer
  - overflow 不为 visible

- NoPaintLayer
  - 不需要 paint 的 PaintLayer，比如一个没有视觉属性（背景、颜色、阴影等）的空 div。

满足以上条件的 LayerObject 会拥有独立的渲染层，而其他的 LayoutObject 则和其第一个拥有渲染层的父元素共用一个。

#### 从 PaintLayer 到 GraphicsLayers

某些特殊的渲染层会被认为是合成层（compositing Layers），合成层拥有单独的 GraphicsLayer，而其他不是合成层的渲染层，则和其第一个拥有 GraphicsLayer 父层共用一个。

每个 GraphicsLayer 都有一个 GraphicsContext，GraphicsContext 会负责输出该层的位图，位图是存储在共享内存中，作为纹理上传到 GPU 中，最后由 GPU 将多个位图进行合成，然后 draw 到屏幕上，此时，我们的页面也就展示到屏幕上。

#### 提升动画效果的元素

合成层的好处是不会影响到其他元素的绘制，因此，为了减少动画元素对其他元素的影响，从而减少 Paint，我们需要把动画效果中的元素提升为合成层。

提升合成层的最好方式是使用 CSS 的 will-change 属性。从上一节合成层产生的原因中，可以知道 will-change 设置为 opacity、transform、top、left、bottom、right 可以将元素提升为合成层。

    #target {
        will-change: transform;
    }

对于目前还不支持 will-change 属性的浏览器，目前常用的是使用一个 3D transform 属性来强制提升为合成层。

但需要注意的是，不要创建太多的渲染层。因为每创建一个新的渲染层，就意味着新的内存分配和更复杂的层的管理。

#### 使用 transform 或者 opacity 来实现动画效果

从性能方面考虑，最理想的渲染流水线是没有布局和绘制环节的，只需要做合成层的合并即可。

为了实现上述的效果，就只需要使用那些仅触发 Composite 的属性。目前，只有两个属性是满足这个条件的：transforms 和 opacity。

注意：元素提升为合成层后，transform 和 opacity 才不会触发 Paint，如果不是合成层，则其依然会触发 paint。

#### 减少绘制区域

对于不需要重新绘制的区域应尽量避免绘制，已减少绘制区域。可以通过之前的方法，将其提升为独立的合成层。

#### 合理管理合成层

提升合成层会达到更好的性能，但问题是，创建一个新的合成层并不是免费的，它得消耗额外的内存和管理资源。实际上在内存资源有限的设备上，合成层带来的性能改善，可能远远赶不上过多合成层开销给页面性能带来的负面影响。同时，由于每个渲染层的纹理都需要上传到 GPU 处理，因此我们还需要考虑 CPU 和 GPU 之间的带宽问题，以及有多大内存供 GPU 处理这些纹理的问题。

之前无线开发时，大多数人都很喜欢用 translateZ(0) 来进行所谓的硬件加速，以提升性能，但是性能优化并没有所谓的“银弹”，translateZ(0) 不是，本文列出的优化建议也不是。抛开了对页面的具体分析，任何的性能优化都是站不住脚的，盲目使用一些优化措施，结果可能会适得其反。因此切实的去分析页面的实际性能表现，不断的改进测试，才是正确的优化途径。

参考链接：

- [前端性能优化（CSS动画篇）](https://segmentfault.com/a/1190000000490328#articleHeader11)
- [无线性能优化：Composite）](https://fed.taobao.org/blog/2016/04/26/performance-composite/)
