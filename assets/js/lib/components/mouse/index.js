
import { Tools } from 'objects/tools/geometry'
export class MouseComponent {
  constructor (app) {
    this.app = app
    this.pos = new PIXI.Point()

    this.shape = new PIXI.Graphics()
    this.shape.anchor = new PIXI.Point(0.5, 0.5)
    this.shape.beginFill(0x000000)
    this.shape.drawRect(0, 0, this.app.width, this.app.height)
    this.shape.beginFill(0xffffff)
    this.shape.drawCircle(0, 0, 100)
    this.shape.endFill()
    this.app.stage.addChild(this.shape)

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

  getmouseInfluenceMap (refPoint, minD, maxD, minF, maxF) {
    const px = this.pos.x - refPoint.x
    const py = this.pos.y - refPoint.y
    const op = new PIXI.Point(px, py)
    const lgth = Tools.getPolarlength(op)
    // console.log(lgth)

    return Tools.map(lgth, minD, maxD, minF, maxF)
  }

  onTick (delta) {
    this.getpos()
    this.shape.x = this.pos.x
    this.shape.y = this.pos.y
  }
}
