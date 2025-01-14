import * as THREE from 'three';
import * as CANNON from 'cannon-es';

class MainCharacter{
    constructor(scene, world, gltfLoader, textureLoader){
        this.scene = scene;
        this.world = world;
        this.gltfLoader = gltfLoader;
        this.textureLoader = textureLoader;
        this.character = null;
        this.mixer = null;
        this.followerLight = null;
        this.currentState = null;

        /* Initializing the physics of the character */
        this.shape = null;
        this.body = null;

        /* Movement */
        this.velocity = 10;
        this.targetQuaternion = new THREE.Quaternion();
        this.rotationAxis = new THREE.Vector3(0, 1, 0);
        this.rotation = null;
        this.cannonDirection = new CANNON.Vec3();
        this.scaledDirection = new CANNON.Vec3();

        this.currentQuaternion = new THREE.Quaternion();
    }
    initialize(path, position){
        this.currentState = 'Walk';
        /* Init Mesh */
        this.gltfLoader.load(path,(gltf) => {
            this.character = gltf.scene;
            this.character.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                }
            });
            this.addAnimation(gltf.animations);
            this.character.position.copy(position);
            this.character.rotation.y = Math.PI;
            this.scene.add(this.character);
            /* Init Physics */
            //initializing box according to bounding box of the character
            const box3 = new THREE.Box3().setFromObject(this.character);
            const size = new THREE.Vector3();
            box3.getSize(size); 
            const halfExtents = new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2);
            this.shape = new CANNON.Box(halfExtents);
            this.body = new CANNON.Body({
                mass: 50,
                position: new CANNON.Vec3(position.x, position.y, position.z),
                quaternion: new CANNON.Quaternion().copy(this.character.quaternion),
                shape: this.shape,
                linearDamping: 0.9,
                angularDamping: 0.9
            });
            this.world.addBody(this.body);
            this.bullet = new CANNON.Body({
                mass: 60,
                shape: new CANNON.Sphere(0.3),
              //   position: new CANNON.Vec3(this.body.position.x, this.body.position.y+0.2, this.body.position.z),
              });
            this.bulletMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32),
            new THREE.MeshStandardMaterial({ color: '#4bffff', emissive: '#4bffff', emissiveIntensity: 1 })
            );
            // this.scene.add(this.bulletMesh);
            this.world.addBody(this.bullet);
            // this.followerLight = new THREE.PointLight('pink',0.1);
            // this.followerLight.castShadow = true;
            // this.scene.add(this.followerLight);
        });

    }
    addAnimation(animation){
        this.character.animations = animation;
        this.mixer = new THREE.AnimationMixer(this.character);
        this.mixer.clipAction(this.character.animations[0]).play();
    }
    moveCharacter(direction, camera, deltaTime, movement, handler, speed=false){
        if (speed){
            this.velocity = 13;
        } else {
            this.velocity = 8;
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
                direction.applyAxisAngle(this.rotationAxis, Math.PI / 8); // Rotate 90 degrees to the left
                break;
            case 'right':
                direction.applyAxisAngle(this.rotationAxis, -Math.PI / 8); // Rotate 90 degrees to the right
                break;
            case 'forward':
            default:
                break;
        }
        this.rotation = Math.atan2(direction.x, direction.z);
        this.targetQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation);
        this.currentQuaternion.copy(this.body.quaternion);
        // Step 2: Slerp towards the target quaternion
        this.currentQuaternion.slerp(this.targetQuaternion, 0.1); // Adjust 0.1 as needed
        // Step 3: Update the Cannon.js body's quaternion with the interpolated value
        this.body.quaternion.set(
            this.currentQuaternion.x,
            this.currentQuaternion.y,
            this.currentQuaternion.z,
            this.currentQuaternion.w
        );
        this.cannonDirection.set(direction.x, direction.y, direction.z);  // Reuse pre-allocated vector
        this.scaledDirection.copy(this.cannonDirection).scale(this.velocity * deltaTime);
        this.cannonDirection.scale(this.velocity * deltaTime, this.scaledDirection);
        this.body.position.vadd(this.scaledDirection, this.body.position);
        camera.position.addScaledVector(direction, this.velocity * deltaTime);
        this.body.velocity.set(0, 0, 0);
        this.body.angularVelocity.set(0,0,0);
    }
    syncCharacter(deltaTime){
        this.character.position.copy(this.body.position);
        this.character.position.y += 0.2;
        this.character.quaternion.copy(this.body.quaternion);
        // this.followerLight.position.copy(this.character.position);
        // this.followerLight.position.y += 2;
        this.mixer.update(deltaTime);
    }
    shoot(direction, camera) {
        if (this.bullet && this.bulletMesh){
            this.scene.remove(this.bulletMesh);
            this.world.removeBody(this.bullet);
        }
        // this.bullet = new CANNON.Body({
        //   mass: 60,
        //   shape: new CANNON.Sphere(0.3),
        // //   position: new CANNON.Vec3(this.body.position.x, this.body.position.y+0.2, this.body.position.z),
        // });
        this.bullet.position.copy(this.character.position);
        this.bullet.position.y += 0.7;
        this.bullet.angularVelocity.set(0, 0, 0);
        //add corresponding mesh
        // this.bulletMesh = new THREE.Mesh(
        //   new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32),
        //   new THREE.MeshStandardMaterial({ color: '#4bffff', emissive: '#4bffff', emissiveIntensity: 1 })
        // );
      
        this.character.getWorldDirection(direction);

      
        this.bullet.velocity.set(
          direction.x * 50,
          direction.y * 50,
          direction.z * 50 
        );
        direction.y=0;
        direction.normalize();
        direction.crossVectors(direction,this.rotationAxis).normalize();
        this.bulletMesh.setRotationFromAxisAngle(direction, Math.PI/2);
      
        this.world.addBody(this.bullet);
        this.scene.add(this.bulletMesh);
    }
    syncBullet(){
        if (this.bullet && this.bulletMesh){
            this.bulletMesh.position.copy(this.bullet.position);
            // this.bulletMesh.quaternion.copy(this.bullet.quaternion);
        }
    }  
}

export default MainCharacter;