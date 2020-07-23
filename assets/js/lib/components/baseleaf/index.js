
import leaf_shape from '!raw-loader!data/svg/drop4.svg'
import leaf_shape_palm from '!raw-loader!data/svg/drop5.svg'
import { Tools } from 'objects/tools/geometry'

export class BaseLeafComponent {
  constructor (app, config = {}) {
    this.defaults = {
      parent: app.stage,
      x: 0,
      y: 0,
      z: 0,
      type: 'basic'
    }
    this.config = Object.assign(this.defaults, config)
    this.active = false
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))

    this.time = 0
    this.palette = this.config.parent.palette
    this.parent = this.config.parent.scene

    this.shape = new SVG(leaf_shape)
    switch (this.config.type) {
      case 'palm':
        this.shape = new SVG(leaf_shape_palm)
        break

      default:
        this.shape = new SVG(leaf_shape)
        break
    }
    this.shape.interactive = true
    this.shape.on('mouseover', this.over)
    this.shape.on('pointerout', this.out)

    this.projection = new PIXI.projection.Container3d()
    this.projection.addChild(this.shape)
    this.projection.pivot.x = this.projection.width / 2

    // this.parent.addChild(this.projection)
  }

  over () {
    this.active = true
    console.log('active')
  }

  out () {
    this.active = false
  }

  refreshColors () {
    this.shape.tint = '0xffffff'
    this.shape.tint = this.palette.getConstantSmoothDepthColor(this.projection.position3d.z)
  }

  onTick (delta) {
    this.time += 0.01

    this.active = this.shape.active
    // this.refreshColors()

    if (this.active) {
      this.shape.tint = '0xffffff'
      this.shape.tint = this.palette.secondary
    }
  }
}
