import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//import * as dat from 'dat.gui'
import { PointLight } from 'three'

// Loading
const textureLoader = new THREE.TextureLoader()
const textureLoader2 = new THREE.TextureLoader()
const normalTexture = textureLoader.load('/textures/circuits_normal2.jpeg')
const particleTexture = textureLoader2.load('/textures/sad_pepe.png')

// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry(0.5, 64, 64)
const particleGeometry = new THREE.BufferGeometry;
const particleCount = 5000;
const posArray = new Float32Array(particleCount * 3)

for(let i = 0; i < (particleCount * 3); i++) {
    posArray[i] = (Math.random() - 0.5) * 5
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

// Materials

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.normalMap = normalTexture;
material.color = new THREE.Color(0x292929)

const particleMaterial = new THREE.PointsMaterial({
    size: 0.01,
    map: particleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending
})



// Mesh
const sphere = new THREE.Mesh(geometry,material)
const particlesMesh = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particlesMesh, sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0x77ff, 2)
pointLight2.position.set(-10, -10, -1)
pointLight2.intensity = 5
scene.add(pointLight2)
/*
const light1 = gui.addFolder('Light 1')

light1.add(pointLight2.position, 'x').min(-10).max(10).step(0.01)
light1.add(pointLight2.position, 'y').min(-10).max(10).step(0.01)
light1.add(pointLight2.position, 'z').min(-10).max(10).step(0.01)
light1.add(pointLight2, 'intensity').min(0).max(15).step(0.01)

//const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1)
//scene.add(pointLightHelper)

const light1Color = {
    color: 0xff00ff
}
light1.addColor(light1Color, 'color')
    .onChange(() => {
        pointLight2.color.set(light1Color.color)
    })*/

const pointLight3 = new THREE.PointLight(0xff00ff, 2)
pointLight3.position.set(10, 10, -1)
pointLight3.intensity = 5
scene.add(pointLight3)
/*
const light2 = gui.addFolder('Light 2')

light2.add(pointLight3.position, 'x').min(-10).max(10).step(0.01)
light2.add(pointLight3.position, 'y').min(-10).max(10).step(0.01)
light2.add(pointLight3.position, 'z').min(-10).max(10).step(0.01)
light2.add(pointLight3, 'intensity').min(0).max(15).step(0.01)
const light2Color = {
    color: 0xff00ff
}
light2.addColor(light2Color, 'color')
    .onChange(() => {
        pointLight3.color.set(light2Color.color)
    })
*/
//const pointLightHelper2 = new THREE.PointLightHelper(pointLight3, 1)
//scene.add(pointLightHelper2)

/**
 * Sizes
 */
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
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
 //const controls = new OrbitControls(camera, canvas)
 //controls.enableDamping = true

//controls = new THREE.TrackballControls( camera );
//controls.target.set( 0, 0, 0 )
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    //alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#21282a'), 1)

/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0
let mouseY = 0

let particleMouseX = 0
let particleMouseY = 0

let newX = 0
let newY = 0


let targetX = 0
let targetY = 0

const windowX = window.innerWidth / 2
const windowY = window.innerHeight / 2

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowX)
    mouseY = (event.clientY - windowY)

    particleMouseX = event.clientX
    particleMouseY = event.clientY
}

window.addEventListener('scroll', updateSphere)

function updateSphere(event) {
    sphere.position.y = window.scrollY * 0.001
}

const clock = new THREE.Clock()

const tick = () =>
{
    targetX = mouseX * 0.001
    targetY = mouseY * 0.001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = -.2 * elapsedTime
    particlesMesh.rotation.y = -0.01 * elapsedTime
    
    sphere.rotation.y += 0.5 * (targetX - sphere.rotation.y)
    sphere.rotation.x += 0.5 * (targetY - sphere.rotation.x)
    sphere.position.z += -1 * (targetY - sphere.rotation.x)

    
    //if(newX != particleMouseX || newY != particleMouseY) {
        particlesMesh.rotation.x = - mouseY * elapsedTime * 0.00008
        particlesMesh.rotation.y = mouseX * elapsedTime * 0.00008
    //}
    newX = particleMouseX
    newY = particleMouseY

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()