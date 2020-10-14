import * as PIXI from 'pixi.js'
import { SVG } from 'pixi-svg'
import { Tween, Easing, autoPlay } from 'es6-tween'

// import { TWEEN } from '@tweenjs/tween.js'

import { MouseComponent } from 'components/mouse'
import { CameraComponent } from 'components/camera'
import { ColorPalette } from 'components/colors'
import { SceneComponent } from 'components/scene'
import { HomeComposition } from 'components/compositions/home'
import { KarlPerfil } from 'components/compositions/perfils/karl'

import { glImage } from 'components/textures/glbuffer'

global.PIXI = PIXI
window.PIXI = PIXI
global.SVG = SVG

require('pixi-projection')
require('pixi-filters')
require('gl-vec4')
require('gl-matrix')
// const glMatrix = require('gl-Matrix')
const PIXI3D = require('pixi3d')
// const TWEEN = require('@tweenjs/tween.js')

const canvas = document.getElementById('canvas')
const app = new PIXI.Application({
  view: canvas,
  resizeTo: canvas,
  antialias: true
})
// app.renderer.resolution = window.devicePixelRatio
const mouse = new MouseComponent(app)
const camera = new CameraComponent(app, { mouse: mouse })

const palette = new ColorPalette(app, { nightMode: true, animate: false })
const scene = new SceneComponent(app, { camera: camera, palette: palette, mouse: mouse })

app.renderer.backgroundColor = '0x463D3F'

// const composition = new HomeComposition(app, { parent: scene })

// const mesh = app.stage.addChild(PIXI3D.Mesh3D.createCube())

/// ////////////////////////////////////////////////////////////
// 3D exemple !!! do not erase
// app.loader.add('dist/mod/buster_drone/scene.gltf')

// app.loader.load((loader, resources) => {
//   const model = app.stage.addChild(
//     PIXI3D.Model.from(resources['dist/mod/buster_drone/scene.gltf'].gltf))

//   model.animations[0].play()

//   model.position.y = 0.3
//   model.scale.set(2)
//   model.rotationQuaternion.setEulerAngles(0, 25, 0)
// })

// const light = Object.assign(new PIXI3D.Light(), {
//   type: 'point', x: -1, y: 0, z: 3, range: 10, intensity: 10
// })
// PIXI3D.LightingEnvironment.main.lights.push(light)
/// /////////////////////////////////////////////////////////

// const image = new PIXI.Sprite.from('dist/images/campo.jpg')

// image.height = window.innerHeight
// image.width = window.innerHeight * 1.499
// app.stage.addChild(image)
// image.renderable = false
// const map = new PIXI.Sprite.from('dist/images/campo-map4.jpg')

// map.height = window.innerHeight
// map.width = window.innerHeight * 1.499
// map.renderable = false
// app.stage.addChild(map)

// const filter = new PIXI.filters.DisplacementFilter(map, 0)
// app.stage.filters = [filter]
//
/// ////////////////////////////////////
const texture = new glImage(app, { mouse: mouse, palette: palette, width: 1000, height: 666, zindex: 0 })
const frame = new PIXI.Sprite.from(texture.texture)
frame.pivot.set(500, 333)
frame.position.set(canvas.width / 2, canvas.height / 2)
// frame.scale.set(1.5, 1)//
app.stage.addChild(frame)
/// /////////////////////////////
// window.onmousemove = function (e) {
//   filter.scale.x = (window.innerWidth / 2 - e.clientX) / 30
//   filter.scale.y = (window.innerHeight / 2 - e.clientY) / 20
// }

window.addEventListener('resize', resize)

function resize () {
  camera.onResize()
  console.log('resize')
  // app.renderer.resolution = window.devicePixelRatio
}
//
// resize()
