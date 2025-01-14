import * as THREE from 'three';
import * as CANNON from 'cannon-es';

class StaticObject {
    constructor(scene, world, gltfLoader, textureLoader) {
        this.scene = scene;
        this.world = world;
        this.gltfLoader = gltfLoader;
        this.textureLoader = textureLoader;
        this.object = null;
        this.shape = null;
        this.body = null;
    }

    initialize(physics=false, path, position, rotation=false, scale=false ) {
        this.gltfLoader.load(path, (gltf) => {
            this.object = gltf.scene;
            this.scene.add(this.object);
            if (physics){
                const box3 = new THREE.Box3().setFromObject(this.object);
                const size = new THREE.Vector3();
                box3.getSize(size); 
                const halfExtents = new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2);
                this.shape = new CANNON.Box(halfExtents);
                this.body = new CANNON.Body({
                    mass: 50,
                    position: new CANNON.Vec3(position.x, position.y, position.z),
                    quaternion: new CANNON.Quaternion().copy(this.object.quaternion),
                    shape: this.shape,
                    linearDamping: 0.9,
                    angularDamping: 0.9
                });
                this.world.addBody(this.body);
            }
            if (scale) {
                this.object.scale.set(scale.x, scale.y, scale.z);
            }
        });
    }
}

export default StaticObject;