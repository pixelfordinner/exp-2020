///////////////////////////
// sunray frag Shader
///////////////////////////

precision highp float;

varying vec2 vpos;
varying vec2 pos;
uniform vec2 u_mouse;
uniform float u_time;

uniform sampler2D img_0;
uniform sampler2D map_0;


uniform sampler2D img_1;
uniform sampler2D map_1;

// specifices uniforms

uniform float u_progression;
uniform vec2 u_direction;
uniform float u_intensity;

uniform float u_fadetime;
uniform float u_fadespeed;



///// NOISE /////
float hash( float n ) {
  return fract(sin(n) * 43758.5453123);
}

float noise( in vec2 x ){
  vec2 p = floor(x);
  vec2 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float n = p.x + p.y * 57.0;
  return mix(mix( hash(n + 0.0), hash(n + 1.0), f.x), mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
}

////// FBM //////
mat2 m = mat2( 0.6, 0.6, -0.6, 0.8);

float fbm(vec2 p){
  float f = 0.0;
  f += 0.5000 * noise(p); p *= m * 2.02;
  f += 0.2500 * noise(p); p *= m * 2.03;
  f += 0.1250 * noise(p); p *= m * 2.01;
  f += 0.0625 * noise(p);
  f /= 0.9375;

  return f;
}

float clouds (vec2 uv, float time) {

  time*= 5.;
  uv.x += time;
  float nuv = fbm( uv );
  uv.x += nuv * 0.7 * fbm(uv + vec2(0., cos(time)*3.));
  uv.y -= nuv * 1.3 * fbm(4.+uv + vec2( sin(time)*3., 0.));

  float result = smoothstep(0.0, 0.99, fbm(uv));
  return result;
}

vec4 effect(vec2 uv, vec2 pos,float time,float mask, float mask2, vec4 image, vec4 color) {
  float rays =  3. * cos( time + uv.x * 5. - uv.y * 3.) * cos(-1. * time + uv.x * 10. - uv.y * 6.) + sin(time * 0.5 + uv.x * 100. - uv.y * 60.) * 2. * uv.y;
  rays = max(0. , rays);
  rays = min(1., rays);

  float lightrays = rays - mask;
  lightrays -= smoothstep(0.5, .7, pos.x );
  lightrays -= smoothstep(0.0, .6,pos.y);

  // make ground reflexions
  float glights = mask2;
  float period = cos(2.*time + (-1. + pos.x) * 5.) -1.;
  glights = 1. - glights;
  glights -= mask;
  glights += image.b * 3.;

  // masking
  glights -= smoothstep (0.8, 0.0, pos.y);
  glights = max(0., glights + period);


// make foggy clouds
  float cloud = 1.-clouds(pos * 9., time);
  cloud += 1.-clouds(uv * 20., time)*0.7;
  cloud += 1.-clouds(uv * 100., time)*0.2;
  cloud /= 2.;
  cloud = pow(cloud, 3.);
  cloud -= 1.-clouds(uv * 5., time)*0.2;

  // masking
  cloud -= mask*2.;
  float cmask = smoothstep( 0.0,0.6, length(uv.y - 0.6));
  cloud -= cmask*4.;
  cloud = min(1., cloud);
  float resitant = cloud *0.25;
  cloud = max ( 0., cloud + period);
  cloud += resitant;
  cloud = max(cloud, 0.);
  cloud = min(cloud, 1.);

  // lighning effect
  color.xyz += max( 0., glights ) * vec3(0.9, 0.8, 0.7) *0.2;
  color.xyz += max( 0., lightrays ) * vec3(0.9, 0.8, 0.7) * 0.15;
  color.xyz += vec3(cloud)*0.1;

  float vigneting = smoothstep(0.7, 1.0, (length(length(.55 * uv * uv) - vec2(0.))));

  color.xyz -= vigneting * 0.07;

  color = pow(color, vec4(1.05));
  return color;
}

void main() {

  vec2 pos = vpos * vec2(0.5,-.5) + vec2(.5);
  float depth = texture2D(map_0,pos).r;
  float n_depth =  texture2D(map_1,pos).r;

  float time = u_time * 0.125;

  float fade = smoothstep(0.0, u_fadespeed, u_fadetime);

  float factor = u_progression;

  float final_depth = mix(depth, n_depth, factor) * fade;

  vec2 displacement = (.5 * u_mouse )  *  final_depth * vec2(u_intensity);
  vec2 uv = pos + displacement;


  float intensity = u_direction.y > 0. ?  0.05 * (1.- length(u_direction.x > 0. ? pos.x : pos.y)) : 0.05 * length(u_direction.x > 0. ? pos.x : pos.y);

  float displacement_out = factor * (final_depth * intensity);

  vec2 dir_out = vec2(u_direction.x <= 0. ? -displacement_out : 0., u_direction.x <= 0. ? 0.: -displacement_out);

  vec4 map =  texture2D(map_0, uv + dir_out);
  vec4 image =   texture2D(img_0,uv +dir_out);

  float displacement_in = (1.- factor) * (final_depth* intensity );

  vec2 dir_in = vec2(u_direction.x <= 0. ? -displacement_in : 0., u_direction.x <= 0.? 0. : -displacement_in);
  vec4 next_image = texture2D(img_1,uv + dir_in );

  vec4 next_map = texture2D(map_1, uv + dir_in);


  image = mix(image, next_image, factor);
  map = mix(map, next_map, factor);

  float mask = map.g;
  float mask2 = map.b;

  vec4 color = image;
  color = effect(uv,pos, time, mask, mask2, image, color);

  gl_FragColor = color;
}
