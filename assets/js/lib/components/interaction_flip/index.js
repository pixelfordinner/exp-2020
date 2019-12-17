
import { Tools } from 'objects/tools/geometry'
export class FlipInteraction {
  constructor (app, config = {}) {
    this.defaults = {
    }
    this.horizontal = true
    this.both = false
    this.config = Object.assign(this.defaults, config)
    this.object = this.config.object
    this.mouse = this.config.mouse
    this.app = app
    this.time = 0
    this.amp = 0
    this.mouse = this.config.mouse
    this.initContainer()
    this.app.ticker.add(delta => this.onTick(delta))
  }

  initContainer () {
    this.container = this.config.object.container
    console.log('hello', this.iObject)
    this.container.tetha = 0
    this.container.startRotation = false
    this.container.endRotation = false
    this.container.isflipped = false
    this.container.goToRigth = 0
    this.container.numclicks = 0
    this.container.dragOrigin = new PIXI.projection.Point3d()
    this.container.currentPosition = new PIXI.projection.Point3d()
    this.container.totalSpeed = 0
    this.container.beginDrag = false
    this.container.on('pointerdown', this.onDragStart)
      .on('pointerup', this.onDragEnd)
      .on('pointermove', this.onDragMove)
      .on('pointerupoutside', this.onDragEnd)
  }

  onDragStart (event) {
    this.data = event.data
    this.alpha = 0.5
    this.dragging = true
    this.beginDrag = true
    this.numclicks++
    this.dragOrigin = new PIXI.projection.Point3d(
      this.data.getLocalPosition(this.parent).x,
      this.data.getLocalPosition(this.parent).y,
      this.data.getLocalPosition(this.parent).z
    )
    this.currentPosition = this.dragOrigin
    console.log(this.numclicks)
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
      // this.distanceFromPrev = Tools.getXlength(newPosition, this.currentPosition)
      if (this.both) {
        this.distanceFromPrev = Tools.getPolarlength(newPosition, this.currentPosition)
      }
      if (this.horizontal) {
        this.distanceFromPrev = Tools.getYlength(newPosition, this.currentPosition)
      } else {
        this.distanceFromPrev = Tools.getXlength(newPosition, this.currentPosition)
      }

      this.totalSpeed = Tools.map(this.distanceFromPrev, 5, 100, 0, 0.02)

      // this.totalSpeed = 0.02
    }
  }

  flip (object, speed) {
    object.euler.y += this.container.goToRigth ? speed : -speed
    object.position3d.z = 100 * (Math.cos(object.euler.y * 2))
  }

  makeFlip () {
    this.speed = 0.0

    if (Math.cos(this.container.euler.y) > 0) {
      this.container.isflipped = true
    } else {
      this.container.isflipped = false
    }
    if (this.container.dragging) {
      this.speed = this.container.totalSpeed
    }
    if (this.container.startRotation) {
      this.speed = this.container.totalSpeed
      if (Math.abs(Math.cos(this.container.euler.y)) >= 0.99) {
        this.container.startRotation = false
      }
    }
    if (!this.container.beginDrag) {
      this.flip(this.container, this.speed)
    }
  }

  onTick (delta) {
    this.makeFlip()
  }
}
