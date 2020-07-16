export class OceanComponent {
  constructor (app, config = {}) {
    this.defaults = {

    }

    this.time = 0
    app.ticker.add(delta => this.onTick(delta))
    this.config = Object.assign(this.defaults, config)
    this.camera = this.config.camera.getCamera()
    console.log(this.camera)

    this.shape = new PIXI.Graphics()
    this.shape.beginFill(this.config.palette.quaternary)
    this.shape.drawRect(0, 0, this.config.bounds.maxWidth * 4, this.config.bounds.maxHeight * 2)
    this.shape.pivot.x = this.config.bounds.maxWidth * 2
    this.shape.pivot.y = 0

    this.shape.endFill()
    this.view = new PIXI.projection.Container3d()
    this.view.addChild(this.shape)

    this.view.position3d.set(0, 0, this.config.z)
    this.view.zIndex = -this.config.z
    // this.camera.addChild(this.view)
    this.config.parent.scene.addChild(this.view)
    // this.camera.addChildAt(this.view)
    // app.stage.addChild(this.shape)
  }

  onTick (delta) {
  }
}
