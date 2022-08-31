import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


const loader = new GLTFLoader();
// Load a glTF resource
loader.load(
	// resource URL
	'/astro.glb',
	// called when the resource is loaded

    
	function ( gltf ) {

       const astro = gltf.scene;

		scene.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

        astro.rotation.y = Math.PI;

  }
	
);


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const pointLight = new THREE.PointLight(0xffffff);
 pointLight.position.set(0, 0, 0);

 const ambientLight = new THREE.AmbientLight(0xffffff);
 scene.add(pointLight, ambientLight);

var characterGeometry = new THREE.BoxGeometry( 2, 3,1);

var characterMaterial = new THREE.MeshBasicMaterial({
 color: 0xFFFFFF
});

var characterMesh = new THREE.Mesh(characterGeometry, characterMaterial);
characterMesh.add( camera );
characterMaterial.transparent = true 
characterMaterial.opacity = 0.1
scene.add(characterMesh)
characterMesh.position.y = 1.5;


const moonTexture = new THREE.TextureLoader().load('/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('/normal.jpg');

const moon = new THREE.Mesh(
new THREE.SphereGeometry(3, 32, 32),
new THREE.MeshStandardMaterial({
   map: moonTexture,
   normalMap: normalTexture,
})
);

scene.add(moon);
moon.position.z = -20;


const EarthTexture = new THREE.TextureLoader().load('/Earth.png');

const earth = new THREE.Mesh(
new THREE.SphereGeometry(3, 60, 60),
new THREE.MeshStandardMaterial({
   map: EarthTexture,
   normalMap: normalTexture,
})
);

scene.add(earth)

earth.position.z = -20;

earth.scale.set(4,4,4);

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);
    
    const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(300));
    
    star.position.set(x, y, z);
    scene.add(star);
    }
    
    Array(600).fill().forEach(addStar);
    
    const spaceTexture = new THREE.TextureLoader().load('space.jpg');
    scene.background = spaceTexture;
    
    camera.position.z = 12;
    
    var collidableObjects = [];
    collidableObjects.push(moon)
    collidableObjects.push(earth)

    const clock = new THREE.Clock()

const animate = function () {

  const elapsedTime = clock.getElapsedTime()


EarthTexture.magFilter = THREE.NearestFilter
moonTexture.magFilter = THREE.NearestFilter

  requestAnimationFrame( animate );

  renderer.render( scene, camera );
  update()

  moon.position.x = 25 * Math.sin(0.2 * elapsedTime)
  moon.position.y = 25 * Math.cos(0.2 * elapsedTime)

  moon.rotation.x += 0.005;
  earth.rotation.x += 0.005;


};

animate();

window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);

var keyboardEvent
var pressed = false;

var collided = 0;

function update() {

  if (pressed) {



    const moveDistance = 0.1

    if (  keyboardEvent.keyCode === 37 && collided !== 37)  {

      characterMesh.position.x -= moveDistance;
    }
    if (   keyboardEvent.keyCode === 39 && collided !== 39 )  {
      characterMesh.position.x += moveDistance;
    }
    if ( keyboardEvent.keyCode === 38 && collided !== 38) {
      characterMesh.position.z -= moveDistance;
    }
    if ( keyboardEvent.keyCode === 40 && collided !== 40) {
      characterMesh.position.z += moveDistance;
    }
    else if (keyboardEvent.keyCode === 32 && collided !== 32) {
      characterMesh.position.y -= moveDistance;

    }

  }

  collided = 0;

  var originPoint = characterMesh.position.clone();

      for (var vertexIndex = 0; vertexIndex < characterMesh.geometry.vertices.length; vertexIndex++)
      {
      var localVertex = characterMesh.geometry.vertices[vertexIndex].clone();

      var globalVertex = localVertex.applyMatrix4( characterMesh.matrix );

      var directionVector = globalVertex.sub( characterMesh.position );

      var raycast = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );

      var collisions = raycast.intersectObjects( collidableObjects );

      if (collisions.length > 0 && collisions[0].distance < directionVector.length()) {

          if (  keyboardEvent.keyCode === 37 )  {
              collided = 37;
          }
          if (   keyboardEvent.keyCode === 39 )  {
              collided = 39;
          }
          if ( keyboardEvent.keyCode === 38 ) {
              collided = 38;
          }
          if ( keyboardEvent.keyCode === 40 ) {
              collided = 40;
          }
          else if (keyboardEvent.keyCode === 32) {
              collided = 32;

          }

      }

      }



}


function onKeyUp(event) {

  pressed = false;
  keyboardEvent = event

}

function onKeyDown(event) {

  pressed = true;
  keyboardEvent = event


}  