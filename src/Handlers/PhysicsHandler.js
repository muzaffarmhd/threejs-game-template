import * as THREE from 'three';
import * as CANNON from 'cannon-es';

class PhysicsHandler{
    constructor(){
    }
    UpdateGeneral(ArrayOfMeshes, ArrayOfBodies){
        for(let i = 0; i < ArrayOfMeshes.length; i++){
            ArrayOfMeshes[i].position.copy(ArrayOfBodies[i].position);
            ArrayOfMeshes[i].quaternion.copy(ArrayOfBodies[i].quaternion);
        }
    }
    UpdateMC(threeObject, cannonObject){
        threeObject.mesh.position.set(cannonObject.body.position.x, cannonObject.body.position.y+0.5, cannonObject.body.position.z);
        threeObject.followerLight.position.set(cannonObject.body.position.x, cannonObject.body.position.y+3, cannonObject.body.position.z);
        // threeObject.mesh.position.copy(cannonObject.body.position);
        threeObject.mesh.quaternion.copy(cannonObject.body.quaternion);
    }
}

export { PhysicsHandler };