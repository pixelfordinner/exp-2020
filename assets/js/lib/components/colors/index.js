
import { Tools } from 'objects/tools/geometry'

export class ColorPalette {
  constructor (app, config = {}) {
    this.defaults = {
      nightMode: true,
      animate: true
    }
    this.app = app

    this.app.ticker.add(delta => this.onTick(delta))
    this.config = Object.assign(this.defaults, config)
    this.nightMode = this.config.nightMode
    this.setup()
  }

  setup () {
    this.time = 0
    this.nightVal = this.config.nightMode ? 1 : 0
    this.nightPos = 1
    this.depth = 0
    this.primaries = ['0xFDFAF2', '0x2C2037']
    this.complementaries = ['0xD8E6EE', '0x4A345F']
    this.secondaries = ['0xFF9E80', '0x62D7C9']
    this.tertiaries = ['0x62D7C9', '0xFF9E80']
    this.quaternary = '0x6754F3'

    // this.primary = this.getNightVal(this.primaries[0], this.primaries[1])
    // this.complementary = this.getNightVal(this.complementaries[0], this.complementaries[1])
    // this.secondary = this.getNightVal(this.secondaries[0], this.secondaries[1])
    // this.tertiary = this.getNightVal(this.tertiaries[0], this.tertiaries[1])
    this.setColors()
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
    const depthindex = Math.ceil(10 * Tools.smoothstep(zpos, 0, 1000))
    return this.constantDepthGradient[depthindex - 1]
  }

  getDepth (zpos) {
    return Tools.smoothstep(zpos, 2000, 0) //* Math.pow(this.nightVal, 100)
  }

  getConstantSmoothDepthColor (zpos) {
    const depthindex = Tools.smoothstep(zpos, 0, 1000)

    const c1 = this.toString(this.rgbToHex(this.interpolateColor(this.complementaries[1], this.quaternary, this.nightVal)))
    // const c2 = this.toString(this.rgbToHex(this.interpolateColor(this.complementaries[1], this.primaries[1], this.nightVal)))

    // return this.getGradient(this.primaries[1], this.quaternary, depthindex)
    return this.getGradient(this.primaries[1], c1, depthindex)
  }

  getSmoothgradientColor (zpos, col1, col2) {
    const depthindex = Tools.smoothstep(zpos, 0, 1000)
    return this.getGradient(col1, col2, depthindex)
  }

  getNightVal (col1, col2) {
    const depthindex = Tools.smoothstep(this.nightVal, 0.4, 0.6)
    return this.getGradient(col1, col2, depthindex)
  }

  setColors () {
    // this.nightVal = (1 + Math.sin(this.time)) / 2
    // this.nightPos = (1 + Math.sin(this.time * 2)) / 2

    // this.nightVal = 1 + Math.pow(Math.sin(this.time), 4) / 2
    // this.nightPos = 1 + Math.pow(Math.sin(this.time * 2), 4) / 2

    // this.nightPos = Math.pow(this.nightPos, 4)
    this.primary = this.getNightVal(this.primaries[0], this.primaries[1])
    // this.background = this.getNightVal(this.primaries[1], this.primaries[0])
    this.complementary = this.getNightVal(this.complementaries[0], this.complementaries[1])
    this.secondary = this.getNightVal(this.secondaries[0], this.secondaries[1])
    this.tertiary = this.getNightVal(this.tertiaries[0], this.tertiaries[1])
    this.app.renderer.backgroundColor = this.primary
    // console.log(this.nightVal)
  }

  animateNight () {
    this.nightVal = (1 + Math.sin(this.time)) / 2
    this.nightPos = (1 + Math.sin(this.time * 2)) / 2
  }

  onTick (delta) {
    this.time += 0.01
    // console.log(this.config.animate)

    if (this.config.animate) {
      this.animateNight()
      this.setColors()
    }
  }
}
