import { basicShader } from 'components/shader/basic'
export class RippleFilter {
  constructor (app, config = {}) {
    this.defaults = {
      parent: app.stage
    }
    this.config = Object.assign(this.defaults, config)
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))
    this.time = 0

    this.shaderfragment = require('!raw-loader!data/shaders/ripple/frag.glsl').default
    // console.log(this.shaderfragment)
    this.shader = new basicShader(this.app)
    // this.shaderfragment = this.shader.shaderfragment
    this.shaderfvertex = this.shader.shadervertex
    this.filter = new PIXI.Filter(PIXI.Filter.defaultVertexSrc, this.shaderfragment, { u_time: 0.0 })
    // this.filter = new PIXI.Filter(this.shadervertex, this.shaderfragment, { u_time: 0.0 })
    // console.log(this.filter)

    // this.amp = 0
    // this.mouse = this.config.mouse

    // this.displacementSprite = new PIXI.Sprite.from('/dist/images/cloud.jpg')
    // this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
    // this.displacementSprite.scale.x = 0.3
    // this.displacementSprite.scale.y = 0.3
    // this.config.parent.addChild(this.displacementSprite)

    // this.filter = new PIXI.filters.DisplacementFilter(this.displacementSprite)
  }

  onTick (delta) {
    this.filter.uniforms.u_time += 0.06
  //  this.displacementSprite.position.x += 1
  }
}
