
export class StarFieldComponent {
  constructor (app, config = {}) {
    this.defaults = {
      numStars: 10000
    }
    this.app = app
    this.width = this.app.screen.width
    this.height = this.app.screen.height
    this.time = 0
    this.config = Object.assign(this.defaults, config)
    this.mask = this.config.mask
    // console.log(this.mask)

    this.shape = this.config.avatar
    this.stars = []

    this.field = new PIXI.projection.Container3d()

    this.field.mask = this.mask

    // this.field.tint = 0x0000ff
    // this.field.isSprite = true
    // this.field.tint = 0x0000ff

    this.filter = new PIXI.filters.BlurFilter()
    this.filter2 = new PIXI.filters.NoiseFilter()
    this.filter.blur = 3
    this.filter.noise = 0.2

    this.field.filters = [this.filter, this.filter2]

    this.field.position.x = -this.width
    this.field.position.y = -this.height

    this.camera = this.config.camera.getCamera()
    this.wtex = new PIXI.Texture(PIXI.Texture.WHITE)
    this.setup()
    this.init()
  }

  init () {
    const bg = new PIXI.projection.Sprite3d(PIXI.Texture.WHITE)

    bg.tint = 0x000000
    bg.position3d.z = 20
    bg.position.x = this.width / 2
    bg.position.y = this.height / 2
    bg.width = this.width
    bg.height = this.height
    this.field.addChild(bg)

    for (let i = 0; i < this.config.numStars; i++) {
      const part = new PIXI.projection.Sprite3d(this.wtex)
      part.anchor = new PIXI.Point(0.5, 0.5)
      part.width = 5
      part.height = 5

      part.position.x = Math.random() * this.app.screen.width * 2
      part.position.y = Math.random() * this.app.screen.height * 2
      part.position3d.z = -200 + Math.random() * 1000
      // part.tint = 0x0000ff
      // this.filter.blur = 30 / part.position3d.z
      // part.filters = [this.filter]
      this.stars.push(part)
      // part.filter = this.filter
      this.field.addChild(part)
    }
    this.field.isSprite = true
    console.log(this.field)

    // console.log(this.filter)

    this.camera.addChild(this.field)
  }

  drawfield () {
    // this.field.
    this.stars.forEach((star, index) => {
      // this.stars[index].position3d.y += Math.cos(0.0001 * this.time * index) * 10
    })
    this.field.position3d.y += Math.cos(this.time)
  }

  setup () {
    this.app.ticker.add(delta => this.onTick(delta))
  }

  distord (amp) {
    this.vertices.forEach((vertex, index) => {
      // vertex.point.y += Math.cos(this.time + index * 0.8) * amp
    })
  }

  onTick (delta) {
    this.time += 0.01
    // this.field.tint = 0xff00ff
    // console.log(this.field)

    this.drawfield()
  }
}
