# Module

In modular programming,developers break programs up into discrete chunks of functionality called a module.

Each module has a smaller duface are than a full program,making verification, debugging, and testing trivial. Well-written modules provide solid abstractions and encapsulation boundaries, so that each module has coherent design and a clear purpose within the overall application.

Node.js has supported modular programming almost since its inception. On the web, however,support for modules has been slow to arrive. Multiple tools exist that support modular javascript on the web, with a variety od benefits and limitations.webpack builds on lessons learned from these systems and applies the concept of modules to any file in your project.

## module methods

### import()

> function(string path):Promise

Dynamically load modules.Calls to import() are treated as a split points, meaning the requested module and its children are split out into a separate chunk.

> this feature relies on Promise internally.If you use import() with older browsers, remember to shim Promise using a polyfill such as es6-promise or promise-polyfill.

#### Dynamic expressions in import()

It's not possible to use a fully dynamic import statement, such as import(foo).Because foo could potentially be any path to any file in your system or project.

The import() must contain at least some imformation about where the module is located. Bundling can be limited to a specific directory or set of files so that when you are using a dynamic expression - every module that could potentially be requested on an import() call is included.
