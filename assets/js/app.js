import * as PIXI from 'pixi.js'
import { AvatarComponent } from 'components/avatar'
import { CameraComponent } from 'components/camera'
import { displacementFilter } from 'components/displacement'
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

const mouse = new MouseComponent(app)

const camera = new CameraComponent(app, {
  mouse: mouse
})

const dispFilter = new displacementFilter(app, {
  mouse: mouse
})

const avatar = new AvatarComponent(app, {
  mouse: mouse,
  camera: camera,
  filter: dispFilter
})

const starField = new StarFieldComponent(app, {
  numStars: 300,
  applyFilter: true,
  applyMask: true,
  camera: camera,
  shapemask: avatar,
  mouse: mouse,
  filter: dispFilter
})
