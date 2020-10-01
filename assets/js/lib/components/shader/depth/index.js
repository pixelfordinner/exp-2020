export class depthShader {
  constructor (app, config = {}) {
    this.defaults = {

    }

    this.time = 0
    app.ticker.add(delta => this.onTick(delta))
    this.config = Object.assign(this.defaults, config)

    this.source = require('!raw-loader!data/shaders/depth/frag.glsl')
    this.sourcev = require('!raw-loader!data/shaders/depth/vert.glsl')

    this.shaderfragment = this.source.default
    this.shadervertex = this.sourcev.default
  }

  onTick (delta) {
  }
}
