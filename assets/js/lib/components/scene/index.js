import { Tools } from 'objects/tools/geometry'

export class SceneComponent {
  constructor (app, config = {}) {
    this.defaults = {

    }
    this.config = Object.assign(this.defaults, config)
    this.time = 0
    app.ticker.add(delta => this.onTick(delta))
    this.scene = new PIXI.projection.Container3d()
    this.scene.sortableChildren = true
    this.camera = this.config.camera.getCamera()
    this.camera.addChild(this.scene)
  }

  onTick (delta) {
    this.time++
  }
}
