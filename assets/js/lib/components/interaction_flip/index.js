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
    this.container.lastState = false
    this.container.isOut = false

    this.container.force = 100
    this.container.euler.y = 0
    this.container.totalSpeed = 0
    this.container.totAngle = 0
    this.container.blur = 0
    this.container.resistance = 160
    this.container.velocity = 0.03

    this.container.on('pointerdown', this.onDragStart)
      .on('pointerup', this.onDragEnd)
      .on('pointermove', this.onDragMove)
      .on('pointerupoutside', this.onDragEnd)
      .on('pointerout', this.onDragOut)
  }

  onDragStart (event) {
    this.data = event.data
    this.dragging = true
    this.beginDrag = true
    this.endRotation = true
    this.isOut = false
    this.mooving = true
    this.force = 100
    console.log('reset force')

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
  }

  onDragMove () {
    this.beginDrag = false
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent)
      this.goToRigth = !(newPosition.x < this.dragOrigin.x)
      this.currentPosition = newPosition
      this.distanceFromPrev = Tools.getXlength(newPosition, this.currentPosition)
      this.mooving = true
    }
    this.newDistance = Tools.getXlength(this.currentPosition, this.dragOrigin)
    if (this.newDistance > this.resistance) {
      this.auto_Rotation = true
      this.dragging = false
    } else {
      this.auto_Rotation = false
    }
  }

  onDragOut () {
    this.isOut = true
  }

  applyAngle (object, angle) {
    object.euler.y = this.container.goToRigth ? angle : -angle
    object.position3d.z = 40 * (Math.cos(object.euler.y * 2))
  }

  makeFlipInteraction () {
    this.speed = 0.0
    // easing: slowly reduce interaction force
    if (this.container.force > 0 && this.container.isOut) this.container.force -= 1.5
    this.container.velocity = Tools.map(this.container.force, 0, 100, 0.01, 0.06)
    // check witch face we show
    this.container.isflipped = Math.cos(this.container.totAngle) > 0

    // add velocity if we drag or with the auto rotate mode activated
    if (this.container.mooving || this.container.auto_Rotation) {
      this.speed = this.container.velocity
    }
    // rewind if we didn't actived the auto rotate
    if (!this.container.mooving && !this.container.auto_Rotation && !this.container.endRotation) {
      this.speed = -this.container.velocity / 1.5
    }
    // check if we complete a rotation ( tricky part! getting a small portion of the cos(angle) to check bounds)
    // do not work on the first drag input
    // reset parameters
    if (Math.cos(this.container.totAngle * 2) > 0.99 && Math.cos(this.container.totAngle * 2) < 1.01) {
      if (!this.container.dragging) {
        this.speed = 0
      }
    }
    // cumulate angle
    this.container.totAngle += this.container.goToRigth ? this.speed : -this.speed

    // make flip animation
    if (!this.container.beginDrag) {
      this.applyAngle(this.container, this.container.totAngle)
    }
  }

  onTick (delta) {
    // console.log(this.container.endRotation)
    this.makeFlipInteraction()
  }
}
