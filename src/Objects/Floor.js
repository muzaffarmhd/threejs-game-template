// import * as THREE from 'three';
// import * as CANNON from 'cannon-es';

// class Floor{
//     constructor(scene, world){
//         this.scene = scene;
//         this.world = world;
//         this.geometry = new THREE.PlaneGeometry(10000, 10000);
//         this.material = new THREE.MeshStandardMaterial({color:'#480075'});
//         this.floor = new THREE.Mesh(this.geometry, this.material);

//         /* Physics */
//         this.shape = new CANNON.Plane();
//         this.body = new CANNON.Body({
//             mass: 0,
//             shape: this.shape
//         });
//         this.plastic = new CANNON.Material('plastic');
//         this.contactMaterial = new CANNON.ContactMaterial(this.plastic, this.plastic, {friction: 0.1, restitution: 0.3});
//     }
//     initialize(){
//         this.floor.receiveShadow = true;
//         this.floor.position.y = 0;
//         this.floor.rotation.x = -1*(Math.PI / 2);
//         this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI / 2);

//         this.scene.add(this.floor);
//         this.world.addBody(this.body);
//         this.world.addContactMaterial(this.contactMaterial);
//     }
// }

// export default Floor;

import * as THREE from 'three';
import * as CANNON from 'cannon-es';

class Floor {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        
        // Create geometry
        this.geometry = new THREE.PlaneGeometry(10000,10000);
        
        // Create gradient texture
        const topLeft = new THREE.Color(0xff00ff);
        const topRight = new THREE.Color(0x0000ff);
        const bottomRight = new THREE.Color(0xff00ff);
        const bottomLeft = new THREE.Color(0x0000ff);
        
        const data = new Uint8Array([
            Math.round(bottomLeft.r * 255), Math.round(bottomLeft.g * 255), Math.round(bottomLeft.b * 255),
            Math.round(bottomRight.r * 255), Math.round(bottomRight.g * 255), Math.round(bottomRight.b * 255),
            Math.round(topLeft.r * 255), Math.round(topLeft.g * 255), Math.round(topLeft.b * 255),
            Math.round(topRight.r * 255), Math.round(topRight.g * 255), Math.round(topRight.b * 255)
        ]);

        const backgroundTexture = new THREE.DataTexture(data, 2, 2, THREE.RGBFormat);
        backgroundTexture.magFilter = THREE.LinearFilter;
        backgroundTexture.needsUpdate = true;

        // Create material with the gradient texture
        this.material = new THREE.MeshStandardMaterial({
            map: backgroundTexture,
            roughness: 0.65,
            metalness: 0.2
        });

        this.floor = new THREE.Mesh(this.geometry, this.material);

        /* Physics */
        this.shape = new CANNON.Plane();
        this.body = new CANNON.Body({
            mass: 0,
            shape: this.shape
        });
        this.plastic = new CANNON.Material('plastic');
        this.contactMaterial = new CANNON.ContactMaterial(
            this.plastic, 
            this.plastic, 
            {
                friction: 0.1, 
                restitution: 0.3
            }
        );
    }

    initialize() {
        this.floor.receiveShadow = true;
        this.floor.position.y = 0;
        this.floor.rotation.x = -Math.PI / 2;
        
        this.body.quaternion.setFromAxisAngle(
            new CANNON.Vec3(1, 0, 0), 
            -Math.PI / 2
        );
        
        this.scene.add(this.floor);
        this.world.addBody(this.body);
        this.world.addContactMaterial(this.contactMaterial);
    }
}

export default Floor;