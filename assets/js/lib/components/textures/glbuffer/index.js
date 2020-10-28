// import { IriShader } from 'components/shader/iri'

import { _tweensAddedDuringUpdate } from '@tweenjs/tween.js'
import { depthShader } from 'components/shader/depth'

import { Tween, Easing, autoPlay } from 'es6-tween'

export class glImage {
  constructor (app, config = {}) {
    this.defaults = {
      collection: 'wood',
      width: 600,
      height: 600,
      scale: 1,
      brightness: 1.7

    }

    this.app = app
    this.config = Object.assign(this.defaults, config)

    this.indice = 0
    this.next_indice = 0
    this.mouse = this.config.mouse
    this.orientation = 0
    this.prev_orientation = 0
    this.set_next = false
    this.isfading = false

    this.progression = 0
    this.density = 500
    this.progression_plus = 0

    this.width = this.config.width
    this.height = this.config.height

    this.scroll = new PIXI.Point(0, 0)
    this.scroll_density = new PIXI.Point(0, 0)

    this.time = 1
    this.app.ticker.add(delta => this.onTick(delta))
    this.program = new depthShader(app, { collection: this.config.collection, hello: 1 })

    this.canvas = document.createElement('canvas')
    // INI WEBGL CANVAS
    this.initCanvas()
    // LOAD SHADERS PROGRAMS
    this.initShaders()
    // SET UP AND LOAD TEXTURES IMAGES
    this.initTextures()
  }

  initShaders () {
    // set uniform locations
    // basics
    this.resolutionLocation = this.gl.getUniformLocation(this.shader, 'u_resolution')
    this.mouseLocation = this.gl.getUniformLocation(this.shader, 'u_mouse')
    this.timeLocation = this.gl.getUniformLocation(this.shader, 'u_time')

    // specifics

    this.progression_Location = this.gl.getUniformLocation(this.shader, 'u_progression')

    // set uniform values
    this.gl.uniform2f(this.resolutionLocation, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.uniform2f(this.mouseLocation, 0, 0)
    this.gl.uniform1f(this.timeLocation, this.time)
    this.gl.uniform1f(this.isdepth_Location, 1.0)
    this.gl.uniform1f(this.progression_Location, 1.0)
  }

  initCanvas () {
    this.gl = this.canvas.getContext('webgl')
    if (!this.gl) {
      return
    }

    this.gl.clearColor(0.05, 0.25, 0.1, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    this.canvas.width = this.width
    this.canvas.height = this.height

    // console.log(this.canvas)

    document.body.addEventListener('wheel', e => this.canvasOnScroll(e))

    this.ratio = this.canvas.width / this.canvas.height

    this.texture = new PIXI.Texture.from(this.canvas)

    const vs2 = this.program.shadervertex
    const fs2 = this.program.shaderfragment

    this.shader = this.initShaderProgram(this.gl, vs2, fs2)

    this.positionAttributeLocation = this.gl.getAttribLocation(this.shader, 'a_position')

    this.positionBuffer = this.gl.createBuffer()
    this.vertices = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]

    this.w = 1
    this.h = 1

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW)

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.useProgram(this.shader)
    this.gl.enableVertexAttribArray(this.positionAttributeLocation)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
    this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0)
  }

  async initTextures () {
    this.collection = this.config.collection

    this.images = []
    this.filters = []
    this.max = 4

    for (let i = 0; i < this.max; i++) {
      const img = new Image()
      img.src = '/dist/images/' + this.collection + '_' + i + '.jpg'
      await new Promise(resolve => { img.onload = resolve })
      this.images.push(img)

      const map = new Image()
      map.src = '/dist/images/' + this.collection + '_' + i + '_filter.jpg'
      await new Promise(resolve => { map.onload = resolve })
      this.filters.push(map)
    }

    this.setTexture(this.images[0], 'img_0', 0, this.gl)
    this.setTexture(this.filters[0], 'map_0', 1, this.gl)
    this.setTexture(this.images[1], 'img_1', 2, this.gl)
    this.setTexture(this.filters[1], 'map_1', 3, this.gl)
  }

  render () {
    // update ubiforms values
    this.gl.uniform1f(this.timeLocation, this.time)
    this.gl.uniform1f(this.brightnessLocation, this.config.brightness)
    // draw on canvas
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6 * this.w * this.h)
  }

  canvasOnScroll (e) {
    this.scroll.x = e.deltaX
    this.scroll.y = e.deltaY
    this.prev_orientation = this.orientation

    if (this.scroll.y > 0) {
      this.orientation = 1
      this.set_next = true
    } else if (this.scroll.y < 0) {
      this.orientation = -1
      this.set_next = true
    }
    if (this.scroll.y !== 0 && this.prev_orientation !== this.orientation) {
      // this.set_next = true
      console.log('change orientation')
    }

    if (this.scroll.y < this.density && this.scroll.y > -this.density) {
      this.scroll_density.y += Math.abs(this.scroll.y)
    }
    if (this.scroll_density > 4) {

    }
  }

  canvasOnClick (e) {
    console.log('click')
  }

  updatetransition (v) {
    this.gl.uniform1f(this.progression_Location, v)
  }

  updatemouse () {
    const mpx = (this.mouse.shape.x - (this.canvas.width / 2)) / this.canvas.width
    const mpy = (this.mouse.shape.y - (this.canvas.height / 2)) / this.canvas.height
    this.gl.uniform2f(this.mouseLocation, mpx, mpy)
  }

  onTick (delta) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.updatemouse()

    // LOOK UP FOR NEXT IMAGE
    if (this.set_next && !this.isfading) {
      this.nid = 0

      if (this.orientation > 0) {
        this.nid = (this.indice + 1) % this.max
      } else if (this.orientation < 0.0) {
        this.nid = this.indice > 0 ? (this.indice - 1) % this.max : this.max - 1
      }
      console.log('nextid : ' + this.nid)

      this.setTexture(this.images[this.nid], 'img_1', 2, this.gl)
      this.setTexture(this.filters[this.nid], 'map_1', 3, this.gl)
      this.set_next = false
    }
    // LOOK UP FOR ACTUAL IMAGE
    if (this.progression > 0.9) {
      if (this.isfading) {
        const prev_indice = this.indice

        if (this.orientation > 0.0) {
          this.indice++
        } else if (this.orientation < 0.0) {
          this.indice = this.indice > 0 ? this.indice - 1 : this.max - 1
        }
        // this.time = 0
        const id = this.indice % this.max
        console.log('new id: ' + id)

        this.setTexture(this.images[id], 'img_0', 0, this.gl)
        this.setTexture(this.filters[id], 'map_0', 1, this.gl)

        this.isfading = false

        // this.orientation = 0
        // this.prev_orientation = 0
        this.scroll_density.y = 0
      }
    }
    if (this.progression > 0.9 && !this.isfading) {
      this.progression = 0
    }

    autoPlay(true)
    // TRANSITION BETWEEN 2 IMAGES
    if (!this.isfading) {
      this.progression_plus = this.scroll_density.y / 500
    }

    this.updatetransition(this.progression_plus)
    const p = { x: this.progression }

    if (this.progression_plus >= 0.05) {
      this.time = 0
      this.isfading = true
      this.tween = new Tween(p)
      this.tween.to({ x: 1 }, 400)
      this.tween.easing(Easing.Elastic.InOut(10, 0))
      this.tween.on('update', x => {
        this.progression = x.x
      })
      this.tween.start()
      this.updatetransition(this.progression + 0.051)
    } else {
      if (this.scroll_density.y > 0) {
        this.scroll_density.y -= 5
      }
    }

    this.time += 0.01
    this.render()
    this.texture.update()
  }

  setTexture (im, name, num, gl) {
    const texture = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0 + num)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im)

    const imgLocation = gl.getUniformLocation(this.shader, name)
    gl.uniform1i(imgLocation, num)
  }

  initShaderProgram (gl, vsSource, fsSource) {
    const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

    // Create the shader program

    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
      return null
    }
    // console.log(shaderProgram)

    return shaderProgram
  }

  loadShader (gl, type, source) {
    const shader = gl.createShader(type)

    // Send the source to the shader object

    gl.shaderSource(shader, source)

    // Compile the shader program

    gl.compileShader(shader)

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }

    return shader
  }
}
