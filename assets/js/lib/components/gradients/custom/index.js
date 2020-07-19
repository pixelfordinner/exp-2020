
export class Gradient {
  constructor (app, config = {}) {
    this.defaults = {
      colorStart: '#ff0000',
      colorEnd: '#000000',
      width: 1000,
      height: 1000,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0
    }
    this.app = app
    this.config = Object.assign(this.defaults, config)
    this.time = 0
    this.app.ticker.add(delta => this.onTick(delta))
    this.texture = this.make(this.config.colorStart, this.config.colorEnd, this.config.width, this.config.height)
  }

  onTick (delta) {
    this.time++
  }

  make (from, to, width, height) {
    const c = document.createElement('canvas')
    c.width = width
    c.height = height

    const ctx = c.getContext('2d')
    const grd = ctx.createLinearGradient(0, 0, 0, height)
    grd.addColorStop(0.5, from)
    grd.addColorStop(1, to)
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, width, height)
    // console.log(ctx)

    return new PIXI.Texture.from(c)
  }
}
