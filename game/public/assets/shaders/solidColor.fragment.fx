precision highp float;

// Uniforms are defined and can be changed on runtime by the CPU.
uniform float color[4];

// The output color of this pixel has to be written to gl_FragColor.
void main() {
    gl_FragColor.r = color[0]; 
    gl_FragColor.g = color[1];
    gl_FragColor.b = color[2];
    gl_FragColor.a = color[3];
}