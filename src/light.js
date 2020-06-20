"use strict";

Physijs.scripts.worker = "js/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

var light, softLight;

function createLight() {
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(200, 150, -200);
    light.target.position.copy(scene.position);
    light.castShadow = true;
    light.shadowCameraLeft = -300;
    light.shadowCameraTop = -300;
    light.shadowCameraRight = 300;
    light.shadowCameraBottom = 300;
    light.shadowCameraNear = 20;
    light.shadowCameraFar = 500;
    light.shadowBias = -0.0001;
    light.shadowMapWidth = light.shadowMapHeight = 2048;
    light.shadowDarkness = 0.8;
    light.shadowCameraVisible = true;
    scene.add(light);
    softLight = new THREE.AmbientLight(0xaaaaaa, 20); // soft white light
    scene.add(softLight);
}
