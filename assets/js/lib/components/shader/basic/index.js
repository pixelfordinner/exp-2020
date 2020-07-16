export class basicShader {
  constructor (app, config = {}) {
    this.defaults = {

    }

    this.time = 0
    app.ticker.add(delta => this.onTick(delta))
    this.config = Object.assign(this.defaults, config)

    // this.source = require('!raw-loader!../../../data/shaders/iridescent/fragment.glsl') // absolute path
    this.source = require('!raw-loader!data/shaders/basic/frag.glsl')
    this.shaderfragment = this.source.default
    this.sourcev = require('!raw-loader!data/shaders/basic/vert.glsl')
    this.shadervertex = this.sourcev.default
    // console.log()

    // this.program = new PIXI.Program(PIXI.Program.defaultVertexSrc, this.shaderfragment, 'irishader')
    // this.program2 = new PIXI.Program(this.shadervertex, this.shaderfragment, 'irishader')
    // this.shader = new PIXI.Shader(this.program, { stime: 0.0 })
  }

  onTick (delta) {
  }
}
