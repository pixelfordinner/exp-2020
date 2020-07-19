import { timingSafeEqual } from 'crypto'
import { Tools } from 'objects/tools/geometry'

export class CameraComponent {
  constructor (app, config = {}) {
    this.defaults = {
      width: app.screen.width,
      heigth: app.screen.height

    }
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))
    this.time = 0
    this.config = Object.assign(this.defaults, config)
    this.camera = new PIXI.projection.Camera3d()
    this.camera.sortChildren = true
    this.camera.position.set(this.app.screen.width / 2, this.app.screen.height / 2)
    this.camera.position3d.z = -30
    this.camera.setPlanes(450, 100, 10000)
    // this.camera.euler.x = Math.PI / 2
    this.app.stage.addChild(this.camera)
    this.mouse = this.config.mouse
    // this.setup()
  }

  getCamera () {
    return this.camera
  }

  animate () {
    // console.log(this.mouse.getWorldpos())
    // this.mp = this.mouse.worldPos
    // const parallaxH = Tools.map(this.mp.x, -this.app.screen.width / 2.5, this.app.screen.width / 2.5, -Math.PI, Math.PI)
    // const parallaxV = Tools.map(this.mp.y, -this.app.screen.height / 2.5, this.app.screen.height / 2.5, -Math.PI, Math.PI)
    // console.log([parallaxH, parallaxV])
    // this.camera.euler.y = (parallaxH) / 60
    // this.camera.euler.x = (parallaxV) / 60
  }

  onTick (delta) {
    this.time += 0.01
  }

  onResize () {
    this.camera.position.set(this.app.screen.width / 2, this.app.screen.height / 2)
  }
}
