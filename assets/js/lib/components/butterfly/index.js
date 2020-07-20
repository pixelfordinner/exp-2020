import wing from '!raw-loader!data/svg/wing3.svg'
import { Tools } from 'objects/tools/geometry'

export class ButterflyComponent {
  constructor (app, config = {}) {
    this.defaults = {
      courage: 1,
      x: 20,
      y: 300,
      z: 0

    }
    this.config = Object.assign(this.defaults, config)
    this.time = 0
    this.wtime = this.config.x
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))

    this.shape = new SVG(wing)
    this.shape.pivot.x = this.shape.width
    this.shape.pivot.y = this.shape.height / 2
    this.shape.tint = this.config.palette.quaternary
    this.shape.alpha = 0.3

    this.eye = new PIXI.Graphics()
    this.eye.alpha = 1
    this.eye.beginFill('0xffffff')
    this.eye.drawCircle(-this.shape.width + 50, -50, 20, 20)
    this.eye.endFill()

    this.wing = new PIXI.projection.Container3d()
    this.wing.addChild(this.shape)
    this.wing.addChild(this.eye)

    this.wing2 = new PIXI.projection.Container3d()
    this.shape2 = new SVG(wing)
    this.shape2.tint = this.config.palette.quaternary
    this.shape2.alpha = 0.3

    this.eye2 = new PIXI.Graphics()
    this.eye2.beginFill('0xffffff')
    this.eye2.drawCircle(-this.shape2.width + 50, -50, 20, 20)
    this.eye2.endFill()
    this.shape2.pivot.x = this.shape.width
    this.shape2.pivot.y = this.shape.height / 2

    this.wing2.addChild(this.shape2)
    this.wing2.addChild(this.eye2)
    this.wing2.euler.y = Math.PI / 1.2
    this.wing.euler.y = Math.PI / 1.2 + Math.PI

    this.butterfly = new PIXI.projection.Container3d()
    this.butterfly.addChild(this.wing)
    this.butterfly.addChild(this.wing2)
    this.config.parent.scene.addChild(this.butterfly)
    this.butterfly.scale3d.set(0.5, 0.5, 0.5)

    if (this.config.anchor != null && !this.butterfly.affraid) {
      this.config.x = this.config.anchor.leaf.position3d.x - this.config.x
      this.config.y = this.config.anchor.leaf.position3d.y - this.config.y
      this.config.z = this.config.anchor.leaf.position3d.z - 20
      this.butterfly.position3d.set(this.config.x, this.config.y, this.config.z)
    }

    this.butterfly.zIndex = -this.config.z
    this.butterfly.affraid = false
    this.butterfly.euler.y = 2.5
    this.butterfly.stress = 0
  }

  onTick (delta) {
    this.amp = 1.6
    this.time += 0.05
    this.wangle = Math.PI

    if (this.config.anchor.leaf.status) {
      this.butterfly.affraid = true
    }

    if (this.butterfly.affraid && this.butterfly.stress < this.config.courage) {
      this.butterfly.stress += 0.01
      if (this.butterfly.stress >= this.config.courage) {
        this.butterfly.affraid = false
      }
    }
    if (!this.butterfly.affraid && this.butterfly.stress > 0) {
      this.butterfly.stress -= 0.01
    }

    if (this.butterfly.stress > 0) {
      this.amp = 2.0
      this.wtime += 0.5
      this.rc = Math.cos(this.wtime * 2.0)
      this.rb = Math.cos(this.wtime * 0.25)
      this.angle = Math.cos(3.0 * this.wtime + (this.rc * this.rb) / 2) / 5
      this.angle = 0.5 * this.angle + 0.5
      this.wangle = Math.PI * 1.5
    } else {
      this.wtime += 0.05
      this.rc = Math.cos(this.wtime * 2.0)
      this.rb = Math.cos(this.wtime * 0.25)
      this.ra = Math.cos(this.wtime * 5)
      this.angle = Math.cos(this.wtime + (this.rc + this.ra * this.rb) / 2) / 5
      this.angle = 0.5 * this.angle + 0.5
    }

    this.wangle /= this.amp
    this.wing.euler.y = this.wangle + this.angle
    this.wing2.euler.y = this.wangle - this.angle + this.wangle

    if (this.config.anchor != null) {
      this.atime = 1.0
      this.xpos = this.config.anchor.leaf.position3d.x - this.config.x
      this.ypos = this.config.anchor.leaf.position3d.y - this.config.y
      this.zpos = this.config.anchor.leaf.position3d.z - 5
      this.plusx = this.xpos + (Math.cos(this.time) * 400)
      this.plusy = this.ypos + ((0.5 * Math.sin(this.time) + 0.5) * -300)
      this.newx = Tools.mix1(this.config.x, this.plusx, this.butterfly.stress)
      this.newy = Tools.mix1(this.config.y, this.plusy, this.butterfly.stress)

      this.butterfly.position3d.x = this.newx
      this.butterfly.position3d.y = this.newy
      this.butterfly.position3d.z = this.zpos
      this.butterfly.zIndex = -this.zpos
    }

    this.shape2.alpha = Math.min(1.3 - this.config.palette.nightVal, 0.8)
    this.shape.alpha = Math.min(1.3 - this.config.palette.nightVal, 0.8)
  }
}
