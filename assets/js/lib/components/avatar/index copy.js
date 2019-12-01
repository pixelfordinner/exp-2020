import * as PIXI from 'pixi.js'
import { GeometryTools } from 'objects/tools/geometry'
import { RSA_PKCS1_OAEP_PADDING } from 'constants'

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
      [0.07, 0.3],
      [0.35, 0.5],
      [0.35, 0.19],
      [0.5, 0.01],
      [0.41, -0.23],
      [0.0, -0.5],
      [-0.41, -0.23],
      [-0.5, 0.01],
      [-0.35, 0.19],
      [-0.35, 0.5],
      [-0.07, 0.3]
    ]

    this.vertexes = []
    this.time = 0

    this.buffers = {
      outline: new PIXI.Graphics(),
      fill: new PIXI.Graphics()
    }

    this.sprites = {
      star: new PIXI.Texture.from('/dist/images/star.png')
    }

    this.setup()
  }

  setup () {
    // Stage all buffers
    Reflect.ownKeys(this.buffers).forEach(buffer => this.app.stage.addChild(this.buffers[buffer]))

    // Register vertexes
    this.points.forEach((point, index) => {
      const vertex = {
        sprite: new PIXI.Sprite(this.sprites.star),
        point: new PIXI.Point(point[0], point[1]),
        x: point[0],
        y: point[1],
        z: 0
      }

      vertex.sprite.anchor.x = 0.5
      vertex.sprite.anchor.y = 0.5
      vertex.sprite.x = vertex.point.x * this.config.scale + windowWidth / 2
      vertex.sprite.y = vertex.point.y * -this.config.scale + windowHeight / 2
      vertex.sprite.scale.x = 0.1
      vertex.sprite.scale.y = 0.1

      this.vertexes.push(vertex)
    })

    this.app.ticker.add(delta => this.onTick(delta))
  }

  drawFill () {
    const p0 = [this.vertexes[0].sprite.x, this.vertexes[0].sprite.y]

    this.buffers.fill.clear()
    GeometryTools.move2(this.buffers.fill, p0)
    this.buffers.fill.beginFill(0xffffff, 1.0)

    this.vertexes.forEach((vertex, index) => {
      if (index < this.vertexes.length - 1) {
        GeometryTools.line2(
          this.buffers.fill,
          [this.vertexes[index + 1].sprite.x, this.vertexes[index + 1].sprite.y]
        )
      }

      if (index === this.vertexes.length - 1) {
        GeometryTools.line2(this.buffers.fill, p0)
        this.buffers.fill.closePath()
        this.buffers.fill.endFill()
      }
    })
  }

  drawStroke () {
    const p0 = [this.vertexes[0].sprite.x, this.vertexes[0].sprite.y]

    this.buffers.outline.clear()

    GeometryTools.move2(this.buffers.outline, p0)
    this.buffers.outline.lineStyle(23, 0x0000ff, 1.0, 1.0)

    this.vertexes.forEach((vertex, index) => {
      if (index < this.vertexes.length - 1) {
        GeometryTools.line2(
          this.buffers.outline,
          [this.vertexes[index + 1].sprite.x, this.vertexes[index + 1].sprite.y]
        )
      }

      if (index === this.vertexes.length - 1) {
        GeometryTools.line2(this.buffers.outline, p0)
        this.buffers.outline.closePath()
      }
    })
  }

  drawRoundedStroke () {
    const p0 = [this.vertexes[0].sprite.x, this.vertexes[0].sprite.y]

    this.buffers.outline.clear()

    GeometryTools.move2(this.buffers.outline, p0)
    this.buffers.outline.lineStyle(23, 0x0000ff, 1.0, 1.0)

    this.vertexes.forEach((vertex, index) => {
      const p = [vertex.sprite.x, vertex.sprite.y]

      this.buffers.outline.lineStyle(23, 0x0000ff, 1.0, 0.0)
      this.buffers.outline.drawCircle(p[0], p[1], 23)
      this.buffers.outline.lineStyle(23, 0x0000ff, 1.0, 1.0)

      if (index < this.vertexes.length - 1) {
        GeometryTools.move2(
          this.buffers.outline,
          [vertex.sprite.x, vertex.sprite.y]
        )
        GeometryTools.line2(
          this.buffers.outline,
          [this.vertexes[index + 1].sprite.x, this.vertexes[index + 1].sprite.y]
        )
      }

      if (index === this.vertexes.length - 1) {
        GeometryTools.move2(this.buffers.outline, p)
        GeometryTools.line2(this.buffers.outline, p0)
      }
    })
  }



  onTick (delta) {
    this.drawStroke()
    this.drawFill()
    this.time += 0.1
  }
}
