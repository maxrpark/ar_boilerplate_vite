
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float uTime;
        uniform float uProgress;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

vec3 hash( vec3 p ) // replace this by something better
{
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
            dot(p,vec3(269.5,183.3,246.1)),
            dot(p,vec3(113.5,271.9,124.6)));

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec3 p )
{
  vec3 i = floor( p );
  vec3 f = fract( p );
	
	vec3 u = f*f*(3.0-2.0*f);

  return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                        dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                   mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                        dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
              mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                        dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                   mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                        dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
  }

  float fbm(vec3 p, int octaves, float persistence, float lacunarity) {
    float amplitude = 0.5;
    float frequency = 1.0;
    float total = 0.0;
    float normalization = 0.0;

    for (int i = 0; i < octaves; ++i) {
      float noiseValue = noise(p * frequency);
      total += noiseValue * amplitude;
      normalization += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    total /= normalization;

    return total;
  }        

void main(){
vec2 uv = vUv;
vec3 baseColor = vec3(1, 0.38, 0.27);
vec3 coords = vec3(uv *10., uProgress);

float noiseSample = 0.0;

noiseSample = remap(noise(coords), -1.0, 1.0, 0.0, 1.0);
float alpha = remap(uProgress, 0.0, 10.0, 0.0, 1.0) ; 
vec3 color = baseColor;

// Use noiseSample to reveal the underlying content based on uProgress
if (alpha < 1.0) {
    // color = mix(color, vec3(noiseSample), alpha);
    color = mix(color, mix(baseColor, vec3(1.0), noiseSample), alpha) ;
}

gl_FragColor = vec4(color,alpha);   
}