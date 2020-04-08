 function Content() {
  var content = document.createElement('div');
  content.innerText =  'content'
  var dom = document.querySelector('#root')
  dom.append(content)
}
// export default Content;

module.exports = Content;