///////////////////////////
// Wind Vertex Shader
///////////////////////////

attribute vec2 a_position;
varying vec2 vpos;
varying vec2 pos;





void main() {

  vpos = a_position.xy;
  gl_Position = vec4(vpos.xy, 1, 1);
}
