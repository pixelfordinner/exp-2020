
import { Tools } from 'objects/tools/geometry'
export class displacementFilter {
  constructor (app, config = {}) {
    this.defaults = {
    }
    this.config = Object.assign(this.defaults, config)
    this.app = app
    this.time = 0
    this.amp = 0
    this.mouse = this.config.mouse

    this.displacementSprite = new PIXI.Sprite.from('/dist/images/cloud.jpg')
    this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
    this.displacementSprite.scale.x = 0.3
    this.displacementSprite.scale.y = 0.3
    this.app.stage.addChild(this.displacementSprite)

    this.filter = new PIXI.filters.DisplacementFilter(this.displacementSprite)
  }
}
