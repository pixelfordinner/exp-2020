import * as PIXI from 'pixi.js'
import { SVG } from 'pixi-svg'

import { MouseComponent } from 'components/mouse'
import { CameraComponent } from 'components/camera'
import { LeafComponent } from 'components/leaf'
import { ColorPalette } from 'components/colors'
import { OceanComponent } from 'components/ocean'
import { SceneComponent } from 'components/scene'
// import { MontainComponent } from 'components/montain'
// import { SunComponent } from 'components/sun'
// import { CloudComponent } from 'components/cloud'

import { ButterflyComponent } from 'components/butterfly'
// import { BaseLeafComponent } from 'components/baseleaf'
// import { LeafClusterComponent } from 'components/leafcluster'

import { HomeComposition } from 'components/compositions/home'

// import { BeachComponent } from 'components/beach'

global.PIXI = PIXI
window.PIXI = PIXI
global.SVG = SVG

require('pixi-projection')
require('pixi-filters')
require('gl-vec4')

const canvas = document.getElementById('canvas')

const app = new PIXI.Application({
  view: canvas,
  resizeTo: canvas,
  antialias: true
})

app.renderer.resolution = window.devicePixelRatio
const mouse = new MouseComponent(app)

const camera = new CameraComponent(app, {
  mouse: mouse

})

const palette = new ColorPalette(app, { nightMode: true, animate: true })
const scene = new SceneComponent(app, { camera: camera, palette: palette, mouse: mouse })
const composition = new HomeComposition(app, { parent: scene })

window.addEventListener('resize', resize)

function resize () {
  camera.onResize()
}

resize()
