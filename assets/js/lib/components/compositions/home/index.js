import { LeafClusterComponent } from 'components/leafcluster'
import { CloudComponent } from 'components/cloud'
import { BeachComponent } from 'components/beach'
import { SunComponent } from 'components/sun'
import { MontainComponent } from 'components/montain'
import { OceanComponent } from 'components/ocean'
import { ButterflyComponent } from 'components/butterfly'

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

    const leaf = new LeafClusterComponent(app, { x: this.bounds.maxWidth / 2 - 200, y: this.bounds.maxHeight / 2, z: 100, parent: this.parent })
    const leaf2 = new LeafClusterComponent(app, { x: this.bounds.maxWidth / 2 - 200, y: this.bounds.maxHeight / 1.5, z: 500, parent: this.parent })
    const leaf3 = new LeafClusterComponent(app, { x: this.bounds.maxWidth / 2 + 800, y: this.bounds.maxHeight / 1.6, z: 400, parent: this.parent })
    const leaf4 = new LeafClusterComponent(app, { x: -this.bounds.maxWidth / 4, y: this.bounds.maxHeight / 1.6, z: 200, parent: this.parent })

    const butterfly = new ButterflyComponent(app, { parent: this.parent, anchor: leaf })
    const cloud = new CloudComponent(app, { parent: this.parent })
    const beach = new BeachComponent(app, { parent: this.parent, x: 0, y: 0, z: 10 })
    const sun = new SunComponent(app, { parent: this.parent, x: 4200, y: 2000, z: 3000 })
    const montains = new MontainComponent(app, { parent: this.parent, x: 300, y: 0, z: 900 })
    const ocean = new OceanComponent(app, { parent: this.parent, z: 2000 })

    // const cloud = new CloudComponent(app, { palette: palette, parent: scene.scene })
  }

  onTick (delta) {
    this.time++
  }
}
