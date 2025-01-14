import * as THREE from 'three'
import {Sky} from 'three/examples/jsm/objects/Sky.js'
const sky = new Sky();
sky.scale.setScalar( 450000 );

const phi = THREE.MathUtils.degToRad( 90 );
const theta = THREE.MathUtils.degToRad( 180 );
const sunPosition = new THREE.Vector3().setFromSphericalCoords( 1, phi, theta );

sky.material.uniforms.sunPosition.value = sunPosition;
export {sky};