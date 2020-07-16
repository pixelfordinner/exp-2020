// import { IriShader } from 'components/shader/iri'
import { basicShader } from 'components/shader/basic'

import { mat4 } from 'gl-matrix'

export class ShaderTexture {
  constructor (app, config = {}) {
    this.defaults = {
      program: new basicShader(app),
      width: 600,
      height: 600

    }

    this.app = app
    this.config = Object.assign(this.defaults, config)
    this.width = this.config.width
    this.height = this.config.height
    // console.log(this.width + ' ' + this.height)
    // this.texture = new PIXI.BaseTexture()
    this.time = 0
    this.app.ticker.add(delta => this.onTick(delta))
    this.program = this.config.program
    // this.program = new basicShader(this.app)

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

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)

    // fill it with a 2 trianthis.gles that cover clip space
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, // first triangle
      1, -1,
      -1, 1,
      -1, 1, // second triangle
      1, -1,
      1, 1
    ]), this.gl.STATIC_DRAW)

    this.resolutionLocation = this.gl.getUniformLocation(this.shader, 'u_resolution')
    this.timeLocation = this.gl.getUniformLocation(this.shader, 'u_time')
    // requestAnimationFrame(this.render)
  }

  render () {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)

    // Tell it to use our program (pair of shaders)
    this.gl.useProgram(this.shader)

    // Turn on the attribute
    this.gl.enableVertexAttribArray(this.positionAttributeLocation)

    // Bind the position buffer.
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    this.gl.vertexAttribPointer(
      this.positionAttributeLocation,
      2, // 2 components per iteration
      this.gl.FLOAT, // the data is 32bit floats
      false, // don't normalize the data
      0, // 0 = move forward size * sizeof(type) each iteration to get the next position
      0 // start at the beginning of the buffer

    )

    // look up uniform locations
    // this.resolutionLocation = this.gl.getUniformLocation(this.shader, 'u_resolution')
    // this.timeLocation = this.gl.getUniformLocation(this.shader, 'u_time')

    this.gl.uniform2f(this.resolutionLocation, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.uniform1f(this.timeLocation, this.time)

    this.gl.drawArrays(
      this.gl.TRIANGLES,
      0, // offset
      6 // num vertices to process
    )
    // requestAnimationFrame(this.render)
    // this.onTick(this.render)
    // this.texture = new PIXI.Texture.from(this.canvas)
  }

  onTick (delta) {
    this.time += 0.001
    console.log(this.time)
    requestAnimationFrame(this.render)
    this.render()
    // this.render()

    // this.texture.destroy()
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
