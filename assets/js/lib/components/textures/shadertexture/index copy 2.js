import { IriShader } from 'components/shader/iri'
import { mat4 } from 'gl-matrix'

export class ShaderTexture {
  constructor (app, config = {}) {
    this.defaults = {
      width: 1000,
      height: 1000
    }
    this.app = app
    this.config = Object.assign(this.defaults, config)
    this.time = 0
    this.app.ticker.add(delta => this.onTick(delta))
    this.program = new IriShader(this.app).program
    // this.program = this.program.program

    // this.canvas = document.createElement('canvas')

    const canvas = document.createElement('canvas')
    //  const canvas = document.querySelector('#canvas')

    // c.width = width
    // c.height = height
    this.gl = canvas.getContext('webgl')
    if (!this.gl) {
      return
    }

    // this.gl = this.initWebGLContext(canvas, this.config.width, this.config.height)
    this.fragment = this.program.fragmentSrc
    this.vertex = this.program.vertexSrc

    this.shader = this.initShaderProgram(this.gl, this.vertex, this.fragment)
    this.positionAttributeLocation = this.gl.getAttribLocation(this.shader, 'a_position')
    // const program = webglUtils.createProgramFromSources(this.gl, [this.vertex, this.fragment])

    this.programInfo = {
      program: this.shader,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(this.shader, 'aVertexPosition')
      },
      uniformLocations: {
        projectionMatrix: this.gl.getUniformLocation(this.shader, 'uProjectionMatrix'),
        modelViewMatrix: this.gl.getUniformLocation(this.shader, 'uModelViewMatrix')
      }
    }
    this.buffers = this.initBuffers(this.gl)
    console.log(app.renderer)

    // const mat4 = require('gl-matrix')
    this.drawScene(this.gl, this.programInfo, this.buffers)
    // transform to PIXI texture

    // this.texture = new PIXI.BaseTexture(this.gl)
    // this.texture = new PIXI.GlTexture(this.gl)
    this.texture = new PIXI.Texture.from(canvas)
    // this.texture = new PIXI.glCore.GlTexture.fromSource(this.canvas)

    console.log(this.texture)

    this.g = new PIXI.Graphics()
    this.g.beginTextureFill(this.texture)
    this.g.drawRect(0, 0, 100, 100)
    this.g.endFill()

    this.app.stage.addChild(this.g)

    // console.log(programInfo)
  }

  onTick (delta) {
    this.time++
  }

  initWebGLContext (c, width, height) {
    // const c = document.createElement('canvas')
    c.width = width
    c.height = height

    const gl = c.getContext('webgl', {
      antialias: false,
      depth: false
    })

    // console.log(gl)

    return gl
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
    console.log(shaderProgram)

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

  initBuffers (gl) {
    // Create a buffer for the square's positions.

    const positionBuffer = gl.createBuffer()

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // Now create an array of positions for the square.

    const positions = [
      -1.0, 1.0,
      1.0, 1.0,
      -1.0, -1.0,
      1.0, -1.0
    ]

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.

    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array(positions),
      gl.STATIC_DRAW)

    return {
      position: positionBuffer
    }
  }

  drawScene (gl, programInfo, buffers) {
    // const mat4 = require('gl-matrix')

    gl.clearColor(0.0, 0.0, 1.0, 1.0) // Clear to black, fully opaque
    gl.clearDepth(1.0) // Clear everything
    // gl.enable(gl.DEPTH_TEST) // Enable depth testing
    // gl.depthFunc(gl.LEQUAL) // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 45 * Math.PI / 180 // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
    const zNear = 0.1
    const zFar = 100.0
    const projectionMatrix = mat4.create()

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
      fieldOfView,
      aspect,
      zNear,
      zFar)

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create()

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to translate
      [-0.0, 0.0, -6.0]) // amount to translate

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.

    const numComponents = 1 // pull out 2 values per iteration
    const type = gl.FLOAT // the data in the buffer is 32bit floats
    const normalize = false // don't normalize
    const stride = 0 // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0 // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset)
    // gl.enableVertexAttribArray(
    //   programInfo.attribLocations.vertexPosition)

    // Tell WebGL to use our program when drawing

    gl.useProgram(programInfo.program)

    // Set the shader uniforms

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix)
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix)

    {
      const offset = 0
      const vertexCount = 4
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
    }
  }
}
