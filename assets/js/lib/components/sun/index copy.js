import { Gradient } from 'components/gradients/custom'
import { Tools } from 'objects/tools/geometry'
import { GradientShadingTexture } from 'components/textures/shadergradient'
// import { TiltShiftFilter } from 'pixi-filters'

export class SunComponent {
  constructor (app, config = {}) {
    this.defaults = {
      x: 200,
      y: -1000,
      z: 0

    }
    this.config = Object.assign(this.defaults, config)
    this.time = 0
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))
    this.shape = new PIXI.Graphics()
    this.shape.clear() /
    this.shape.beginFill('0xFFFFFF')
    this.shape.drawCircle(0, 0, 1000)
    this.shape.endFill()
    this.shape.tint = this.config.palette.secondary

    this.c1 = this.config.palette.toHex(this.config.palette.secondary)
    this.c2 = this.config.palette.toHex(this.config.palette.primary)
    this.gradientshader = new GradientShadingTexture(this.app, { color_start: this.c1, color_end: this.c2, mix_Val: 0 })
    // this.shader =

    this.gradient = new Gradient(this.app, { colorStart: this.c1, colorEnd: this.c2, width: 2200, height: 1100 })
    this.texture = new PIXI.Graphics()
    this.texture.beginTextureFill(this.gradient)
    // this.texture.beginFill('0xffffff')
    this.texture.drawRect(0, 0, 2200, 1100)
    this.texture.endFill()

    this.texture.pivot.x = this.texture.width / 2
    this.texture.pivot.y = 0
    // this.texture.mask = this.shape

    this.sun = new PIXI.projection.Container3d()
    this.sun.zIndex = -this.config.z
    this.sun.position3d.set(this.config.x, this.config.y, this.config.z)
    this.sun.addChild(this.shape)
    // this.sun.addChild(this.texture)
    this.config.parent.scene.addChild(this.sun)
    // this.gradient = new Gradient(this.app, { colorStart: this.cs, colorEnd: this.ce, width: this.svg.width, height: this.svg.height * 2 })
  }

  updatemode () {
    this.shape.tint = '0xFFFFFF'
    this.shape.tint = this.config.palette.secondary
    // console.log(this.shape.tint)
    // this.gradient = new Gradient(this.app, { colorStart: this.c1, colorEnd: this.c2, width: 2200, height: 2200 })
  }

  onTick (delta) {
    this.time += 0.01
    // console.log(this.time)
    // console.log(this.config.palette.nightVal)
    this.updatemode()
    this.ypos = Tools.mix1(this.config.y, this.config.y - 4000, this.config.palette.nightPos)
    this.sun.position3d.y = this.ypos
  }
}
