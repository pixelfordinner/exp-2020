import drop from '!raw-loader!data/svg/drop4.svg'
import { Tools } from 'objects/tools/geometry'
// import { IridescentShader } from 'components/shader/iridescent'
import { basicShader } from 'components/shader/basic'
import { LineComponent } from 'components/primitives/line'
import { Gradient } from 'components/gradients/custom'
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
    // this.app.stage.addChild(this.svg)
    this.num = this.config.num
    this.petal = [this.num]

    this.rd = Math.ceil(Math.random(this.config.zindex * 2567.78) * 9)
    this.offset = this.rd
    // console.log(Math.ceil(this.rd * 9))

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
    // this.gradient = new Gradient(this.app, { colorStart: this.cs, colorEnd: this.ce, width: this.svg.width, height: this.svg.height * 2 })

    const program = new basicShader(this.app)

    // this.sTex = new ShaderTexture(this.app, { program: program, width: this.svg.width, height: this.svg.height + 10, zindex: this.config.z, brightness: 1.6, scale: 2 })
    // this.texture = new PIXI.Graphics()
    // this.texture.beginTextureFill(this.sTex)
    // this.texture.drawRect(0, 0, this.svg.width, this.svg.height)
    // this.texture.endFill()
    // this.texture.pivot.x = this.texture.width / 2
    // this.texture.angle = 5 + ((190 / 9) * this.config.index)

    // this.gTex = [this.num]
    // this.gtexture = new PIXI.Graphics()
    // this.gtexture.beginTextureFill(this.gradient.texture)
    // this.gtexture.drawRect(0, 0, this.svg.width, this.svg.height)
    // this.gtexture.endFill()
    // // this.gtexture.pivot.x = this.gtexture.width / 2
    // this.app.stage.addChild(this.gtexture)
    // this.texture.angle = 5 + ((190 / 9) * this.config.index)
    // if (this.config.light) {
    //   this.lightleaf = this.svg.clone()
    //   this.lightleaf.pivot.x = this.svg.width / 2
    //   this.lightleaf.angle = this.tetha + ((190 / this.num) * this.rd)
    // }

    // this.texture.angle = this.tetha + ((190 / this.num) * this.rd)

    for (let i = 0; i < this.num; i++) {
      this.petal[i] = this.svg.clone()
      this.petal[i].pivot.x = this.svg.width / 2
      this.petal[i].angle = this.tetha + ((190 / this.num) * i)
      // this.texture.angle = this.tetha + ((190 / this.num) * this.rd)
      if (i === this.rd) {
        if (this.config.index === 2) {
          // this.texture.filters = !this.palette.nightMode ? [this.AAFilter, this.filter] : [this.filter, this.AAFilter]
        }
        // this.leaf.addChild(this.texture)
        // this.texture.mask = this.petal[i]
      } else {
        // this.gTex[i] = this.gtexture.clone()
        // this.gTex[i].angle = this.tetha + ((190 / this.num) * i)
        // this.leaf.addChild(this.gTex[i])
        // this.gTex[i].pivot.x = this.gtexture.width / 2
        // this.gTex[i].mask = this.petal[i]
        this.petal[i].tint = this.palette.getConstantSmoothDepthColor(this.config.z)
      }
      this.leaf.addChild(this.petal[i])
    }

    if (this.config.light) {
      this.leaf.interactive = true
      this.leaf.on('mouseover', this.onPointerIn)
      this.leaf.on('pointerout', this.onPointerOut)
      // this.leaf.on(‘mousemove’, onPointerMove)
      // this.leaf.on('pointermove', this.onMove)
    }

    // this.leaf.addChild(this.texture)
    // this.texture.mask = this.lightleaf

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
    // this.leaf.addChild(this.lightleaf)

    this.addTige(this.palette.getConstantSmoothDepthColor(this.config.z))
    this.leaf.addChild(this.line.shape)
    // this.leaf.scale3d.set(4)
    // this.leaf.position3d.set(this.config.x, this.config.y, this.config.z)
    // this.leaf.zIndex = -this.config.z
    // this.config.parent.scene.addChild(this.leaf)
  }

  addTige (color) {
    this.line = new LineComponent(this.app, {
      camera: this.camera,
      color: color
    })
  }

  // onMove () {
  //   // if (this.config.light) {
  //   //   if (this.leaf.mouseover) {
  //   //     console.log('hello')
  //   //   }
  //   // }
  // }

  onTick (delta) {
    this.time += 0.005
    // console.log('leaf > ' + this.status)
    // console.log(this.leaf.mouseover)
    // this.filter.uniforms.stime += 0.01

    // this.animateoffset()
    this.animateLeaf()
  }

  onPointerIn () {
    // console.log('interact with leaf')

    this.status = true

    // console.log('leaf > ')
  }

  onPointerOut () {
    this.status = false

    // this.amp = 0
  }

  animateoffset () {
    this.counter++
    if (this.offset < this.num) {
      if (this.counter > 100) {
        this.offset += Math.ceil(2.0 * (Math.random(this.time + this.rd) - 0.5))
        this.counter = 0
      }
    } else {
      this.offset = 0
      this.counter = 0
    }
  }

  animateLeaf () {
    // const angle = Math.cos(this.config.palette.nightPos * 4) * 10
    const angle = this.config.palette.nightVal * 10
    this.angle = angle
    if (this.leaf.status) {
      this.leaf.amp += 0.3
      this.leaf.amp = Math.max(this.leaf.amp, 20)
    }
    if (!this.leaf.status) {
      this.leaf.amp -= 0.5
      this.leaf.amp = Math.max(0, this.leaf.amp)
    }
    // this.leaf.amp = Math.max(this.leaf.amp, 20)

    console.log(this.leaf.amp)
    // this.leaf.angle = angle

    // if (this.offset < this.num) {
    //   if (this.counter > 100) {
    //     this.offset += Math.ceil(2.0 * (Math.random(this.time + this.rd) - 0.5))
    //     this.counter = 0
    //   }
    // } else {
    //   this.offset = 0
    //   this.counter = 0
    // }
    if (this.config.light) {
      // this.lightleaf.angle = 0.7 * this.tetha + (((190 - angle) / this.num) * this.offset)
      // this.texture.angle = 0.7 * this.tetha + (((190 - angle) / this.num) * this.offset)
      // if (this.config.palette.nightVal > 0.5) {
      // console.log(this.status)
      if (this.leaf.status) {
        // console.log('light on')
        this.texture.alpha = this.config.palette.getDepth(this.leaf.position3d.z)
        // if (this.angle < this.config.palette.nightVal * 20) {
        //   this.amp += 0.1
        // }
      } else {
        this.texture.alpha = 0
      }

      // if (this.leaf.status) {
      //   this.amp = this.leaf.amp
      // }

      this.angle += this.leaf.amp

      this.lightleaf.angle = 0.7 * this.tetha + (((190 - this.angle) / this.num) * this.offset)
      this.texture.angle = 0.7 * this.tetha + (((190 - this.angle) / this.num) * this.offset)
    }
    // if (this.status) {
    //   console.log('light on')
    //   this.texture.alpha = this.config.palette.getDepth(this.leaf.position3d.z)
    // } else {
    //   this.texture.alpha = 0
    // }

    this.leaf.skew = new PIXI.Point(Math.cos(this.rd * this.time * 0.5) * 0.06, 0)
    this.leaf.position3d.z += Math.cos((this.rd * 400) + this.time * 3.0) * 0.2
    this.leaf.zIndex = -this.leaf.position3d.z

    for (let i = 0; i < this.num; i++) {
      this.petal[i].angle = 0.7 * this.tetha + (((190 - this.angle) / this.num) * i)
      this.petal[i].tint = '0xFFFFFF'
      this.petal[i].tint = this.palette.getConstantSmoothDepthColor(this.leaf.position3d.z)

      this.line.doShape(this.palette.getConstantSmoothDepthColor(this.leaf.position3d.z))
    }
  }

  onResize () {

  }
}
