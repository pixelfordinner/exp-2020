
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float stime;
//uniform bool nightmode;

void main() {

  vec4 currentColor = texture2D(uSampler, vTextureCoord);

  vec3 newColor = vec3(1.+sin(stime)/2.,1.+cos(stime)/2.,1. + cos(vTextureCoord.x)*.5);

  newColor = clamp(newColor, vec3(.01), vec3(.99));

  vec3 c = currentColor.a > 0. ? newColor : vec3(0);
  gl_FragColor = vec4(c,currentColor.a) ;
}

