import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 300 });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const debugObjects = {
  skyColor: 0xff0000,
  groundColor: 0x0000ff,
};
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("rgb(255, 243, 70)", 0.3);
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(
  debugObjects.skyColor,
  debugObjects.groundColor,
  0.3
);
scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

/**
 * Rect Area Light can only work with MeshStandardMaterial and MeshPhysicalMaterial
 */
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

const spotLight = new THREE.SpotLight(
  0x78ff00,
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

gui.add(ambientLight, "intensity", 0, 1, 0.001).name("Ambient Light intensity");
gui
  .add(directionalLight, "intensity", 0, 1, 0.001)
  .name("directional Light intensity");
gui
  .add(hemisphereLight, "intensity", 0, 1, 0.001)
  .name("hemisphere Light intensity");

const pointLightFolder = gui.addFolder("Point Light");
pointLightFolder.add(pointLight, "intensity", 0, 1, 0.001);
pointLightFolder.add(pointLight, "distance", 1, 10, 0.01);
pointLightFolder.add(pointLight, "decay", 0, 10, 0.001);

const rectAreaLightFolder = gui.addFolder("RectArea Light");
rectAreaLightFolder.add(rectAreaLight, "intensity", 0, 10, 0.001);
rectAreaLightFolder.add(rectAreaLight, "width", 1, 10, 0.001);
rectAreaLightFolder.add(rectAreaLight, "height", 1, 10, 0.001);

const spotLightFolder = gui.addFolder("Spot Light");
spotLightFolder.add(spotLight, "intensity", 0, 1, 0.001);
spotLightFolder.add(spotLight, "distance", 1, 100, 1);
spotLightFolder.add(spotLight, "angle", 0, Math.PI / 2, 0.001);
spotLightFolder.add(spotLight, "penumbra", 0, 1, 0.001);
spotLightFolder.add(spotLight, "decay", 0, 4, 0.01);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
