precision highp float;

// Uniforms are defined and can be changed on runtime by the CPU.
uniform float revealersCurrentCount;
uniform float revealersX[MAX_REVEALERS];
uniform float revealersZ[MAX_REVEALERS];
uniform float revealersRadius[MAX_REVEALERS];
uniform float mapSidelength;

// letying values were created by the vertex shader and are fetched in the fragment shader.
// They are also interpolated from the three calls made in the vertex shader.
letying vec3 pixelWorldPosition;

float getAlpha() {
    // Define some constants.
    float revealed_alpha = 0.0;
    float fow_alpha = 0.5;
    float soft_border_width = 3.0;
    
    // Calculate the alpha value.
    float ret_val = fow_alpha;
    for (int i = 0; i < MAX_REVEALERS; i++) {
        if (ret_val == revealed_alpha) {
            return ret_val;
        }
        float radius = revealersRadius[i];
        float dist = length(pixelWorldPosition.xz - vec2(revealersX[i], revealersZ[i]));
        float lower = radius - soft_border_width / 2.0;
        float upper = radius + soft_border_width / 2.0;
        if (dist <= radius) {
            if (dist <= lower) {
                ret_val = revealed_alpha;
            } else if (lower < dist && dist <= upper) {
                float dist_fraction = (dist - lower) / (upper - lower) * 2.0;
                float new_val = dist_fraction * (fow_alpha - revealed_alpha) + revealed_alpha;
                if (new_val < ret_val) {
                    ret_val = new_val;
                }
            } else {
                ret_val = fow_alpha;
            }
        }
    }
    return ret_val;
}

bool isInnerBorderLine(float mapBorderLineWidth, float mapBorderDashedWidth) {
    return (pixelWorldPosition.x > mapSidelength / 2.0 - 2.0 * mapBorderLineWidth - mapBorderDashedWidth) ||
           (pixelWorldPosition.x < -(mapSidelength / 2.0 - 2.0 * mapBorderLineWidth - mapBorderDashedWidth)) ||
           (pixelWorldPosition.z > mapSidelength / 2.0 - 2.0 * mapBorderLineWidth - mapBorderDashedWidth) ||
           (pixelWorldPosition.z < -(mapSidelength / 2.0 - 2.0 * mapBorderLineWidth - mapBorderDashedWidth));
}

bool isDashedBorderLine(float mapBorderLineWidth, float mapBorderDashedWidth) {
    return (pixelWorldPosition.x > mapSidelength / 2.0 - mapBorderLineWidth - mapBorderDashedWidth) ||
           (pixelWorldPosition.x < -(mapSidelength / 2.0 - mapBorderLineWidth - mapBorderDashedWidth)) ||
           (pixelWorldPosition.z > mapSidelength / 2.0 - mapBorderLineWidth - mapBorderDashedWidth) ||
           (pixelWorldPosition.z < -(mapSidelength / 2.0 - mapBorderLineWidth - mapBorderDashedWidth));
}

bool isOuterBorderLine(float mapBorderLineWidth, float mapBorderDashedWidth) {
    return (pixelWorldPosition.x > mapSidelength / 2.0 - mapBorderLineWidth) ||
           (pixelWorldPosition.x < -(mapSidelength / 2.0 - mapBorderLineWidth)) ||
           (pixelWorldPosition.z > mapSidelength / 2.0 - mapBorderLineWidth) ||
           (pixelWorldPosition.z < -(mapSidelength / 2.0 - mapBorderLineWidth));
}

// The output color of this pixel has to be written to gl_FragColor.
void main() {
    // Define some constants.
    float gray = 0.15;
    float gridSubdivisionFactor = 1.0;
    float mapBorderLineWidth = 0.025;
    float mapBorderDashedWidth = 0.1;
    
    // Calculate the output color.
    float checkerboardX = pixelWorldPosition.x * gridSubdivisionFactor - floor(pixelWorldPosition.x * gridSubdivisionFactor);
    float checkerboardZ = pixelWorldPosition.z * gridSubdivisionFactor - floor(pixelWorldPosition.z * gridSubdivisionFactor);
    if (pixelWorldPosition.x > mapSidelength / 2.0) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    } else if (isOuterBorderLine(mapBorderLineWidth, mapBorderDashedWidth)) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else if (isDashedBorderLine(mapBorderLineWidth, mapBorderDashedWidth)) {
        if (checkerboardX < 0.5 && checkerboardZ < 0.5 || checkerboardX > 0.5 && checkerboardZ > 0.5) {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        } else {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        }
    } else if (isInnerBorderLine(mapBorderLineWidth, mapBorderDashedWidth)) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        if (checkerboardX < 0.5 && checkerboardZ < 0.5 || checkerboardX > 0.5 && checkerboardZ > 0.5) {
            discard;
        }
        gl_FragColor.r = gray; 
        gl_FragColor.g = gray;
        gl_FragColor.b = gray;
        gl_FragColor.a = getAlpha();
    }
}