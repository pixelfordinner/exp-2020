
export class StarFieldComponent {
  constructor (app, config = {}) {
    this.defaults = {
      numStars: 1000
    }
    this.app = app
    this.width = this.app.screen.width
    this.height = this.app.screen.height
    this.time = 0
    this.config = Object.assign(this.defaults, config)
    this.stars = []
    this.field = new PIXI.projection.Container3d()
    this.filter = new PIXI.filters.BlurFilterPass(5, 2, 10, 10)
    console.log(PIXI.filters)

    this.field.position.x = -this.width / 2
    this.field.position.y = -this.height / 2
    this.camera = this.config.camera.getCamera()
    this.wtex = new PIXI.Texture(PIXI.Texture.WHITE)
    this.setup()
    this.init()
  }

  init () {
    for (let i = 0; i < this.config.numStars; i++) {
      const part = new PIXI.projection.Sprite3d(this.wtex)
      part.anchor = new PIXI.Point(0.5, 0.5)
      part.width = 5
      part.height = 5

      part.position.x = Math.random() * this.app.screen.width
      part.position.y = Math.random() * this.app.screen.height
      part.position3d.z = -1000 + Math.random() * 2000
      this.stars.push(part)

      this.field.addChild(part)
      // this.camera.addChild(part)

      // console.log(part.position3d.z)
    }
    this.camera.addChild(this.field)
    // this.app.stage.addChild(this.field)
  }

  drawfield () {
    this.stars.forEach((star, index) => {
      // console.log(star.position3d.s + this.time)

      this.stars[index].position3d.z += Math.cos(this.time)
    })
    // this.field.filter = this.filter
  }

  setup () {
    this.app.ticker.add(delta => this.onTick(delta))
  }

  onTick (delta) {
    this.time += 0.01
    this.drawfield()
  }
}
