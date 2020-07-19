
import { Tools } from 'objects/tools/geometry'
export class DisplacementFilter {
  constructor (app, config = {}) {
    this.defaults = {
      parent: app.stage
    }
    this.config = Object.assign(this.defaults, config)
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))
    this.time = 0
    this.amp = 0
    // this.mouse = this.config.mouse

    this.displacementSprite = new PIXI.Sprite.from('/dist/images/cloud.jpg')
    this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
    this.displacementSprite.scale.x = 0.3
    this.displacementSprite.scale.y = 0.3
    this.config.parent.addChild(this.displacementSprite)

    this.filter = new PIXI.filters.DisplacementFilter(this.displacementSprite)
  }

  onTick (delta) {
    this.displacementSprite.position.x += 1
  }
}
