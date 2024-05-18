precision highp float;

// Attributes are set per vertex by Babylon.js during draw calls to the GPU.
attribute vec3 position;

// Uniforms are defined and can be changed on runtime by the CPU.
uniform mat4 worldViewProjection;
uniform mat4 world;

// Varying values are created by the vertex shader and transmitted to the pixel shader.
varying vec3 pixelWorldPosition;

void main() {
    // It is required to set the position of the current vertex on the screen.
    gl_Position = worldViewProjection * vec4(position, 1.0);
    
    // We want to pass the pixel's position in world coordinates to the vertex shader.
    pixelWorldPosition = vec3(world * vec4(position, 1.0));
}