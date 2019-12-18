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
    this.logdebuger = false
  }

  initContainer () {
    this.container = this.config.object.container
    this.container.dragOrigin = new PIXI.projection.Point3d()
    this.container.currentPosition = new PIXI.projection.Point3d()

    this.container.beginDrag = false
    this.container.mooving = false
    this.container.goToRigth = false
    this.container.auto_Rotation = false
    this.container.endRotation = false
    this.container.isflipped = false
    this.container.changeState = false

    this.container.tetha = 0
    this.container.euler.y = 0
    this.container.totalSpeed = 0
    this.container.totAngle = 0
    this.container.resistance = 100

    this.container.on('pointerdown', this.onDragStart)
      .on('pointerup', this.onDragEnd)
      .on('pointermove', this.onDragMove)
      .on('pointerupoutside', this.onDragEnd)
      .on('pointerout', this.onDragOut)
  }

  onDragStart (event) {
    this.data = event.data
    this.totAngle = 0
    this.dragging = true
    this.beginDrag = true
    this.endRotation = true

    this.dragOrigin = new PIXI.projection.Point3d(
      this.data.getLocalPosition(this.parent).x,
      this.data.getLocalPosition(this.parent).y,
      this.data.getLocalPosition(this.parent).z
    )
    this.currentPosition = this.dragOrigin
  }

  onDragEnd () {
    this.dragging = false
    this.beginDrag = false
    this.endRotation = false
    this.mooving = false
    this.newDistance = Tools.getXlength(this.currentPosition, this.dragOrigin)
    if (this.newDistance > this.resistance) {
      this.auto_Rotation = true
    } else {
      this.dragging = false
    }

    this.newDistance = Tools.getXlength(this.currentPosition, this.dragOrigin)

    if (this.newDistance > this.resistance) {
      this.auto_Rotation = true
    } else {
      this.dragging = false

      this.auto_Rotation = false
    }
  }

  onDragOut () {
    this.beginDrag = true
    this.mooving = false
  }

  onDragMove () {
    this.beginDrag = false
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent)
      this.goToRigth = !(newPosition.x < this.dragOrigin.x)
      this.currentPosition = newPosition
      this.distanceFromPrev = Tools.getXlength(newPosition, this.currentPosition)
      this.totalSpeed = 0.03
      this.mooving = true
    }
  }

  makeFlipAnimation (object, speed) {
    object.euler.y += this.container.goToRigth ? speed : -speed
    object.position3d.z = 100 * (Math.cos(object.euler.y * 2))
  }

  makeFlipInteraction () {
    this.speed = 0.0
    // check container angle to see if we switch texture rendering
    // this.container.isflipped = Math.cos(this.container.euler.y) > 0

    this.container.changeState
    if (Math.cos(this.container.euler.y) > 0) {
      this.container.isflipped = true
      this.container.changeState = true
    }

    console.log(this.container.changeState)

    // check if we are dragging or if we already completed the drag moove
    if (this.container.mooving || this.container.auto_Rotation) {
      this.speed = this.container.totalSpeed
      // this.container.totAngle += this.container.totalSpeed
      this.container.totAngle += this.container.goToRigth ? this.container.totalSpeed : -this.container.totalSpeed
    }
    // check container angle to see if we completed the rotation
    if (Math.abs(Math.cos(this.container.euler.y)) >= 0.99) {
      this.container.endRotation = true
      this.container.changeState = false
      if (this.container.totAngle >= Math.PI || this.container.totAngle <= -Math.PI) this.speed = 0
    }

    // check container angle to see if we didn't completed the rotation nether actived the auto_rotation behavior
    // then rewind the rotation
    if (Math.abs(Math.cos(this.container.euler.y)) <= 0.99) {
      if (!this.container.auto_Rotation && !this.container.endRotation) {
        this.speed = -0.02
        // this.container.totAngle -= 0.2
      }
    }

    // make flip animation
    if (!this.container.beginDrag) {
      this.makeFlipAnimation(this.container, this.speed)
    }
  }

  onTick (delta) {
    this.makeFlipInteraction()
    // console.log(this.container.endRotation)
  }
}
