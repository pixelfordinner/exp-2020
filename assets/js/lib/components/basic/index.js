
export class BasicComponent {
  constructor (app, config = {}) {
    this.defaults = {

    }
    this.config = Object.assign(this.defaults, config)
    this.time = 0

    app.ticker.add(delta => this.onTick(delta))
  }

  onTick (delta) {
    this.time++
  }
}
