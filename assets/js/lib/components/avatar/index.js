import { Tools } from 'objects/tools/geometry'

export class AvatarComponent {
  constructor (app, config = {}) {
    this.defaults = {
      scale: 300,
      roundedCorners: true,
      fill: false
    }

    this.time = 0
    this.tetha = 0
    this.angle = 0
    this.config = Object.assign(this.defaults, config)
    this.app = app
    this.mouse = this.config.mouse
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
    this.camera = this.config.camera.getCamera()
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
    this.initContainer()
  }

  initContainer () {
    this.container = new PIXI.projection.Container3d()
    this.container.interactive = true
    this.container.on('pointerdown', this.onDragStart)
      .on('pointerup', this.onDragEnd)
      .on('pointermove', this.onDragMove)
      .on('pointerupoutside', this.onDragEnd)
    this.container.addChild(this.buffers.fill)
    this.container.addChild(this.buffers.outline_mask)
    this.container.addChild(this.buffers.outline)
    this.camera.addChild(this.container)
    this.container.tetha = 0
    this.container.startRotation = false
    this.container.endRotation = false
    this.container.isflipped = false
    this.container.goToRigth = 0
    this.container.tempAngle = 0
    this.container.dragOrigin = new PIXI.projection.Point3d()
    this.container.currentPosition = new PIXI.projection.Point3d()
    this.container.totalSpeed = 0
    this.container.beginDrag = false
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
    this.container.position3d.z += Math.cos(this.time / 6) * 1
  }

  morph (amp) {
    this.vertices.forEach((vertex, index) => {
      vertex.point.y += Math.cos(this.time + index * 0.8) * amp
    })
  }

  flip (object, speed) {
    object.euler.y += this.container.goToRigth ? speed : -speed
    object.position3d.z = 100 * (Math.cos(object.euler.y * 2))
  }

  onDragStart (event) {
    this.data = event.data
    this.alpha = 0.5
    this.dragging = true
    this.beginDrag = true
    this.tempAngle++
    this.dragOrigin = new PIXI.projection.Point3d(
      this.data.getLocalPosition(this.parent).x,
      this.data.getLocalPosition(this.parent).y,
      this.data.getLocalPosition(this.parent).z
    )
    this.currentPosition = this.dragOrigin
    console.log(this.tempAngle)
  }

  onDragEnd () {
    this.alpha = 1
    this.dragging = false
    this.beginDrag = false
    this.newDistance = Tools.getPolarlength(this.currentPosition, this.dragOrigin)
    if (this.newDistance > 100) {
      this.startRotation = true
    } else {
      this.dragging = false

      this.startRotation = false
      this.newDistance = 0
    }
  }

  onDragMove () {
    this.beginDrag = false

    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent)
      if (newPosition.x < this.dragOrigin.x) {
        this.goToRigth = false
      } else {
        this.goToRigth = true
      }
      this.currentPosition = newPosition
      this.distanceFromPrev = Tools.getPolarlength(newPosition, this.currentPosition)

      this.totalSpeed = Tools.map(this.distanceFromPrev, 5, 100, 0, 0.02)
      // this.totalSpeed = 0.02
    }
  }

  onTick (delta) {
    this.time += 0.05
    this.morph(0.2)
    this.speed = 0.0

    if (Math.cos(this.container.euler.y) > 0) {
      this.container.isflipped = true
    } else {
      this.container.isflipped = false
    }
    if (this.container.dragging) {
      this.speed = this.container.totalSpeed
      // this.container.totalSpeed += this.container.goToRigth ? 0.03 : -0.03
    }
    if (this.container.startRotation) {
      this.speed = this.container.totalSpeed
      if (Math.abs(Math.cos(this.container.euler.y)) >= 0.99) {
        this.container.startRotation = false
      }
    }
    // this.flip(this.container, this.speed)
    if (!this.container.beginDrag) {
      this.flip(this.container, this.speed)
    }
    this.makeShape()
  }
}
