import * as PIXI from 'pixi.js'
import { SVG } from 'pixi-svg'

import { MouseComponent } from 'components/mouse'
import { CameraComponent } from 'components/camera'
import { LeafComponent } from 'components/leaf'
import { ColorPalette } from 'components/colors'
import { ShaderTexture } from 'components/textures/shadertexture'
import { OceanTexture } from 'components/ocean'
import { OceanComponent } from './lib/components/ocean'
import { SceneComponent } from './lib/components/scene'

global.PIXI = PIXI
window.PIXI = PIXI
global.SVG = SVG

require('pixi-projection')
require('pixi-filters')
require('gl-vec4')

const bounds = {
  minHeight: 560,
  minWidth: 320,
  maxWidth: 1920,
  maxHeight: 1080,
  maxDepth: 1000
}

const canvas = document.getElementById('canvas')

const app = new PIXI.Application({
  view: canvas,
  // resizeTo: canvas,
  antialias: true,
  backgroundColor: 0xffffff
})
const renderer = app.renderer

app.renderer.resolution = window.devicePixelRatio
app.renderer.resize(canvas.offsetWidth, canvas.offsetHeight)

const palette = new ColorPalette(app, { nightMode: true })
app.renderer.backgroundColor = palette.primary
const mouse = new MouseComponent(app)
const camera = new CameraComponent(app, {
  mouse: mouse

})
//
// camera.sortChildren = true
const scene = new SceneComponent(app, { camera: camera })

const ocean = new OceanComponent(app, {
  parent: scene,
  bounds: bounds,
  camera: camera,
  palette: palette,
  x: bounds.maxWidth / 2,
  y: bounds.maxHeight / 2,
  z: 2000
})

const leaf4 = new LeafComponent(app, {
  parent: scene,
  camera: camera,
  mouse: mouse,
  bounds: bounds,
  palette: palette,
  index: 1,
  x: bounds.maxWidth / 2,
  y: bounds.maxHeight / 2,
  z: 300

})

// const ocean = new OceanComponent(app, {

//   bounds: bounds,
//   camera: camera,
//   palette: palette,
//   x: bounds.maxWidth / 2,
//   y: bounds.maxHeight / 2,
//   z: 2000
// })

const leaf3 = new LeafComponent(app, {
  parent: scene,
  camera: camera,
  mouse: mouse,
  bounds: bounds,
  palette: palette,
  index: 4,
  x: bounds.maxWidth / 2,
  y: bounds.maxHeight / 2,
  z: 400

})
const leaf = new LeafComponent(app, {
  parent: scene,
  camera: camera,
  mouse: mouse,
  bounds: bounds,
  palette: palette,
  index: 2,
  x: bounds.maxWidth / 2,
  y: bounds.maxHeight / 2,
  z: 500

})

console.log(scene)

// const ocean = new OceanComponent(app, {
//   bounds: bounds,
//   camera: camera,
//   palette: palette
// })

window.addEventListener('resize', resize)

function resize () {
  app.renderer.resize(canvas.offsetWidth, canvas.offsetHeight)
  leaf.onResize()
  // leaf2.onResize()
  leaf3.onResize()
  leaf4.onResize()
  camera.onResize()
}

resize()
