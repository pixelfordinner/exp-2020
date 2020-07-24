import { LineComponent } from 'components/primitives/line'

export class FlowerComponent {
  constructor (app, config = {}) {
    this.defaults = {
      parent: app.stage,
      x: 400,
      y: 500,
      z: 100

    }
    this.config = Object.assign(this.defaults, config)
    this.time = 0
    this.amp = 0
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))

    this.parent = this.config.parent.scene
    this.palette = this.config.parent.palette

    this.flower = new PIXI.projection.Container3d()

    this.bulb = new PIXI.Graphics()
    this.bulb.beginFill(0xffffff)
    this.bulb.drawEllipse(0, 0, 10, 15)
    this.bulb.endFill()
    this.bulb.interactive = true
    this.bulb.on('mouseover', this.mouseover)
    this.bulb.on('pointerout', this.mouseout)

    this.petal = new PIXI.Graphics()
    this.petal.beginFill(0xffffff)
    this.petal.drawEllipse(0, -10, 3, 7)
    this.petal.endFill()

    // this.petal.on('mouseover', this.mouseover)
    // this.petal.on('pointerout', this.mouseout)

    this.line = new LineComponent(this.app, { color: this.palette.secondary })

    this.flower.addChild(this.line.shape)
    this.flower.addChild(this.bulb)
    this.flower.addChild(this.petal)
    this.flower.position3d.set(this.config.x, this.config.y, this.config.z)
    this.flower.scale3d.set(2)

    this.parent.addChild(this.flower)
  }

  mouseover () {
    this.active = true
  }

  mouseout () {
    this.active = false
  }

  onTick (delta) {
    this.active = this.bulb.active
    if (this.active) {
      this.amp += 0.01
      this.amp = Math.min(this.amp, 0.2)
    } else {
      this.amp -= 0.0005
      this.amp = Math.max(0, this.amp)
    }

    this.time += 0.01 + this.amp
    this.petal.tint = '0xffffff'
    this.petal.tint = this.palette.secondary
    this.bulb.tint = '0xffffff'
    this.bulb.tint = this.palette.getConstantSmoothDepthColor(this.flower.position3d.z)

    this.flower.zIndex = -this.flower.position3d.z
    // this.petal.scale.set((this.amp * 10))
    this.bulb.position.x = Math.cos(this.time) * 20
    this.petal.position.x = Math.cos(this.time) * 22
    this.bulb.angle = Math.cos(this.time) * 6
    const p1 = this.bulb.position
    const p2 = new PIXI.Point(this.bulb.position.x, this.bulb.position.y + 200)

    this.line.drawLine(p1, p2, this.palette.getConstantSmoothDepthColor(this.flower.position3d.z))
  }
}
