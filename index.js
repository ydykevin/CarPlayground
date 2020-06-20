"use strict";

// import { BowlingBall } from './bowling'
Physijs.scripts.worker = "js/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

var initScene,
    render,
    ground_material,
    renderer,
    scene,
    ground,
    camera,
    vehicle,
    bowlingball,
    loader;

var loadingManager = new THREE.LoadingManager();
var textureLoader = new THREE.TextureLoader(loadingManager);

initScene = function () {
    // Loader
    loader = new THREE.TextureLoader();
    //variable declaration
    var input;
    var json_loader = new THREE.JSONLoader();

    // set up renderer of the scene
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    document.getElementById("viewport").appendChild(renderer.domElement);

    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -30, 0));

    camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    scene.add(camera);
    
    //load map
    createMapBorder();
    createCar();
    createLight();
    createBowling();
    createGround();
    createBoxes();
    createRamp();
    init_TREE_GUI()
    // createTree()
    setup_tree()

    // car control
    input = {
        power: null,
        direction: null,
        reset: false,
        steering: 0,
    };

    var isSpeeding = false;

    document.addEventListener("keydown", function (ev) {
        input.reset = false;
        if (ev.keyCode === 37) {
            input.direction = 1;
        } else if (ev.keyCode === 38) {
            input.power = 300;
        } else if (ev.keyCode === 39) {
            input.direction = -1;
        } else if (ev.keyCode === 40) {
            input.power = -300;
        }
        if (ev.keyCode === 16 && !isSpeeding) {
            input.power=input.power>0?900:-900;
            isSpeeding = true;
        }
        // if (ev.keyCode === 82 && !input.reset) {
        //     input.reset = true;
        // }
    });

    document.addEventListener("keyup", function (ev) {
        if (ev.keyCode === 37) {
            input.direction = null;
        } else if (ev.keyCode === 38) {
            input.power = null;
        } else if (ev.keyCode === 39) {
            input.direction = null;
        } else if (ev.keyCode === 40) {
            input.power = null;
        }
        if (ev.keyCode === 16) {
            if (input.power) {
                input.power=input.power>0?300:-300;
            }
            isSpeeding = false;
        }
        if (ev.keyCode === 82 && !input.reset) {
            input.reset = true;
        }
        // Press B to reset bowling 
        if (ev.keyCode === 66) {
          resetBowling()
          console.log('reset bowling area')
        }
    });

    scene.addEventListener("update", function () {
        
        if (input && vehicle) {
            if (input.reset) {
                scene.remove(vehicle);
                createCar();
                input.power = null;
                input.direction = null;
                input.steering = 0;
                input.reset = false;
            }
            if (input.direction !== null) {
                input.steering += input.direction / 50;
                if (input.steering < -0.4) input.steering = -0.4;
                if (input.steering > 0.4) input.steering = 0.4;
            }
            vehicle.setSteering(input.steering, 0);
            vehicle.setSteering(input.steering, 1);

            if (input.power !== null) {
                console.log(input.power);
                vehicle.applyEngineForce(input.power);
            } else {
                vehicle.applyEngineForce(0);
                vehicle.setBrake(20, 2);
                vehicle.setBrake(20, 3);
            }
        }
        scene.simulate(undefined, 2);
    });

    requestAnimationFrame(render);
    scene.simulate();
};

render = function () {
    console.log("treeDensity: "+treeDensity+", treeSize: "+treeSize+", Weather: "+weather+", particleDensity: "+particleDensity+", particleSize: "+particleSize+", particleSpeed: "+particleSpeed);
    requestAnimationFrame(render);
    if (vehicle) {
        camera.position
            .copy(vehicle.mesh.position)
            .add(new THREE.Vector3(110, 125, 110));
        camera.lookAt(vehicle.mesh.position);
    }
    renderer.shadowMapType = THREE.PCFSoftShadowMap
    renderer.render(scene, camera);
};

window.onload = initScene;
