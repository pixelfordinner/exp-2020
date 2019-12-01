import * as PIXI from 'pixi.js'
import { AvatarComponent } from 'components/avatar'
const canvas = document.getElementById('canvas')

const app = new PIXI.Application({
  view: canvas,
  width: canvas.offsetWidth,
  heigth: canvas.offsetHeight,
  resizeTo: canvas
})
// Components
new AvatarComponent(app)
