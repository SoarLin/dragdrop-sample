// 載入 style
import '../sass/style.sass'

// 載入圖片檔
import '../images/*.*'

// load jQuery
import jquery from 'jquery'
export default (window.$ = window.jQuery = jquery)

var mySwiper = new Swiper('.swiper-container', {
  // Optional parameters
  slidesPerView: 'auto',
  touchStartPreventDefault: false,

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
})

function dragStart(e) {
  let target = e.currentTarget;
  let id = $(target).data('id')
  console.log('dragStart, id = ' + id);
  e.originalEvent.dataTransfer.setData('text/plain', id)
}

function dropped(e) {
  console.log('dropped')
  cancelDefault(e)
  let id = e.originalEvent.dataTransfer.getData('text/plain')
  let imgSrc = $(`.swiper-slide[data-id="${id}"]`).find('img')[0].src
  let dom = `<div class="drop-image"><img src="${imgSrc}"></div>`
  $(e.currentTarget).append(dom)
}

function cancelDefault(e) {
  e.preventDefault()
  e.stopPropagation()
  return false
}

$('.swiper-slide').on('dragstart', dragStart)
$('#dropArea').on('drop', dropped)
$('#dropArea').on('dragenter', cancelDefault)
$('#dropArea').on('dragover', cancelDefault)