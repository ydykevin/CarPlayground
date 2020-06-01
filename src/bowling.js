"use strict";

Physijs.scripts.worker = "js/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

var pin = new Array(10);
var bumper_left, bumper_right, pin_material, ball_material, ground_material;
var textureLoader = new THREE.TextureLoader();
var json_loader = new THREE.JSONLoader();

function createBowling() {
    createBumpers();
    createBowlingBall();
    createBowlingPin();
}

function createBumpers() {
    // color of the ground
    ground_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({ color: 0xffad33 }),
        0.2, // low friction
        0.6 // high restitution
    );

    // Bumpers
    var bumper_geom = new THREE.BoxGeometry(2, 1, 100);

    bumper_left = new Physijs.BoxMesh(bumper_geom, ground_material, 0, {
        restitution: 0.2,
    });
    bumper_left.position.y = 1;
    bumper_left.position.z = 20;
    bumper_left.position.x = 45;
    bumper_left.rotation.y = Math.PI / 2;
    bumper_left.receiveShadow = false;
    bumper_left.castShadow = true;
    scene.add(bumper_left);

    bumper_right = new Physijs.BoxMesh(bumper_geom, ground_material, 0, {
        restitution: 0.2,
    });
    bumper_right.position.y = 1;
    bumper_right.position.z = -10;
    bumper_right.position.x = 45;
    bumper_right.rotation.y = Math.PI / 2;
    bumper_right.receiveShadow = false;
    bumper_right.castShadow = true;
    scene.add(bumper_right);
}

function createBowlingBall() {
    ball_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({
            map: loader.load("/img/bowlingBall.png"),
        })
    );

    json_loader.load("model/bowling/bowling-ball.json", function (geometry) {
        var ball = new Physijs.BoxMesh(geometry, ball_material);
        ball.scale.set(3, 3, 3);
        // ball.rotateX(Math.PI);
        ball.position.set(80, 1.5, 3);
        ball.castShadow = true;
        scene.add(ball);
    });
}

function createBowlingPin() {
    pin_material = Physijs.createMaterial(new THREE.MeshLambertMaterial());

    json_loader.load("model/bowling/bowling-pin.json", function (
        geometry,
        materials
    ) {
        var faceMaterial = new THREE.MultiMaterial(materials);

        for (var i = 0, xpin1 = -6, xpin2 = -4, xpin3 = -2; i < 10; i++) {
            pin[i] = new Physijs.BoxMesh(geometry, faceMaterial);
            pin[i].castShadow = true;
            pin[i].scale.set(1, 1, 1);

            pin[i].position.y = 2;

            if (i > 5) {
                pin[i].position.z = 5;
                pin[i].position.x = xpin1;
                xpin1 += 4;
            } else if (i > 2) {
                pin[i].position.z = 8;
                pin[i].position.x = xpin2;
                xpin2 += 4;
            } else if (i > 0) {
                pin[i].position.z = 11;
                pin[i].position.x = xpin3;
                xpin3 += 4;
            } else pin[i].position.z = 14;

            scene.add(pin[i]);
        }
    });
}
