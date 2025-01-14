import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Camera from './Camera.js';
import { Lights } from './Lights.js';
import Floor from '../Objects/Floor.js';
import MainCharacter from '../Objects/MainCharacter.js';
import StaticObject from '../Objects/StaticObject.js';

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
            skybox: new StaticObject(this.scene, this.world, this.gltfLoader, this.textureLoader)
        }
    }
    initialize() {
        this.objects.mainCharacter.initialize('./static/Character/scene.gltf', new THREE.Vector3(0, 0, 22));
        this.objects.lights.initialize(new THREE.Vector3(2, 3, 2));
        this.objects.cameraObject.initialize(new THREE.Vector3(0, 0, 3), new THREE.Vector3(0, 0, 0));
        this.objects.floor.initialize();
        this.objects.skybox.initialize(false, './static/Micellaneous/skybox.glb', new THREE.Vector3(0, 0, 0), false, new THREE.Vector3(0.4,0.4,0.4));
        this.world.gravity.set(0, -9.82, 0);
        this.scene.fog = new THREE.Fog('#8b16ff', 0, 230);

    }
    update(deltaTime) {
        if (this.objects.mainCharacter.character && this.objects.skybox.object) {
            this.inputHandler.handleCharacter(this.objects.mainCharacter, this.objects.cameraObject.camera, deltaTime);
            this.objects.mainCharacter.syncCharacter(deltaTime);
            this.objects.cameraObject.updateMainCamera(this.objects.mainCharacter);
            this.inputHandler.handleBullet(this.objects.mainCharacter, this.objects.cameraObject.camera);
            this.objects.mainCharacter.syncBullet();
            this.objects.skybox.object.position.copy(this.objects.mainCharacter.character.position);
        }
        if (this.floor){
            this.floor.update(0.01);
        }
        this.world.step(1 / 60, deltaTime, 3);
    }
}

export default BaseScene;
