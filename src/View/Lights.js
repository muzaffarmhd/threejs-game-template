import * as THREE from 'three';

class Lights {
    constructor(scene){
        this.scene = scene;
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    }
    initialize(directionalLightPosition){
        this.directionalLight.position.copy(directionalLightPosition);
        this.scene.add(this.directionalLight, this.ambientLight);
    }
}

export { Lights };