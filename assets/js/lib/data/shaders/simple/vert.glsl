attribute vec4 a_position;
uniform vec2 u_resolution;
  // all shaders have a main function
  void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = a_position;
  }
