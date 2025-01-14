import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Camera from './Camera.js';
import { Lights } from './Lights.js';
import Floor from '../Objects/Floor.js';
import MainCharacter from '../Objects/MainCharacter.js';

class BaseScene{
    constructor(sceneManager, inputHandler, gltfLoader, textureLoader){
        this.scene = new THREE.Scene();
        this.world = new CANNON.World();
        this.world.broadphase = new CANNON.SAPBroadphase(this.world);
        this.cameraObject = new Camera(this.scene);
        this.gltfLoader = gltfLoader;
        this.textureLoader = textureLoader;
        this.sceneManager = sceneManager;
        this.inputHandler = inputHandler;
        this.objects = {
            cameraObject: new Camera(this.scene),
            lights: new Lights(this.scene),
            floor: new Floor(this.scene, this.world),
            mainCharacter: new MainCharacter(this.scene, this.world, this.gltfLoader, this.textureLoader),
        }
    }
    initialize() {
        this.objects.mainCharacter.initialize('./static/Character/scene.gltf', new THREE.Vector3(0, 0, 22));
        this.objects.lights.initialize(new THREE.Vector3(2, 3, 2));
        this.objects.cameraObject.initialize(new THREE.Vector3(0, 0, 3), new THREE.Vector3(0, 0, 0));
        this.objects.floor.initialize();
        this.world.gravity.set(0, -9.82, 0);
        this.scene.fog = new THREE.Fog('#701fa3', 0, 130);

    }
    update(deltaTime) {
        if (this.objects.mainCharacter.character) {
            this.inputHandler.handleCharacter(this.objects.mainCharacter, this.objects.cameraObject.camera, deltaTime);
            this.objects.mainCharacter.syncCharacter(deltaTime);
            this.objects.cameraObject.updateMainCamera(this.objects.mainCharacter);
            this.inputHandler.handleBullet(this.objects.mainCharacter, this.objects.cameraObject.camera);
            this.objects.mainCharacter.syncBullet();
        }
        this.world.step(1 / 60, deltaTime, 3);
    }
}

export default BaseScene;
