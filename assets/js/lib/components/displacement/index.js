
import { Tools } from 'objects/tools/geometry'
export class displacementFilter {
  constructor (app, config = {}) {
    this.defaults = {
    }
    this.app = app
    this.time = 0

    this.setup()
    this.config = Object.assign(this.defaults, config)
    this.mouse = this.config.mouse
    this.mouse.pos = new PIXI.Point(0, 0)
    this.amp = 0

    this.displacementSprite = new PIXI.Sprite.from('/dist/images/cloud.jpg')
    this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
    this.displacementSprite.scale.x = 0.3
    this.displacementSprite.scale.y = 0.3
    this.app.stage.addChild(this.displacementSprite)
    this.filter = new PIXI.filters.DisplacementFilter(this.displacementSprite)
  }

  setup () {
    this.app.ticker.add(delta => this.onTick(delta))
  }

  animateFilter (finallgth) {
    // this.amp = finallgth
  }

  onTick (delta) {
    // this.displacementSprite.x += Math.cos(this.amp / 3)
    // this.displacementSprite.scale = new PIXI.Point(5 / this.amp, 5 / this.amp)
  }
}
