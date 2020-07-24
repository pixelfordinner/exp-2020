//////////////////////////////////////////
// Ripple Effect Filter fragment shader //
//////////////////////////////////////////



varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float u_time;
//uniform bool nightmode;

void main() {
  vec2 uv = vTextureCoord;
  uv.y *= 1.5;
  float steps = (uv.y*3.);

uv.x += sin(u_time+ steps*20.)*steps*0.005;
 // uv.x += sin(u_time)*0.005;

  vec4 currentColor = texture2D(uSampler, uv);

  //vec3 newColor = vec3(1.+sin(stime)/2.,1.+cos(stime)/2.,1. + cos(vTextureCoord.x)*.5);

  //newColor = clamp(newColor, vec3(.01), vec3(.99));

  //vec3 c = currentColor.a > 0. ? newColor : vec3(0);
  gl_FragColor = currentColor ;
}

