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



  void main() {

    vec2 pos = vpos * vec2(0.5,-.5) + vec2(.5);
  //  pos *=.99;

    vec4 dp =  texture2D(map,pos);
    vec2 mm = u_mouse ;

    vec2 displacement = u_mouse * dp.x *0.02   ;

   // vec2 uv2 = pos;



    vec4 filter =  texture2D(map,pos + displacement);

    float depth = filter.r;
    float mask = filter.g;
    float lmask = filter.b;




    vec2 uv = pos + displacement;

    float time = u_time*0.6 ;

    float pattern =  3.*cos(time+ uv.x * 5.- uv.y *3.) * cos(-1.*time+ uv.x * 20.- uv.y *12.)+sin(time*0.5+ uv.x*100. - uv.y *60.) * 2. * uv.y;



    pattern = max(0. , pattern);
    pattern = min(1., pattern);

   // float pattern2 =  3.*cos(time+ uv.x * 5.) * 2. * uv.y;

   // float dd =  cos( time+ uv.x + uv.y * 5.) ;
   // pattern += dd;

    float pattern2 =  cos(time+ uv.x * 5.)  ;
    pattern2 = max(0. , pattern2);
    pattern2 = min(1., pattern2);

    pattern2 -= mask;

    //float mask = 1.- filter.x * 2.;

    float light = pattern - mask ;


   // light -= cos(time + pos.x * 5.)+1. *0.5;
      // light = max(0. , light);
    light -= smoothstep(0.5, .7, pos.x );

    light -= smoothstep(0.0, .6,pos.y);

   // light -= cos(time + pos.x + pos.y * 5.) + 1. /2.;

    //float groundlight = smoothstep(0.9,0.0, length( 20.*uv2 - vec2(10)));




    vec4 texture = texture2D(img,pos + displacement) ;

  //  float masktexture =  texture2D(map,pos + displacement).y;

   // float depthtexture =  texture2D(map,pos + displacement).x;


    float glights = lmask ;

    glights = 1. - glights ;
    glights -= mask;
    glights += texture.b * 2.;
    //glights = max(0., glights);

    //glights = max(0., glights + cos(time + pos.x * 5.) -1.) ;
     glights = max(0., glights + pattern2 -1.) ;

   // glights = max(0., glights + sin(time + pos.x * .5) -1.) ;
    glights -= smoothstep (0.8, 0.0, pos.y);


    vec3 effect = vec3( glights );

    float focallight = smoothstep (0.3, 1.3, depth);
    float vigneting = smoothstep(0.7, 1.0, (length(length(.55*uv*uv) - vec2(0.))));



    vec4 final = texture ;





    // lighning effect

    final.xyz += max( 0., glights ) * vec3(0.9, 0.8, 0.7) *0.3;
    final.xyz +=  max( 0., light ) * vec3(0.9, 0.8, 0.7) * 0.14;

    final.xyz = pow( final.xyz , 0.7* vec3( 1.7 * 1. - focallight));


  //final.xyz += max( 0., 0.2 * lights + pattern2 ) * 0.5;
    final.xyz -= vigneting*0.06;

    gl_FragColor = final ;

    //gl_FragColor = vec4(vec3(light+glights), 1.);





  }
