
import { Tools } from 'objects/tools/geometry'
export class MouseComponent {
  constructor (app) {
    this.app = app
    this.pos = new PIXI.Point()
    this.initShape()
    this.amp = 100
    this.setup()
  }

  setup () {
    this.app.ticker.add(delta => this.onTick(delta))
  }

  getpos () {
    this.pos = this.app.renderer.plugins.interaction.mouse.global
  }

  isIn () {
    if (this.pos.x >= 0) {
      return true
    } else {
      return false
    }
  }

  initShape () {
    this.shape = new PIXI.Graphics()
    this.shape.anchor = new PIXI.Point(0.5, 0.5)
    this.shape.beginFill(0x000000)
    this.shape.drawRect(0, 0, this.app.width, this.app.height)
    this.shape.beginFill(0xffffff)
    this.shape.drawCircle(0, 0, 10)
    this.shape.endFill()
    this.app.stage.addChild(this.shape)
  }

  drawShape () {
    this.shape.clear()
    this.shape.anchor = new PIXI.Point(0.5, 0.5)
    // if (this.amp <= 0) this.amp = 0
    this.shape.lineStyle(Tools.map(this.amp, 0, 200, 6, 2) + 10, 0xffffff)
    this.shape.drawCircle(0, 0, Tools.map(this.amp, 0, 200, 50, 10) + 40)
    this.app.stage.addChild(this.shape)
  }

  getmouseInfluenceMap (refPoint, minD, maxD, minF, maxF) {
    const px = this.pos.x - refPoint.x
    const py = this.pos.y - refPoint.y
    const op = new PIXI.Point(px, py)
    const lgth = Tools.getPolarlength(op)
    this.amp = lgth

    return Tools.map(lgth, minD, maxD, minF, maxF)
  }

  onTick (delta) {
    this.time += 0.1
    this.getpos()
    this.shape.x = this.pos.x
    this.shape.y = this.pos.y
    this.drawShape(Math.cos(this.time))
  }
}
