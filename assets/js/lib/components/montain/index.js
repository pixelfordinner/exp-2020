
import svg from '!raw-loader!data/svg/montain2.svg'
import svg2 from '!raw-loader!data/svg/montain4.svg'
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

    this.time = 0

    // optimization for webGL canvas rendering
    this.shape = new SVG(svg)
    const size = 500
    const ratio = this.shape.width / this.shape.height
    const xr = this.shape.width / size
    const yr = this.shape.height / size * ratio

    this.shadow = new SVG(svg)
    this.shadow.pivot.y = this.shadow.height * 2
    this.shadow.scale.set(1, -1)
    this.shadow.tint = this.config.palette.quaternary
    // this.shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY
    this.shadow.alpha = 0.3
    // this.filter = new DisplacementFilter(this.app, { parent: this.config.parent.scene }).filter
    this.filter = new RippleFilter(this.app, { parent: this.config.parent.scene }).filter

    this.noiseFilter = new PIXI.filters.NoiseFilter(0.5, 30)

    this.shadow.filters = [this.filter]

    const program = new basicShader(this.app)

    this.sTex = new ShaderTexture(this.app, { palette: this.config.palette, program: program, width: size, height: size, zindex: this.config.z, scale: 1, brightness: 1.8 })
    this.texture = new PIXI.Graphics()
    this.texture.beginTextureFill(this.sTex)
    this.texture.drawRect(0, 0, this.shape.width / xr, this.shape.height / yr)
    this.texture.endFill()
    this.texture.scale.set(xr, yr)
    this.texture.mask = this.shape

    this.montain = new PIXI.projection.Container3d()
    this.montain.addChild(this.texture)
    this.montain.addChild(this.shape)
    this.montain.addChild(this.shadow)
    this.montain.scale3d.set(3.5)
    this.montain.pivot.x = this.montain.width / 2
    this.montain.pivot.y = this.montain.height
    this.montain.position3d.set(this.config.x, this.config.y, this.config.z)
    this.montain.zIndex = -this.config.z

    this.shape2 = new SVG(svg2)
    this.shape2_shd = new SVG(svg2)
    this.shape2_shd.scale.set(1, -0.6)
    this.shape2_shd.position.y = this.shape2.height - this.shape2_shd.height

    this.shape2.position.x = -400
    this.shape2_shd.position.x = -400
    this.shape2_shd.tint = this.config.palette.quaternary
    this.shape2_shd.filters = [this.filter]
    this.shape3 = new SVG(svg2)
    this.shape3.scale.set(1, 1)
    this.shape3.position.x = 700
    this.shape3_shd = this.shape3.clone()
    this.shape3_shd.scale.set(1, -0.6)
    this.shape3_shd.position.x = 700
    this.shape3_shd.position.y = this.shape3.height - this.shape3_shd.height
    this.shape3_shd.tint = this.config.palette.quaternary
    this.shape3_shd.filters = [this.filter]
    this.montain2 = new PIXI.projection.Container3d()
    this.montain2.addChild(this.shape2)
    this.montain2.addChild(this.shape3)
    this.montain2.addChild(this.shape2_shd)
    this.montain2.addChild(this.shape3_shd)
    this.montain2.position3d.set(this.config.x - 3400, this.config.y - 100, this.config.z + 500)
    this.montain2.zIndex = -this.config.z - 500
    this.montain2.scale3d.set(3.4)

    this.config.parent.scene.addChild(this.montain)
    this.config.parent.scene.addChild(this.montain2)
  }

  onTick (delta) {
    this.alpha = Tools.smoothstep(this.config.palette.nightPos, 0.2, 0.8)
    this.shadow.alpha = this.alpha / 2.5
    this.shape2_shd.alpha = this.alpha / 2.5
    this.shape3_shd.alpha = this.alpha / 2.5
    this.shape2.tint = '0xffffff'
    this.shape3.tint = '0xffffff'
    this.shape2.tint = this.config.palette.complementary
    this.shape3.tint = this.config.palette.complementary

    this.time++
  }
}
