function Header() {
  var header = document.createElement('div');
  header.innerText =  'header'
  var dom = document.querySelector('#root')
  dom.append(header)
}

// export default  Header;
module.exports = Header;