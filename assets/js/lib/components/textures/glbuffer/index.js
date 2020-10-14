// import { IriShader } from 'components/shader/iri'

import { depthShader } from 'components/shader/depth'

import { mat4, glMatrix } from 'gl-matrix'

export class glImage {
  constructor (app, config = {}) {
    this.defaults = {
      program: new depthShader(app),
      width: 600,
      height: 600,
      scale: 1,
      brightness: 1.7

    }

    this.app = app
    this.config = Object.assign(this.defaults, config)

    this.mouse = this.config.mouse

    this.width = this.config.width
    this.height = this.config.height
    this.time = 1
    this.app.ticker.add(delta => this.onTick(delta))
    this.program = this.config.program

    this.canvas = document.createElement('canvas')

    this.gl = this.canvas.getContext('webgl')
    if (!this.gl) {
      return
    }

    this.gl.clearColor(0.05, 0.25, 0.1, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    this.canvas.width = this.width
    this.canvas.height = this.height

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

    this.init()
  }

  async init () {
    this.collection = 'wood'

    this.img = new Image()
    this.img.src = '/dist/images/' + this.collection + '_' + 0 + '.jpg'
    await new Promise(resolve => { this.img.onload = resolve })
    this.setTexture(this.img, 'img_0', 0, this.gl)

    this.map = new Image()
    this.map.src = '/dist/images/' + this.collection + '_' + 0 + '_filter.jpg'
    await new Promise(resolve => { this.map.onload = resolve })
    this.setTexture(this.map, 'map_0', 1, this.gl)

    this.img = new Image()
    this.img.src = '/dist/images/' + this.collection + '_' + 1 + '.jpg'
    await new Promise(resolve => { this.img.onload = resolve })
    this.setTexture(this.img, 'img_1', 2, this.gl)

    this.map = new Image()
    this.map.src = '/dist/images/' + this.collection + '_' + 1 + '_filter.jpg'
    await new Promise(resolve => { this.map.onload = resolve })
    this.setTexture(this.map, 'map_1', 3, this.gl)
  }

  render () {
    // update ubiforms values
    this.gl.uniform1f(this.timeLocation, this.time)
    this.gl.uniform1f(this.brightnessLocation, this.config.brightness)
    // draw on canvas
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6 * this.w * this.h)
  }

  onTick (delta) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    const mpx = (this.mouse.pos.x - (this.canvas.width / 2)) / this.canvas.width
    const mpy = (this.mouse.pos.y - (this.canvas.height / 2)) / this.canvas.height

    this.gl.uniform2f(this.mouseLocation, mpx, mpy)

    this.progression = Math.cos(this.time * 1.5) * 0.5 + 0.5

    this.gl.uniform1f(this.progression_Location, this.progression)
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
