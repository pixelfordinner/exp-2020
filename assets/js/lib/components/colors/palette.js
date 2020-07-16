import { subtract } from 'gl-vec4'
import { Tools } from 'objects/tools/geometry'

export class ColorPalette {
  constructor (app, config = {}) {
    this.defaults = {
      nightMode: true
    }
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))

    this.config = Object.assign(this.defaults, config)
    this.nightMode = this.config.nightMode
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

    this.quaternary = '6754F3'

    this.depthGradient = this.getGradientPalette(this.complementary, this.primary, 10)
    this.constantDepthGradient = this.getGradientPalette(this.complementary, this.primaries[0], 10)
    console.log(this.constantDepthGradient)
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

  getGradientPalette (col1, col2, steps) {
    const tons = [steps]
    for (let i = 0; i < steps; i++) {
      tons[i] = this.toString(this.rgbToHex(this.interpolateColor(col1, col2, i / steps)))
    }
    return tons
  }

  getDepthColor (zpos) {
    const depthindex = Math.ceil(Tools.map(zpos, 0, 1000, 0, 10))
    return this.depthGradient[depthindex]
  }

  animate () {
  }

  onTick (delta) {
    this.time += 0.01
  }
}
