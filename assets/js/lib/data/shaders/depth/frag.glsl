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

    vec4 dp =  texture2D(map,pos);
    vec2 displacement = u_mouse * dp.x *0.015 ;

    //gl_FragColor = texture2D(img,vpos + u_mouse * 0.1 * dp);
     gl_FragColor = texture2D(img,pos + displacement);

     // gl_FragColor = vec4(vpos.xy,1,1);
    //gl_FragColor = vec4(vec3(depth),vpos );


  }
