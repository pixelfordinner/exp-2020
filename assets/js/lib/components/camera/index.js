export class CameraComponent {
  constructor (app, config = {}) {
    this.defaults = {
      width: app.screen.width,
      heigth: app.screen.height

    }
    this.app = app
    this.time = 0
    this.config = Object.assign(this.defaults, config)
    this.camera = new PIXI.projection.Camera3d()
    this.camera.position.set(this.app.screen.width / 2, this.app.screen.height / 2)
    this.camera.position3d.z = 0

    this.camera.setPlanes(350, 230, 1000)
    this.camera.euler.x = 0
    this.app.stage.addChild(this.camera)
    this.setup()
  }

  setup () {
    this.app.ticker.add(delta => this.onTick(delta))
  }

  getCamera () {
    return this.camera
  }

  onTick (delta) {
    this.time += 0.05
    // this.camera.position3d.z = Math.cos(this.time) * 30
    // this.camera.euler.y = Math.cos(this.time / 20) * Math.PI
    // console.log(this.camera.position3d.z)
  }
}
