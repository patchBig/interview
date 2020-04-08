# autodll-webpack-plugin

## Important Note

Now, that webpack 5 planning to support caching out-of-the-box, AutoDllPlugin will soon be obsolete.

In the meantime, I would like to recommend Michael Goddard's hard-source-webpack-plugin, which seems like webpack 5 is going to use internally.

## Introduction

Webpack's own DllPlugin it great, it can drastically reduce the amount of time needed to build (and rebuild) your bundles by reducing the amount of work meeds to be done.

If you think about it, most of the code in your bundles come from NPM modules that you're rarely going to touch. You know that, but Webpack doesn't. So every time it compiles it has to analyze and build them too - and that takes time.

The DllPlugin allows you to create a separate bundle in advance for all of those modules, and teach Webpack to reference them to that bundle instead.

That leads to a dramatic reduction in the amount of times Webpack to build your bundles.

### The DllPlugin sounds great! So why AutoDllPlugin

While the DllPlugin has many advantages, it's main drawback is that it requires a lot of boilerplate.

AutoDllPlugin serves as a high-level plugin for both the DllPlugin and  the DllReferencePlugin, and hides away most of their complexity.

When you build your bundle for the first time, the AutoDllPlugin Complies the Dll for you, and references all the specified modules from your bundle to the DLL.

The next time you compile you code,AutoDllPlugin will skip the build and read from the cache instead.

AutoDllPlugin will rebuild your DLLs every time you change the Plugin's configuration, install for remove a node module.

When using Webpack's Dev Server, the bundle are loaded into the memory preventing unnecessary read from the fileSystem.

With the way the DllPlugin works,you must load the DLL bundles before your own bundle, This is commonly accomplished by adding an additional script tag to the HTML.

Because that is such a common task,AutoDllPlugin can do this for you (in conjunction with the HtmlPlugin).
