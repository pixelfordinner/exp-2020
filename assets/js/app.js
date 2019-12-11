import * as PIXI from 'pixi.js'
import { AvatarComponent } from 'components/avatar'
import { CameraComponent } from 'components/camera'
import { CardComponent } from 'components/card'
import { MouseComponent } from 'components/mouse'

import { StarFieldComponent } from 'components/starfield3d'

global.PIXI = PIXI
window.PIXI = PIXI
require('pixi-projection')
require('pixi-filters')

require('gl-vec4')
console.log(require('gl-vec4'))

const canvas = document.getElementById('canvas')

const app = new PIXI.Application({
  view: canvas,
  width: canvas.offsetWidth,
  heigth: canvas.offsetHeight,
  resizeTo: canvas,
  antialias: true,
  backgroundColor: 0x0000ff
})

// Components
const mouse = new MouseComponent(app)

const camera = new CameraComponent(app)
// const avatar = new AvatarComponent(app)

// console.log(mask)
const avatar = new AvatarComponent(app, {
  camera: camera
})

// console.log(container.camera)

//
// console.log(app)

// new CardComponent(app, {
//   camera: camera,
//   parent: avatar
// })

new StarFieldComponent(app, {
  camera: camera,
  shapemask: avatar,
  mouse: mouse,
  mask: avatar.getmask()
})

// const points = [
//   [0.07, 0.30, 0.35, 0.50, 0.35, 0.19, 0.50, 0.01, 0.41, -0.23, 0.00, -0.50, -0.41, -0.23, -0.50, 0.01, -0.35, 0.19, 0.35, 0.50, -0.07, 0.30]
// ]
// const buffer = new PIXI.Buffer.from(points[0])
// const geometry = new PIXI.Geometry(buffer)
// const material = new PIXI.MeshMaterial(1, 0x0000FF)
// const mesh = new PIXI.Mesh(geometry, material)

// console.log(mesh.geometry)
// app.stage.addChild(mesh)

// })

// new AvatarComponent(app)
