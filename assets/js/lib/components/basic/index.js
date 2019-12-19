import { Tools } from 'objects/tools/geometry'

export class BasicComponent {
  constructor (app, config = {}) {
    this.defaults = {
      mame: mask,
      size: 10
    }
    this.config = Object.assign(this.defaults, config)
    this.time = 0

    this.app.ticker.add(delta => this.onTick(delta))
  }

  onTick (delta) {
    this.time++
  }
}
