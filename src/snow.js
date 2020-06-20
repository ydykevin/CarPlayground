"use strict";

Physijs.scripts.worker = "js/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

var renderer,
    snow,
    snowGeo,
    snowCount = 0,
    snowDrop,
    snowMaterial;

function createSnow() {
    // console.log("Nhay vao day");
    snowCount = particleDensity * 200;
    snowGeo = new THREE.Geometry();
    for (let i = 0; i < snowCount; i++) {
        snowDrop = new THREE.Vector3(
            Math.random() * 400 - 200,
            Math.random() * 500 - 250,
            Math.random() * 400 - 200
        );
        snowDrop.velocity = {};
        snowDrop.velocity = 0;
        snowGeo.vertices.push(snowDrop);
    }
    snowMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: particleSize,
        transparent: true,
    });
    snow = new THREE.Points(snowGeo, snowMaterial);
    snow.name = "snow";
    scene.add(snow);

    animateSnow();
}

function animateSnow() {
    //add velocity to the snow
    snowGeo.vertices.forEach((p) => {
        p.velocity -= 0.02 + Math.random() * 0.01;
        p.y += p.velocity;
        if (p.y < -200) {
            p.y = 200;
            p.velocity = 0;
        }
    });
    snowGeo.verticesNeedUpdate = true;
    snow.rotation.y += 0.002;
    requestAnimationFrame(animateSnow);
}

function deleteSnow() {
    var selectedObject = scene.getObjectByName("snow");
    scene.remove(selectedObject);
}
