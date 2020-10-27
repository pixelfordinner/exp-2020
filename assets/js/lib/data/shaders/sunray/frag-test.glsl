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

    float time = u_time ;

    vec2 pos = vpos * vec2(0.5,-.5) + vec2(.5);
    vec2 uv = vec2(pos -vec2(0.5) )*2.;

    vec4 dp =  texture2D(map,pos);
    vec2 displacement = u_mouse * dp.x *0.02   ;
   // uv += displacement;
       vec4 texture = texture2D(img,pos + displacement) ;

    float depthtexture =  texture2D(map,pos + displacement).x;
    float masktexture =  texture2D(map,pos + displacement).y;
    float lighttexture = texture2D(map, 0.2*vec2(cos(time)*0.2,.0) + pos + displacement).z ;
    float lighttexture2 = texture2D(map, vec2(cos(time)*0.2,.0) + pos + displacement).z ;

    lighttexture2 = 1. - (lighttexture2 + 1.-smoothstep(.0,.5,uv.y));
    lighttexture2 += max(0.,smoothstep(.0,.3,texture.b)) * 2.;
    lighttexture2 -= masktexture*2.;
    //lighttexture2 += smoothstep(.0,.3,texture.b);

    lighttexture2 -= length(uv.y);

   // lighttexture -= masktexture;
    lighttexture = 1.-lighttexture;
      lighttexture2 = max(0., lighttexture2);


    //vec4 texture =  texture2D(map,pos ).z;

  //  vec4 texture = texture2D(img,pos + displacement) ;

    vec4 final = texture  ;


  float depth = smoothstep (0.3, 0.7, depthtexture);
  float ground = smoothstep (0.25, 1., pow(depthtexture, 2.));



  //final = pow(final, 1.-vec4(ground)*.35);
  final = pow(final, vec4(1.13));




  float vigneting = smoothstep(0.7, 1.0, (length(length(.55*uv*uv) - vec2(0.))));

  final.xyz -= vigneting*0.06;
  final.xyz += vec3(.05,.01,.03);

  //final = pow( final, vec4(vec3(1.+(lighttexture*0.3), 1.));
  float lightfloor = lighttexture2 ;

 // lightfloor = lighttexture2 ;
  final += vec4(vec3(max(0.,lightfloor)),1.);


  //final = vec4(vec3(lighttexture+lighttexture2), 1.);



  gl_FragColor = final ;




  }
