
import svg from '!raw-loader!data/svg/montain2.svg'
import svg2 from '!raw-loader!data/svg/montain6.svg'
import svg3 from '!raw-loader!data/svg/montain5.svg'
import { ShaderTexture } from 'components/textures/shadertexture'
import { basicShader } from 'components/shader/basic'
import { RippleFilter } from 'components/filters/ripple'
import { Tools } from 'objects/tools/geometry'

export class MontainComponent {
  constructor (app, config = {}) {
    this.defaults = {
      // program: new basicShader(app),
      parent: app.stage,
      x: 0,
      y: 0,
      z: 0

    }
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))
    this.config = Object.assign(this.defaults, config)
    this.parent = this.config.parent.scene
    this.palette = this.config.parent.palette

    this.time = 0

    // optimization for webGL canvas rendering
    this.shape = new SVG(svg)
    // this.shape.pivot.x = this.shape.width / 2

    this.debug = new PIXI.Graphics()
    this.debug.beginFill('0xffff00')
    this.debug.drawRect(0, 0, this.shape.width, this.shape.height)
    this.debug.endFill()
    this.debug.pivot.x = this.debug.width / 2

    // this.shape.scale.set(3)
    const size = 100
    const ratio = this.shape.width / this.shape.height

    const xr = this.shape.width / size
    const yr = this.shape.height / size * ratio

    this.shadow = new SVG(svg)
    // this.shadow.position.x = this.shape.width / 2
    // this.shadow.pivot.y = this.shadow.height * 2
    this.shadow.scale.set(1, -0.8)
    this.shadow.position.y = this.shape.height - this.shadow.height
    this.shadow.tint = this.palette.quaternary
    // this.shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY
    this.shadow.alpha = 0.3
    // this.filter = new DisplacementFilter(this.app, { parent: this.parent }).filter
    this.filter = new RippleFilter(this.app, { parent: this.parent }).filter

    // this.noiseFilter = new PIXI.filters.NoiseFilter(0.5, 30)

    this.shadow.filters = [this.filter]

    const program = new basicShader(this.app)

    this.sTex = new ShaderTexture(this.app, { palette: this.palette, program: program, width: size, height: size, zindex: this.config.z, scale: 1, brightness: 1.8 })
    this.texture = new PIXI.Graphics()
    this.texture.beginTextureFill(this.sTex)
    this.texture.drawRect(0, -10, this.shape.width / xr + 10, this.shape.height / yr + 10)
    this.texture.endFill()
    this.texture.scale.set(xr, yr)
    // this.texture.position.x = -this.texture.width / 2
    this.texture.mask = this.shape

    this.montain = new PIXI.projection.Container3d()
    // this.montain.addChild(this.debug)
    this.montain.addChild(this.shadow)
    this.montain.addChild(this.texture)
    this.montain.addChild(this.shape)

    this.montain.scale3d.set(6)
    this.montain.pivot3d.x = this.montain.width / 2
    // this.montain.pivot3d.y = this.montain.height / 2
    this.montain.position3d.set(this.config.x, this.config.y, this.config.z)
    this.montain.zIndex = -this.config.z

    this.shape2 = new SVG(svg2)
    this.shape2_shd = new SVG(svg2)
    this.shape2_shd.scale.set(1, -0.6)
    this.shape2_shd.position.y = this.shape2.height - this.shape2_shd.height

    this.shape2.position.x = -800
    this.shape2_shd.position.x = -800
    this.shape2_shd.tint = this.palette.quaternary
    this.shape2_shd.filters = [this.filter]
    this.shape3 = new SVG(svg3)
    this.shape3.scale.set(1)
    this.shape3.position.x = 100
    this.shape3_shd = this.shape3.clone()
    this.shape3_shd.scale.set(1, -0.6)
    this.shape3_shd.position.x = 100
    this.shape3_shd.position.y = this.shape3.height - this.shape3_shd.height
    this.shape3_shd.tint = this.palette.quaternary
    this.shape3_shd.filters = [this.filter]
    this.montain2 = new PIXI.projection.Container3d()
    this.montain2.addChild(this.shape2)
    this.montain2.addChild(this.shape3)
    this.montain2.addChild(this.shape2_shd)
    this.montain2.addChild(this.shape3_shd)
    this.montain2.position3d.set(this.config.x - 800, this.config.y + 1000, this.config.z + 600)
    this.montain2.zIndex = -this.config.z - 600
    this.montain2.scale3d.set(5)
    this.montain2.pivot3d.x = this.montain2.width / 2

    this.parent.addChild(this.montain)
    this.parent.addChild(this.montain2)
  }

  onTick (delta) {
    this.alpha = Tools.smoothstep(this.palette.nightPos, 0.2, 0.8)
    this.shadow.alpha = this.alpha / 2.5
    this.shape2_shd.alpha = this.alpha / 2.5
    this.shape3_shd.alpha = this.alpha / 2.5
    this.shape2.tint = '0xffffff'
    this.shape3.tint = '0xffffff'
    this.shape2.tint = this.palette.complementary
    this.shape3.tint = this.palette.complementary

    // this.time++
  }
}
