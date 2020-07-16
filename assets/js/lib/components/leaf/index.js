import drop from '!raw-loader!data/svg/drop4.svg'
import { Tools } from 'objects/tools/geometry'
import { IridescentShader } from 'components/shader/iridescent'
import { basicShader } from 'components/shader/basic'
import { LineComponent } from 'components/primitives/line'
import { Gradient } from 'components/gradients/custom'
import { ShaderTexture } from 'components/textures/shadertexture'

/// import { ColorPalette } from 'components/colors/palette'

export class LeafComponent {
  constructor (app, config = {}) {
    this.defaults = {
      num: 13,
      parent: app.stage,
      x: 0,
      y: 0,
      z: 0
    }
    this.app = app
    this.config = Object.assign(this.defaults, config)

    this.setup()
    this.doShape()
  }

  setup () {
    this.app.ticker.add(delta => this.onTick(delta))
    this.time = 0
    this.svg = new SVG(drop)
    this.app.stage.addChild(this.svg)
    this.num = this.config.num
    this.petal = [this.num]

    this.rd = Math.random(this.config.index * 2567.78)
    this.tetha = this.rd * 200
    this.tetha = Math.min(this.tetha, 130)
    this.tetha = Math.max(this.tetha, 70)
    this.leaf = new PIXI.projection.Container3d()

    this.camera = this.config.camera.getCamera()
    this.palette = this.config.palette
    this.cs = this.palette.toHex(this.palette.complementary)
    this.ce = this.palette.toHex('0xff0000')
    // this.shader = new IridescentShader(this.app, {})
    // this.filter = new PIXI.Filter(PIXI.Filter.defaultVertexSrc, this.shader.shaderfragment, { stime: 0.0, nightmode: this.palette.nightMode })
    // this.AAFilter = new PIXI.filters.FXAAFilter()
  }

  doShape () {
    this.gradient = new Gradient(this.app, { colorStart: this.cs, colorEnd: this.ce, width: 400, height: 150 })
    const program = new basicShader(this.app)

    this.sTex = new ShaderTexture(this.app, { program: program, width: this.svg.width, height: this.svg.height + 10 })

    this.texture = new PIXI.Graphics()
    this.texture.beginTextureFill(this.sTex)
    this.texture.drawRect(0, 0, this.svg.width, this.svg.height)
    this.texture.endFill()

    this.texture.pivot.x = this.texture.width / 2
    this.texture.angle = 5 + ((190 / 9) * this.config.index)

    for (let i = 0; i < this.num; i++) {
      this.petal[i] = this.svg.clone()
      this.petal[i].pivot.x = this.svg.width / 2
      this.petal[i].angle = 5 + ((190 / this.num) * i)
      if (i === this.config.index) {
        if (this.config.index === 2) {
          // this.texture.filters = !this.palette.nightMode ? [this.AAFilter, this.filter] : [this.filter, this.AAFilter]
        }
        this.leaf.addChild(this.texture)
        this.texture.mask = this.petal[i]
      } else {
        this.petal[i].tint = this.palette.getConstantDepthColor(this.config.z)
      }
      this.leaf.addChild(this.petal[i])
    }

    this.addTige(this.palette.getConstantDepthColor(this.config.z))
    this.leaf.addChild(this.line.shape)
    this.leaf.scale3d.set(4)
    this.leaf.position3d.set(this.config.x, this.config.y, this.config.z)

    console.log(this.leaf.zIndex)

    this.leaf.zIndex = -this.config.z
    console.log(this.leaf.zIndex)

    this.config.parent.scene.addChild(this.leaf)
  }

  addTige (color) {
    this.line = new LineComponent(this.app, {
      camera: this.camera,
      color: color
    })
    // this.leaf.addChild(this.line.shape)
  }

  onTick (delta) {
    this.time += 0.005
    // this.filter.uniforms.stime += 0.01
    this.animateLeaf()
  }

  animateLeaf () {
    const angle = Math.cos(this.time) * 10
    this.leaf.angle = angle / 20
    this.texture.angle = this.tetha + (((190 - angle) / this.num) * this.config.index)
    this.leaf.skew = new PIXI.Point(Math.cos(this.rd * this.time * 7) * 0.06, 0)
    this.leaf.position3d.z += Math.cos((this.rd * 400) + this.time * 3.0) * 2
    this.leaf.zIndex = -this.leaf.position3d.z

    for (let i = 0; i < this.num; i++) {
      this.petal[i].angle = this.tetha + (((190 - angle) / this.num) * i)
      this.petal[i].tint = '0xFFFFFF'
      this.petal[i].tint = this.palette.getConstantSmoothDepthColor(this.leaf.position3d.z)
      // this.line.shape.clear()
      this.line.doShape(this.palette.getConstantSmoothDepthColor(this.leaf.position3d.z))
      // this.addTige(this.palette.getConstantSmoothDepthColor(this.leaf.position3d.z))
      // console.log(this.);
    }
  }

  onResize () {

  }
}
