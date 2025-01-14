import * as THREE from 'three';
import * as CANNON from 'cannon-es';

class Floor{
    constructor(scene, world){
        this.scene = scene;
        this.world = world;
        this.geometry = new THREE.PlaneGeometry(10000, 10000);
        this.material = new THREE.MeshStandardMaterial({color:'#480075'});
        this.floor = new THREE.Mesh(this.geometry, this.material);

        /* Physics */
        this.shape = new CANNON.Plane();
        this.body = new CANNON.Body({
            mass: 0,
            shape: this.shape
        });
        this.plastic = new CANNON.Material('plastic');
        this.contactMaterial = new CANNON.ContactMaterial(this.plastic, this.plastic, {friction: 0.1, restitution: 0.3});
    }
    initialize(){
        this.floor.receiveShadow = true;
        this.floor.position.y = 0;
        this.floor.rotation.x = -1*(Math.PI / 2);
        this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI / 2);

        this.scene.add(this.floor);
        this.world.addBody(this.body);
        this.world.addContactMaterial(this.contactMaterial);
    }
}

export default Floor;