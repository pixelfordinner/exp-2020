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
    // this.tige.lineStyle(10.0, 0xffffff, 1, 0.5, false)
    // this.tige.arcTo(0, 0, 0, 800, 1000)

    this.shape.lineStyle(this.config.stroke, color, this.config.alfa)
    // this.tige.mooveTo()
    // this.shape.arc(0, 0, 60, 2 * Math.PI, 3 * Math.PI / 2)
    this.shape.moveTo(0, 0)
    // this.shape.lineTo(0, 200)

    // this.tige.arcTo(650, 270, 467, 800, 1000)
    this.shape.bezierCurveTo(0, 0, -20, 100, 0, 200)

    // console.log(this.shape)
    // this.camera.addChild(this.tige)
    // this.app.stage.addChild(this.tige)
  }

  onTick (delta) {
  }

  onResize () {
  }
}
