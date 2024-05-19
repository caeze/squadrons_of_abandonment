precision highp float;

// Samplers
varying vec2 vUV;
uniform sampler2D textureSampler;

// Parameters
uniform float time;
uniform vec2 center;

void main(void) {
    // Define the effect parameters.
    float ellipticity = 3.0;
    float effectStrength = 200.0;
    float torusDiameter = 1.2;
    float effectTorusWidth = 0.05;
    float effectReductionOverTimeFactor = 500.0;
    
    // Get the uv coordinates to work with.
    vec2 uv = vUV.xy;
    
    // Store the original color.
    vec4 c = texture2D(textureSampler, uv);
    
    // Measure the distance to the center.
    float dist = distance(uv, center);

    if (time > 0.0 && time < 1.0 && time - effectTorusWidth <= dist && dist <= time + effectTorusWidth) {
        // The pixel offset distance is based on the input parameters.
        float diff = (dist - time);
        float diffPow = (1.0 - pow(abs(diff * effectStrength), torusDiameter));
        float diffTime = (diff  * diffPow);

        // Calculate the direction of the distortion.
        vec2 dir = normalize(uv - center);
        
        // Perform the distortion and reduce the effect over time.
        uv += ((dir * diffTime) / (time * dist * effectReductionOverTimeFactor));
        
        // Grab color for the new coord
        c = texture2D(textureSampler, uv);
    }

    gl_FragColor = c;
}
