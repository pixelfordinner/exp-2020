import { GradientShadingTexture } from 'components/textures/shadergradient'
// import { displacementFilter } from 'components/displacement'

export class OceanComponent {
  constructor (app, config = {}) {
    this.defaults = {

    }

    this.time = 0
    app.ticker.add(delta => this.onTick(delta))
    this.config = Object.assign(this.defaults, config)
    this.parent = this.config.parent.scene
    this.palette = this.config.parent.palette

    const size = 100
    this.gradTex = new GradientShadingTexture(app, { palette: this.palette, width: size, height: size, vertical: 1, type: 'ocean' })

    this.texture = new PIXI.Graphics()
    this.texture.beginTextureFill(this.gradTex)
    this.texture.drawRect(0, 5, size, size)
    this.texture.endFill()
    this.texture.pivot.x = size / 2
    // this.texture.scale.set(this.config.bounds.maxWidth * 10 / size, this.config.bounds.maxHeight * 3 / size)
    this.texture.scale.set(200, 50)
    this.view = new PIXI.projection.Container3d()
    this.view.addChild(this.texture)

    this.view.position3d.set(0, 0, this.config.z)
    this.view.zIndex = -this.config.z
    this.parent.addChild(this.view)
  }

  onTick (delta) {
  }
}
