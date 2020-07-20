import drop from '!raw-loader!data/svg/drop4.svg'
import { Tools } from 'objects/tools/geometry'
import { basicShader } from 'components/shader/basic'
import { LineComponent } from 'components/primitives/line'
import { ShaderTexture } from 'components/textures/shadertexture'

export class LeafComponent {
  constructor (app, config = {}) {
    this.defaults = {
      num: 13,
      light: true,
      interactive: true,
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
    this.counter = 0
    this.status = false
    this.svg = new SVG(drop)
    this.num = this.config.num
    this.petal = [this.num]

    this.rd = Math.ceil(Math.random(this.config.zindex * 2567.78) * 9)
    this.offset = this.rd

    this.tetha = this.rd * 200
    this.tetha = Math.min(this.tetha, 130)
    this.tetha = Math.max(this.tetha, 70)
    this.leaf = new PIXI.projection.Container3d()
    this.leaf.status = false
    this.leaf.amp = 0

    this.leaf.scale3d.set(4)
    this.leaf.position3d.set(this.config.x, this.config.y, this.config.z)
    this.leaf.zIndex = -this.config.z
    this.config.parent.scene.addChild(this.leaf)

    this.camera = this.config.camera.getCamera()
    this.palette = this.config.palette
    this.cs = this.palette.toHex(this.palette.getConstantSmoothDepthColor(this.config.z))
    this.ce = this.palette.toHex(this.palette.secondary)
  }

  doShape () {
    const program = new basicShader(this.app)

    for (let i = 0; i < this.num; i++) {
      this.petal[i] = this.svg.clone()
      this.petal[i].pivot.x = this.svg.width / 2
      this.petal[i].angle = this.tetha + ((190 / this.num) * i)
      this.petal[i].tint = this.palette.getConstantSmoothDepthColor(this.config.z)
      this.petal[i].interactive = true
      this.petal[i].mouseIsOn = false
      this.petal[i].on('mouseover', this.petalOn)
      this.petal[i].on('pointerout', this.petalOff)
      this.leaf.addChild(this.petal[i])
    }

    if (this.config.light) {
      this.leaf.interactive = true
      this.leaf.on('mouseover', this.onPointerIn)
      this.leaf.on('pointerout', this.onPointerOut)
    }

    if (this.config.light) {
      this.sTex = new ShaderTexture(this.app, { program: program, width: this.svg.width, height: this.svg.height + 10, zindex: this.config.z, brightness: 1.6, scale: 2 })
      this.texture = new PIXI.Graphics()
      this.texture.beginTextureFill(this.sTex)
      this.texture.drawRect(0, 0, this.svg.width, this.svg.height)
      this.texture.endFill()
      this.texture.pivot.x = this.texture.width / 2

      this.lightleaf = this.svg.clone()
      this.lightleaf.pivot.x = this.svg.width / 2
      this.lightleaf.angle = this.tetha + ((190 / this.num) * this.rd)
      this.texture.mask = this.lightleaf

      this.leaf.addChild(this.lightleaf)
      this.leaf.addChild(this.texture)
    }
    this.addTige(this.palette.getConstantSmoothDepthColor(this.config.z))
    this.leaf.addChild(this.line.shape)
  }

  addTige (color) {
    this.line = new LineComponent(this.app, {
      camera: this.camera,
      color: color
    })
  }

  onTick (delta) {
    this.time += 0.005
    this.animateLeaf()
  }

  petalOn () {
    this.mouseIsOn = true
  }

  petalOff () {
    this.mouseIsOn = false
  }

  onPointerIn () {
    this.status = true
  }

  onPointerOut () {
    this.status = false
  }

  animateoffset () {
    this.counter++

    if (this.counter > 100) {
      this.offset += Math.ceil(2.0 * (Math.random(this.time + this.rd) - 0.5))
      this.counter = 0
    } else {
      this.offset = 0
      this.counter = 0
    }
  }

  animateLeaf () {
    const angle = this.config.palette.nightVal * 10
    this.angle = angle
    if (this.leaf.status && this.leaf.amp < 20) {
      this.leaf.amp += 0.5
    }
    if (!this.leaf.status) {
      this.leaf.amp -= 0.5
      this.leaf.amp = Math.max(0, this.leaf.amp)
    }

    if (this.config.light) {
      if (this.leaf.status) {
        this.texture.alpha = this.config.palette.getDepth(this.leaf.position3d.z)
      } else {
        this.texture.alpha = 0
      }

      this.angle += this.leaf.amp
    }

    this.leaf.skew = new PIXI.Point(Math.cos(this.rd * this.time * 0.5) * 0.06, 0)
    this.leaf.position3d.z += Math.cos((this.rd * 400) + this.time * 3.0) * 0.2
    this.leaf.zIndex = -this.leaf.position3d.z

    for (let i = 0; i < this.num; i++) {
      this.petal[i].angle = 0.7 * this.tetha + (((190 - this.angle) / this.num) * i)
      this.petal[i].tint = '0xFFFFFF'
      this.petal[i].tint = this.palette.getConstantSmoothDepthColor(this.leaf.position3d.z)
      if (this.petal[i].mouseIsOn) {
        this.lightleaf.angle = 0.7 * this.tetha + (((190 - this.angle) / this.num) * i)
        this.texture.angle = 0.7 * this.tetha + (((190 - this.angle) / this.num) * i)
      }
      this.line.doShape(this.palette.getConstantSmoothDepthColor(this.leaf.position3d.z))
    }
  }
}
