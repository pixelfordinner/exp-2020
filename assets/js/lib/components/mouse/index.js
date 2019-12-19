
import { Tools } from 'objects/tools/geometry'

export class MouseComponent {
  constructor (app) {
    this.app = app
    this.pos = new PIXI.Point()
    this.WorldPos = new PIXI.Point()
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

  getWorldpos () {
    const wpx = this.pos.x - this.app.screen.width / 2
    const wpy = this.pos.y - this.app.screen.height / 2
    this.worldPos = new PIXI.Point(wpx, wpy)
  }

  getParallax () {
    const parallaxH = Tools.map(this.pos.x, -this.app.screen.width / 2.5, this.app.screen.width / 2.5, -Math.PI, Math.PI)
    const parallaxV = Tools.map(this.pos.y, -this.app.screen.height / 2.5, this.app.screen.height / 2.5, -Math.PI, Math.PI)
    return new PIXI.Point(parallaxH, parallaxV)
  }

  getParallax2 () {
    const parallaxH = Tools.map(this.worldPos.x, -this.app.screen.width / 2, this.app.screen.width / 2, -Math.PI, Math.PI)
    const parallaxV = Tools.map(this.worldPos.y, -this.app.screen.height / 2, this.app.screen.height / 2, -Math.PI, Math.PI)
    return new PIXI.Point(parallaxH, parallaxV)
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
    this.shape.lineStyle(4, 0xffffff)
    this.shape.drawCircle(0, 0, 50)
    this.app.stage.addChild(this.shape)
  }

  getMouseInfluenceMap (refPoint, minD, maxD, minF, maxF) {
    const mpx = this.pos.x - this.app.screen.width / 2
    const mpy = this.pos.y - this.app.screen.height / 2

    const px = mpx - refPoint.x
    const py = mpy - refPoint.y
    const op = new PIXI.Point(px, py)
    const lgth = Tools.getPolarlength(op)
    // this.amp = lgth

    this.val = Tools.map(lgth, minD, maxD, minF, maxF)
    if (this.val < 0) this.val = 0
    return this.val
  }

  getMouseInfluenceX (refPoint, minD, maxD, minF, maxF) {
    const mpx = this.pos.x - this.app.screen.width / 2
    const mpy = this.pos.y - this.app.screen.height / 2

    const px = mpx - refPoint.x
    const py = mpy - refPoint.y
    const op = new PIXI.Point(px, py)
    const lgth = Tools.getXlength(op)
    // this.amp = lgth

    this.val = Tools.map(lgth, minD, maxD, minF, maxF)
    if (this.val < 0) this.val = 0
    return this.val
  }

  onTick (delta) {
    this.time += 0.1
    this.getpos()
    this.getWorldpos()
    this.shape.x = this.pos.x
    this.shape.y = this.pos.y
    this.drawShape()
  }
}
