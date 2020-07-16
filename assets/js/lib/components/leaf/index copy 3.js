import drop from '!raw-loader!data/svg/drop2.svg'
import { ShaderComponent } from 'components/shader'
// import { Tools } from 'objects/tools/geometry'
// import { ArcComponent } from 'components/primitives/arc'
import { LineComponent } from 'components/primitives/line'
import { Gradient } from 'components/gradients/custom'
// import { MASK_TYPES } from 'pixi.js'

export class LeafComponent {
  constructor (app, config = {}) {
    this.defaults = {
      x: 0,
      y: 0,
      z: 0
    }
    this.app = app
    this.config = Object.assign(this.defaults, config)

    this.setup()
    this.doShape()
    // this.addTige()
    // console.log(this.config.bounds)
  }

  setup () {
    this.app.ticker.add(delta => this.onTick(delta))
    this.time = 0
    this.svg = new SVG(drop)
    // this.tige = new PIXI.Graphics()
    this.petal = []

    this.rd = Math.random(this.config.index * 2567.78)
    this.tetha = this.rd * 200
    this.tetha = Math.min(this.tetha, 130)
    this.tetha = Math.max(this.tetha, 70)
    this.plant = new PIXI.projection.Container3d()
    this.leaf = new PIXI.projection.Container3d()
    this.camera = this.config.camera.getCamera()

    this.palette = this.config.palette
    this.cs = this.palette.toHex(this.palette.complementary)
    this.ce = this.palette.toHex('0xff0000')

    this.shader = new ShaderComponent(this.app, {})

    this.filter = new PIXI.Filter(PIXI.Filter.defaultVertexSrc, this.shader.shaderfragment, { stime: 0.0, nightmode: this.palette.nightMode })
    this.antialFilter = new PIXI.filters.FXAAFilter()
  }

  doShape () {
    this.gradient = new Gradient(this.app, { colorStart: this.cs, colorEnd: this.ce, width: 200, height: 150 })

    this.texture = new PIXI.Graphics()
    // this.texture.beginTextureFill(this.gradient)
    this.texture.beginFill(0xffffff)
    this.texture.drawRect(0, 0, 200, 150)
    this.texture.endFill()
    this.texture.scale.set(1.4)
    //  this.texture.filters = [this.antialFilter, this.filter]
    this.texture.pivot.x = this.texture.width / 2
    this.texture.pivot.y = this.texture.height / 2
    // this.leaf.addChild(this.texture)
    // this.app.stage.addChild(this.texture)

    for (let i = 0; i < 9; i++) {
      this.petal[i] = this.svg.clone()
      this.petal[i].pivot.x = this.svg.width / 2
      this.petal[i].angle = 5 + ((190 / 8) * i)
      if (i === this.config.index) {
        // this.texture.mask = this.petal[i]
        // this.texture.filters = [this.filter, this.antialFilter]
        this.petal[i].filters = !this.palette.nightMode ? [this.antialFilter, this.filter] : [this.filter, this.antialFilter]
      } else {
        this.petal[i].tint = this.palette.complementary
      }
      this.leaf.addChild(this.petal[i])
    }

    this.addTige()
    this.leaf.scale3d.set(3)
    this.leaf.position3d.set(this.config.x, this.config.y, this.config.z)
    this.app.stage.addChild(this.leaf)
    this.camera.addChild(this.leaf)
  }

  addTige () {
    this.line = new LineComponent(this.app, {
      camera: this.camera,
      color: this.palette.complementary
    })
    this.leaf.addChild(this.line.shape)
  }

  onTick (delta) {
    this.time += 0.005
    this.filter.uniforms.stime += 0.01
    this.animateLeaf()
  }

  animateLeaf () {
    const angle = Math.cos(this.time) * 10
    this.leaf.angle = angle / 20
    // const rd = Math.random(this.config.index)
    for (let i = 0; i < 9; i++) {
      this.petal[i].angle = this.tetha + (((190 - angle) / 9) * i)
    }
    this.leaf.skew = new PIXI.Point(Math.cos(this.rd * this.time * 7) * 0.06, 0)
    this.leaf.position3d.z += Math.cos(this.time * this.rd) / 20
  }

  onResize () {

  }
}
