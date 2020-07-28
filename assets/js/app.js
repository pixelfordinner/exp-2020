import * as PIXI from 'pixi.js'
import { SVG } from 'pixi-svg'
import { Tween, Easing, autoPlay } from 'es6-tween'
import { TWEEN } from '@tweenjs/tween.js'
import { MouseComponent } from 'components/mouse'
import { CameraComponent } from 'components/camera'
import { ColorPalette } from 'components/colors'
import { SceneComponent } from 'components/scene'
import { HomeComposition } from 'components/compositions/home'

global.PIXI = PIXI
window.PIXI = PIXI
global.SVG = SVG

require('pixi-projection')
require('pixi-filters')
require('gl-vec4')
// const TWEEN = require('@tweenjs/tween.js')

const canvas = document.getElementById('canvas')
console.log(Easing)
const app = new PIXI.Application({
  view: canvas,
  resizeTo: canvas,
  antialias: true
})

app.renderer.resolution = window.devicePixelRatio

const mouse = new MouseComponent(app)
const camera = new CameraComponent(app, { mouse: mouse })
const palette = new ColorPalette(app, { nightMode: true, animate: false })
const scene = new SceneComponent(app, { camera: camera, palette: palette, mouse: mouse })
const composition = new HomeComposition(app, { parent: scene })

app.stage.addChild(camera.camera)
window.addEventListener('resize', resize)

function resize () {
  camera.onResize()
  // app.renderer.resolution = window.devicePixelRatio
}

resize()
