import { GeometryTools } from 'objects/tools/geometry'

const windowWidth = window.innerWidth
const windowHeight = window.innerHeight

export class AvatarComponent {
  constructor (app, config = {}) {
    this.defaults = {
      scale: 300,
      roundedCorners: true,
      fill: false
    }

    this.config = Object.assign(this.defaults, config)

    this.app = app
    this.texture = 0

    this.points = [
      new PIXI.Point(0.07, 0.3),
      new PIXI.Point(0.35, 0.5),
      new PIXI.Point(0.35, 0.19),
      new PIXI.Point(0.5, 0.01),
      new PIXI.Point(0.41, -0.23),
      new PIXI.Point(0.0, -0.5),
      new PIXI.Point(-0.41, -0.23),
      new PIXI.Point(-0.5, 0.01),
      new PIXI.Point(-0.35, 0.19),
      new PIXI.Point(-0.35, 0.5),
      new PIXI.Point(-0.07, 0.3)
    ]

    this.vertices = []
    this.sprite = new PIXI.projection.Sprite3d()
    this.container = new PIXI.projection.Container3d()
    this.time = 0.1
    this.camera = this.config.camera.getCamera()
    this.centerx = windowWidth / 2
    this.centery = windowHeight / 2
    this.centerz = 0
    this.buffers = {
      fill: new PIXI.Graphics(),
      outline: new PIXI.Graphics(),
      outline_mask: new PIXI.Graphics()
    }
    this.setup()
  }

  setup () {
    Reflect.ownKeys(this.buffers).forEach(buffer => this.app.stage.addChild(this.buffers[buffer]))

    this.points.forEach((point, index) => {
      const vertex = {
        point: new PIXI.Point(point.x * this.config.scale,
          point.y * -this.config.scale),
        strokeWeight: 23
      }

      this.vertices.push(vertex)
    })

    this.app.ticker.add(delta => this.onTick(delta))
  }

  distord (amp) {
    this.vertices.forEach((vertex, index) => {
      vertex.point.y += Math.cos(this.time + index * 0.8) * amp
    })
  }

  drawFill () {
    const p0 = this.vertices[0].point
    this.buffers.fill.clear()
    GeometryTools.move2(this.buffers.fill, p0)
    this.buffers.fill.beginFill(0xff0000, 1.0)

    this.vertices.forEach((vertex, index) => {
      if (index < this.vertices.length - 1) {
        GeometryTools.line2(
          this.buffers.fill,
          this.vertices[index + 1].point
        )
      }

      if (index === this.vertices.length - 1) {
        GeometryTools.line2(this.buffers.fill, p0)
        this.buffers.fill.closePath()
        this.buffers.fill.endFill()
      }
    })

    this.container.addChild(this.buffers.fill)
    // this.container.addChild(this.verso)

    this.camera.addChild(this.container)
  }

  col () {
    this.buffers.outline_mask.tint = 0xff00ff
  }

  getmask () {
    /// console.log(this.buffers.fill.geometry)
    return this.buffers.fill
  }

  onTick (delta) {
    this.time += 0.01
    // this.distord(2)
    // this.container.position3d.z = 200 + Math.cos(this.time) * 500

    this.container.euler.y = Math.cos(this.time / 3) * Math.PI
    // console.log(this.buffers.fill.transform)

    // this.buffers.fill.position3d.z = 600
    this.container.tint = 0xff0000
    this.drawFill()
  }
}
