import { subtract } from 'gl-vec4'
import { Tools } from 'objects/tools/geometry'

export class ColorPalette {
  constructor (app, config = {}) {
    this.defaults = {
      nightMode: true,
      nightVal: 0.9
    }
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))
    this.config = Object.assign(this.defaults, config)

    this.nightMode = this.config.nightMode
    this.nightVal = this.config.nightVal

    this.setup()
  }

  setup () {
    this.time = 0
    this.primaries = ['0xFDFAF2', '0x2C2037']
    this.complementaries = ['0xD8E6EE', '0x4A345F']
    this.secondaries = ['0xFF9E80', '0x62D7C9']
    this.tertiaries = ['0x62D7C9', '0xFF9E80']

    this.primary = !this.config.nightMode ? this.primaries[0] : this.primaries[1]
    this.complementary = !this.config.nightMode ? this.complementaries[0] : this.complementaries[1]
    this.secondary = this.config.nightMode ? this.secondaries[0] : this.secondaries[1]
    this.tertiary = this.config.nightMode ? this.tertiaries[0] : this.tertiaries[1]
    this.quaternary = '0x6754F3'

    this.depthGradient = this.getGradientSteps(this.complementary, this.primary, 10)
    this.constantDepthGradient = this.config.nightMode
      ? this.getGradientSteps(this.complementaries[1], this.primaries[1], 10)
      : this.getGradientSteps(this.primaries[1], this.complementaries[0], 10)
    console.log(this.constantDepthGradient)

    // this.primary = this.getNightVal(this.primaries[0], this.primaries[1])
  }

  toHex (string) {
    const newstring = string.replace('0x', '#')
    return newstring
  }

  toString (string) {
    const newstring = string.replace('#', '0x')
    return newstring
  }

  hexToRgb (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null
  }

  rgbToHex (rgb) {
    return '#' + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)
  }

  interpolateColor (col1, col2, factor) {
    const rgb1 = this.hexToRgb(this.toHex(col1))
    const rgb2 = this.hexToRgb(this.toHex(col2))
    if (arguments.length < 3) factor = 0.5
    const result = rgb1.slice()
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (rgb2[i] - rgb1[i]))
    }
    return result
  }

  getGradientSteps (col1, col2, steps) {
    const tons = [steps]
    for (let i = 0; i < steps; i++) {
      tons[i] = this.toString(this.rgbToHex(this.interpolateColor(col1, col2, i / steps)))
    }
    return tons
  }

  getGradient (col1, col2, flow) {
    const tone = this.toString(this.rgbToHex(this.interpolateColor(col1, col2, flow)))

    return tone
  }

  getDepthColor (zpos) {
    const depthindex = Math.ceil(Tools.remap(zpos, 0, 500, 0, 10))
    return this.depthGradient[depthindex]
  }

  getConstantDepthColor (zpos) {
    // zpos = Math.min(zpos, 400)
    const depthindex = Math.ceil(10 * Tools.smoothstep(zpos, 0, 1000))

    // console.log('depthindex: ' + depthindex)

    return this.constantDepthGradient[depthindex - 1]
  }

  getConstantSmoothDepthColor (zpos) {
    // zpos = Math.min(zpos, 400)
    const depthindex = Tools.smoothstep(zpos, 0, 1000)

    // console.log('depthindex: ' + depthindex)
    const col1 = this.primary
    const col2 = this.se

    return this.getGradient(this.primaries[1], this.complementaries[1], depthindex)
  }

  getSmoothgradientColor (zpos, col1, col2) {
    const depthindex = Tools.smoothstep(zpos, 0, 1000)
    return this.getGradient(col1, col2, depthindex)
  }

  getNightVal (col1, col2) {
    const depthindex = Tools.smoothstep(this.nightVal, 0, 1)
    return this.getGradient(col1, col2, depthindex)
  }

  animate () {
    // console.log(this.nightVal)
    this.nightVal = (1 + Math.cos(this.time)) / 2

    this.primary = this.getNightVal(this.primaries[0], this.primaries[1])
    this.app.renderer.backgroundColor = this.primary
    // console.log(this.nightVal)
  }

  onTick (delta) {
    this.time += 0.01
    // this.animate()
  }
}
