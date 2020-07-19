import { GradientShadingTexture } from 'components/textures/shadergradient'
import svg from '!raw-loader!data/svg/beach.svg'

export class BeachComponent {
  constructor (app, config = {}) {
    this.defaults = {
      mode: 'primary'
    }

    this.time = 0
    app.ticker.add(delta => this.onTick(delta))
    this.config = Object.assign(this.defaults, config)

    this.shape = new SVG(svg)
    this.shape.pivot.x = this.shape.width / 2
    this.shape.position = new PIXI.Point(0, this.shape.height * 2.1)
    this.shape.scale.set(3, 2)

    this.view = new PIXI.projection.Container3d()
    this.view.addChild(this.shape)
    this.view.position3d.set(0, 0, this.config.z)
    this.view.zIndex = -this.config.z

    this.config.parent.scene.addChild(this.view)
  }

  onTick (delta) {
    if (this.config.mode === 'primary') {
      this.shape.tint = '0xffffff'
      this.shape.tint = this.config.palette.primary
    }
  }
}
