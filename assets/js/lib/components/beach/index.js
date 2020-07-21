import { GradientShadingTexture } from 'components/textures/shadergradient'
import svg from '!raw-loader!data/svg/beach.svg'
import svg2 from '!raw-loader!data/svg/montain4.svg'

export class BeachComponent {
  constructor (app, config = {}) {
    this.defaults = {
      mode: 'primary'
    }

    this.time = 0
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))
    this.config = Object.assign(this.defaults, config)

    this.shape = new SVG(svg)
    this.shape.pivot.x = this.shape.width / 2
    this.shape.position = new PIXI.Point(0, this.shape.height * 2.1)
    this.shape.scale.set(3, 2)

    this.shape2 = new SVG(svg2)
    const size = 100
    this.xratio = this.shape2.width / size
    this.yratio = this.shape2.height / size
    this.gtex = new GradientShadingTexture(app, { palette: this.config.palette, width: size, height: size, vertical: 0, type: 'beach' })
    this.texture = new PIXI.Graphics()
    this.texture.beginTextureFill(this.gtex)
    this.texture.drawRect(0, 0, size, size)
    this.texture.scale.set(this.xratio, this.yratio)
    this.texture.mask = this.shape2

    this.view = new PIXI.projection.Container3d()
    this.view.addChild(this.shape)
    this.view.position3d.set(0, 0, this.config.z)
    this.view.zIndex = -this.config.z

    this.view2 = new PIXI.projection.Container3d()
    this.view2.addChild(this.texture)
    this.view2.addChild(this.shape2)
    this.view2.position3d.set(this.config.x - 2300, this.config.y + 650, this.config.z + 400)
    this.view2.pivot.x = this.view2.width / 2
    this.view2.scale3d.set(6, 3, 1)
    this.view2.zIndex = -this.config.z - 400
    this.config.parent.scene.addChild(this.view)
    this.config.parent.scene.addChild(this.view2)
  }

  onTick (delta) {
    this.shape.tint = '0xffffff'
    this.shape.tint = this.config.palette.primary
    // if (this.config.mode === 'primary') {
    //   this.shape.tint = '0xffffff'
    //   this.shape.tint = this.config.palette.primary
    // }
  }
}
