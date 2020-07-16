
  precision highp float;
  uniform vec2 u_resolution;



  void main() {

    vec2  uv = (gl_FragCoord.xy - .5 * u_resolution.xy)/u_resolution.y;


  }
