import { Tools } from 'objects/tools/geometry'

import { LeafClusterComponent } from 'components/leafcluster'

export class SceneComponent {
  constructor (app, config = {}) {
    this.defaults = {
    }
    this.config = Object.assign(this.defaults, config)
    this.time = 0
    this.wind = 0.5
    this.speed = 0.01
    this.bounds = {
      minHeight: 560,
      minWidth: 320,
      maxWidth: 1920,
      maxHeight: 1080,
      maxDepth: 1000
    }
    app.ticker.add(delta => this.onTick(delta))
    this.palette = this.config.palette
    this.scene = new PIXI.projection.Container3d()
    this.scene.sortableChildren = true
    this.camera = this.config.camera.getCamera()
    this.camera.addChild(this.scene)
  }

  onTick (delta) {
    this.time++
  }
}
