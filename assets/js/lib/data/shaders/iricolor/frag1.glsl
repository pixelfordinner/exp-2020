
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float stime;


void main() {

  vec4 currentColor = texture2D(uSampler, vTextureCoord);
  // based on bigtimebuddy replaceColor Filter fragent shader

  vec3 newColor = vec3(1.+sin(stime)/2.,1.+cos(stime)/2.,1. + cos(vTextureCoord.x)*.5);

  //newColor = clamp(newColor, vec3(.1), vec3(1.));

  vec3 colorDiff = newColor - (currentColor.rgb / max(currentColor.a, 0.000000001));
  float colorDistance = length(colorDiff);
  float epsilon = 2.;
  float doReplace = step(colorDistance, epsilon);
  //float doReplace = smoothstep(0.0000000001, .1, currentColor.a);
  gl_FragColor = vec4(mix(currentColor.rgb, (newColor + colorDiff) * currentColor.a, doReplace), currentColor.a);


  //simplest way
  // vec3 c = currentColor.a != 0.0 ? vec3(1.,cos(stime),cos(currentColor.g)) : vec3(0);
  // gl_FragColor = vec4(c,currentColor.a) ;
}

