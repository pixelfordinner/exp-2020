import TWEEN from '@tweenjs/tween.js'
import { Tween, autoPlay } from 'es6-tween'

export class BlobComponent {
  constructor (app, config = {}) {
    this.defaults = {

    }
    this.config = Object.assign(this.defaults, config)
    this.time = 0

    app.ticker.add(delta => this.onTick(delta))
    this.numbers = 6
    this.pump = 30
    this.gap = 20
    this.angles = []
    // this.curvedata = 0
    this.parent = this.config.parent.scene
    // this.rangles = []

    this.curvedata = this.makeBlob()
    this.curvedata2 = this.makeBlob()
    this.prevdata = null
    this.blob = new PIXI.Graphics()
    this.blob.interactive = true
    this.blob.on('pointerdown', this.mousedown)
    this.blob.on('pointerup', this.mouseup)
    // this.drawCurve(this.curvedata, this.blob)
    this.parent.addChild(this.blob)
    // this.tween = new Tween(this.curvedata)
    // this.tween.from(this.curvedata)
    // this.tween.to(this.curvedata2)
    console.log(this.tween)

    this.shape = new PIXI.Graphics()
    // this.drawPoints(this.points, this.shape)
    // this.drawVectorPoints(this.vectors, this.shape)

    this.parent.addChild(this.shape)
    // this.parent.addChild(this.blob)
    // this.t = new TWEEN.Tween(this.curvedata)
    // console.log(TWEEN)
  }

  mousedown () {
    // this.active = true
  }

  mouseup () {
    this.active = true
  }

  compileCurveData (points, vectors) {
    const data = []
    let pos = 0
    let v1pos = 0
    let v2pos = 0
    for (let i = 0; i < this.numbers; i++) {
      pos = points[i]
      v1pos = vectors[i][1]
      if (i > 0) {
        v2pos = vectors[i - 1][0]
      }

      if (i === 0) {
        v2pos = vectors[this.numbers - 1][0]
      }
      const config = {
        p: pos,
        cp: v1pos,
        cp2: v2pos
      }
      data.push(config)
    }
    return data
  }

  rint (min, max) {
    const amount = Math.random() * (max - min) + min
    return Math.round(amount)
  }

  getVectorPoints (points, angles, pump) {
    const vectors = []
    const r = pump
    points.forEach((p, index) => {
      const angle = angles[index] / 360 * Math.PI * 2
      let tetha = Math.cos(this.time) * 13
      tetha = 0
      const nangle = tetha + angle + Math.PI / 2
      const pangle = tetha + angle - Math.PI / 2

      const x1 = p.x + r * Math.cos(nangle)
      const y1 = p.y + r * Math.sin(nangle)
      const x2 = p.x + r * Math.cos(pangle)
      const y2 = p.y + r * Math.sin(pangle)
      const p1 = new PIXI.Point(x1, y1)
      const p2 = new PIXI.Point(x2, y2)
      vectors.push([p1, p2])
    })
    return vectors
  }

  drawVectorPoints (points, shape) {
    // shape.clear()
    shape.beginFill('0x00ffff')
    points.forEach(p => {
      shape.drawCircle(p[0].x, p[0].y, 4, 4)
      shape.drawCircle(p[1].x, p[1].y, 4, 4)
    })
    shape.endFill()
    shape.lineStyle(2, '0x00ffff')
    points.forEach(p => {
      shape.moveTo(p[0].x, p[0].y)
      shape.lineTo(p[1].x, p[1].y)
    })
    shape.endFill()
  }

  drawPoints (points, shape) {
    shape.clear()
    shape.beginFill()
    points.forEach((p, index) => {
      shape.drawCircle(p.x, p.y, 8, 8)
      // shape.alpha = 1 / index
    })
    shape.endFill()
  }

  getrandomLenght () {
    const lengths = []
    for (let i = 0; i < this.numbers; i++) {
      const l = this.getRandomArbitrary(10, 30)
      lengths.push(100 - l)
    }
    return lengths
    console.log(lengths)
  }

  getpolarPoints (angles, lengths) {
    const points = []
    angles.forEach((a, index) => {
      const r = lengths[index]
      const angle = (a / 360) * Math.PI * 2
      const x = r * Math.cos(angle)
      const y = r * Math.sin(angle)
      points.push(new PIXI.Point(x, y))
    })
    return points
  }

  randomizeAngles (angles) {
    const rangles = []
    angles.forEach((a, index) => {
      const angle = this.rint(a[0], a[1])
      rangles.push(angle)
    })
    return rangles
  }

  uniformAngles (angles) {
    const uangles = []
    angles.forEach((a, index) => {
      const angle = (Math.PI * 2) / (index)
      uangles.push(angle)
    })
    return uangles
  }

  setAnglesRange (num, angles) {
    const a = 330 / num
    const gap = this.gap
    for (let i = 0; i < num; i++) {
      if (i < num - 1) {
        angles.push([(a * i) + gap, (a * (i + 1)) - gap])
      } else {
        angles.push([(a * i) + gap, 330])
      }
    }
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

  makeBlob () {
    this.setAnglesRange(this.numbers, this.angles)
    this.rangles = this.randomizeAngles(this.angles)
    this.lengths = this.getrandomLenght()
    this.points = this.getpolarPoints(this.rangles, this.lengths)
    this.vectors = this.getVectorPoints(this.points, this.rangles, this.pump)
    return this.compileCurveData(this.points, this.vectors)
  }

  drawvectors (data, graphics) {
    graphics.clear()
    graphics.lineStyle(2, '0x00ffff')
    data.forEach((vertex, index) => {
      const p = vertex.p
      let cp2 = 0
      const cp = vertex.cp
      if (index < this.numbers - 1) {
        cp2 = data[index + 1].cp2
      }
      if (index === this.numbers - 1) {
        cp2 = data[0].cp2
      }

      graphics.moveTo(cp.x, cp.y)
      graphics.lineTo(cp2.x, cp2.y)
      graphics.beginFill('0x00ffff')
      graphics.drawCircle(p.x, p.y, 8, 8)
      graphics.drawCircle(cp.x, cp.y, 3, 3)
      graphics.drawCircle(cp2.x, cp2.y, 3, 3)
    })
    graphics.endFill()
  }

  drawCurve (data, graphics) {
    graphics.clear()
    graphics.beginFill(0xffffff)
    graphics.moveTo(data[this.numbers - 1].p.x, data[this.numbers - 1].p.y)
    data.forEach((c, index) => {
      graphics.bezierCurveTo(c.cp2.x, c.cp2.y, c.cp.x, c.cp.y, c.p.x, c.p.y)
      // this.drawPoints(this.points, this.shape)
      // this.drawVectorPoints(this.vectors, this.shape)
    })
    graphics.closePath()
    graphics.endFill()
  }

  drawBlob (shape, shape2) {
    const data = this.curvedata
    autoPlay(true)

    if (this.prevdata === null) {
      this.drawCurve(data, shape)
      this.drawvectors(data, shape2)
      // this.drawPoints(this.points, this.shape)
      // this.drawVectorPoints(this.vectors, this.shape)
    } else {
      console.log('newblob')
      const coords = [...this.prevdata]
      const tween = new Tween(coords)
      tween.to(data, 1000)
      tween.on('update', p => {
        this.drawCurve(p, shape)
        this.drawvectors(p, shape2)
      })
      tween.start()
      // this.prevdata = data
    }
    // this.prevdata = data
    // this.prevdata = data
    // this.drawCurve(data, shape)
  }

  onTick (delta) {
    if (this.blob.active) {
      this.prevdata = this.curvedata
      this.curvedata = this.makeBlob()
      this.blob.active = false
      // this.prevdata =
      // this.drawCurve(this.curvedata, this.blob)
    }
    this.drawBlob(this.blob, this.shape)
    // setInterval(() => {
    //   this.makeBlob()
    //   this.drawCurve(this.curvedata, this.blob)
    //   // console.log('hello')
    // }, 3000)
    this.time++
  }
}
