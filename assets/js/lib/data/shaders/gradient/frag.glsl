
////////////////////////
// Gradient Shader
////////////////////////


  precision highp float;


  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 start_color;
  uniform vec3 end_color;
  uniform float mix_value;
  uniform float fade_value;
  uniform float vertical_mode;



  void main() {

    vec3 cs = start_color / vec3(255);
    vec3 ce = end_color /  vec3(255);
    vec2 res = u_resolution;
    vec2 uv = gl_FragCoord.xy / res;

    vec3 finalColor = vertical_mode > 0. ? mix(ce, cs, length(uv.y)) : mix(ce, cs, length(uv.x));
    if(fade_value > 0.0){
      finalColor = mix(ce, finalColor, mix_value);
    }
    gl_FragColor = vec4(finalColor, 1);


  }
