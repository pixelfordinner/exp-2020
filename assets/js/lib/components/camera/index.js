
import * as PIXI from 'pixi.js'
require('pixi-projection')
export class CameraComponent {
  constructor (app, config = {}) {
    this.defaults = {
      width: app.screen.width,
      heigth: app.screen.height
    }

    const point = new PIXI.Point()


 // camera.position.set(width / 2, height / 2)
 // camera.setPlanes(350, 30, 10000)
 // camera.euler.x = Math.PI / 5.5
 // app.stage.addChild(camera)
 console.log('hello')
  }
}
