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
    // console.log('hello', this.iObject)
    this.container.tetha = 0
    this.container.startRotation = false
    this.container.endRotation = false
    this.container.euler.y = 0
    this.container.isflipped = false
    this.container.goToRigth = 0
    this.container.numclicks = 0
    this.container.dragOrigin = new PIXI.projection.Point3d()
    this.container.currentPosition = new PIXI.projection.Point3d()
    this.container.totalSpeed = 0
    this.container.totAngle = 0
    this.container.mooving = false
    this.container.beginDrag = false
    this.container.on('pointerdown', this.onDragStart)
      .on('pointerup', this.onDragEnd)
      .on('pointermove', this.onDragMove)
      .on('pointerupoutside', this.onDragEnd)
  }

  onDragStart (event) {
    this.data = event.data
    this.alpha = 0.5
    this.totAngle = 0
    this.dragging = true
    this.beginDrag = true
    this.endRotation = false
    this.numclicks++
    this.dragOrigin = new PIXI.projection.Point3d(
      this.data.getLocalPosition(this.parent).x,
      this.data.getLocalPosition(this.parent).y,
      this.data.getLocalPosition(this.parent).z
    )
    this.currentPosition = this.dragOrigin
  }

  onDragEnd () {
    this.alpha = 1
    this.dragging = false
    this.beginDrag = false
    this.endRotation = false
    this.newDistance = Tools.getPolarlength(this.currentPosition, this.dragOrigin)
    if (this.newDistance > 100) {
      this.startRotation = true
    } else {
      this.dragging = false
    }
  }

  onDragMove () {
    this.beginDrag = false

    if (this.dragging) {
      this.mooving = true
      const newPosition = this.data.getLocalPosition(this.parent)
      if (newPosition.x < this.dragOrigin.x) {
        this.goToRigth = false
      } else {
        this.goToRigth = true
      }
      this.currentPosition = newPosition

      if (this.both) {
        this.distanceFromPrev = Tools.getPolarlength(newPosition, this.currentPosition)
      }
      if (this.horizontal) {
        this.distanceFromPrev = Tools.getYlength(newPosition, this.currentPosition)
      } else {
        this.distanceFromPrev = Tools.getXlength(newPosition, this.currentPosition)
      }
      this.totalSpeed = Tools.map(this.distanceFromPrev, 5, 100, 0, 0.03)
    }
  }

  flip (object, speed) {
    object.euler.y += this.container.goToRigth ? speed : -speed
    object.position3d.z = 100 * (Math.cos(object.euler.y * 2))
  }

  makeFlip () {
    // reset animation speed
    this.speed = 0.0
    // check container angle to see if we switch texture rendering
    this.container.isflipped = Math.cos(this.container.euler.y) > 0
    // check if we are dragging or if we already completed the drag moove
    if (this.container.dragging && this.container.mooving || this.container.startRotation) {
      this.speed = this.container.totalSpeed
      this.container.totAngle += this.container.totalSpeed
    }
    // check container angle to see if we completed the rotation
    if (this.container.totAngle > Math.PI || Math.abs(Math.cos(this.container.euler.y)) > 0.99) {
      this.container.startRotation = false
      if (this.container.totAngle > Math.PI) this.speed = 0
    } else if (this.container.totAngle > 0 && !this.dragging) {
      console.log(this.container.totAngle)
      // this.speed = -this.speed
      // this.container.totAngle -= this.speed
      // this.speed = -this.speed
    }

    if (!this.container.beginDrag) {
      this.flip(this.container, this.speed)
    }
  }

  onTick (delta) {
    this.makeFlip()
  }
}
