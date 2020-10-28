export class depthShader {
  constructor (app, config = {}) {
    this.defaults = {
      collection: 'wood'

    }

    this.time = 0
    app.ticker.add(delta => this.onTick(delta))
    this.config = Object.assign(this.defaults, config)

    console.log(this.config)

    switch (this.config.collection) {
      case 'wood':
        this.source = require('!raw-loader!data/shaders/sunray/sunray.frag')
        this.sourcev = require('!raw-loader!data/shaders/sunray/sunray.vert')

        break

      default:
        this.source = require('!raw-loader!data/shaders/wind/wind.frag')
        this.sourcev = require('!raw-loader!data/shaders/wind/wind.vert')
        break
    }

    this.shaderfragment = this.source.default
    this.shadervertex = this.sourcev.default
  }

  onTick (delta) {
  }
}
