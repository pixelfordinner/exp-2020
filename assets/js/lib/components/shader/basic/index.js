export class basicShader {
  constructor (app, config = {}) {
    this.defaults = {
      type: 'basic'

    }

    this.time = 0
    app.ticker.add(delta => this.onTick(delta))
    this.config = Object.assign(this.defaults, config)

    // this.source = require('!raw-loader!../../../data/shaders/iridescent/fragment.glsl') // absolute path

    switch (this.config.type) {
      case 'ripple':
        console.log('ripple')
        this.source = require('!raw-loader!data/shaders/ripple/frag.glsl')
        this.sourcev = require('!raw-loader!data/shaders/ripple/vert.glsl')

        break

      default:
        this.source = require('!raw-loader!data/shaders/basic/frag.glsl')
        this.sourcev = require('!raw-loader!data/shaders/basic/vert.glsl')
        break
    }
    // this.source = require('!raw-loader!data/shaders/basic/frag.glsl')
    this.shaderfragment = this.source.default
    // this.sourcev = require('!raw-loader!data/shaders/basic/vert.glsl')
    this.shadervertex = this.sourcev.default
    // console.log()

    // this.program = new PIXI.Program(PIXI.Program.defaultVertexSrc, this.shaderfragment, 'irishader')
    // this.program2 = new PIXI.Program(this.shadervertex, this.shaderfragment, 'irishader')
    // this.shader = new PIXI.Shader(this.program, { stime: 0.0 })
  }

  onTick (delta) {
  }
}
