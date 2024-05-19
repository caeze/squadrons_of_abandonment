precision highp float;

// Attributes are set per vertex by Babylon.js during draw calls to the GPU.
attribute vec3 position;

// Uniforms are defined and can be changed on runtime by the CPU.
uniform mat4 worldViewProjection;

// It is required to write the position of the current vertex on the screen to gl_Position.
void main() {
    // Write the position of the current vertex on the screen.
    gl_Position = worldViewProjection * vec4(position, 1.0);
}