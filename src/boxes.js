"use strict";

Physijs.scripts.worker = "js/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

var box_material, loader;
var boxCount = 0;

function createBoxes() {
    loader = new THREE.TextureLoader();
    box_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({ color: boxColor }),
        0.4, // low friction
        0.6 // high restitution
    );

    for (var i = 0; i < boxDensity * 5; i++) {
        var size = Math.random() * boxSize + 0.5;
        var box = new Physijs.BoxMesh(
            new THREE.BoxGeometry(size, size, size),
            box_material
        );
        box.castShadow = box.receiveShadow = true;
        box.position.set(Math.random() * 100 - 130, 5, Math.random() * 250 - 120);
        box.name = "box" + boxCount;
        boxCount++;
        scene.add(box);
    }
}

function clearBox() {
    for (var i = 0; i < boxCount; i++) {
        let objName = "box" + i;
        var selectedObject = scene.getObjectByName(objName);
        scene.remove(selectedObject);
    }
    boxCount = 0;
}
