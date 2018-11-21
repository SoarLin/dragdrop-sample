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
      src: Images.yoona.jpg
    },
    {
      id: '1-2',
      src: Images.happy.jpg
    },
    {
      id: '1-3',
      src: Images.ame.jpg
    }
  ],
  '2': [{
      id: '2-1',
      src: Images.iu1.jpg
    },
    {
      id: '2-2',
      src: Images.iu2.jpg
    },
    {
      id: '2-3',
      src: Images.iu3.jpg
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

    // clone 一份
    let cloneDrag = Object.assign(Object.create(Object.getPrototypeOf(draging)), draging)
    this.jqDOM.append(cloneDrag.drop)
    cloneDrag.setAbsoultePosition(e.offsetX - cloneDrag.offsetX, e.offsetY - cloneDrag.offsetY)

    let isExist = this.elements.some((e) => {
      return this.isEquivalent(e, draging)
    })
    if (!isExist) {
      this.elements.push(cloneDrag)
    }
  }

  cancelDefault(e) {
    e.preventDefault()
    e.stopPropagation()
    return false
  }
}
// 拖曳中物體(全域變數)
var draging
// 初始化被放置的區塊
var dropArea = new DropArea()

function dragStart(e) {
  let id = $(e.currentTarget).data('id')
  console.log('dragStart, id = ' + id);
  draging = new DragElement(id, e.offsetX, e.offsetY)
}

$('.swiper-slide').on('dragstart', dragStart)

// 切換場景
$('.js-scenes-table td').on('click', function (e) {
  let target = e.currentTarget
  let clickSceneId = $(target).data('id')

  if (SCENES[clickSceneId] !== undefined) {
    // console.log('清除 mySwiper 內所有圖片')
    mySwiper.removeAllSlides()

    // console.log(`載入場景${clickSceneId}的圖片`)
    SCENES[clickSceneId].forEach((img) => {
      let slide = `<div class="swiper-slide" data-id="${img.id}" draggable="true">
            <img src="${img.src}" alt="" class="thumb-img">
          </div>`
      mySwiper.appendSlide(slide)
    })
    // 重新綁上拖曳事件
    $('.swiper-slide').on('dragstart', dragStart)
  }

  // sidebar未開啟 or 選到不同場景 => toggle
  if (!sidebar.isOpen || sidebar.sceneId === clickSceneId) {
    sidebar.toggleClass()
  }
  sidebar.replaceContent(clickSceneId)
})