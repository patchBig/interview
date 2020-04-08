import avatar from '../../images/a.png'
import style from '../css/index.scss'

function createAvatar() {
  var img = new Image()
  img.src = avatar;
  img.classList.add(style.avatar) 

  var root = document.querySelector('#root')
  root.append(img)
}

export default createAvatar;