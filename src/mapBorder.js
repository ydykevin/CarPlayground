"use strict";

Physijs.scripts.worker = "js/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

function createMapBorder() {
    // color of the ground
    ground_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({ color: 0xfca000 }),
        0.2, // low friction
        0.6 // high restitution
    );

    // Bumpers
    var bumper,
        bumper_geom = new THREE.BoxGeometry(8, 3, 308);

    bumper = new Physijs.BoxMesh(bumper_geom, ground_material, 0, {
        restitution: 0.2,
    });
    bumper.position.y = 0;
    bumper.position.x = -150;
    bumper.receiveShadow = true;
    bumper.castShadow = true;
    scene.add(bumper);

    bumper = new Physijs.BoxMesh(bumper_geom, ground_material, 0, {
        restitution: 0.2,
    });
    bumper.position.y = 1;
    bumper.position.x = 150;
    bumper.receiveShadow = true;
    bumper.castShadow = true;
    scene.add(bumper);

    bumper = new Physijs.BoxMesh(bumper_geom, ground_material, 0, {
        restitution: 0.2,
    });
    bumper.position.y = 1;
    bumper.position.z = -150;
    bumper.rotation.y = Math.PI / 2;
    bumper.receiveShadow = true;
    bumper.castShadow = true;
    scene.add(bumper);

    bumper = new Physijs.BoxMesh(bumper_geom, ground_material, 0, {
        restitution: 0.2,
    });
    bumper.position.y = 1;
    bumper.position.z = 150;
    bumper.rotation.y = Math.PI / 2;
    bumper.receiveShadow = true;
    bumper.castShadow = true;
    scene.add(bumper);

    // requestAnimationFrame(render);
}
