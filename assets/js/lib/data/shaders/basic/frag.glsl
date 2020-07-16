
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float index;


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

  vec3 iriGradient (vec2 uv){
    vec2 dd = uv;
    dd +=  noise(uv*5.);
    vec3 iri = exp( sin(vec3(2., 1.,4.) * (dd.yyx + dd.yxy - dd.xxy)) * vec3(.5));
    //iri = pow(iri, vec3(.9));
    return normalize(iri)*1.4;
}

  void main() {
    vec2 uv = vec2(1.);
    uv.x += cos(u_time)+5.;
    vec2  p = (gl_FragCoord.xy - .5 * u_resolution)/u_resolution.y;
    p.x += index + u_time;
    vec3 iri = iriGradient(p);
   // gl_FragColor = vec4(vec3(fract( u_time),0.,0.), 1);
    gl_FragColor = vec4(iri, 1);


  }
