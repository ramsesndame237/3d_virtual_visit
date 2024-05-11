import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);;
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
// const light = new THREE. PointLight(0xffffff); // soft white light
// light.position.set(-100,400,100);
// scene.add( light );
const light = new THREE.SpotLight(0xffffff,1,8,Math.PI / 8, 0);
light.position.set(0, 2, 2);
const helperLight = new THREE.SpotLightHelper( light);
scene.add(light, helperLight);
const light2 = new THREE.DirectionalLight(0xffffff,3);
light2.position.set(0, 4, 4);
const helperLight2 = new THREE.DirectionalLightHelper( light,3);
scene.add(light2, helperLight2);
scene.background = new THREE.Color(0xbfd1e5);

camera.position.z = 5;

const loader = new GLTFLoader()

// WINDOW RESIZE HANDLING
export function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

loader.load('/model/donnerbrunnen/scene.gltf', (gltf) => {
    const box = new THREE.Box3().setFromObject( gltf.scene );
    const center = box.getCenter( new THREE.Vector3() );
    gltf.scene.position.x += ( gltf.scene.position.x - center.x );
    gltf.scene.position.y += ( gltf.scene.position.y - center.y );
    gltf.scene.position.z += ( gltf.scene.position.z - center.z );
    scene.add(gltf.scene);
},undefined,function (error) {
    console.error(error);
})
const raycaster = new THREE.Raycaster(); // create once
const clickMouse = new THREE.Vector2();  // create once
const moveMouse = new THREE.Vector2();   // create once
let draggable;

function intersect(pos) {
    raycaster.setFromCamera(pos, camera);
    return raycaster.intersectObjects(scene.children);
}

window.addEventListener('click', event => {
    if (draggable != null) {
        console.log(`dropping draggable ${draggable.userData.name}`)
        draggable = null
        return;
    }

    // THREE RAYCASTER
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const found = intersect(clickMouse);
    if (found.length > 0) {
        if (found[0].object.userData.draggable) {
            draggable = found[0].object
            console.log(`found draggable ${draggable.userData.name}`)
        }
    }
})
const controls  = new OrbitControls(camera,renderer.domElement)
window.addEventListener('mousemove', event => {
    moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});





function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animate();