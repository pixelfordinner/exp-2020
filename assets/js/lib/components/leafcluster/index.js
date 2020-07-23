import { BaseLeafComponent } from 'components/baseleaf'
import { LineComponent } from 'components/primitives/line'
import { Tools } from 'objects/tools/geometry'

export class LeafClusterComponent {
  constructor (app, config = {}) {
    this.defaults = {
      parent: app.stage,
      numbers: 13,
      scale: 4,
      x: 400,
      y: 500,
      z: 100
    }

    this.config = Object.assign(this.defaults, config)
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))
    this.time = 0
    this.parent = this.config.parent.scene
    this.palette = this.config.parent.palette
    this.angle = Math.PI / 2.0
    this.amp = 0

    this.num = this.config.numbers
    this.active = false

    this.leafs = []
    this.cluster = new PIXI.projection.Container3d()
    this.cluster.interactive = true
    this.cluster.on('mouseover', this.pointerover)
    this.cluster.on('pointerout', this.pointerout)

    for (let i = 0; i < this.num; i++) {
      const leaf = new BaseLeafComponent(this.app, { parent: this.config.parent })
      leaf.projection.rotation = this.angle + ((Math.PI / this.num) * i)
      this.leafs.push(leaf)
      this.cluster.addChild(leaf.projection)
    }

    this.line = new LineComponent(this.app, {
      // camera: this.camera,
      color: this.palette.getConstantSmoothDepthColor(this.config.z)
    })
    this.cluster.addChild(this.line.shape)

    this.cluster.position3d.set(this.config.x, this.config.y, this.config.z)
    this.cluster.zIndex = -this.config.z
    this.cluster.scale3d.set(this.config.scale)
    this.parent.addChild(this.cluster)
  }

  pointerover () {
    this.active = true
  }

  pointerout () {
    this.active = false
  }

  animatewind () {
    this.wind = this.parent.wind
    const a = Math.cos(this.time + this.config.z) * 0.2
    this.cluster.position3d.z += a
    this.cluster.zIndex = -this.cluster.position3d.z
    this.cluster.skew = new PIXI.Point(a * 0.3, 0)
  }

  animateSun () {
    this.nightVal = this.palette.nightVal

    this.tetha = Tools.smoothstep(this.nightVal, 0.0, 1) * Math.PI / 8
    if (this.active) {
      this.amp += 0.01
      this.amp = Math.min(this.amp, Math.PI / 10)
    } else {
      this.amp -= 0.01
      this.amp = Math.max(0, this.amp)
    }
    this.tetha -= this.amp

    this.leafs.forEach((leaf, index) => {
      leaf.projection.rotation = (this.angle + this.tetha / 2) + (((1.0 * Math.PI - this.tetha) / this.num) * index)
      leaf.shape.tint = '0xffffff'
      leaf.shape.tint = this.palette.getConstantSmoothDepthColor(this.cluster.position3d.z)
    })

    // this.line = new LineComponent(this.app, {
    //   // camera: this.camera,
    //   color: this.palette.getConstantSmoothDepthColor(this.config.z)
    // })
    // this.cluster.addChild(this.line.shape)
    this.line.doShape(this.palette.getConstantSmoothDepthColor(this.cluster.position3d.z))
  }

  onTick (delta) {
    this.time += this.config.parent.speed
    this.active = this.cluster.active
    this.animatewind()
    this.animateSun()
  }
}
