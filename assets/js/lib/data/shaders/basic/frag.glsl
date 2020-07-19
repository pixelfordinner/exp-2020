///////////////////////////
// Iridescent color Shader

  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float index;
  uniform float scale;
  uniform float brightness;

  #define ROT(a) mat2(cos(a), sin(a), -sin(a), cos(a))

float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

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
    dd +=  noise(uv * scale);
    vec3 iri = exp( sin(vec3(2., 1.,4.) * (dd.yyx + dd.yxy - dd.xxy)) * vec3(.5));
    return normalize(iri) * brightness *0.8;
}

  void main() {

    vec2  p = (gl_FragCoord.xy - .5 * u_resolution)/u_resolution.y;

    p*= ROT((5. * u_time) + index);

    vec3 iri = iriGradient(p);

    // add grain
    // vec2 uv = (gl_FragCoord.xy - .5 * u_resolution)/u_resolution.y;
    // float n = noise(uv*260.);
    // iri -= pow(iri,vec3(n))/7.;
    // float hh = hash12(uv*5000.);
    // iri += pow(hh, 3.)*0.05;

    gl_FragColor = vec4(iri, 1);


  }
