import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


export default class Env{
    constructor(scene, start, end){
        this.scene = scene;
        this.start = start;
        this.end = end;
        this.initGeometry();
    }
    initGeometry(){
        const plane_tex = new THREE.TextureLoader().load('../img/grasslight-big.jpg');

        const plane_geom = new THREE.PlaneGeometry(1000, 1000);
        plane_geom.rotateX(-Math.PI/2)
        const plane_mat = new THREE.MeshPhongMaterial({color: 'white', map: plane_tex});
        const plane_mesh = new THREE.Mesh(plane_geom, plane_mat);
        plane_mesh.material.map.repeat.set( 32, 32);
        plane_mesh.material.map.wrapS = plane_mesh.material.map.wrapT = THREE.RepeatWrapping;
        plane_mesh.material.map.encoding = THREE.sRGBEncoding;
        plane_mesh.receiveShadow = true;
        this.scene.add(plane_mesh);
    }
}