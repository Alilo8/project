import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import Env from './environment.js';
import Car from './car.js';

class Engine{
    constructor(){
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.delta = 0;
        this.FPS = 10;
        this.getWinSize();
        this.initFPS();
        this.initEventListeners();
        this.initGui();
        this.check = false;
        this.thetaxy = 0;
        this.thetaxz = 0;
        this.thetayz = 0;

        this.initLight();
        this.initCamera();
        this.initRenderer();
        this.env = new Env(this.scene);
        this.car = new Car(this.scene);
    }
    getWinSize(){
        this.winSize = {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }
    initFPS(){
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.append(this.stats.dom);
    }
    initEventListeners(){
        window.addEventListener('resize', () => {
            this.getWinSize();
            this.canvas.width = this.winSize.width;
            this.canvas.height = this.winSize.height;
            this.camera.aspect = this.winSize.width / this.winSize.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.winSize.width, this.winSize.height);
        });
        window.addEventListener('keypress', (e) => {
            if(e.code === 'KeyS'){
                this.thetaxy += 0.1;
                const position = this.line.geometry.attributes.position;
                position.setX(1,position.getX(0) + 10*Math.cos(this.thetaxy));
                position.setY(1,position.getY(0) + 10*Math.sin(this.thetaxy));
                position.needsUpdate = true;
            }
            else if(e.code === 'KeyA'){
                this.thetaxz += 0.1;
                const position = this.line.geometry.attributes.position;
                position.setX(1,position.getX(0) + 10*Math.cos(this.thetaxz));
                position.setZ(1,position.getZ(0) + 10*Math.sin(this.thetaxz));
                position.needsUpdate = true;
            }
            else if(e.code === 'KeyD'){
                this.thetayz += 0.1;
                const position = this.line.geometry.attributes.position;
                position.setY(1,position.getY(0) + 10*Math.cos(this.thetayz));
                position.setZ(1,position.getZ(0) + 10*Math.sin(this.thetayz));
                position.needsUpdate = true;
            }
            else if(e.code === 'KeyQ'){
                let vec = new THREE.Vector3(1, 0, 0);
                vec = this.rotate(vec, Math.PI);
                console.log(vec);

            }
        })
    }
    rotate(vector, radians){
        let temp = {...vector};
        if(vector.y!=0){
            temp.x = Math.round(Math.cos(radians) * vector.x - Math.sin(radians) * vector.y);
            temp.y = Math.round(Math.sin(radians) * vector.x + Math.cos(radians) * vector.y);
        }
        else{
            temp.x = Math.round(Math.cos(radians) * vector.x - Math.sin(radians) * vector.z);
            temp.z = Math.round(Math.sin(radians) * vector.x + Math.cos(radians) * vector.z);
        }
        return temp;
    }
    initLight(){
        this.scene.background = new THREE.Color( 0x00aaff );
        this.scene.fog = new THREE.Fog( 0x00aaff, 0, 500 );
        
        const fillLight1 = new THREE.HemisphereLight( 0x4488bb, 0x002244, 0.5 );
		fillLight1.position.set( 2, 1, 1 );
		this.scene.add( fillLight1 );
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 2.25 );
        directionalLight.position.set( 200, 450, 500 );

        directionalLight.castShadow = true;

        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 512;

        directionalLight.shadow.camera.near = 100;
        directionalLight.shadow.camera.far = 1200;

        directionalLight.shadow.camera.left = - 1000;
        directionalLight.shadow.camera.right = 1000;
        directionalLight.shadow.camera.top = 350;
        directionalLight.shadow.camera.bottom = - 350;
        this.scene.add( directionalLight );
    }
    initCamera(){
        this.camera = new THREE.PerspectiveCamera(45, this.winSize.width / this.winSize.height);
        this.camera.position.set(19, 73, 19);
        this.scene.add(this.camera);
    }
    initRenderer(){
        this.canvas = document.querySelector('.webgl');
        this.renderer = new THREE.WebGLRenderer( { antialias: true, canvas: this.canvas });
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.VSMShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.controls = new OrbitControls(this.camera, this.canvas);

        const mat = new THREE.MeshMatcapMaterial({color: 'white'});
        let geom = new THREE.SphereGeometry(1);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.y = 10;
        this.scene.add(mesh);

        geom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 10, 0), new THREE.Vector3(10, 10, 0)])
        this.line = new THREE.Line(geom, mat);
        this.scene.add(this.line);
    }
    initGui(){
        const gui = new GUI({width: 200});
        const self = this;
        this.pointObj = {
            x:10,
            y:10,
            z:10,
            Apply: function() {
                self.onApply();
            }
        }
        
        const point = gui.addFolder('Point');
        point.add(this.pointObj, 'x', -50, 50);
        point.add(this.pointObj, 'y', -50, 50);
        point.add(this.pointObj, 'z', -50, 50);

    }
    onApply(){
        
    }
    loop(){
        this.renderer.setAnimationLoop(() => {
            this.stats.update();
            this.controls.update();
            this.renderer.render(this.scene, this.camera)
        })
    }
}

const engine = new Engine();
engine.loop();