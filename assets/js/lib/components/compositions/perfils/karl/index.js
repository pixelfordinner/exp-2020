import { Point } from 'pixi.js'

export class KarlPerfil {
  constructor (app, config = {}) {
    this.defaults = {

    }
    this.config = Object.assign(this.defaults, config)

    this.parent = this.config.parent
    this.palette = this.parent.palette

    this.time = 0
    app.ticker.add(delta => this.onTick(delta))

    this.pic = new PIXI.Sprite.from('/dist/images/cloud.jpg')
    this.pic.anchor.set(0.5)

    this.parent.scene.addChild(this.pic)
  }

  onTick (delta) {
    this.time++
  }
}
