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
    const x1 = a.x
    const y1 = a.y
    const x2 = b.x
    const y2 = b.y

    const x = x1 * (1 - d) + x2 * d
    const y = y1 * (1 - d) + y2 * d
    return new PIXI.Point(x, y)
  }
}
