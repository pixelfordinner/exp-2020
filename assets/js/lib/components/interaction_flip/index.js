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
    this.container.tetha = 0
    this.container.auto_Rotation = false
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
      .on('pointerout', this.onDragOut)
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
    this.mooving = false
    this.newDistance = Tools.getXlength(this.currentPosition, this.dragOrigin)
    console.log(this.newDistance)

    if (this.newDistance > 130) {
      this.auto_Rotation = true
    } else {
      this.dragging = false
    }

    this.newDistance = Tools.getXlength(this.currentPosition, this.dragOrigin)
    console.log(this.newDistance)

    if (this.newDistance > 130) {
      this.auto_Rotation = true
    } else {
      this.dragging = false
    }
  }

  onDragOut () {
    this.beginDrag = true
    this.endRotation = false
    this.mooving = false
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
      // this.totalSpeed = Tools.map(this.distanceFromPrev, 5, 100, 0, 0.03)
      this.totalSpeed = 0.03
    }
  }

  makeFlipAnimation (object, speed) {
    object.euler.y += this.container.goToRigth ? speed : -speed
    object.position3d.z = 100 * (Math.cos(object.euler.y * 2))
  }

  makeFlipInteraction () {
    // reset animation speed
    this.speed = 0.0
    // check container angle to see if we switch texture rendering
    this.container.isflipped = Math.cos(this.container.euler.y) > 0
    if (Math.cos(this.container.euler.y) > 0) {
      this.container.auto_Rotation = true
    }
    // check if we are dragging or if we already completed the drag moove
    if (this.container.dragging && this.container.mooving || this.container.auto_Rotation) {
      this.speed = this.container.totalSpeed
      this.container.totAngle += this.container.totalSpeed
    }
    // check container angle to see if we completed the rotation
    if (this.container.totAngle > Math.PI || Math.abs(Math.cos(this.container.euler.y)) > 0.99) {
      this.container.auto_Rotation = false
      this.container.endRotation = true
      if (this.container.totAngle > Math.PI) this.speed = 0
    }
    // check container angle to see if we didn't completed the rotation nether actived the auto_rotation behavior
    // reset the rotation to start
    if (Math.abs(Math.cos(this.container.euler.y)) <= 0.99) {
      console.log(Math.abs(Math.cos(this.container.euler.y)))
      if (!this.container.mooving && !this.container.auto_Rotation && !this.container.endRotation) {
        this.speed = -0.02
        this.container.totAngle -= 0.2
        console.log('<<<<')
      }
    }
    // make flip animation
    if (!this.container.beginDrag) {
      this.makeFlipAnimation(this.container, this.speed)
    }
  }

  onTick (delta) {
    this.makeFlipInteraction()
  }
}
