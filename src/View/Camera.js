import * as THREE from 'three';
class Camera {
    constructor(scene) {
        this.scene = scene;
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
        this.targetCameraPosition = new THREE.Vector3();
        this.characterDirection = new THREE.Vector3(0, 0, -1);
    }
    initialize(position, lookAt){
        this.camera.position.copy(position);
        this.camera.lookAt(lookAt);
        this.scene.add(this.camera);
    }
    getCamera(){
        return this.camera;
    }
    updateMainCamera(mainCharacter){
        mainCharacter.character.getWorldDirection(this.characterDirection);
        this.targetCameraPosition.copy(mainCharacter.character.position);
        this.characterDirection.multiplyScalar(-4); 
        this.targetCameraPosition.add(this.characterDirection); 
        this.targetCameraPosition.y += 2; 
        this.camera.position.lerp(this.targetCameraPosition, 0.1); 
        this.camera.lookAt(mainCharacter.character.position);
    }
}
export default Camera;