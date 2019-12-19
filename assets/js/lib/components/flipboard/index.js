import { Tools } from 'objects/tools/geometry'

export class FlipboardComponent {
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

    this.recto = this.config.recto_scene.container
    this.initVerso()
    this.initContainer()

    this.initMouse()
    this.initCamera()

    if (this.config.applyFilter) this.initFilter()
    if (this.config.applyMask) this.initMask()
  }

  initMask () {
    this.shape = this.config.avatar
    // this.mask = this.shape.getmask()
    this.mask = this.shape.container

    // this.app.stage.addChild(this.smask)
    this.container.mask = this.mask
  }

  initVerso () {
    this.verso = new PIXI.projection.Sprite3d(this.wtex)
    this.verso.tint = 0xff0000
    this.verso.anchor = new PIXI.Point(0.5, 0.5)
    this.verso.width = 4000
    this.verso.height = 4000
    this.verso.euler.y = 0
    this.verso.position3d.x = 0
    this.verso.position3d.z = 100
  }

  initContainer () {
    this.container = new PIXI.projection.Container3d()
    this.container.anchor = new PIXI.Point(0.5, 0.5)
    this.container.x = this.width / 2
    this.container.y = this.height / 2
    this.container.addChild(this.verso)
    this.container.addChild(this.recto)
    this.app.stage.addChild(this.container)
  }

  initFilter () {
    // this. maskContainer =

    this.filter = this.config.filter
    this.container.filters = [this.filter.filter]
    //  }

    // if (this.config.applyMask) this.container.mask = this.mask
  }

  initMouse () {
    this.mouse = this.config.mouse
    this.mouse.pos = new PIXI.Point(0, 0)
  }

  initCamera () {
    this.camera = this.config.camera.getCamera()
    this.camera.addChild(this.container)
  }

  animateFilter () {
    this.xp = this.shape.container.position3d.x
    this.yp = this.shape.container.position3d.y

    this.finallgth = this.mouse.getMouseInfluenceMap(new PIXI.Point(this.xp, this.yp), 50, 500, 20, 0)
    this.filter.displacementSprite.x += this.finallgth / 7
    this.filter.filter.scale = new PIXI.Point(this.finallgth / 2, this.finallgth / 2)
  }

  onTick (delta) {
    if (!this.shape.container.isflipped) {
      this.recto.renderable = false
      this.verso.renderable = true
    } else {
      this.recto.renderable = true
      this.verso.renderable = false
    }

    this.mouseReady = this.mouse.isIn()
    if (this.config.applyFilter && this.mouseReady) {
      this.animateFilter()
    }
    this.time += 0.01
  }
}
