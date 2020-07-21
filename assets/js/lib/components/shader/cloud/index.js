
export class CloudShader {
  constructor (app, config = {}) {
    this.defaults = {

    }

    this.time = 0
    app.ticker.add(delta => this.onTick(delta))
    this.config = Object.assign(this.defaults, config)
    this.source = require('!raw-loader!data/shaders/cloud/frag.glsl')
    this.shaderfragment = this.source.default
    this.sourcev = require('!raw-loader!data/shaders/cloud/vert.glsl')
    this.shadervertex = this.sourcev.default
  }

  onTick (delta) {
  }
}
