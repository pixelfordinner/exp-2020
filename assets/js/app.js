import * as PIXI from 'pixi.js'
import { AvatarComponent } from 'components/avatar'
import { CameraComponent } from 'components/camera'
import { displacementFilter } from 'components/displacement'
import { MouseComponent } from 'components/mouse'

import { FlipboardComponent } from 'components/flipboard'
import { FlipInteraction } from 'components/interaction_flip'
import { CosmosComponent, MaskComponent } from 'components/cosmos'

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

const flipIt = new FlipInteraction(app, {
  mouse: mouse,
  object: avatar
})

const cosmos = new CosmosComponent(app, {
  mouse: mouse,
  camera: camera
})

const flipboard = new FlipboardComponent(app, {
  numStars: 300,
  applyFilter: true,
  applyMask: true,
  recto_scene: cosmos,
  avatar: avatar,
  camera: camera,
  mouse: mouse,
  filter: dispFilter

})
