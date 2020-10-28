///////////////////////////
// wind frag Shader

  precision highp float;

  varying vec2 vpos;
  varying vec2 pos;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;

  uniform sampler2D img_0;
  uniform sampler2D map_0;


  uniform sampler2D img_1;
  uniform sampler2D map_1;

  // specifices uniforms

  uniform float isdepth;
  uniform float myindex;
  uniform float u_progression;

  float isfading = 0.;



  vec4 effect( vec2 uv, vec4 color){

    float vigneting = smoothstep(0.7, 1.0, (length(length(.55 * uv * uv) - vec2(0.))));
    color.xyz -= vigneting * 0.07;
    color = pow(color, vec4(1.05));
    return color;
  }



  void main() {

    vec2 pos = vpos * vec2(0.5,-.5) + vec2(.5);

    float depth = texture2D(map_0,pos).r;
    float n_depth =  texture2D(map_1,pos).r;
    float factor = u_progression;
    float final_depth = mix(depth, n_depth, factor);
    vec2 displacement = (.5 * u_mouse ) *  final_depth * vec2(0.02, 0.022);

    vec2 uv = pos + displacement  ;


    float mask = texture2D(map_0,uv).g;
    float n_mask = texture2D(map_1,uv).g;

    float mask2 = texture2D(map_0,uv).b;
    float n_mask2 = texture2D(map_1,uv).b;

    float time = u_time * 0.25;
    float force = smoothstep(0.0, .25, time)*0.0025;

    vec2 wind = vec2(force * cos(20.*time+ uv.x * 20.), 0.);
    wind *= 1.-mask2;
    wind *= 1.-mask;
  wind = max(vec2(-0.0025),wind);

wind = min(vec2(0.0025),wind);

    vec2 uv2 = pos + displacement + wind;

    float intensity = 0.05;

    float displacement_out = factor * ( 2.*length(   uv.y ) *final_depth * intensity );
    vec4 filter =  texture2D(map_0, uv + vec2(0.,-displacement_out ));
    vec4 image =   texture2D(img_0,uv2 + vec2(0.,-displacement_out )) ;

    float displacement_in = (1.- factor) * (2.*length(   uv.y ) * final_depth* intensity );
    vec4 next_image = texture2D(img_1,uv + vec2(0., -displacement_in ) ) ;
    vec4 next_filter = texture2D(map_1, uv2 + vec2(0., -displacement_in )) ;

    image = mix(image, next_image, factor);
    filter = mix(filter, next_filter, factor);

   // vec4 color = vec4(wind.x*20.,0.,0.,1.);
    vec4 color = image;
    color = effect(uv, color);

    gl_FragColor = color;

  }
