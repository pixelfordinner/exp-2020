import { Matrix, Point } from 'pixi.js'
import { Tools } from 'objects/tools/geometry'

export class BlobComponent {
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
    // this.makeStarShape()
    this.num = 4

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    // this.setBlobPoints()
    this.getCirclePoints(new PIXI.Point(300, 300), 100)
    // this.drawQuadraticCurve()
    this.drawPath(this.ctx, this.ipoints)

    this.t = new PIXI.Texture.from(this.canvas)
    this.shape.beginTextureFill(this.t)
    this.shape.drawRect(0, 0, 700, 700)
    this.shape.endFill()
    // this.setBlobInfluencePoints()
    // this.compileBezierData()
    // this.drawBezierCurves()
    // this.drawQuadraticCurve()
    this.parent.addChild(this.shape)
    // this.shape.scale.set(4)
    // this.drawBezierCurves()
  }

  makeStarShape () {
    const n = 32
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 / (n)) * i
      const a2 = (Math.PI * 2 / (n)) * (i + 1)
      const r1 = 20
      const r2 = 300
      this.radius = r1 + (35.0 * Math.cos(i * Math.PI))
      const s = Tools.Pol2Cart(a, r1)
      const e = Tools.Pol2Cart(a2, r1)
      const v = Tools.mix2(s, e, 0.5)
      const aa = Tools.mix1(a, a2, 0.5)
      const v2 = Tools.Pol2Cart(aa, this.radius)
      console.log(v)
      const b = [s, v2, e]
      this.points.push(b)
    }
  }

  setBlobPoints () {
    const n = this.num
    for (let i = 0; i < n; i++) {
      const tetha = (Math.PI * 2 / n)
      const p = tetha * i
      const q = tetha * i + tetha / 2
      const r1 = 20
      const r2 = 25
      // const s = Tools.Pol2Cart(a, r1)
      this.points.push(Tools.Pol2Cart(q, r1))
      this.points.push(Tools.Pol2Cart(p, r2))
    }
  }

  setBlobInfluencePoints () {
    const n = this.num
    const r1 = 4
    for (let i = 0; i < n - 1; i++) {
      const p1 = this.points[i]
      const p2 = this.points[i + 1]
      const p3 = Tools.mix2(p1, p2, 0.5)

      const pa = Tools.Cart2Pol(p2)
      const pp = Tools.Pol2Cart(pa.x, pa.y)
      // console.log(pa)

      const x1 = pa.y * Math.cos(pa.x)
      const y1 = pa.y * Math.sin(pa.x)

      this.ipoints.push(new PIXI.Point(pp.x, pp.y))
    }
  }

  compileBezierData () {
    const n = this.num
    for (let i = 0; i < n; i += 2) {
      const p1 = this.points[i]
      const p2 = this.points[i + 1]
      const p1_2 = this.ipoints[i]
      const c = [p1, p2]
      this.curve_points.push(c)
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

  drawQuadraticCurve () {
    this.shape.clear()
    this.shape.beginFill('0xffffff')
    // this.shape.moveTo(this.ipoints[0].x, this.ipoints[1].y)
    this.ipoints.forEach((c, index) => {
      if (index < this.ipoints.length - 1) {
        // this.shape.moveTo(this.ipoints[index].x, this.ipoints[index].y)
        // this.shape.moveTo(this.ipoints[0].x, this.ipoints[1].y)
        this.shape.quadraticCurveTo(c.mx, c.my, c.x, c.y)
      }

      // this.shape.bezierCurveTo(c[0].x, c[0].y, c[1].x, c[1].y, c[2].x, c[2].y)

      // this.shape.quadraticCurveTo(c[0].x, c[0].y, c[1].x, c[1].y)
      // this.shape.bezierCurveTo(c[0].x, c[0].y, c[1].x, c[1].y, c[2].x, c[2].y)
    })
    // this.shape.closePath()
    this.shape.endFill()
  }

  drawBezierCurves () {
    this.shape.clear()
    this.shape.beginFill('0xffffff')
    this.shape.moveTo(this.curves[0][0].x, this.curves[0][0].y)
    this.curves.forEach((c, index) => {
      this.shape.bezierCurveTo(c[0].x, c[0].y, c[1].x, c[1].y, c[2].x, c[2].y)
    })
    this.shape.closePath()
    this.shape.endFill()
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
      const rr = radius + this.getRandomArbitrary(40, 100)
      this.ipoints.push({
        x: base.x + radius * Math.sin(angle),
        y: base.y + radius * Math.cos(angle),
        mx: base.x + rr * Math.sin(ba),
        my: base.y + rr * Math.cos(ba)
      })
    }
    this.ipoints.push(this.ipoints[0])
    // return positions
    // this.ipoints = positions
  }

  onTick (delta) {
    this.time += 0.05
    this.radius = 10
    // const moveSin = Math.sin(this.time) * 5
    // const moveCos = Math.cos(this.time) * 5
    const moveSin = 0
    const moveCos = 0

    // this.shape.clear()
    // this.shape.moveTo(0, -this.radius)
    // this.shape.beginFill('0xffffff')
    // this.shape.quadraticCurveTo(this.radius, -this.radius, this.radius, 0)

    // this.shape.quadraticCurveTo(this.radius, this.radius, 0, this.radius)

    // this.shape.quadraticCurveTo(-this.radius, this.radius, -this.radius, 0)
    // this.shape.quadraticCurveTo(-this.radius, -this.radius, 0, -this.radius)

    // this.shape.quadraticCurveTo(this.radius, -this.radius, this.radius, 0)
    // this.shape.quadraticCurveTo(this.radius, this.radius, 0, this.radius)
    // this.shape.quadraticCurveTo(-this.radius, this.radius, -this.radius, 0)
    // this.shape.quadraticCurveTo(-this.radius, -this.radius, 0, -this.radius)

    // this.shape.scale.set(4)
    // this.shape.closePath()
    // this.shape.endFill()
  }
}
