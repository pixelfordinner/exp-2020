import wing from '!raw-loader!data/svg/wing3.svg'
import { Tools } from 'objects/tools/geometry'

export class ButterflyComponent {
  constructor (app, config = {}) {
    this.defaults = {
      x: 0,
      y: 0,
      z: 0

    }
    this.config = Object.assign(this.defaults, config)
    this.time = 0
    this.wtime = 0
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
    // this.eye.endFill()
    // this.eye.beginFill(this.config.palette.quaternary)
    // this.eye.drawCircle(-this.shape.width + 50, -50, 30, 30)

    this.eye.endFill()

    this.wing = new PIXI.projection.Container3d()
    // this.wing.addChild(this.eye)
    this.wing.addChild(this.shape)
    this.wing.addChild(this.eye)

    // this.wing.pivot.x = this.wing.width

    this.wing2 = new PIXI.projection.Container3d()
    this.shape2 = new SVG(wing)
    this.shape2.tint = this.config.palette.quaternary
    this.shape2.alpha = 0.3
    // this.shape2 = new PIXI.Graphics()

    // this.shape2.addChild(this.tmp_shape)
    this.eye2 = new PIXI.Graphics()
    this.eye2.beginFill('0xffffff')
    // this.shape2.drawCircle(70, 50, 20, 20)
    this.eye2.drawCircle(-this.shape2.width + 50, -50, 20, 20)
    // this.eye2.endFill()
    // this.eye2.beginFill(this.config.palette.quaternary)
    // this.eye2.drawCircle(-this.shape2.width + 50, -50, 30, 30)
    this.eye2.endFill()
    // this.shape2.tint = this.config.palette.tertiary
    // this.shape2.position.x -= this.shape2.width
    this.shape2.pivot.x = this.shape.width
    this.shape2.pivot.y = this.shape.height / 2
    // this.shape2
    // this.shape2.scale.set(-1, 1)
    // this.shape2.position.x += this.shape2.width

    this.wing2.addChild(this.shape2)
    this.wing2.addChild(this.eye2)

    // this.wing2.scale3d.set(-1, 1)

    // this.wing.beginFill(this.config.palette.tertiary)
    // this.wing.drawRect(0, 0, 10, 10)
    // this.wing.endFill()

    this.butterfly = new PIXI.projection.Container3d()
    this.butterfly.addChild(this.wing)
    this.butterfly.addChild(this.wing2)
    this.config.parent.scene.addChild(this.butterfly)
    this.butterfly.scale3d.set(0.5, 0.5, 0.5)
    // this.wing.euler.y = -Math.PI
    this.wing2.euler.y = Math.PI / 1.2
    this.wing.euler.y = Math.PI / 1.2 + Math.PI

    if (this.config.anchor != null && !this.butterfly.affraid) {
      this.config.x = this.config.anchor.leaf.position3d.x
      this.config.y = this.config.anchor.leaf.position3d.y - 300
      this.config.z = this.config.anchor.leaf.position3d.z - 20
      // this.
      this.butterfly.position3d.set(this.config.x, this.config.y, this.config.z)
    }

    // this.butterfly.position3d.set(this.config.x, this.config.y, this.config.z)
    this.butterfly.zIndex = -this.config.z
    // this.butterfly.euler.y = -Math.PI / 2
    // this.app.stage.addChild(this.shape)
    //  this.butterfly.euler.y = 3
    this.butterfly.interactive = true
    this.butterfly.affraid = false
    this.butterfly.stress = 0
    this.butterfly.on('mouseover', this.onTop)
  }

  onTop () {
    // this.affraid = true
    // this.stress = 1
  }

  onTick (delta) {
    this.amp = 1.4
    // if (this.butterfly.stress > 0) {
    //   this.amp = 0.9
    // }
    if (this.config.anchor.leaf.status) {
      this.butterfly.affraid = true
    }
    if (this.butterfly.stress > 0) {
      this.amp = 1.6
      this.wtime += 1
      this.rc = Math.cos(this.wtime * 2.0)
      this.rb = Math.cos(this.wtime * 0.25)
      // this.ra = Math.cos(this.time * 5)

      this.angle = Math.cos(this.wtime + (this.rc * this.rb) / 2) / 5
      this.angle = 0.5 * this.angle + 0.5
    } else {
      // this.amp = 0.8
      this.wtime += 0.05
      this.rc = Math.cos(this.wtime * 2.0)
      this.rb = Math.cos(this.wtime * 0.25)
      this.ra = Math.cos(this.wtime * 5)

      this.angle = Math.cos(this.wtime + (this.rc + this.ra * this.rb) / 2) / 5
      this.angle = 0.5 * this.angle + 0.5
    }
    this.time += 0.05

    if (this.butterfly.affraid && this.butterfly.stress < 1) {
      this.butterfly.stress += 0.01
      console.log('stress up')
      if (this.butterfly.stress >= 1) {
        this.butterfly.affraid = false
      }
    }
    if (!this.butterfly.affraid && this.butterfly.stress > 0) {
      this.butterfly.stress -= 0.01
      console.log('stress down')
    }

    // this.amp = 1.1
    // if (this.butterfly.stress > 0) {
    //   this.amp = 0.9
    // }
    this.wing.euler.y = Math.PI / this.amp + this.angle
    this.wing2.euler.y = Math.PI / this.amp - this.angle

    if (this.config.anchor != null) {
    //   this.xpos = this.config.anchor.leaf.position3d.x
    //   this.ypos = this.config.anchor.leaf.position3d.y
      // this.zpos = this.config.anchor.leaf.position3d.z - 2
      // this.butterfly.position3d.z = this.zpos

      // this.time += 0.1
      // console.log(this.butterfly.affraid)
      this.atime = 1.0
      this.xpos = this.config.anchor.leaf.position3d.x
      this.ypos = this.config.anchor.leaf.position3d.y - 300
      this.zpos = this.config.anchor.leaf.position3d.z - 50

      this.plusx = this.xpos + (Math.cos(this.time) * 400)
      this.plusy = this.ypos + ((0.5 * Math.sin(this.time) + 0.5) * -300)
      // this.plusz = // this.zpos - ((0.5 * Math.sin(this.time) + 0.5) * 30)
      // console.log(this.plusx)
      this.newx = Tools.mix1(this.config.x, this.plusx, this.butterfly.stress)
      this.newy = Tools.mix1(this.config.y, this.plusy, this.butterfly.stress)
      // this.newz = Tools.mix1(this.config.z, this.plusz, this.butterfly.stress)

      this.butterfly.position3d.x = this.newx
      this.butterfly.position3d.y = this.newy
      this.butterfly.position3d.z = this.zpos
      this.butterfly.zIndex = -this.zpos
    }

    this.shape2.alpha = Math.min(1.3 - this.config.palette.nightVal, 0.8)
    this.shape.alpha = Math.min(1.3 - this.config.palette.nightVal, 0.8)
  }
}
