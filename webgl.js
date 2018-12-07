const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util').random;
const palettes = require('nice-color-palettes')

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true }
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('#fff', 1);

  // Setup a camera (degrees, aspect ratio, near value, far value)
  const camera = new THREE.OrthographicCamera(45, 1, 0.01, 100);

  // Setup your scene
  const scene = new THREE.Scene();

  const palette = random.pick(palettes);
  const box = new THREE.BoxGeometry(1, 1, 1)
  const meshes = []
  for (let i = 0; i < 30; i += 1) {
    const mesh = new THREE.Mesh(
      box,
      new THREE.MeshStandardMaterial({
        color: random.pick(palette),
      })
    );
    mesh.position.set(
      random.range(-1, 1), random.range(-1, 1), random.range(-1, 1),
    )
    mesh.scale.set(
      random.range(-1, 1), random.range(-1, 1), random.range(-1, 1),
    )
    mesh.scale.multiplyScalar(0.5)
    scene.add(mesh);
    meshes.push(mesh);
  }

  scene.add(new THREE.AmbientLight('#cfcfcf'))
  const light = new THREE.DirectionalLight('#fff', 1);
  light.position.set(-1, 0, 4)
  scene.add(light)

  // draw each frame
  return {
    // Handle resize events here
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);

      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 1.5;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render ({ time }) {
      for (let i = 0; i < 30; i += 1) {
        meshes[i].rotation.y = time * (15 * Math.PI / 180);
      }

      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload () {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
