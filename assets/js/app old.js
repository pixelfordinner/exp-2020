import * as PIXI from 'pixi.js'
import { SVG } from 'pixi-svg'

// import { AvatarComponent } from 'components/avatar'
// import { displacementFilter } from 'components/displacement'
// import { FlipboardComponent } from 'components/flipboard'
// import { FlipInteraction } from 'components/interaction_flip'
// import { CosmosComponent } from 'components/cosmos'
// import { MaskComponent } from 'components/mask'

import { MouseComponent } from 'components/mouse'
import { CameraComponent } from 'components/camera'
import { LeafComponent } from 'components/svgshape'
import { ShaderComponent } from 'components/shader'
// import { sColor } from 'data/shaders'
// console.log(glslify)

// console.log(glsl)

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
  antialias: true,
  backgroundColor: 0x0000ff
})

const bounds = {
  minHeight: 560,
  minWidth: 320
}
//
// console.log(app.view)

const mouse = new MouseComponent(app)

const camera = new CameraComponent(app, {
  mouse: mouse
})
// const shader = new ShaderComponent(app, {})
const leaf = new LeafComponent(app, {
  camera: camera,
  mouse: mouse,
  bounds: bounds
})

window.addEventListener('resize', resize)
function resize () {
  app.renderer.resize(canvas.offsetWidth, canvas.offsetHeight)
  leaf.onResize()
  camera.onResize()
}

resize()

// app.resize(canvas)
// const dispFilter = new displacementFilter(app, {
//   mouse: mouse
// })

// const avatar = new AvatarComponent(app, {
//   mouse: mouse,
//   camera: camera,
//   filter: dispFilter
// })

// const flipIt = new FlipInteraction(app, {
//   mouse: mouse,
//   object: avatar
// })

// const cosmos = new CosmosComponent(app, {
//   mouse: mouse,
//   camera: camera
// })

// const flipboard = new FlipboardComponent(app, {
//   numStars: 300,
//   applyFilter: true,
//   applyMask: true,
//   recto_scene: cosmos,
//   avatar: avatar,
//   camera: camera,
//   mouse: mouse,
//   filter: dispFilter

// })
