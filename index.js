"use strict";

// import { BowlingBall } from './bowling'
Physijs.scripts.worker = "js/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

var initScene,
  render,
  ground_material,
  box_material,
  renderer,
  scene,
  ground,
  light,
  camera,
  vehicle,
  bowlingball,
  loader;

var pinos = new Array(10);
var loadingManager = new THREE.LoadingManager();
var textureLoader = new THREE.TextureLoader(loadingManager);

initScene = function () {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  document.getElementById("viewport").appendChild(renderer.domElement);

  scene = new Physijs.Scene();
  scene.setGravity(new THREE.Vector3(0, -30, 0));
  scene.addEventListener("update", function () {
    if (input && vehicle) {
        if(input.reset){
            scene.remove(vehicle);
            resetCar();
            input.power = null;
            input.direction = null;
            input.steering = 0;
            input.reset = false;
            vehicle.applyEngineForce(0);
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
      }

    }

    scene.simulate(undefined, 2);
  });

  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  scene.add(camera);

  // Light
  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(20, 20, -15);
  light.target.position.copy(scene.position);
  light.castShadow = true;
  light.shadowCameraLeft = -150;
  light.shadowCameraTop = -150;
  light.shadowCameraRight = 150;
  light.shadowCameraBottom = 150;
  light.shadowCameraNear = 20;
  light.shadowCameraFar = 400;
  light.shadowBias = -0.0001;
  light.shadowMapWidth = light.shadowMapHeight = 2048;
  light.shadowDarkness = 0.7;
  scene.add(light);

  var input;

  // Loader
  loader = new THREE.TextureLoader();

  // Materials
  ground_material = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({ map: loader.load("img/rocks.jpg") }),
    0.8, // high friction
    0.4 // low restitution
  );
  ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
  ground_material.map.repeat.set(3, 3);

  box_material = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({ map: loader.load("img/plywood.jpg") }),
    0.4, // low friction
    0.6 // high restitution
  );
  box_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
  box_material.map.repeat.set(0.25, 0.25);

  // Ground
  var NoiseGen = new SimplexNoise();

  var ground_geometry = new THREE.PlaneGeometry(500, 500, 100, 100);
  for (var i = 0; i < ground_geometry.vertices.length; i++) {
    var vertex = ground_geometry.vertices[i];
    //vertex.y = NoiseGen.noise( vertex.x / 30, vertex.z / 30 ) * 1;
  }
  ground_geometry.computeFaceNormals();
  ground_geometry.computeVertexNormals();

  // If your plane is not square as far as face count then the HeightfieldMesh
  // takes two more arguments at the end: # of x faces and # of z faces that were passed to THREE.PlaneMaterial
  ground = new Physijs.HeightfieldMesh(
    ground_geometry,
    ground_material,
    0 // mass
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  for (i = 0; i < 50; i++) {
    var size = Math.random() * 2 + 0.5;
    var box = new Physijs.BoxMesh(
      new THREE.BoxGeometry(size, size, size),
      box_material
    );
    box.castShadow = box.receiveShadow = true;
    box.position.set(Math.random() * 25 - 50, 5, Math.random() * 25 - 50);
    scene.add(box);
  }

  var json_loader = new THREE.JSONLoader();
  var isSpeeding = false;



  var resetCar = function (){
      json_loader.load("model/car/carbody.js", function (car, car_materials) {
          json_loader.load("model/car/wheel.js", function (wheel, wheel_materials) {
              var mesh = new Physijs.BoxMesh(
                  car,
                  new THREE.MeshFaceMaterial(car_materials)
              );
              mesh.position.y = 2;
              mesh.position.x = 110;
              mesh.position.z = 25;
              mesh.rotation.y = 135;
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
                      new THREE.Vector3(i % 2 === 0 ? -1.6 : 1.6, -1, i < 2 ? 3.3 : -3.2),
                      new THREE.Vector3(0, -1, 0),
                      new THREE.Vector3(i % 2 ===0? -1:1, 0, 0),
                      0.6,
                      0.7,
                      i < 2 ? false : true
                  );
              }

          });
      });
  }

  resetCar();

    input = {
        power: null,
        direction: null,
        reset:false,
        steering: 0,
    };
    document.addEventListener("keydown", function (ev) {
        input.reset = false;
        if(ev.keyCode===37){
            input.direction = 1;
        }else if(ev.keyCode===38){
            input.power = 200;
        }else if(ev.keyCode===39){
            input.direction = -1;
        }else if(ev.keyCode===40){
            input.power = -150;
        }
        if(ev.keyCode===16 && !isSpeeding){
            input.power *=3;
            isSpeeding = true;
        }
        if(ev.keyCode===82 && !input.reset){
            input.reset = true;
        }
    });
    document.addEventListener("keyup", function (ev) {
        if(ev.keyCode===37){
            input.direction = null;
        }else if(ev.keyCode===38){
            input.power = null;
        }else if(ev.keyCode===39){
            input.direction = null;
        }else if(ev.keyCode===40){
            input.power = null;
        }
        if(ev.keyCode===16){
            if(input.power){
                input.power /=3;
            }
            isSpeeding = false;
        }
        if(ev.keyCode===82){
            input.reset = false;
        }
    });

  createBowling();
  requestAnimationFrame(render);
  scene.simulate();


};



render = function () {
  requestAnimationFrame(render);
  if (vehicle) {
    camera.position
      .copy(vehicle.mesh.position)
      .add(new THREE.Vector3(40, 25, 40));
    camera.lookAt(vehicle.mesh.position);

    light.target.position.copy(vehicle.mesh.position);
    light.position.addVectors(
      light.target.position,
      new THREE.Vector3(20, 20, -15)
    );
  }
  renderer.render(scene, camera);
};

window.onload = initScene;
