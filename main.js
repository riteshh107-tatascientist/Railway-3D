import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 6);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5,10,5);
scene.add(dirLight);

// Fog
scene.fog = new THREE.Fog(0x000000, 10, 50);

// Track
const trackGeo = new THREE.PlaneGeometry(200, 2);
const trackMat = new THREE.MeshStandardMaterial({ color: "gray" });
const track = new THREE.Mesh(trackGeo, trackMat);
track.rotation.x = -Math.PI / 2;
track.position.y = -1;
scene.add(track);

// 🚆 Train (Fallback + Model)
let train;

// Try loading real model
const loader = new GLTFLoader();
loader.load('./assets/train.glb', (gltf) => {
  train = gltf.scene;
  train.scale.set(1,1,1);
  scene.add(train);
}, undefined, () => {
  // fallback if model fails
  train = new THREE.Mesh(
    new THREE.BoxGeometry(2,1,4),
    new THREE.MeshStandardMaterial({ color: "red" })
  );
  scene.add(train);
});

// 🌌 Stars Background
const starsGeo = new THREE.BufferGeometry();
const starCount = 1000;

const starPos = new Float32Array(starCount * 3);
for(let i=0;i<starCount;i++){
  starPos[i*3] = (Math.random()-0.5)*100;
  starPos[i*3+1] = (Math.random()-0.5)*100;
  starPos[i*3+2] = (Math.random()-0.5)*100;
}
starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos,3));

const starsMat = new THREE.PointsMaterial({ size: 0.2 });
const stars = new THREE.Points(starsGeo, starsMat);
scene.add(stars);

// 🔊 Sound
const audio = new Audio('./assets/train.mp3');
audio.loop = true;
window.addEventListener('click', () => {
  audio.play().catch(()=>{});
});

// 🎬 Animation
function animate() {
  requestAnimationFrame(animate);

  track.position.z += 0.3;
  if(track.position.z > 10) track.position.z = 0;

  if(train){
    train.position.y = Math.sin(Date.now()*0.005)*0.05;
  }

  stars.rotation.y += 0.0005;

  renderer.render(scene, camera);
}
animate();

// 🎯 Scroll Animation
gsap.registerPlugin(ScrollTrigger);

gsap.to(camera.position, {
  z: 3,
  y: 1,
  scrollTrigger: {
    trigger: ".glass",
    start: "top center",
    end: "bottom center",
    scrub: true
  }
});

// 🎮 Control
window.addEventListener("keydown", (e)=>{
  if(train){
    if(e.key === "ArrowLeft") train.position.x -= 0.5;
    if(e.key === "ArrowRight") train.position.x += 0.5;
  }
});

// 🤖 Prediction
window.predict = () => {
  let delay = Math.random()*20;
  document.getElementById("result").innerText =
    delay < 5 ? "✅ On Time" : "⚠️ Delay: " + delay.toFixed(1) + " mins";
};