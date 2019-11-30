import * as PIXI from 'pixi.js'

import { AvatarComponent } from 'components/avatar'

const app = new PIXI.Application({
  view: document.getElementById('canvas'),
  width: window.innerWidth,
  heigth: window.innerHeight
})

// Components

new AvatarComponent(app)
