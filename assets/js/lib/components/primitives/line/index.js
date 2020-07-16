import { Tools } from 'objects/tools/geometry'

export class LineComponent {
  constructor (app, config = {}) {
    this.defaults = {

      stroke: 4,
      color: 0x4A345F,
      alfa: 1,
      alignment: 0.5,
      native: false
    }
    this.app = app
    this.config = Object.assign(this.defaults, config)
    this.setup()
    this.doShape(this.config.color)
  }

  setup () {
    this.app.ticker.add(delta => this.onTick(delta))
    this.time = 0
    this.shape = new PIXI.Graphics()
    this.camera = this.config.camera
  }

  doShape (color) {
    this.shape.clear()
    this.shape.lineStyle(this.config.stroke, color, this.config.alfa)
    this.shape.moveTo(0, 0)
    this.shape.bezierCurveTo(0, 0, -20, 100, 0, 200)
  }

  onTick (delta) {
  }

  onResize () {
  }
}
