export class CardComponent {
  constructor (app, config = {}) {
    this.defaults = {
    }
    this.app = app
    this.time = 0
    this.tetha = 0.0
    this.zpos = 300
    this.config = Object.assign(this.defaults, config)
    this.camera = this.config.camera.getCamera()
    this.card = new PIXI.projection.Container3d()
    this.cardflip = 1
    // textures
    const wtex = new PIXI.Texture(PIXI.Texture.WHITE)

    // Sprites
    this.recto = new PIXI.projection.Sprite3d(wtex)
    this.recto.tint = 0xff0000
    this.recto.anchor = new PIXI.Point(0.5, 0.5)
    this.recto.width = 600
    this.recto.height = 400
    this.recto.euler.y = 0
    this.recto.position3d.z = this.zpos

    this.verso = new PIXI.projection.Sprite3d(wtex)
    this.verso.tint = 0x0000ff
    this.verso.anchor = new PIXI.Point(0.5, 0.5)
    this.verso.width = 600
    this.verso.height = 400
    this.verso.euler.y = 0
    this.verso.position3d.z = this.zpos

    this.card.addChild(this.recto)
    this.card.addChild(this.verso)
    this.card.interactive = true
    // this.card.on('pointerdown', this.onDragStart)
    this.camera.addChild(this.card)
    this.setup()
  }

  setup () {
    this.app.ticker.add(delta => this.onTick(delta))
    this.card.on('pointerdown', this.onDragStart)
    this.card.on('pointerup', this.onDragEnd)
    // this.card.on('pointerupoutside', this.onDragEnd)
    // this.card.on('pointermove', this.onDragMove)
  }

  showfaces () {
    if (this.recto.euler.y < Math.PI / 2) {
      this.recto.renderable = true
      this.verso.renderable = false
    } else {
      this.verso.renderable = true
      this.recto.renderable = false
    }
  }

  flip (sprite, angle) {
    sprite.euler.y = angle
    sprite.position3d.z = -Math.sin(sprite.euler.y) * this.recto.width / 6
  }

  rotate (sprite, angle) {
    sprite.position3d.x = sprite.position.x + (Math.cos(angle) * 200)
    sprite.position3d.z = this.zpos + (Math.sin(angle) * 200)
  }

  animate (angle) {
    // const angle = Math.abs(Math.cos(this.time)) * Math.PI
    const angle2 = this.time

    this.flip(this.verso, angle)
    this.flip(this.recto, angle)
    // this.rotate(this.verso, angle2) repeat for both sprite recto + verso
    this.showfaces()
  }

  onDragStart () {
    // console.log(this.card)
    this.data = event.data
    this.alpha = 0.5
    this.dragging = true
  }

  onDragEnd () {
    this.alpha = 1
    this.dragging = false
    // set the interaction data to null
    this.data = null
    console.log('end')
  }

  onTick (delta) {
    if (this.card.dragging) { this.time += 0.01 }

    this.tetha = Math.abs(Math.sin(this.time)) * Math.PI
    // console.log(this.tetha)
    // console.log(this.cardflip)

    this.animate(this.tetha)
  }
}
