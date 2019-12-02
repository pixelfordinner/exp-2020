import * as PIXI from 'pixi.js'
import { AvatarComponent } from 'components/avatar'
import { CameraComponent } from 'components/camera'

const canvas = document.getElementById('canvas')

const app = new PIXI.Application({
  view: canvas,
  width: canvas.offsetWidth,
  heigth: canvas.offsetHeight,
  resizeTo: canvas,
  antialias: true
})

// Components
new CameraComponent(app)
new AvatarComponent(app)
