function SideBar() {
  var sidebar = document.createElement('div');
  sidebar.innerText =  'sidebar'
  var dom = document.querySelector('#root')
  dom.append(sidebar)
}


// export default SideBar;
module.exports = SideBar;