import { BlobComponent } from 'components/blob'

export class CaveComponent {
  constructor (app, config = {}) {
    this.defaults = {
      parent: app.stage,
      layers: 6
    }

    this.config = Object.assign(this.defaults, config)

    this.parent = this.config.parent
    this.palette = this.config.parent.palette
    this.layers = []
    this.shapes = []
    this.numbers = 12

    this.blob = new BlobComponent(app, { parent: this.parent, interactive: false, debug: false, addtoparent: false })

    // this.curve = this.blob.makeBlob()
    // this.rect = new PIXI.Graphics()
    // this.rect.beginFill(this.palette.secondary)
    // this.rect.drawPolygon(-250, -250, 250, -250, 250, 250, -250, 250)
    // // this.rect.moveTo(this.curve[this.blob.numbers - 1].p.x, this.curve[this.blob.numbers - 1].p.y)
    // this.rect.beginHole()
    // this.rect.moveTo(this.curve[this.blob.numbers - 1].p.x, this.curve[this.blob.numbers - 1].p.y)
    // this.curve.forEach((c, index) => {
    //   this.rect.bezierCurveTo(c.cp2.x, c.cp2.y, c.cp.x, c.cp.y, c.p.x, c.p.y)
    // })
    // this.rect.endHole()
    // this.parent.scene.addChild(this.rect)
    this.makelayer(this.blob)
    // this.basicdraw()
  }

  basicdraw () {
    this.curve = this.blob.makeBlob()
    this.rect = new PIXI.Graphics()
    this.rect.beginFill(this.palette.secondary)
    this.rect.drawPolygon(-250, -250, 250, -250, 250, 250, -250, 250)
    // this.rect.moveTo(this.curve[this.blob.numbers - 1].p.x, this.curve[this.blob.numbers - 1].p.y)
    this.rect.beginHole()
    this.rect.moveTo(this.curve[this.blob.numbers - 1].p.x, this.curve[this.blob.numbers - 1].p.y)
    this.curve.forEach((c, index) => {
      this.rect.bezierCurveTo(c.cp2.x, c.cp2.y, c.cp.x, c.cp.y, c.p.x, c.p.y)
    })
    this.rect.endHole()
    this.parent.scene.addChild(this.rect)
  }

  makelayer (blob) {
    for (let i = 0; i < this.numbers; i++) {
      const layer = new PIXI.projection.Container3d()
      const shape = new PIXI.Graphics()
      const curve = blob.makeBlob()
      const zpos = i * 50
      const color = this.palette.getConstantSmoothDepthColor(zpos)
      // const color = this.palette.secondary
      shape.beginFill(color)
      shape.drawPolygon(-250, -250, 250, -250, 250, 250, -250, 250)

      shape.beginHole()
      shape.moveTo(curve[blob.numbers - 1].p.x, curve[blob.numbers - 1].p.y)
      curve.forEach((c, index) => {
        shape.bezierCurveTo(c.cp2.x, c.cp2.y, c.cp.x, c.cp.y, c.p.x, c.p.y)
      })
      shape.endHole()
      shape.endFill()

      this.shapes.push(shape)

      layer.addChild(shape)
      layer.position3d.z = -zpos
      layer.zindex = -zpos

      this.layers.push(layer)
      this.parent.scene.addChild(layer)
    }
  }

  onTick (delta) {
    this.time++
  }
}
