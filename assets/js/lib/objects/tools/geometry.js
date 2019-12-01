import * as PIXI from 'pixi.js'

export class GeometryTools {
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
    let x1 = a.x
    let y1 = a.y
    let x2 = b.x
    let y2 = b.y

    let x = x1 * (1 - d) + x2 * d
    let y = y1 * (1 - d) + y2 * d
    return new PIXI.Point(x, y)
  }
}
