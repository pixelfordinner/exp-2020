///////////////////////////
// depth frag Shader

  precision highp float;

  varying vec2 vpos;
  varying vec2 pos;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;

  uniform sampler2D img;


  uniform sampler2D map;
    uniform sampler2D next_img;
  uniform sampler2D prev_img;

  // specifices uniforms

  uniform float isdepth;
  uniform float myindex;

  float isfading = 1.;

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
   // float n = noise(uv + vec2(0.,time));
  time*= 2.;
    uv.x += time;
    float nuv = fbm( uv );
    uv.x += nuv * 0.7 * fbm(uv + vec2(0., cos(time)*3.));
    uv.y -= nuv * 1.3 * fbm(4.+uv + vec2( sin(time)*3., 0.));

    float result = smoothstep(0.0, 0.99, fbm(uv));
    return result;


  }



  void main() {

    vec2 pos = vpos * vec2(0.5,-.5) + vec2(.5);



    vec2 displacement = u_mouse *  texture2D(map,pos).x * 0.02;
    // no displacement is isdepth condition is 0.
    // cf: isdepth_location in components/textures/image3d

    if ( isdepth < 0.5 || isfading > 0.) {
      displacement = vec2(0.0);
    }

    vec2 uv = pos + displacement;
    float time = u_time * 0.25 ;

    vec4 filter =  texture2D(map, pos + displacement);
    vec4 image = texture2D(img,pos + displacement) ;
    vec4 next_image = texture2D(next_img,pos ) ;

    float factor = abs(cos(time*20.));

    float transition = smoothstep(0.,1.,length(uv.x - factor));

    vec4 trans_img = mix(image,next_image,0.5);

    image = trans_img;




    float depth = filter.r;
    float mask  = filter.g;
    float mask2 = filter.b;

    //float particles = 1. -smoothstep(0.0,0.003, length(uv - ( vec2(0.5, 0.4)+0.02* vec2(cos(pos.x + time), sin(pos.y + time * 0.3))) ));

    vec4 color = image ;

    if( isfading > 0.){
// make light rays
    float rays =  3. * cos( time + uv.x * 5. - uv.y * 3.) * cos(-1. * time + uv.x * 10. - uv.y * 6.) + sin(time * 0.5 + uv.x * 100. - uv.y * 60.) * 2. * uv.y;
    rays = max(0. , rays);
    rays = min(1., rays);

    float lightrays = rays - mask ;
    lightrays -= smoothstep(0.5, .7, pos.x );
    lightrays -= smoothstep(0.0, .6,pos.y);

// make ground reflexions
    float glights = mask2 ;
    float period = cos(2.*time + (-1. + pos.x) * 5.) -1.;
    glights = 1. - glights ;
    glights -= mask;
    glights += image.b * 2.;
    // masking
    glights -= smoothstep (0.8, 0.0, pos.y);
    glights = max(0., glights + period) ;


// make foggy clouds
    float cloud = 1.-clouds(pos * 9., time);
     cloud += 1.-clouds(uv * 20., time)*0.7;
     cloud += 1.-clouds(uv * 100., time)*0.2;
     cloud /= 2.;
     cloud = pow(cloud, 3.);
     cloud -= 1.-clouds(uv * 5., time)*0.2;
    // masking
     cloud -= mask;
     float cmask = smoothstep( 0.0,0.6, length(uv.y - 0.6));
     //cloud -= cmask*4.;
     cloud = min(1., cloud);
     float resitant = cloud *0.25;
     cloud = max ( 0., cloud + period);
     cloud += resitant;

     cloud -= cmask*10.;
     cloud = max(cloud, 0.);
     cloud = min(cloud, 1.);

    // lighning effect
    color.xyz += max( 0., glights ) * vec3(0.9, 0.8, 0.7) *0.3;
    color.xyz += max( 0., lightrays ) * vec3(0.9, 0.8, 0.7) * 0.17;

    color.xyz += vec3(cloud)*0.15;

    // depth curves
    float focallight = smoothstep (0.5, 1.1, depth);
    color.xyz = pow( color.xyz , 0.6 * vec3( 1.7 * 1. - focallight));

    // vigneting
    float vigneting = smoothstep(0.7, 1.0, (length(length(.55 * uv * uv) - vec2(0.))));
    color.xyz -= vigneting * 0.06;
    }



    gl_FragColor = color ;
   // gl_FragColor =  vec4(vec3(cloud), 1.);

  }
