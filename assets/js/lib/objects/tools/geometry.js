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

  static Cart2Pol (p) {
    const l = Math.sqrt(Math.pow(p.x, 2.0) + Math.pow(p.y, 2.0))
    const a = Math.atan(p.y, p.x)
    console.log(a)

    return new PIXI.Point(a, l)
  }

  static Pol2Cart (a, l) {
    const x = l * Math.cos(a)
    const y = l * Math.sin(a)

    return new PIXI.Point(x, y)
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

  static remap (value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1)
  }

  static clamp (x, minVal, maxVal) {
    return Math.min(Math.max(x, minVal), maxVal)
  }

  static smoothstep (x, edge0, edge1) {
    // const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0)
    const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0.0), 1.0)

    return t * t * (3.0 - 2.0 * t)
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
