
////////////////////////
// clound Shader
////////////////////////


  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_color;
  uniform float u_steps;
  uniform float u_type;


  float hash(float p)
{
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

float noise ( vec2 uv){

  vec2 p = floor(uv);
  vec2 f = fract(uv);
  f = f*f*(3.0-2.0*f);
  float n = p.x + p.y*57.0;
  return mix(mix( hash(n + 0.0), hash(n + 1.0), f.x), mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);

}
  void main() {


    vec2  uv = gl_FragCoord.xy /u_resolution;
    float size = u_steps;
    vec2 id = ceil(uv*size);
    uv = fract(uv * size) - 0.5;
    vec3 fcolor = u_color / 255.;
    float type = u_type;
    float n = noise(id);

    n = smoothstep(.995, 1., n);

    if(type == 1.){
    n -= smoothstep(size, 0., id.y);
    }
   if(n>0.)n += 0.1*cos(0.1*u_time*id.x+id.y*33.33);

    gl_FragColor = vec4(fcolor*vec3(n), n);
  }
