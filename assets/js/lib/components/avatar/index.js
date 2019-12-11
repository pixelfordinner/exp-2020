import { Tools } from 'objects/tools/geometry'

// const windowWidth = window.innerWidth
// const windowHeight = window.innerHeight

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
    this.container.interactive = true
    this.container.on('pointerdown', this.onDragStart)
    this.container.on('pointerup', this.onDragEnd)

    this.time = 0.0
    this.tetha = 0.0
    this.angle = 0
    this.camera = this.config.camera.getCamera()
    this.centerx = this.app.width / 2
    this.centery = this.app.height / 2
    this.centerz = 0
    this.buffers = {
      fill: new PIXI.Graphics(),
      outline: new PIXI.Graphics(),
      outline_mask: new PIXI.Graphics()
    }
    this.setup()
    this.container.addChild(this.buffers.fill)
    this.container.addChild(this.buffers.outline_mask)
    this.container.addChild(this.buffers.outline)

    this.camera.addChild(this.container)
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
    Tools.move2(this.buffers.fill, p0)
    this.buffers.fill.beginFill(0xff0000, 1.0)

    this.vertices.forEach((vertex, index) => {
      if (index < this.vertices.length - 1) {
        Tools.line2(
          this.buffers.fill,
          this.vertices[index + 1].point
        )
      }

      if (index === this.vertices.length - 1) {
        Tools.line2(this.buffers.fill, p0)
        this.buffers.fill.closePath()
        this.buffers.fill.endFill()
      }
    })
  }

  drawFillToBuffer (buffer) {
    const p0 = this.vertices[0].point
    buffer.clear()
    Tools.move2(buffer, p0)
    buffer.beginFill(0xffffff, 1.0)

    this.vertices.forEach((vertex, index) => {
      if (index < this.vertices.length - 1) {
        Tools.line2(
          buffer,
          this.vertices[index + 1].point
        )
      }

      if (index === this.vertices.length - 1) {
        Tools.line2(buffer, p0)
        buffer.closePath()
        buffer.endFill()
      }
    })
  }

  drawRStroke () {
    const p0 = this.vertices[0].point
    // this.buffers.outline.clear()
    Tools.move2(this.buffers.outline, p0)

    this.vertices.forEach((vertex, index) => {
      const p = vertex.point
      this.buffers.outline.lineStyle(vertex.strokeWeight, 0xffffff, 1, 0)
      this.buffers.outline.drawCircle(p.x, p.y, vertex.strokeWeight)
      this.buffers.outline.lineStyle(vertex.strokeWeight, 0xffffff, 1, 1)

      if (index < this.vertices.length - 1) {
        Tools.move2(
          this.buffers.outline,
          p
        )
        Tools.line2(
          this.buffers.outline,
          this.vertices[index + 1].point
        )
      }
      if (index === this.vertices.length - 1) {
        Tools.line2(this.buffers.outline, p0)
      }
    })
  }

  drawStroke () {
    const p0 = this.vertices[0].point
    this.buffers.outline_mask.clear()
    Tools.move2(this.buffers.outline_mask, p0)
    this.buffers.outline_mask.lineStyle(this.vertices[0].strokeWeight + 1, 0xffffff, 1, 1)
    this.vertices.forEach((vertex, index) => {
      if (index < this.vertices.length - 1) {
        Tools.line2(
          this.buffers.outline_mask,
          this.vertices[index + 1].point
        )
      }
      if (index === this.vertices.length - 1) {
        Tools.line2(this.buffers.outline_mask, p0)
        this.buffers.outline_mask.closePath()
      }
    })
  }

  makeOutline () {
    this.buffers.outline_mask._mask = this.buffers.outline
    this.drawFillToBuffer(this.buffers.outline)
    this.drawRStroke()
    this.drawStroke()
  }

  makeShape () {
    this.drawFillToBuffer(this.buffers.outline)
    this.drawRStroke()
  }

  colorize () {
    this.buffers.outline_mask.tint = 0xff00ff
  }

  getmask () {
    return this.buffers.outline
  }

  animate () {
    this.container.position3d.z = 200 + Math.cos(this.time / 6) * 500
  }

  distord (amp) {
    this.vertices.forEach((vertex, index) => {
      vertex.point.y += Math.cos(this.time + index * 0.8) * amp
    })
  }

  flip (sprite, angle) {
    sprite.euler.y = angle
    sprite.position3d.z -= Math.cos(angle * 2) * 50
  }

  onDragStart () {
    console.log('hello')

    this.data = event.data
    this.alpha = 0.5
    this.dragging = true
  }

  onDragEnd () {
    this.alpha = 1
    this.dragging = false
    this.data = null
    console.log('end')
  }

  onTick (delta) {
    this.time += 0.05
    this.animate()

    if (this.container.dragging) {
      this.tetha += 0.01
    }

    const angle = (0.5 + Math.cos(this.tetha) * 0.5) * Math.PI
    this.flip(this.container, angle)
    this.makeShape()
  }
}
