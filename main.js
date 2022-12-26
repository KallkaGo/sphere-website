import * as THREE from 'three'
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

/*
* Scene
* */
const scene = new THREE.Scene()

/*
* Canvas
* */
const canvas = document.querySelector('canvas.webgl')

/*
* Geometry
* */
const geometry = new THREE.SphereGeometry(3, 64, 64)

/*
* material
* */
const material = new THREE.MeshStandardMaterial({
    color: '#00ff83',
    roughness:0.5
})

/*
* Mesh
* */
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Light
const light = new THREE.PointLight(0xffffff, 1.25, 100)
light.position.set(0, 10, 10)
scene.add(light)

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
scene.add(camera)

//Renderer

camera.position.z = 20
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha:true

})
renderer.setSize(sizes.width, sizes.height)
renderer.setClearAlpha(0)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5


// Resizes
window.addEventListener('resize', () => {
    // Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    //Update Camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    // update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

//Timeline magic
const t1 = gsap.timeline({defaults: {duration: 1,}})
t1.fromTo(mesh.scale, {z: 0, x: 0, y: 0}, {z: 1, x: 1, y: 1})
t1.fromTo('nav', {y: "-100%",}, {y: "0%"})
t1.fromTo('.title', {opacity: 0}, {opacity: 1})

// Mouse Animation color

let mouseDown = false
let rgb = [12, 23, 55]
window.addEventListener('mousedown', () => mouseDown = true)
window.addEventListener('mouseup', () => mouseDown = false)
window.addEventListener('mousemove', (e) => {
    if (mouseDown) {
        rgb = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255),
            150,
        ]
        //     let's animate
        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)

        gsap.to(mesh.material.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b
        })
    }

})


const clock = new THREE.Clock()
const loop = () => {
    // elapsed time
    const elapsedTime = clock.getElapsedTime()
    // update controls
    controls.update()
    // update renderer
    renderer.render(scene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(loop)
}

loop()



