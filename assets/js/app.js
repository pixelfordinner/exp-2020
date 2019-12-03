import * as PIXI from 'pixi.js'
import { AvatarComponent } from 'components/avatar'
import { CameraComponent } from 'components/camera'
import { MouseComponent } from 'components/mouse'
import { CardComponent } from 'components/card'
import { StarFieldComponent } from 'components/starfield3d'

global.PIXI = PIXI
window.PIXI = PIXI
require('pixi-projection')
require('pixi-filters')

const canvas = document.getElementById('canvas')

const app = new PIXI.Application({
  view: canvas,
  width: canvas.offsetWidth,
  heigth: canvas.offsetHeight,
  resizeTo: canvas,
  antialias: true,
  backgroundColor: 0xffffff
})

// Components
const camera = new CameraComponent(app)
// const avatar = new AvatarComponent(app)

// console.log(mask)
const avatar = new AvatarComponent(app, {
  camera: camera
})

new CardComponent(app, {
  camera: camera,
  parent: avatar
})

new StarFieldComponent(app, {
  camera: camera,
  shape: avatar,
  mask: avatar.getmask()
})

// new AvatarComponent(app)
