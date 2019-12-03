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
    this.time = 0.1
    this.centerx = windowWidth / 2
    this.centery = windowHeight / 2
    this.centerz = 0
    this.buffers = {
      fill: new PIXI.Graphics(),
      outline: new PIXI.Graphics(),
      outline_mask: new PIXI.Graphics()
    }

    this.sprites = {
      star: new PIXI.Texture.from('/dist/images/star.png')
    }

    this.setup()
  }

  setup () {
    // Stage all buffers
    Reflect.ownKeys(this.buffers).forEach(buffer => this.app.stage.addChild(this.buffers[buffer]))

    // Register vertices
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
  }

  drawStroke () {
    const p0 = this.vertices[0].point
    this.buffers.outline_mask.clear()
    GeometryTools.move2(this.buffers.outline_mask, p0)
    this.buffers.outline_mask.lineStyle(this.vertices[0].strokeWeight + 1, 0xffffff, 1, 1)
    this.vertices.forEach((vertex, index) => {
      if (index < this.vertices.length - 1) {
        GeometryTools.line2(
          this.buffers.outline_mask,
          this.vertices[index + 1].point
        )
      }
      if (index === this.vertices.length - 1) {
        GeometryTools.line2(this.buffers.outline_mask, p0)
        this.buffers.outline_mask.closePath()
      }
    })
  }

  drawRStroke () {
    const p0 = this.vertices[0].point
    this.buffers.outline.clear()
    GeometryTools.move2(this.buffers.outline, p0)

    this.vertices.forEach((vertex, index) => {
      const p = this.vertices[index].point
      this.buffers.outline.lineStyle(this.vertices[index].strokeWeight, 0xffffff, 1, 0)
      this.buffers.outline.drawCircle(p.x, p.y, this.vertices[index].strokeWeight)
      this.buffers.outline.lineStyle(this.vertices[index].strokeWeight, 0xffffff, 1, 1)

      if (index < this.vertices.length - 1) {
        GeometryTools.move2(
          this.buffers.outline,
          p
        )
        GeometryTools.line2(
          this.buffers.outline,
          this.vertices[index + 1].point
        )
      }
      if (index === this.vertices.length - 1) {
        GeometryTools.line2(this.buffers.outline, p0)
      }
    })
  }

  transform () {
    this.buffers.outline.position.x = this.centerx
    this.buffers.outline.position.y = this.centery
    this.buffers.fill.position.x = this.centerx
    this.buffers.fill.position.y = this.centery
    this.buffers.outline_mask.position.x = this.centerx
    this.buffers.outline_mask.position.y = this.centery
  }

  shape () {
    this.buffers.outline_mask._mask = this.buffers.outline
    this.drawRStroke()
    this.drawStroke()
  }

  col () {
    this.buffers.outline_mask.tint = 0xff00ff
    // this.buffers.outline.tint = 0xff0000
  }

  onTick (delta) {
    this.time += 0.1
    this.distord(0.4)
    this.transform()
    this.col()
    this.shape()
  }
}
