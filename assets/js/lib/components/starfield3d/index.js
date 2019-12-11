import { Tools } from 'objects/tools/geometry'
export class StarFieldComponent {
  constructor (app, config = {}) {
    this.defaults = {
      numStars: 1000,
      applyFilter: true,
      applyMask: true
    }

    this.finallgth = 0
    this.dy = 0
    this.time = 0
    this.app = app
    this.config = Object.assign(this.defaults, config)
    this.width = this.app.screen.width
    this.height = this.app.screen.height

    this.mask = this.config.shapemask.getmask()

    this.field = new PIXI.projection.Container3d()
    this.field.anchor = new PIXI.Point(0.5, 0.5)
    this.field.x = -this.width * 1.5
    this.field.y = -this.height * 1.5
    this.field.scale.x = 2
    this.field.scale.y = 2
    this.stars = []

    this.container = new PIXI.projection.Container3d()
    this.container.anchor = new PIXI.Point(0.5, 0.5)
    this.container.x = this.width / 2
    this.container.y = this.height / 2
    this.container.addChild(this.field)

    this.app.stage.addChild(this.container)

    this.px = this.app.width / 2
    this.py = this.app.height / 2
    this.mouse = this.config.mouse
    this.mouse.pos = new PIXI.Point(0, 0)

    if (this.config.applyMask) this.container.mask = this.mask

    if (this.config.applyFilter) {
      this.displacementSprite = new PIXI.Sprite.from('/dist/images/cloud.jpg')
      this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
      this.displacementSprite.scale.x = 0.3
      this.displacementSprite.scale.y = 0.3
      this.app.stage.addChild(this.displacementSprite)
      this.filter = new PIXI.filters.DisplacementFilter(this.displacementSprite)
      this.filter.scale = new PIXI.Point(0.1, 0.1)
      this.container.filters = [this.filter]
    }

    this.camera = this.config.camera.getCamera()
    this.camera.addChild(this.container)
    this.wtex = new PIXI.Texture(PIXI.Texture.WHITE)
    this.setup()
    this.init()
  }

  init () {
    const bg = new PIXI.projection.Sprite3d(PIXI.Texture.WHITE)
    bg.tint = 0x000000
    bg.position3d.z = 2
    bg.position.x = 0
    bg.position.y = 0
    bg.width = this.width * 2
    bg.height = this.height * 2
    this.field.addChild(bg)

    for (let i = 0; i < this.config.numStars; i++) {
      const part = new PIXI.projection.Sprite3d(this.wtex)
      part.anchor = new PIXI.Point(0.5, 0.5)
      part.width = 5
      part.height = 5

      part.position.x = Math.random() * this.app.screen.width
      part.position.y = Math.random() * this.app.screen.height
      part.position3d.z = 20 + Math.random() * 1000

      this.stars.push(part)
      this.field.addChild(part)
    }
    this.field.isSprite = true
  }

  getTexture () {
    const tex = this.field.Texture
  }

  drawfield () {
    this.stars.forEach((star, index) => {
    })
    this.field.position3d.z += Math.cos(this.time)
  }

  setup () {
    this.app.ticker.add(delta => this.onTick(delta))
  }

  distord (amp) {
    this.vertices.forEach((vertex, index) => {
      vertex.point.y += Math.cos(this.time + index * 0.8) * amp
    })
  }

  animateFilter () {
    this.finallgth = this.mouse.getmouseInfluenceMap(new PIXI.Point(this.container.x, this.container.y), 20, 500, 0, 20)
    this.displacementSprite.x += this.finallgth / 7
    this.filter.scale = new PIXI.Point(this.finallgth / 2, 0)
  }

  onTick (delta) {
    this.cond = this.mouse.isIn()
    console.log(this.cond)

    if (this.config.applyFilter && this.cond) {
      this.animateFilter()
    }
    this.time += 0.01
    this.drawfield()
  }
}
