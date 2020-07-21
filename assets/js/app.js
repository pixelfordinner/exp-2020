import * as PIXI from 'pixi.js'
import { SVG } from 'pixi-svg'

import { MouseComponent } from 'components/mouse'
import { CameraComponent } from 'components/camera'
import { LeafComponent } from 'components/leaf'
import { ColorPalette } from 'components/colors'
import { OceanComponent } from 'components/ocean'
import { SceneComponent } from 'components/scene'
import { MontainComponent } from 'components/montain'
import { SunComponent } from 'components/sun'
import { CloudComponent } from 'components/cloud'

import { ButterflyComponent } from 'components/butterfly'

import { BeachComponent } from 'components/beach'

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
  resizeTo: canvas,
  antialias: true
  // backgroundColor: 0xffffff
})

app.renderer.resolution = window.devicePixelRatio

// const palette = new ColorPalette(app, { nightMode: false, animate: false })

const mouse = new MouseComponent(app)

const camera = new CameraComponent(app, {
  mouse: mouse

})

const scene = new SceneComponent(app, { camera: camera })
const palette = new ColorPalette(app, { nightMode: true, animate: true })
// app.renderer.backgroundColor = palette.primary

const cloud = new CloudComponent(app, { palette: palette, parent: scene.scene })
const beach = new BeachComponent(app, {
  parent: scene,
  palette: palette,
  x: 0,
  y: 0,
  z: 10
})
const sun = new SunComponent(app, {
  parent: scene,
  palette: palette,
  x: 4200,
  y: 2000,
  z: 3000
})

const montain1 = new MontainComponent(app, {
  parent: scene,
  palette: palette,
  x: 300,
  y: 0,
  z: 900
})

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
  index: 4,
  x: -bounds.maxWidth / 4,
  y: bounds.maxHeight / 1.6,
  z: 200

})

const leaf3 = new LeafComponent(app, {
  parent: scene,
  camera: camera,
  mouse: mouse,
  bounds: bounds,
  palette: palette,
  light: true,
  index: 4,
  x: bounds.maxWidth / 2 + 800,
  y: bounds.maxHeight / 1.6,
  z: 400

})
const leaf2 = new LeafComponent(app, {
  parent: scene,
  camera: camera,
  mouse: mouse,
  bounds: bounds,
  palette: palette,
  light: true,
  index: 2,
  x: bounds.maxWidth / 2 - 200,
  y: bounds.maxHeight / 2,
  z: 100

})
const butterfly = new ButterflyComponent(app, { parent: scene, palette: palette, anchor: leaf2 })
const butterfly2 = new ButterflyComponent(app, { courage: 1.2, x: 200, y: 100, parent: scene, palette: palette, anchor: leaf2 })
const leaf = new LeafComponent(app, {
  parent: scene,
  camera: camera,
  mouse: mouse,
  bounds: bounds,
  palette: palette,
  index: 2,
  x: bounds.maxWidth / 2 - 200,
  y: bounds.maxHeight / 1.5,
  z: 500

})

window.addEventListener('resize', resize)

function resize () {
  camera.onResize()
}

resize()
