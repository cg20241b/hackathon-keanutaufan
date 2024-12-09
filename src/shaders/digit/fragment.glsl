uniform vec3 baseColor;
uniform float ambientIntensity;
uniform vec3 lightPosition;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vLightPosition;

void main() {
    // Ambient
    vec3 ambient = baseColor * ambientIntensity;
    
    // Diffuse
    vec3 lightDir = normalize(vLightPosition - vViewPosition);
    float diff = max(dot(vNormal, lightDir), 0.0);
    vec3 diffuse = diff * baseColor;
    
    // Specular (Metallic)
    vec3 viewDir = normalize(vViewPosition);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 64.0);
    vec3 specular = baseColor * spec; // Use base color for metallic look
    
    vec3 finalColor = ambient + diffuse + specular;
    gl_FragColor = vec4(finalColor, 1.0);
} 