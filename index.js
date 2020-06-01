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

initScene = function() {
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
    createLight();
    createBowling();
    createGround();
    createBoxes();
    createRamp();

    //load car model
    json_loader.load("model/car/carbody.js", function (car, car_materials) {
        json_loader.load("model/car/wheel.js", function (
            wheel,
            wheel_materials
        ) {
            var mesh = new Physijs.BoxMesh(
                car,
                new THREE.MeshFaceMaterial(car_materials)
            );
            mesh.position.y = 30;
            mesh.position.x = 80;
            mesh.position.z = 30;
            mesh.castShadow = mesh.receiveShadow = true;

            vehicle = new Physijs.Vehicle(
                mesh,
                new Physijs.VehicleTuning(10.88, 1.83, 0.28, 500, 10.5, 6000)
            );
            scene.add(vehicle);

            var wheel_material = new THREE.MeshFaceMaterial(wheel_materials);

            for (var i = 0; i < 4; i++) {
                vehicle.addWheel(
                    wheel,
                    wheel_material,
                    new THREE.Vector3(
                        i % 2 === 0 ? -1.6 : 1.6,
                        -1,
                        i < 2 ? 3.3 : -3.2
                    ),
                    new THREE.Vector3(0, -1, 0),
                    new THREE.Vector3(-1, 0, 0),
                    0.5,
                    0.7,
                    i < 2 ? false : true
                );
            }

            // car control
            input = {
                power: null,
                direction: null,
                steering: 0,
            };
            document.addEventListener("keydown", function (ev) {
                switch (ev.keyCode) {
                    case 37: // left
                        input.direction = 1;
                        break;

                    case 38: // forward
                        input.power = true;
                        break;

                    case 39: // right
                        input.direction = -1;
                        break;

                    case 40: // back
                        input.power = false;
                        break;
                }
            });
            document.addEventListener("keyup", function (ev) {
                switch (ev.keyCode) {
                    case 37: // left
                        input.direction = null;
                        break;

                    case 38: // forward
                        input.power = null;
                        break;

                    case 39: // right
                        input.direction = null;
                        break;

                    case 40: // back
                        input.power = null;
                        break;
                }
            });
        });
    });
    
    scene.addEventListener("update", function () {
        if (input && vehicle) {
            if (input.direction !== null) {
                input.steering += input.direction / 50;
                if (input.steering < -0.6) input.steering = -0.6;
                if (input.steering > 0.6) input.steering = 0.6;
            }
            vehicle.setSteering(input.steering, 0);
            vehicle.setSteering(input.steering, 1);

            if (input.power === true) {
                vehicle.applyEngineForce(300);
            } else if (input.power === false) {
                vehicle.setBrake(20, 2);
                vehicle.setBrake(20, 3);
            } else {
                vehicle.applyEngineForce(0);
            }
        }

        scene.simulate(undefined, 2);
    });

    requestAnimationFrame(render);
    scene.simulate();
};

render = function () {
    requestAnimationFrame(render);
    if (vehicle) {
        camera.position
            .copy(vehicle.mesh.position)
            .add(new THREE.Vector3(40, 35, 40));
        camera.lookAt(vehicle.mesh.position);
    }
    renderer.render(scene, camera);
};

window.onload = initScene;
