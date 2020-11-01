///////////////////////////
// Wind Frag Shader
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


vec4 effect(vec2 uv, vec4 color) {
  float vigneting = smoothstep(0.7, 1.0, (length(length(.55 * uv * uv) - vec2(0.))));
  color.xyz -= vigneting * 0.07;
  color = pow(color, vec4(1.05));
  return color;
}

void main() {
  vec2 pos = vpos * vec2(0.5, -.5) + vec2(.5);
  float depth = texture2D(map_0, pos).r;
  float n_depth = texture2D(map_1, pos).r;
  float factor = u_progression;
  float final_depth = mix(depth, n_depth, factor);
  vec2 displacement = (.5 * u_mouse) * final_depth * vec2(u_intensity);

  vec2 uv = pos + displacement;

  float mask = texture2D(map_0, uv).g;
  float n_mask = texture2D(map_1, uv).g;

  float mask2 = texture2D(map_0, uv).b;
  float n_mask2 = texture2D(map_1, uv).b;

  float time = u_time * 0.25;

  float force = smoothstep(0.0, .25, time) * 0.0025;


  vec2 wind = vec2(force * cos(20. * time + uv.x * 20.), 0.);
  wind *= 1. - mask2;
  wind *= 1. - mask;
  wind = max(vec2(-0.0025), wind);
  wind = min(vec2(0.0025), wind);

  vec2 uv2 = pos + displacement + wind;



  vec2 orientation =  vec2(0,1);

  float intensity = u_direction.y > 0. ?  0.05 * (1.- length(u_direction.x > 0. ? pos.x : pos.y)) : 0.05 * length(u_direction.x > 0. ? pos.x : pos.y);

  float displacement_out = factor * (final_depth * intensity);

  vec2 dir_out = vec2(u_direction.x > 0. ? -displacement_out : 0., u_direction.x > 0. ? 0.: -displacement_out);

  vec4 map =  texture2D(map_0, uv + dir_out);
  vec4 image =   texture2D(img_0,uv2 +dir_out);

  float displacement_in = (1.- factor) * (final_depth* intensity );

  vec2 dir_in = vec2(u_direction.x > 0. ? -displacement_in : 0., u_direction.x > 0.? 0. : -displacement_in);
  vec4 next_image = texture2D(img_1,uv2 + dir_in );

  vec4 next_map = texture2D(map_1, uv + dir_in);

  image = mix(image, next_image, factor);
  map = mix(map, next_map, factor);


  vec4 color = image;


  color = image;
  color = effect(uv, color);

  gl_FragColor = color;
}
