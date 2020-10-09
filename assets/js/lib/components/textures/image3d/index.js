// import { IriShader } from 'components/shader/iri'

import { depthShader } from 'components/shader/depth'

import { mat4, glMatrix } from 'gl-matrix'

export class ImageTexture {
  constructor (app, config = {}) {
    this.defaults = {
      program: new depthShader(app),
      width: 600,
      height: 600,
      scale: 5,
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
    // this.vertices = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]

    this.w = 1
    this.h = 1

    this.vertices = this.createPlane(this.w, this.h)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW)

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.useProgram(this.shader)
    this.gl.enableVertexAttribArray(this.positionAttributeLocation)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)

    this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0)

    // set uniform locations
    // basics
    this.resolutionLocation = this.gl.getUniformLocation(this.shader, 'u_resolution')
    this.mouseLocation = this.gl.getUniformLocation(this.shader, 'u_mouse')
    this.timeLocation = this.gl.getUniformLocation(this.shader, 'u_time')

    // specifics

    this.isdepth_Location = this.gl.getUniformLocation(this.shader, 'isdepth')
    this.index_Location = this.gl.getUniformLocation(this.shader, 'myindex')
    // this.brightnessLocation = this.gl.getUniformLocation(this.shader, 'brightness')

    // const mpx = (this.mouse.pos.x - this.canvas.width / 2) / this.canvas.width
    // const mpy = (this.mouse.pos.y - this.canvas.height / 2) / this.canvas.height

    // set uniform values
    this.gl.uniform2f(this.resolutionLocation, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.uniform2f(this.mouseLocation, 0, 0)
    this.gl.uniform1f(this.timeLocation, this.time)
    this.gl.uniform1f(this.isdepth_Location, 1.0)
    this.gl.uniform1f(this.index_Location, 0.0)

    // this.gl.uniform1f(this.brightnessLocation, this.config.brightness)

    this.init()
  }

  async init () {
    this.img = new Image()
    this.img.src = '/dist/images/wood.jpg'
    await new Promise(resolve => { this.img.onload = resolve })
    this.setTexture(this.img, 'img', 0, this.gl)

    this.map = new Image()
    this.map.src = '/dist/images/wood-01-filter.jpg'
    await new Promise(resolve => { this.map.onload = resolve })
    this.setTexture(this.map, 'map', 1, this.gl)

    this.next_img = new Image()
    this.next_img.src = '/dist/images/wood2.jpg'
    await new Promise(resolve => { this.next_img.onload = resolve })
    this.setTexture(this.next_img, 'next_img', 2, this.gl)

    glMatrix.setMatrixArrayType(Array)

    this.worldMatrix = []
    this.viewMatrix = []
    this.projMatrix = []
    this.rotMatrix = []

    mat4.identity(this.rotMatrix)
    mat4.identity(this.worldMatrix)
    mat4.lookAt(this.viewMatrix, [0, 0, -2], [0, 0.1, 0], [0, 1, 0])
    mat4.perspective(this.projMatrix, glMatrix.toRadian(40), this.ratio, 0.001, 100.0)

    // mat4.rotate(this.worldMatrix, this.rotMatrix, Math.PI * Math.sin(this.time), [0, 1, 0])

    this.matWorldUniformLocation = this.gl.getUniformLocation(this.shader, 'mWorld')
    this.matViewUniformLocation = this.gl.getUniformLocation(this.shader, 'mView')
    this.matProjUniformLocation = this.gl.getUniformLocation(this.shader, 'mProj')

    this.gl.uniformMatrix4fv(this.matWorldUniformLocation, this.gl.FALSE, this.worldMatrix)
    this.gl.uniformMatrix4fv(this.matViewUniformLocation, this.gl.FALSE, this.viewMatrix)
    this.gl.uniformMatrix4fv(this.matProjUniformLocation, this.gl.FALSE, this.projMatrix)
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

    const mpx = (this.mouse.pos.x - this.canvas.width / 2) / this.canvas.width
    const mpy = (this.mouse.pos.y - this.canvas.height / 2) / this.canvas.height
    this.gl.uniform2f(this.mouseLocation, mpx, mpy)

    this.time += 0.01
    this.render()
    this.texture.update()
  }

  createPlane (xlength, ylength) {
    const vertex = []
    const ws = 1 / xlength
    const hs = 1 / ylength
    // ws *= 2
    for (let x = 0; x < xlength; x++) {
      for (let y = 0; y < ylength; y++) {
        const x0 = x * ws - 0.5
        const x1 = (x + 1) * ws - 0.5
        const y0 = y * hs - 0.5
        const y1 = (y + 1) * hs - 0.5

        vertex.push(x0, y0, -1)
        vertex.push(x0, y1, -1)
        vertex.push(x1, y1, -1)

        vertex.push(x1, y1, -1)
        vertex.push(x1, y0, -1)
        vertex.push(x0, y0, -1)
      }
    }

    return vertex
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
    // const mapLocation = gl.getUniformLocation(this.shader, 'map')
    // const next_imgLocation = gl.getUniformLocation(this.shader, 'next_img')

    gl.uniform1i(imgLocation, num)
    // gl.uniform1i(mapLocation, num)
    // gl.uniform1i(next_imgLocation, num)
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
