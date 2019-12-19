import { Tools } from 'objects/tools/geometry'

export class MaskComponent {
  constructor (app, config = {}) {
    this.defaults = {
      mame: mask,
      size: 10
    }
    this.config = Object.assign(this.defaults, config)
    this.shape = this.config.avatar
    this.time = 0

    this.app.ticker.add(delta => this.onTick(delta))
  }

  onTick (delta) {
    this.time++
    console.log(this.shape)
  }
}
