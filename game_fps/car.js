import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export default class Car{
    constructor(scene){
        this.scene = scene;
        this.initGeometry();
        this.initEventListener();
    }
    initGeometry(){
        const dracoLoader = new DRACOLoader();
        const self = this;
        dracoLoader.setDecoderPath('../3d_models/gltf/');
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        this.wheels = []
        this.carModel = undefined;
        loader.load('../3d_models/ferrari.glb', function(gltf) {
            self.carModel = gltf.scene.children[0];
            self.wheels.push(
                self.carModel.getObjectByName('wheel_fl'),
                self.carModel.getObjectByName('wheel_fr'),
                self.carModel.getObjectByName('wheel_rl'),
                self.carModel.getObjectByName('wheel_rr')
            )
            self.scene.add(self.carModel);
        });
    }
    initEventListener(){
        window.addEventListener('keydown', (e) => {
            if(e.code === "KeyW"){
                for ( let i = 0; i < this.wheels.length; i++){
                    this.wheels[i].rotation.x += Math.PI/4;
                }
                this.carModel.position.z-=0.1;
            }
        })
    }
}