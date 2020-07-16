export class IridescentTexture {
  constructor (app) {
    // this.config = Object.assign(this.defaults, config)
    this.time = 0
    app.ticker.add(delta => this.onTick(delta))
    this.source = require('!raw-loader!data/shaders/iridescent/fragment.glsl')
    this.shaderfragment = this.source.default
    // console.log(this.shaderfragment)

    // this.shader = PIXI.Shader.from(undefined, this.source.default, { stime: 0.0 })
    this.program = new PIXI.Program(PIXI.Program.defaultVertexSrc, this.shaderfragment, 'irishader')
    this.shader = new PIXI.Shader(this.program, { stime: 0.0 })
    // console.log(this.shader.program.fragmentSrc)
  }

  onTick (delta) {
  }
}
