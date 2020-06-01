"use strict";

Physijs.scripts.worker = "js/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

function createCar() {
        json_loader.load("../model/car/carbody.js", function (car, car_materials) {
        json_loader.load("../model/car/wheel.js", function (
            wheel,
            wheel_materials
        ) {
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
                new Physijs.VehicleTuning(
                    10.88,
                    1.83,
                    0.28,
                    500,
                    10.5,
                    6000
                )
            );
            scene.add(vehicle);

            var wheel_material = new THREE.MeshFaceMaterial(
                wheel_materials
            );

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
                    new THREE.Vector3(i % 2 === 0 ? -1 : 1, 0, 0),
                    0.6,
                    0.7,
                    i < 2 ? false : true
                );
            }
        });
    });
};