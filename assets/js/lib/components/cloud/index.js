import { CloudShadingTexture } from 'components/textures/cloud'
import { Tools } from 'objects/tools/geometry'

export class CloudComponent {
  constructor (app, config = {}) {
    this.defaults = {
      x: -1600,
      y: 130,
      z: 1600
    }

    this.config = Object.assign(this.defaults, config)
    this.time = 0
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))
    this.ctex = new CloudShadingTexture(this.app, { palette: this.config.palette, steps: 8, tiling: 10, width: 100, height: 100, u_color: this.config.palette.secondary })
    this.ctex.wrapMode = PIXI.WRAP_MODES.REPEAT
    this.shape = new PIXI.Graphics()
    this.shape.beginTextureFill(this.ctex)
    this.shape.drawRect(0, 0, 1000, 100)
    this.shape.endFill()
    this.shape.blendMode = PIXI.BLEND_MODES.ADD
    this.shape.alpha = 0.5
    this.shape.pivot.x = this.shape.width / 2

    this.cloud = new PIXI.projection.Container3d()
    this.cloud.position3d.set(this.config.x, this.config.y, this.config.z)
    this.cloud.zIndex = -this.config.z
    this.cloud.addChild(this.shape)
    this.cloud.scale3d.set(3.8)
    this.config.parent.addChild(this.cloud)
  }

  onTick (delta) {
    this.shape.alpha = Tools.smoothstep(this.config.palette.nightPos, 0.5, 1.0) / 2
    this.time++
  }
}
