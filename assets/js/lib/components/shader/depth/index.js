export class depthShader {
  constructor (app, config = {}) {
    this.defaults = {
      univers: 'forest'

    }

    this.time = 0
    app.ticker.add(delta => this.onTick(delta))
    this.config = Object.assign(this.defaults, config)

    console.log(this.config)

    switch (this.config.univers) {
      case 'garden':
        this.source = require('!raw-loader!data/shaders/wind/frag.glsl')
        this.sourcev = require('!raw-loader!data/shaders/wind/vert.glsl')

        break

      default:
        this.source = require('!raw-loader!data/shaders/sunray/frag.glsl')
        this.sourcev = require('!raw-loader!data/shaders/sunray/vert.glsl')
        break
    }

    this.shaderfragment = this.source.default
    this.shadervertex = this.sourcev.default
  }

  onTick (delta) {
  }
}
