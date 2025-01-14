import * as THREE from 'three';
import * as CANNON from 'cannon-es';
const plastic = new CANNON.Material('plastic');
const plastic_plastic = new CANNON.ContactMaterial(plastic, plastic, {friction: 0.1, restitution: 0.3});
class Ground{
    constructor(scene){
        //Creating the ground
        this.geometry = new THREE.PlaneGeometry(10000, 10000);
        this.material = new THREE.MeshStandardMaterial({color:'#ea42fc'});
        this.ground = new THREE.Mesh(this.geometry, this.material);
        this.ground.receiveShadow = true;
        this.ground.rotation.x = -1*(Math.PI / 2);
        this.ground.position.y = 0;
        scene.add(this.ground);
    }
    getShader(which){
        //Purple pink and dark purple shader
    }
}

class GroundPhysics{
    constructor(world){
        this.groundShape = new CANNON.Plane();
        this.groundBody = new CANNON.Body({
            mass: 0,
            shape: this.groundShape
        });
        this.groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI / 2);
        world.addContactMaterial(plastic_plastic);
        world.addBody(this.groundBody);
    }
}

export { Ground, GroundPhysics };