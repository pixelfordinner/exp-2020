export class CosmosComponent {
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

    this.initField()
    this.initStars()

    this.initContainer()

    this.initMouse()
    this.initCamera()
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

  initContainer () {
    this.container = new PIXI.projection.Container3d()
    this.container.anchor = new PIXI.Point(0.5, 0.5)
    this.container.x = this.width / 2
    this.container.y = this.height / 2
    // this.container.addChild(this.verso)
    this.container.addChild(this.field)
    this.app.stage.addChild(this.container)
  }

  initMouse () {
    this.mouse = this.config.mouse
    this.mouse.pos = new PIXI.Point(0, 0)
  }

  initCamera () {
    this.camera = this.config.camera.getCamera()
    this.camera.addChild(this.container)
  }

  initStars () {
    this.bg = new PIXI.projection.Sprite3d(this.wtex)
    this.bg.tint = 0x000000
    this.bg.position3d.z = 1000
    this.bg.anchor = new PIXI.Point(0.5, 0.5)
    this.bg.position.x = this.width / 2
    this.bg.position.y = this.height / 2
    // this.bg.position3d.z = 200
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
      if (star.position3d.z <= 3000 && star.position3d.z >= 0) {
        star.position3d.z -= 30
      }
      if (star.position3d.z <= 0) {
        star.position3d.z = 3000
      }
    })
  }

  getParallax () {
    this.parallax = this.mouse.getParallax2()
    this.container.euler.y = this.parallax.x / 40
    this.container.euler.x = this.parallax.y / 50
  }

  onTick (delta) {
    this.time += 0.01
    this.drawfield()
    this.getParallax()
  }
}
