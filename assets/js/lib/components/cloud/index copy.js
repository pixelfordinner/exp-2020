import CloudShadingTexture from 'components/textures/cloud'

export class CloudComponent {
  constructor (app, config = {}) {
    this.defaults = {

    }
    this.config = Object.assign(this.defaults, config)
    this.time = 0
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))
    this.ctex = new CloudShadingTexture(this.app)
  }

  onTick (delta) {
    this.time++
  }
}
