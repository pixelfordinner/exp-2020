///////////////////////////
// sunray vert Shader

attribute vec2 a_position;
varying vec2 vpos;
varying vec2 pos;

uniform vec2 u_resolution;
uniform float u_time;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
uniform sampler2D map;

void main() {

  // vec3 npos = a_position;
  // npos.x *= 1.5;
  // vpos = npos.xy * vec2(-1) + vec2(0.5);
  // vpos = a_position.xy * -.5 + vec2(.5);
  // a_position *= 2.;
  vpos = ((a_position.xy * 2.));

  // vpos = a_position.xy*2.;

  // float depth = texture2D(map,vpos.xy).r;

  // npos.z = 1.-sin(u_time+npos.y*npos.x*20.)*0.02;
  // float s = smoothstep( 0., 1., depth);
  // npos.xy *= .9*s;

  // npos.z = -depth*0.15;

  // gl_Position =  vec4(npos,1) * mWorld * mProj * mView;
  gl_Position = vec4(vpos.xy, 1, 1);
}
