const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  context: 'webgl',
  animate: true
};

// Your glsl code
const frag = glsl(`
  precision highp float;

  uniform float time;
  uniform float aspect;
  varying vec2 vUv;

  // for noise
  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

  void main () {
    // now doing noise
    vec2 center = vUv - 0.5;
    center.x *= aspect;
    float dist = length(center);

    float n = noise(vec3(center * 1.0, 0.5));
    vec3 color = hsl2rgb(
      1.0 + n * 0.25,
      0.25 + n * 0.1,
      0.8 - n * 0.5
    );
    float opacity = smoothstep(0.251, 0.25, dist);

    gl_FragColor = vec4(color, opacity);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    clearColor: 'white',
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
      aspect: ({ width, height }) => width / height
    }
  });
};

canvasSketch(sketch, settings);
