// 載入圖片檔
import Images from '../images/*.*'

// import jquery
import './import-jquery.js'

// 載入 Semantic-UI css
import '../semantic/dist/semantic.min.css'

// 載入 style
import '../sass/style.sass'

// load Semantic-UI js
import '../semantic/dist/semantic.min.js'

// 定義場景下圖片
var SCENES = {
  '1': [{
      id: '1-1',
      src: Images.yoona.jpg,
      used: false
    },
    {
      id: '1-2',
      src: Images.happy.jpg,
      used: false
    },
    {
      id: '1-3',
      src: Images.ame.jpg,
      used: false
    }
  ],
  '2': [{
      id: '2-1',
      src: Images.iu1.jpg,
      used: false
    },
    {
      id: '2-2',
      src: Images.iu2.jpg,
      used: false
    },
    {
      id: '2-3',
      src: Images.iu3.jpg,
      used: false
    }
  ]
}

// 左側 sidebar
class Sidebar {
  constructor() {
    this.jqDOM = $('.js-sidebar')
    this.isOpen = false
    this.sceneId = -1

    this.jqDOM.sidebar({
        context: '#mainContainer'
      })
      .sidebar('setting', {
        dimPage: false,
        closable: false,
        transition: 'overlay',
        onShow: () => {
          this.isOpen = true
        },
        onHidden: () => {
          this.isOpen = false
        }
      })
  }

  toggleClass() {
    this.jqDOM.sidebar('toggle')
  }

  replaceContent(sceneId) {
    this.jqDOM.text(`替換成場景${sceneId}的內容`)
    this.sceneId = sceneId
  }
}
var sidebar = new Sidebar()

// 場景圖片 swiper
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

// 被拖曳的物件
class DragElement {
  constructor(id, offsetX, offsetY) {
    this.id = id
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.init()
  }

  init() {
    this.imgSrc = $(`.swiper-slide[data-id="${this.id}"]`).find('img')[0].src
    this.drop = $('<div>', {
      class: 'drop-image',
      html: `<img src="${this.imgSrc}">`
    })
  }

  disabledOrigin() {
    SCENES[CurrentSceneID].forEach((img) => {
      if (img.id === this.id) {
        img.used = true
      }
    })
    $(`.swiper-slide[data-id="${this.id}"]`)
      .addClass('dragged')
      .removeAttr('draggable')
      .unbind('dragstart')
  }

  setAbsoultePosition(x, y) {
    this.drop.css({
      top: y,
      left: x
    })
  }
}

// 被丟東西的區塊
class DropArea {
  constructor() {
    this.jqDOM = $('#dropArea')
    this.elements = []
    this.init()
  }

  init() {
    this.jqDOM.on('drop', this.dropped.bind(this))
    this.jqDOM.on('dragenter', this.cancelDefault.bind(this))
    this.jqDOM.on('dragover', this.cancelDefault.bind(this))
  }

  isEquivalent(a, b) {
    // origin: http://adripofjavascript.com/blog/drips/object-equality-in-javascript.html
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }

  dropped(e) {
    this.cancelDefault(e)

    if (draging === undefined) return

    // clone 一份
    let cloneDrag = Object.assign(Object.create(Object.getPrototypeOf(draging)), draging)
    this.jqDOM.append(cloneDrag.drop)
    let posX = e.originalEvent.clientX - cloneDrag.offsetX
    let posY = e.originalEvent.clientY - cloneDrag.offsetY
    cloneDrag.setAbsoultePosition(posX, posY)
    cloneDrag.disabledOrigin()

    let isExist = this.elements.some((e) => {
      return this.isEquivalent(e, draging)
    })
    if (!isExist) {
      this.elements.push(cloneDrag)
    }
    draging = undefined
  }

  cancelDefault(e) {
    e.preventDefault()
    e.stopPropagation()
    return false
  }
}
// 目前場景
var CurrentSceneID = -1
// 拖曳中物體(全域變數)
var draging
// 初始化被放置的區塊
var dropArea = new DropArea()

function dragStart(e) {
  let id = $(e.currentTarget).data('id')
  console.log('dragStart, id = ' + id);
  draging = new DragElement(id, e.offsetX, e.offsetY)
}

$('.swiper-slide:not(.dragged)').on('dragstart', dragStart)

// 切換場景
$('.js-scenes-table td').on('click', function (e) {
  let target = e.currentTarget
  CurrentSceneID = $(target).data('id')

  if (SCENES[CurrentSceneID] !== undefined) {
    // console.log('清除 mySwiper 內所有圖片')
    mySwiper.removeAllSlides()

    // console.log(`載入場景${CurrentSceneID}的圖片`)
    SCENES[CurrentSceneID].forEach((img) => {
      let dragable = (!img.used) ? 'draggable="true"' : ''
      let hasUsedClass = (img.used) ? 'dragged' : ''
      let slide = `<div class="swiper-slide ${hasUsedClass}" data-id="${img.id}" ${dragable}>
            <img src="${img.src}" alt="" class="thumb-img">
          </div>`
      mySwiper.appendSlide(slide)
    })
    // 重新綁上拖曳事件
    $('.swiper-slide:not(.dragged)').on('dragstart', dragStart)
  }

  // sidebar未開啟 or 選到不同場景 => toggle
  if (!sidebar.isOpen || sidebar.sceneId === CurrentSceneID) {
    sidebar.toggleClass()
  }
  sidebar.replaceContent(CurrentSceneID)
})