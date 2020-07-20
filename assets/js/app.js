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

import { ButteflyComponent } from 'components/butterfly'

import { BeachComponent } from 'components/beach'
import { ButterflyComponent } from './lib/components/butterfly'

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
  antialias: true,
  backgroundColor: 0xffffff
})
// const renderer = app.renderer

app.renderer.resolution = window.devicePixelRatio
console.log(window)
// app.renderer.resize(window.innerWidth, window.innerHeight)/
// app.renderer.resize(window.visualViewport.width, window.visualViewport.height)
// app.renderer.resize(canvas.offsetWidth, canvas.offsetHeight)

const palette = new ColorPalette(app, { nightMode: false, animate: true })

app.renderer.backgroundColor = palette.primary

// app.stage.on('move', function (event) {
//   console.log(event.type, event.target) // 'move', PIXI.DisplayObject {}
// })
/// /const noiseFilter = new PIXI.filters.NoiseFilter(0.05, 30)
// app.stage.filters = [noiseFilter]
// const filter = new PIXI.filters.DisplacementFilter(this.displacementSprite)

const mouse = new MouseComponent(app)

const camera = new CameraComponent(app, {
  mouse: mouse

})
//
// camera.sortChildren = true
const scene = new SceneComponent(app, { camera: camera })
// const butterfly = new ButterflyComponent(app, { x: 800, y: 400, z: 60, parent: scene, palette: palette })
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
const butterfly = new ButterflyComponent(app, { x: 800, y: 400, z: 60, parent: scene, palette: palette, anchor: leaf2 })
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
