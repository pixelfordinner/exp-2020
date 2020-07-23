import { LeafClusterComponent, PalmComponent } from 'components/leafcluster'

import { StarComponent } from 'components/star'
import { BeachComponent } from 'components/beach'
import { SunComponent } from 'components/sun'
import { MontainComponent } from 'components/montain'
import { OceanComponent } from 'components/ocean'
import { ButterflyComponent } from 'components/butterfly'
import { PalmTreeComponent } from 'components/palmtree'
import { MoonComponent } from 'components/moon'

export class HomeComposition {
  constructor (app, config = {}) {
    this.defaults = {

    }
    this.config = Object.assign(this.defaults, config)
    this.time = 0
    this.app = app
    this.app.ticker.add(delta => this.onTick(delta))

    this.parent = this.config.parent
    this.bounds = this.parent.bounds

    this.background = new PIXI.projection.Container3d()
    this.background.zIndex = 100
    const stars = new StarComponent(app, { parent: this.background, palette: this.parent.palette })
    // const moon = new MoonComponent(app, { parent: this.background, palette: this.parent.palette, x: 200, y: 0, z: 0, size: 1 })

    // const sun = new SunComponent(app, { parent: this.background, palette: this.parent.palette, x: 0, y: 0, z: 0, size: 5 })
    // this.parent.camera.addChild(this.background)
    this.app.stage.addChild(this.background)
    const leaf = new LeafClusterComponent(app, { x: this.bounds.maxWidth / 2 - 200, y: this.bounds.maxHeight / 1.7, z: 100, parent: this.parent })
    const leaf2 = new LeafClusterComponent(app, { x: this.bounds.maxWidth / 2 - 200, y: this.bounds.maxHeight / 1.0, z: 500, parent: this.parent })
    const leaf3 = new LeafClusterComponent(app, { x: this.bounds.maxWidth / 2 + 800, y: this.bounds.maxHeight / 1.2, z: 400, parent: this.parent })
    const leaf4 = new LeafClusterComponent(app, { x: -this.bounds.maxWidth / 4, y: this.bounds.maxHeight / 1.2, z: 200, parent: this.parent })

    // const palm = new PalmTreeComponent(app, { x: -this.bounds.maxWidth / 2, y: this.bounds.maxHeight / 1.6, z: 500, parent: this.parent })

    const butterfly = new ButterflyComponent(app, { parent: this.parent, anchor: leaf })
    const beach = new BeachComponent(app, { parent: this.parent, x: 0, y: 0, z: 10 })
    const sun = new SunComponent(app, { parent: this.parent, x: 7200, y: 5000, z: 9000, size: 50 })
    // const sun = new SunComponent(app, { parent: this.parent, x: 0, y: 0, z: 0, size: 10 })
    const montains = new MontainComponent(app, { parent: this.parent, x: 3050, y: -1150, z: 2100 })
    const ocean = new OceanComponent(app, { parent: this.parent, z: 3500 })
  }

  onTick (delta) {
    this.time++
  }
}
