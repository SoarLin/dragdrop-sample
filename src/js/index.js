// 載入圖片檔
import '../images/*.*'

// import jquery
import './import-jquery.js'

// 載入 Semantic-UI css
import '../semantic/dist/semantic.min.css'

// 載入 style
import '../sass/style.sass'

// load Semantic-UI js
import '../semantic/dist/semantic.min.js'

$('.js-sidebar')
  .sidebar({
    context: '#mainContainer'
  })
  .sidebar('setting', {
    dimPage: false,
    closable: false,
    transition: 'overlay'
  })

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

// 切換場景
$('.js-scenes-table td').on('click', function (e) {
  let target = e.currentTarget
  let sceneId = $(target).data('id')
  console.log('清除 mySwiper 內所有圖片')
  console.log(`載入場景${sceneId}的圖片`)
  console.log('sidebar內換成場景相關內容')
  $('.ui.sidebar').sidebar('toggle')
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