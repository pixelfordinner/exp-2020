import * as PIXI from 'pixi.js'
import { AvatarComponent } from 'components/avatar'
import { CameraComponent } from 'components/camera'
import { CardComponent } from 'components/card'
import { StarFieldComponent } from 'components/starfield3d'

global.PIXI = PIXI
window.PIXI = PIXI
require('pixi-projection')
require('pixi-layers')
require('pixi-filters')

const canvas = document.getElementById('canvas')

const app = new PIXI.Application({
  view: canvas,
  width: canvas.offsetWidth,
  heigth: canvas.offsetHeight,
  resizeTo: canvas,
  antialias: true,
  backgroundColor: 0x1099bb
})

// Components
const camera = new CameraComponent(app)

new CardComponent(app, {
  camera: camera
})
new StarFieldComponent(app, {
  camera: camera
})
new AvatarComponent(app)
