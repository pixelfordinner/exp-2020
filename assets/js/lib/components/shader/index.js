export class ShaderComponent {
  constructor (app, config = {}) {
    this.defaults = {
      path: '../../data/shaders/iridescent/fragment.glsl',
      loader: '!raw-loader!',
      chemin: require('!raw-loader!../../data/shaders/iridescent/fragment.glsl')

    }

    this.time = 0
    app.ticker.add(delta => this.onTick(delta))
    this.config = Object.assign(this.defaults, config)

    const path = this.config.loader.concat(this.config.path)

    // require(shader)

    // this.source = require('!raw-loader!data/shaders/iridescent/fragment.glsl')
    // console.log(this.config.path)

    this.source = require('!raw-loader!../../data/shaders/iridescent/fragment.glsl')
    // this.source2 = require('!raw-loader!.*$ (path2)'

    // this.source = require(this.config.chemin)
    // this.source = require('!raw-loader!data' + this.config.path)
    // const path = '!raw-loader!data/shaders/iridescent/fragment.glsl'
    // this.source = require(path)
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
