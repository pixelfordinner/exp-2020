// import { IriShader } from 'components/shader/iri'
import { basicShader } from 'components/shader/basic'

import { mat4 } from 'gl-matrix'

export class ShaderTexture {
  constructor (app, config = {}) {
    this.defaults = {
      program: new basicShader(app),
      width: 600,
      height: 600,
      scale: 5,
      brightness: 1.7

    }

    this.app = app
    this.config = Object.assign(this.defaults, config)

    this.width = this.config.width
    this.height = this.config.height
    this.time = 0
    this.app.ticker.add(delta => this.onTick(delta))
    this.program = this.config.program

    this.canvas = document.createElement('canvas')

    this.gl = this.canvas.getContext('webgl')
    if (!this.gl) {
      return
    }
    this.canvas.width = this.width
    this.canvas.height = this.height

    this.texture = new PIXI.Texture.from(this.canvas)

    const vs2 = this.program.shadervertex
    const fs2 = this.program.shaderfragment

    this.shader = this.initShaderProgram(this.gl, vs2, fs2)
    this.positionAttributeLocation = this.gl.getAttribLocation(this.shader, 'a_position')

    this.positionBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), this.gl.STATIC_DRAW)

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.useProgram(this.shader)
    this.gl.enableVertexAttribArray(this.positionAttributeLocation)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)

    this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0)

    // set uniform locations
    this.resolutionLocation = this.gl.getUniformLocation(this.shader, 'u_resolution')
    this.timeLocation = this.gl.getUniformLocation(this.shader, 'u_time')
    this.indexLocation = this.gl.getUniformLocation(this.shader, 'index')
    this.scaleLocation = this.gl.getUniformLocation(this.shader, 'scale')
    this.brightnessLocation = this.gl.getUniformLocation(this.shader, 'brightness')
    // set uniform values
    this.gl.uniform2f(this.resolutionLocation, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.uniform1f(this.indexLocation, this.config.zindex)
    this.gl.uniform1f(this.scaleLocation, this.config.scale)
    this.gl.uniform1f(this.brightnessLocation, this.config.brightness)
  }

  render () {
    // update ubiforms values
    this.gl.uniform1f(this.timeLocation, this.time)
    this.gl.uniform1f(this.brightnessLocation, this.config.brightness)
    // draw on canvas
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
  }

  onTick (delta) {
    this.time += 0.001
    this.render()
    this.texture.update()
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
