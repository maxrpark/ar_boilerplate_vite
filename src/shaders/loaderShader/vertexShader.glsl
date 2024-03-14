varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

float PI = 3.141592653589793;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    
    // gl_Position = projectedPosition;

    gl_Position = vec4(position, 1.0);


    vUv = uv;
    vNormal = (modelMatrix * vec4(normal,0)).xyz;
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
}