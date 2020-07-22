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

    this.mouse = this.config.mouse
  }

  getCamera () {
    return this.camera
  }

  getParallax () {
    this.parallax = this.mouse.getParallax2()
    this.camera.euler.y = -this.parallax.y / 5
    this.camera.euler.x = -this.parallax.x / 5

    this.camera.position3d.y = (this.parallax.x * 1000)
    this.camera.position3d.x = (this.parallax.y * 1000)
  }

  onTick (delta) {
    this.time += 0.01
    this.time++
    if (this.mouse.pos.x > 0) {
      this.getParallax()
    }
  }

  onResize () {
    this.camera.position.set(this.app.screen.width / 2, this.app.screen.height / 2)
  }
}
