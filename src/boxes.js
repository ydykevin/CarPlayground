"use strict";

Physijs.scripts.worker = "js/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

var box_material, loader;

function createBoxes() {
    loader = new THREE.TextureLoader();
    box_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({ color: 0xff0000 }),
        0.4, // low friction
        0.6 // high restitution
    );

    for (var i = 0; i < 50; i++) {
        var size = Math.random() * 2 + 0.5;
        var box = new Physijs.BoxMesh(
            new THREE.BoxGeometry(size, size, size),
            box_material
        );
        box.castShadow = box.receiveShadow = true;
        box.position.set(Math.random() * 25 - 50, 5, Math.random() * 25 - 50);
        scene.add(box);
    }
}
