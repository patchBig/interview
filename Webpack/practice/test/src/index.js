// ES Module 模块引入方式
// CommonJS 模块引入
// CMD
// webpack 模块打包工具
// JS 模块打包工具 -> 

// import Header from './js/header.js'
// import Content from './js/content.js'
// import SideBar from './js/sidebar.js'

// import avatar from '../images/a.png'
// import createAvatar from './js/createAvatar'

// const a = require('../a.png')
// import style from  '../src/css/index.scss'

// createAvatar()

// var img = new Image()
// img.src = avatar;
// img.classList.add(style.avatar) 

// var root = document.querySelector('#root')
// root.append(img)

// var Header = require('./header.js')
// var Content = require('./content.js')
// var SideBar = require('./sidebar.js')

//  new Header();
//  new SideBar()
//  new Content()

import './css/index.scss'
var root = document.querySelector('#root')

root.innerHTML = ('<div class="kw-icon-replay"> </div>')
