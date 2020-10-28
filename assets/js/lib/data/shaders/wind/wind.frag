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

  ///// NOISE /////
// float hash( float n ) {

//     return fract(sin(n) * 43758.5453123);
// }

// float noise( in vec2 x ){
//     vec2 p = floor(x);
//     vec2 f = fract(x);
//     f = f * f * (3.0 - 2.0 * f);
//     float n = p.x + p.y * 57.0;
//     return mix(mix( hash(n + 0.0), hash(n + 1.0), f.x), mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
// }

// ////// FBM //////
// mat2 m = mat2( 0.6, 0.6, -0.6, 0.8);
// float fbm(vec2 p){

//     float f = 0.0;
//     f += 0.5000 * noise(p); p *= m * 2.02;
//     f += 0.2500 * noise(p); p *= m * 2.03;
//     f += 0.1250 * noise(p); p *= m * 2.01;
//     f += 0.0625 * noise(p);
//     f /= 0.9375;

//     return f;
// }



  // float clouds (vec2 uv, float time) {
  //  // float n = noise(uv + vec2(0.,time));
  //   time*= 5.;
  //   uv.x += time;
  //   //uv.y += time*0.2;
  //   float nuv = fbm( uv );
  //   uv.x += nuv * 0.7 * fbm(uv + vec2(0., cos(time)*3.));
  //   uv.y -= nuv * 1.3 * fbm(4.+uv + vec2( sin(time)*3., 0.));

  //   float result = smoothstep(0.0, 0.99, fbm(uv));
  //   return result;


  // }

  vec4 effect( vec2 uv, vec4 color){




    // lighning effect
    //color.xyz += max( 0., glights ) * vec3(0.9, 0.8, 0.7) *0.2;
   // color.xyz += max( 0., lightrays ) * vec3(0.9, 0.8, 0.7) * 0.15;
    //color.xyz += vec3(cloud)*0.1;


    float vigneting = smoothstep(0.7, 1.0, (length(length(.55 * uv * uv) - vec2(0.))));




    color.xyz -= vigneting * 0.07;

    color = pow(color, vec4(1.05));

    return color;
  }



  void main() {

    vec2 pos = vpos * vec2(0.5,-.5) + vec2(.5);

    float depth = texture2D(map_0,pos).r;
    float n_depth =  texture2D(map_1,pos).r;

    float mask = texture2D(map_0,pos).g;
    float n_mask = texture2D(map_1,pos).g;

    float mask2 = texture2D(map_0,pos).b;
    float n_mask2 = texture2D(map_1,pos).b;

 float factor = u_progression;
    float time = u_time * 0.25 ;

    //float force = 0.0025;

    float force = smoothstep(0.0, .25, time)*0.0025;

    vec2 wind = vec2(force * cos(20.*time+ pos.x * 20.), 0.);
    wind *= 1.-mask2;
    wind *= 1.-mask;

    //wind -= n_mask;
   // wind *= 0.3;

    //float factor = u_progression;
    //wind = mix( wind, vec2(0.), vec2(factor));
   // wind = smoothstep( wind,vec2(0.) vec2(factor));

   // factor = smoothstep(0.0, 1.0, factor);
    float final_depth = mix(depth, n_depth, factor);

    //vec2 wind = vec2(cos(time+pos*2), 0);

    vec2 displacement = u_mouse  *  final_depth * vec2(0.015, 0.015);
    // displacement = min(displacement, displacement*u_progression);
    vec2 uv = pos + displacement  + wind ;
    float intensity = 0.05;

    float displacement_out = factor * ( 2.*length(   uv.y ) *final_depth * intensity );
    vec4 filter =  texture2D(map_0, uv + vec2(0.,-displacement_out ));
    vec4 image =   texture2D(img_0,uv + vec2(0.,-displacement_out )) ;

    float displacement_in = (1.- factor) * (2.*length(   uv.y ) * final_depth* intensity );
    vec4 next_image = texture2D(img_1,uv + vec2(0., -displacement_in ) ) ;
    vec4 next_filter = texture2D(map_1, uv + vec2(0., -displacement_in )) ;


    image = mix(image, next_image, factor);
    filter = mix(filter, next_filter, factor);


  vec4 color = image;
    //vec4 color = filter;

    color = effect(uv, color);
    // if( color.b+color.g+color.b * 0.33 > 0.6){
    //   color += 0.1*( cos(time*4.)*0.5 +0.5);
    // }
    //color += vec4(.3,0.,0.,0.);

    gl_FragColor = color;




  }
