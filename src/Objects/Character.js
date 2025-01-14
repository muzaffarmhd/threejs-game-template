import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/loaders/GLTFLoader.js';
const gltfLoader = new GLTFLoader();
class Character{
    constructor(scene){
        //Creating the character
        this.geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        this.material = new THREE.MeshStandardMaterial({color:'purple'});
        // gltfLoader.load('./static/Vehicles/GLTF/Spaceship_FernandoTheFlamingo.gltf',(gltf) => {
        gltfLoader.load('./static/Character/scene.gltf',(gltf) => {
            this.mesh = gltf.scene;
            console.log(gltf.animations);
            this.mesh.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;  // Let the mesh cast shadows
                    // node.receiveShadow = true;  // Optionally, let it receive shadows
                }
            });
            this.addAnimation(gltf.animations);
            // this.mesh.scale.set(0.01,0.01,0.01);
            scene.add(this.mesh);
        });
        this.followerLight = new THREE.PointLight('pink',0.6);
        this.followerLight.position.set(0,2,0);
        this.followerLight.castShadow = true;
        scene.add(this.followerLight);
    }
    addAnimation(animation){
        this.mesh.animations = animation;
        this.mixer = new THREE.AnimationMixer(this.mesh);
        this.mixer.clipAction(this.mesh.animations[0]).play();
    }
    getCharacter(){
        return this.characterMesh;
    }

}

class CharacterPhysics{
    constructor(world){
        this.shape = new CANNON.Box(new CANNON.Vec3(2,0.5,2));
        this.body = new CANNON.Body({
            mass: 100,
            position: new CANNON.Vec3(0, 0, 0),
            shape: this.shape
        });
        this.body.angularDamping = 0.7;
        this.body.linearDamping = 0.7;
        this.currentState = 'idle';
        world.addBody(this.body);

        // Movement
        this.velocity = 10;
        this.targetQuaternion = new THREE.Quaternion();
        this.rotationAxis = new THREE.Vector3(0, 1, 0);
    }   
    UpdateState(state){
        this.currentState = state;
    }
    UpdatePosition(direction, camera, deltaTime, movement, handler){
        if (this.currentState !== 'speed') {
            this.velocity = 8;
        } else {
            this.velocity = 13;
        }
        camera.getWorldDirection(direction);
        if (handler.space){
            direction.y=3;
        } else {
            direction.y = 0;
        }
        direction.normalize();
        switch (movement){
            case 'backward':
                direction.x*=-1;
                direction.z*=-1;
                break;
            case 'left':
                direction.applyAxisAngle(this.rotationAxis, Math.PI / 4); // Rotate 90 degrees to the left
                break;
            case 'right':
                direction.applyAxisAngle(this.rotationAxis, -Math.PI / 4); // Rotate 90 degrees to the right
                break;
            case 'forward':
            default:
                break;
        }
        const rotation = Math.atan2(direction.x, direction.z);
        this.targetQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
        this.targetQuaternion = new THREE.Quaternion().setFromAxisAngle(this.rotationAxis, rotation);
        let currentQuaternion = new THREE.Quaternion(
            this.body.quaternion.x,
            this.body.quaternion.y,
            this.body.quaternion.z,
            this.body.quaternion.w
        );
        // Step 2: Slerp towards the target quaternion
        currentQuaternion.slerp(this.targetQuaternion, 0.1); // Adjust 0.1 as needed
        // Step 3: Update the Cannon.js body's quaternion with the interpolated value
        this.body.quaternion.set(
            currentQuaternion.x,
            currentQuaternion.y,
            currentQuaternion.z,
            currentQuaternion.w
        );
        let cannonDirection = new CANNON.Vec3(direction.x, direction.y, direction.z);
        let scaledDirection = new CANNON.Vec3().copy(direction);
        cannonDirection.scale(this.velocity * deltaTime, scaledDirection);
        this.body.position.vadd(scaledDirection, this.body.position);
        camera.position.addScaledVector(direction, this.velocity * deltaTime);
        this.body.velocity.set(0, 0, 0);
        this.body.angularVelocity.set(0,0,0);
    }
        
}

class CharacterFire extends Character{
    constructor(scene, world){
        super(scene);
        this.fire = new THREE.PointLight(0xff0000, 1, 100);
        this.fire.position.set(0, 0, 0);
        this.firebody = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(0, 0, 0),
            shape: new CANNON.Sphere(0.1)
        });
        scene.add(this.fire);
    }

}


export { Character, CharacterPhysics };