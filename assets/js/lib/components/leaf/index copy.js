import drop from '!raw-loader!data/svg/drop2.svg'

import { ShaderComponent } from 'components/shader'
// import source from 'raw-loader!glslify-loader!data/shader/fragment.glsl'

export class LeafComponent {
  constructor (app, config = {}) {
    this.defaults = {
    }

    this.config = Object.assign(this.defaults, config)
    this.app = app
    this.svg = new SVG(drop)
    this.time = 0
    app.ticker.add(delta => this.onTick(delta))
    this.petal = []
    this.plant = new PIXI.projection.Container3d()
    this.leaf = new PIXI.projection.Container3d()
    this.camera = this.config.camera.getCamera()

    // this.leaf.position.x = app.view.width / 2
    // this.leaf.position.y = app.view.height + 40
    // this.leaf.position3d.z = 300

    // this.camera.addChild(this.leaf)
    // this.leaf.position3d.z = -3000

    this.shader = new ShaderComponent(app, {})
    // this.petal[i].shader = this.shader.shader

    this.filter = new PIXI.Filter(PIXI.Filter.defaultVertexSrc, this.shader.shaderfragment, { stime: 0.0 })
    // this.filter = new PIXI.Filter()
    // this.filter.program = this.shader.program

    // console.log(this.shader.shader.program.fragmentSrc)

    for (let i = 0; i < 9; i++) {
      this.petal[i] = this.svg.clone()
      this.petal[i].pivot.x = this.svg.width / 2
      this.petal[i].angle = ((180 / 9) * i)
      // this.petal[i].scale = new PIXI.Point(0.1, 0.1)
      // const shape = 0
      if (i === 4) {
        // this.petal[i].tint = 0xff00ff
        // this.petal[i].shader = [this.shader.shader]

        // console.log(this.petal[i])
        this.petal[i].filters = [this.filter]
        //
        // shape = new PIXI.Mesh(this.petal[4].geometry, shader.shader)
        // this.plant.addChild(shape)
        // console.log(shader.shader)
      }

      // interesting note !!
      // container size w/h adapt itself automaticaly to its own content as you add new element into it.
      // exemple :
      // this.petal[i].position = new PIXI.Point(this.plant.width / 2, this.plant.height)
      // if unchecked the container size grow gradualy and the leafs are spreaded verticaly

      this.leaf.addChild(this.petal[i])
      // this.camera.addChild(this.petal[i])
      this.leaf.scale = new PIXI.Point(10, 10)
    }
    // this.leaf.skew = new PIXI.Point(2, 1)
    // this.camera = this.config.camera.getCamera()
    // this.camera.addChild(this.leaf)

    // this.leaf.position3d.z = 4000
    this.leaf.position3d.set(0, 0, 4000)
    // app.stage.filterArea = app.renderer.screen
    // app.stage.filters = [this.filter]
    // this.plant.addChild(this.leaf)
    app.stage.addChild(this.leaf)
    this.camera.addChild(this.leaf)
  }

  onTick (delta) {
    this.time += 0.01
    // this.leaf.skew = new PIXI.Point(3 + Math.cos(this.time) * 3, 0.0)
    this.filter.uniforms.stime += 0.1
    // this.leaf.position3d.set(0, 0, Math.cos(this.time) * 30)
    this.leaf.position3d.z += Math.cos(this.time) * 3
    // console.log(this.leaf.position3d)
  }

  onresize (app) {
    // this.leaf.position3d.z = 4000
    // this.leaf.position3d.set(0, 0, 4000)

    // this.leaf.position = new PIXI.Point(app.screen.width / 2, app.screen.height - 40)
    // this.leaf.position3d.set(0, 0, 10)
    // this.leaf.position3d.set(app.screen.width / 2, app.screen.height + 40, 1)
    // this.leaf.position3d.z = 3000
  }
}
