import { Tools } from 'objects/tools/geometry'
import { CloudShader } from 'components/shader/cloud'
// import { ColorPalette } from 'components/colors'
// import { SunComponent } from '../../sun'
// import {  } from "module";

export class CloudShadingTexture {
  constructor (app, config = {}) {
    this.defaults = {
      program: new CloudShader(app),
      width: 100,
      height: 100,
      type: 'cloud',
      u_color: '0x000000',
      steps: 10
    }

    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))
    this.config = Object.assign(this.defaults, config)
    this.c1 = this.config.palette.hexToRgb(this.config.palette.toHex(this.config.u_color))

    console.log(this.rgb1)

    this.width = this.config.width
    this.height = this.config.height
    this.time = 0
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
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, // first triangle
      1, -1,
      -1, 1,
      -1, 1, // second triangle
      1, -1,
      1, 1
    ]), this.gl.STATIC_DRAW)

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.useProgram(this.shader)
    this.gl.enableVertexAttribArray(this.positionAttributeLocation)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
    this.gl.vertexAttribPointer(
      this.positionAttributeLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    )
    // set uniforms locations here
    this.resolutionLocation = this.gl.getUniformLocation(this.shader, 'u_resolution')
    this.timeLocation = this.gl.getUniformLocation(this.shader, 'u_time')
    this.colorLocation = this.gl.getUniformLocation(this.shader, 'u_color')
    this.stepsLocation = this.gl.getUniformLocation(this.shader, 'u_steps')
    this.typeLocation = this.gl.getUniformLocation(this.shader, 'u_type')
    this.render()
  }

  render () {
    // update uniforms here
    this.gl.uniform2f(this.resolutionLocation, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.uniform1f(this.timeLocation, this.time)
    this.gl.uniform1f(this.stepsLocation, this.config.steps)
    this.gl.uniform1f(this.typeLocation, this.config.type)
    this.gl.uniform3f(this.colorLocation, this.c1[0], this.c1[1], this.c1[2])
    this.gl.drawArrays(
      this.gl.TRIANGLES,
      0,
      6
    )
  }

  onTick (delta) {
    this.time += 0.01
    this.render()
    this.texture.update()
  }

  initShaderProgram (gl, vsSource, fsSource) {
    const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource)
    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
      return null
    }
    return shaderProgram
  }

  loadShader (gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }
    return shader
  }
}
