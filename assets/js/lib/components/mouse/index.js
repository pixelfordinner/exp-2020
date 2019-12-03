export class MouseComponent {
  constructor (app, config = {}) {
    this.defaults = {
    }
    this.app = app
    this.time = 0.1
    this.config = Object.assign(this.defaults, config)
    this.camera = this.config.camera.getCamera()
    this.setup()
  }

  setup () {
    this.app.ticker.add(delta => this.onTick(delta))
  }

  onTick (delta) {
  }
}
