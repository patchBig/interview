# Keep Webpack Fast: A Field Guide for Better Build Performance

Webpack is a brilliant tool for bundling frontend assets. When things start to slown down, though, its batteries-included nature and the ocean of third-party tooling can make it difficult to optimize. Poor performance is the norm and not the expection. But it does't have to be that way, and so -- after many hours of research, tiral, and error -- what follows is a field guide offering up what we learned on our path towards a faster build.

## In the land before time

2017 was an ambitious years for the frontend team at Slack. After a few years of rapid development, we had a lot of technical debt and plans to modernize on a grand scale. Top of mind: rewriting our UI components in React and making wide use of modern Javascript syntax. Before we could hope to achieve any of that,though,we needed a build system capable of supporting a nebula of new tooling.

Up to this point, we'd survived with little more than file concatenation, and while it had gotten us this far it was clear it would get us no further. A real build system was needed.And so, as a powerful starting point and for its community, familiarity, and feature set, we chose webpack.

For the most part our transition to webpack was smooth. Smooth, that is, until it came to build performance. Our build took minutes, not seconds: a far cry from the sub-second concatenation we were used to.Slack's web teams deploy up to 100 times on any given work day, so we felt this increase acutely.

Build performance has long been a concern among webpack's user base and, while the core team has worked furiously over the past few months to improve it, there are many steps you can take to improve your own build. The techniques below helped us reduce our build time by a factor of 10, and we want to share them in case they help others.

## Before you begin, measure

In crucial to understand where time is being before you attempt to optimize. Webpack isn't forthcoming with this information but there are other ways to get what you need.

### The node inspector

Node ships with an [inspector](https://nodejs.org/en/docs/guides/debugging-getting-started/) that can be used to profile builds. Those unfamiliar with performance profiling need not be discouraged: Google has worked hard to explain how to do so in great detail. A rough understanding of the phases of a webpack build will be of great benefit here and while [their documentation](https://webpack.js.org/concepts/) covers this in brief you may find it just as effective to read though some of the [core](https://github.com/webpack/webpack/blob/b597322e3cb701cf65c6d6166c39eb6825316ab7/lib/Compilation.js) [code](https://github.com/webpack/webpack/blob/0975d13da711904429c6dd581422c755dd04869c/lib/Compiler.js).

Note that if your build is sufficiently large(think hundreds of modules or longer than a minute), you may need to break your profiling into sections to prevent your developer tools from crashing.

### long-term logging

Profiling helped us identify the slow parts of our build up front, but it wasn't suited to the observation of trends over time. We wanted each build to report granular timing data so that we could see how much time was spent in each of our expensive steps( transpilation, minification, and localization) and to determine whether our optimizations were working.
