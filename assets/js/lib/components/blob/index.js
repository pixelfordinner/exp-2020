
export class BlobComponent {
  constructor (app, config = {}) {
    this.defaults = {

    }
    this.config = Object.assign(this.defaults, config)
    this.time = 0

    app.ticker.add(delta => this.onTick(delta))
    this.numbers = 6
    this.pump = 30
    this.angles = []
    this.parent = this.config.parent.scene
    // this.rangles = []
    this.setAnglesRange(this.numbers, this.angles)
    this.rangles = this.randomizeAngles(this.angles)
    this.lengths = this.getrandomLenght()
    console.log(this.lengths)

    this.points = this.getpolarPoints(this.rangles, this.lengths)
    this.vectors = this.getVectorPoints(this.points, this.rangles, this.pump)
    // console.log(this.vectors[2][1])
    this.curvedata = this.compileCurveData(this.points, this.vectors)
    // console.log(this.curvedata)
    this.curve = new PIXI.Graphics()

    this.drawCurve(this.curvedata, this.curve)

    this.shape = new PIXI.Graphics()
    this.drawPoints(this.points, this.shape)
    this.drawVectorPoints(this.vectors, this.shape)

    this.parent.addChild(this.shape)
    this.parent.addChild(this.curve)
  }

  drawCurve (data, graphics) {
    graphics.beginFill(0xffffff)
    graphics.moveTo(data[this.numbers - 1].p.x, data[this.numbers - 1].p.y)
    // graphics.drawCircle(data[this.numbers - 1].p.x, data[this.numbers - 1].p.y, 20, 20)
    // graphics.moveTo(data[0].p.x, data[0].p.y)

    data.forEach((c, index) => {
      // graphics.lineTo(p.x, p.y)
      // graphics.lineTo(d.p.x, d.p.y)

      // graphics.drawCircle(d.p.x, d.p.y, 20, 20)

      // console.log(c.cp2.x)
      // graphics.moveTo(c.p.x, c.p.y)
      // graphics.lineTo(p.x, p.y)
      // graphics.drawCircle(p.x, p.y, 20, 20)
      //
      graphics.bezierCurveTo(c.cp2.x, c.cp2.y, c.cp.x, c.cp.y, c.p.x, c.p.y)
    })
    graphics.endFill()
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
    // const r = 200
    const points = []
    // for (const a of angles) {
    //   const angle = (a / 360) * Math.PI * 2
    //   const r = 100
    //   console.log('angle  deg: ' + a + ' rad : ' + angle)
    //   const x = r * Math.cos(angle)
    //   const y = r * Math.sin(angle)
    //   points.push(new PIXI.Point(x, y))
    // }
    angles.forEach((a, index) => {
      const r = lengths[index]
      const angle = (a / 360) * Math.PI * 2

      // console.log('angle' + index + ' : ' + angle)

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
    // console.log(rangles)
    return rangles
  }

  uniformAngles (angles) {
    const uangles = []
    angles.forEach((a, index) => {
      const angle = (Math.PI * 2) / (index)
      uangles.push(angle)
    })
    // console.log(uangles)
    return uangles
  }

  setAnglesRange (num, angles) {
    // const angle = (Math.PI * 2) / this.numbers
    const a = 330 / num
    const gap = 20
    for (let i = 0; i < num; i++) {
      if (i < num - 1) {
        angles.push([(a * i) + gap, (a * (i + 1)) - gap])
      } else {
        angles.push([(a * i) + gap, 330])
      }
      // console.log(angles)
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

  onTick (delta) {
    this.time++
  }
}
