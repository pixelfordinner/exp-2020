import { Tools } from 'objects/tools/geometry'

export class StarFieldComponent {
  constructor (app, config = {}) {
    this.defaults = {
      numStars: 100,
      applyFilter: false,
      applyMask: false
    }

    this.finallgth = 0
    this.dy = 0
    this.time = 0
    this.app = app
    this.config = Object.assign(this.defaults, config)
    this.width = this.app.screen.width
    this.height = this.app.screen.height
    this.wtex = new PIXI.Texture(PIXI.Texture.WHITE)
    this.setup()
  }

  setup () {
    this.app.ticker.add(delta => this.onTick(delta))
    this.initMask()
    this.initField()
    this.initStars()
    this.initVerso()
    this.initContainer()
    this.initMouse()
    this.initFilter()
    this.initCamera()
  }

  initMask () {
    this.shape = this.config.shapemask
    this.mask = this.shape.getmask()
  }

  initField () {
    this.field = new PIXI.projection.Container3d()
    this.field.anchor = new PIXI.Point(0.5, 0.5)
    this.field.x = -this.width * 1.5
    this.field.y = -this.height * 1.5
    this.field.scale.x = 2
    this.field.scale.y = 2
    this.stars = []
  }

  initVerso () {
    this.verso = new PIXI.projection.Sprite3d(this.wtex)
    this.verso.tint = 0xff0000
    this.verso.anchor = new PIXI.Point(0.5, 0.5)
    this.verso.width = 4000
    this.verso.height = 4000
    this.verso.euler.y = 0
    this.verso.position3d.x = 0
    // this.verso.y = -this.app.height / 2
    this.verso.position3d.z = 100
    // this.container.addChild(this.verso)
  }

  initContainer () {
    this.container = new PIXI.projection.Container3d()
    this.container.anchor = new PIXI.Point(0.5, 0.5)
    this.container.x = this.width / 2
    this.container.y = this.height / 2
    this.container.addChild(this.verso)
    this.container.addChild(this.field)
    // this.container.addChild(this.field)

    this.app.stage.addChild(this.container)
  }

  initFilter () {
    if (this.config.applyMask) this.container.mask = this.mask

    if (this.config.applyFilter) {
      this.filter = this.config.filter
      this.container.filters = [this.filter.filter]
    }
  }

  initMouse () {
    this.mouse = this.config.mouse
    this.mouse.pos = new PIXI.Point(0, 0)
  }

  initCamera () {
    this.camera = this.config.camera.getCamera()
    this.camera.addChild(this.container)
    // this.camera.addChild(this.verso)
    // this.camera.addChild(this.bg)
    // this.camera.addChild(this.field)
  }

  initStars () {
    this.bg = new PIXI.projection.Sprite3d(this.wtex)
    this.bg.tint = 0x000000
    this.bg.position3d.z = 2
    this.bg.position.x = 0
    this.bg.position.y = 0
    this.bg.position3d.z = 200
    this.bg.width = this.width * 2
    this.bg.height = this.height * 2
    this.field.addChild(this.bg)

    for (let i = 0; i < this.config.numStars; i++) {
      const part = new PIXI.projection.Sprite3d(this.wtex)
      part.anchor = new PIXI.Point(0.5, 0.5)
      part.width = 5
      part.height = 5
      part.position.x = Math.random() * this.app.screen.width * 2 - this.app.screen.width / 2
      part.position.y = Math.random() * this.app.screen.height * 2 - this.app.screen.height / 2
      part.position3d.z = 20 + Math.random() * 3000
      this.stars.push(part)
      this.field.addChild(part)
    }
    this.field.isSprite = true
  }

  drawfield () {
    this.stars.forEach((star, index) => {
      if (star.position3d.z < 3000 && star.position3d.z > 0) {
        star.position3d.z--
      } else {
        star.position3d.z = 3000
      }
    })
    // this.field.position3d.z += Math.cos(this.time)
  }

  animateFilter () {
    this.xp = this.shape.container.position3d.x
    this.yp = this.shape.container.position3d.y

    this.finallgth = this.mouse.getMouseInfluenceMap(new PIXI.Point(this.xp, this.yp), 50, 500, 20, 0)
    this.filter.displacementSprite.x += this.finallgth / 7
    this.filter.filter.scale = new PIXI.Point(this.finallgth / 2, this.finallgth / 2)
  }

  onTick (delta) {
    const isOn = this.shape.container.isflipped
    // console.log(isOn)
    if (!this.shape.container.isflipped) {
      this.field.renderable = false
    } else {
      this.field.renderable = true
    }

    this.mouseReady = this.mouse.isIn()
    if (this.config.applyFilter && this.mouseReady) {
      this.animateFilter()
    }
    this.time += 0.01
    this.drawfield()
  }
}
