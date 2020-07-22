
import { Tools } from 'objects/tools/geometry'
import { GradientShadingTexture } from 'components/textures/shadergradient'

export class MoonComponent {
  constructor (app, config = {}) {
    this.defaults = {
      x: 0,
      y: 0,
      z: 0,
      size: 1

    }
    this.config = Object.assign(this.defaults, config)
    this.time = 0
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))
    this.palette = this.config.palette
    this.parent = this.config.parent

    this.sTex2 = new GradientShadingTexture(this.app, { palette: this.palette, width: 100, height: 100, color_start: this.palette.primary, color_end: this.palette.secondary, vertical: 1, distord: 1, fade_value: 1 })

    this.texture = new PIXI.Graphics()
    this.texture.beginTextureFill(this.sTex2)
    this.texture.drawCircle(-50, -50, 49, 49)
    this.texture.endFill()

    this.texture.position.x = 300

    // this.sun = new PIXI.projection.Container3d()
    // this.sun.interactive = true
    // this.sun.on('pointerdown', this.onClick)

    // // this.sun.mouseover = function (mouseData) {
    // //   console.log('hello')
    // // }

    // this.sun.zIndex = -this.config.z
    // this.sun.position3d.set(this.config.x, this.config.y, this.config.z)
    // this.sun.addChild(this.texture)
    // this.sun.scale3d.set(this.config.size)

    this.parent.addChild(this.texture)
  }

  onClick () {
    console.log('hello')
    // this.alpha = 0
  }

  onTick (delta) {
    // console.log(this.sun.mouseover)

    // this.time += 0.01
    // this.ypos = Tools.mix1(this.config.y, this.config.y - 8000, this.palette.nightPos)
    // this.sun.position3d.y = this.ypos
    // this.strech = this.app.view.width * 5
    // this.sun.position3d.x = this.strech
  }
}
