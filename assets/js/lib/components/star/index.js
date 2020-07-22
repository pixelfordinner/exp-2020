import { CloudShadingTexture } from 'components/textures/cloud'
import { Tools } from 'objects/tools/geometry'

export class StarComponent {
  constructor (app, config = {}) {
    this.defaults = {
      x: 0,
      y: -1400,
      z: 10,
      width: 600,
      height: 600,
      steps: 50
    }

    this.config = Object.assign(this.defaults, config)
    this.time = 0
    this.app = app
    this.parent = this.config.parent
    this.palette = this.config.palette

    this.app.ticker.add(delta => this.onTick(delta))
    const w = this.config.width
    const h = this.config.height
    const s = this.config.steps
    this.ctex = new CloudShadingTexture(this.app, { palette: this.palette, steps: s, width: w, height: h, u_color: this.palette.secondary, type: 1 })
    // this.ctex.wrapMode = PIXI.WRAP_MODES.CLAMP
    this.shape = new PIXI.Graphics()
    this.shape.beginTextureFill(this.ctex)
    this.shape.drawRect(0, 0, w * 3, h)
    this.shape.endFill()
    // this.shape.blendMode = PIXI.BLEND_MODES.ADD
    // this.shape.alpha = 0.5
    // this.shape.pivot.x = -this.shape.width

    this.cloud = new PIXI.projection.Container3d()
    // this.cloud.position3d.set(this.config.x, this.config.y, this.config.z)
    this.cloud.zIndex = 0
    this.cloud.addChild(this.shape)
    this.cloud.scale3d.set(1.2)
    this.parent.addChild(this.cloud)
  }

  onTick (delta) {
    this.shape.alpha = Tools.smoothstep(this.palette.nightVal, 0.4, 0.6) / 1.4
    this.time++
  }
}
