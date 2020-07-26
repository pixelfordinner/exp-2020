import { Matrix, Point } from 'pixi.js'
import { Tools } from 'objects/tools/geometry'

export class SvgBlobComponent {
  constructor (app, config = {}) {
    this.defaults = {

    }
    this.config = Object.assign(this.defaults, config)
    this.time = 0
    this.time2 = 0
    this.time3 = 0
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))
    this.parent = this.config.parent.scene

    this.shape = new PIXI.Graphics()
    this.points = []
    this.curve_points = []
    this.ipoints = []
    this.curves = []
    this.num = 4

    this.canvas = document.createElement('canvas')
    this.canvas.width = 600
    this.canvas.height = 600
    this.ctx = this.canvas.getContext('2d')
    this.getCirclePoints(new PIXI.Point(300, 300), 150)
    this.drawPath(this.ctx, this.ipoints)

    this.t = new PIXI.Texture.from(this.canvas)
    this.shape.beginTextureFill(this.t)
    this.shape.drawRect(0, 0, 600, 600)
    this.shape.endFill()
    // this.parent.addChild(this.shape)
    this.shape.pivot.x = this.shape.width / 2
    this.shape.pivot.y = this.shape.height / 2
    //
    // this.shape2 = new PIXI.Graphics()
    // this.drawShape()
    this.parent.addChild(this.shape)
  }

  drawShape () {
    this.shape2.clear()
    this.shape2.beginFill('0xffffff')
    // let cpath = `M${points[0].x},${points[1].y}`
    this.shape2.moveTo(this.ipoints[0].x, this.ipoints[0].y)
    for (let i = 0; i < this.ipoints.length - 1; i++) {
      const c = this.ipoints[i]

      // let p = this.ipoints[this.ipoints.length]
      if (i > 0) {
        const p = this.ipoints[i - 1]
        this.shape2.bezierCurveTo(p.mx, p.my, c.mx, c.my, c.x, c.y)
      } else {
        const p = this.ipoints[this.ipoints.length - 1]
        this.shape2.bezierCurveTo(p.mx, p.my, c.mx, c.my, c.x, c.y)
      }
      // this.shape2.bezierCurveTo(p.lx, p.ly, c.mx, c.my, c.x, c.y)
      // cpath += `S${point.mx},${point.my},${point.x},${point.y}`
    }
  }

  drawPath (ctx, points) {
    let cpath = `M${points[0].x},${points[1].y}`
    for (const point of points) {
      cpath += `S${point.mx},${point.my},${point.x},${point.y}`
    }
    cpath += 'Z'
    console.log(cpath)
    const p = new Path2D(cpath)
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.fillStyle = 'rgb(229, 244, 216)'
    ctx.fill(p)
  }

  getRandomArbitrary (min, max) {
    const amount = Math.random() * (max - min) + min
    const sign = Math.random() < 0.4 ? -1 : 1
    return sign * amount
  }

  rint (min, max) {
    const amount = Math.random() * (max - min) + min
    return Math.round(amount)
  }

  getCirclePoints (base, radius) {
    // const angles = [0, 45, 90, 135, 180, 225, 270, 315]; // randomize gaps (360 omitted)
    let angles = [0, 90, 180, 270] // randomize gaps (360 omitted)
    angles = [
      this.rint(0, 90 - 45),
      this.rint(90, 180 - 45),
      this.rint(180, 270 - 45),
      this.rint(270, 360 - 45)
    ]
    const positions = []
    for (const a in angles) {
      const angle = (angles[a] * Math.PI) / 180
      const ba = ((angles[a] - 20) * Math.PI) / 180
      const bc = (((angles[a] - 20) * Math.PI) - Math.PI) / 180
      const rr = radius + this.getRandomArbitrary(40, 100)
      this.ipoints.push({
        x: base.x + radius * Math.sin(angle),
        y: base.y + radius * Math.cos(angle),
        mx: base.x + rr * Math.sin(ba),
        my: base.y + rr * Math.cos(ba),
        lx: base.x + rr * Math.sin(bc),
        ly: base.y + rr * Math.cos(bc)
      })
    }
    this.ipoints.push(this.ipoints[0])
  }

  onTick (delta) {
    this.time += 0.05
    this.radius = 10

    const moveSin = 0
    const moveCos = 0
  }
}
