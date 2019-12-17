export class Tools {
  static move2 (graphic, point) {
    graphic.moveTo(point.x, point.y)
  }

  static line2 (graphic, point) {
    graphic.lineTo(point.x, point.y)
  }

  static mix1 (a, b, di) {
    return a * (1 - di) + b * di
  }

  static mix2 (a, b, d) {
    const x1 = a.x
    const y1 = a.y
    const x2 = b.x
    const y2 = b.y

    const x = x1 * (1 - d) + x2 * d
    const y = y1 * (1 - d) + y2 * d
    return new PIXI.Point(x, y)
  }

  static map (n, start1, stop1, start2, stop2) {
    var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2
    return newval
  }

  static getPolarlength (p) {
    const length = Math.sqrt(Math.pow(p.x, 2.0) + Math.pow(p.y, 2.0))
    return length
  }

  static getXlength (p) {
    const length = Math.sqrt(Math.pow(p.x, 2.0))
    return length
  }

  static getYlength (p) {
    const length = Math.sqrt(Math.pow(p.y, 2.0))
    return length
  }

  // static distToVector (v1, v2) {
  //   return Math.sqrt(Math.pow(v1.x - v1.y, 2) + Math.pow(v2.x - v2.y, 2))
  // }
}
