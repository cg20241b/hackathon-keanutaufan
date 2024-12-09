uniform float time;

void main() {
    // Glowing white effect
    float glow = 0.8 + 0.2 * sin(time * 2.0);
    gl_FragColor = vec4(vec3(1.0) * glow, 1.0);
} 