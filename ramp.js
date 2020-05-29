"use strict";

Physijs.scripts.worker = "js/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

var ramp, ramp_material;
var texture = new THREE.TextureLoader().load("./img/wood.jpg");

function createRamp() {
    // create ramp vertices
    var ramp_geo = new THREE.Geometry();
    // x (horizontal), y (vertical), z (deep)
    ramp_geo.vertices.push(
        new THREE.Vector3(-20, 0, -20), //0 bot-bk-left
        new THREE.Vector3(20, 0, -20), //1 bot-bk-right
        new THREE.Vector3(-20, 0, 0), //2 bot-front-left
        new THREE.Vector3(20, 0, 0), //3 bot-front-right
        new THREE.Vector3(-20, 5, -20), //4 top-bk-left
        new THREE.Vector3(20, 5, -20) //5 top-bk-right
    );
    // connect vertices with edges
    ramp_geo.faces.push(
        // back
        new THREE.Face3(0, 4, 5),
        new THREE.Face3(1, 0, 5),
        // ramp
        new THREE.Face3(2, 5, 4),
        new THREE.Face3(5, 2, 3),
        // bottom
        new THREE.Face3(2, 0, 1),
        new THREE.Face3(2, 1, 3),
        // left
        new THREE.Face3(0, 2, 4),
        // right
        new THREE.Face3(1, 5, 3)
    );

    ramp_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
        0.2, // low friction
        0.6 // high restitution
    );

    // is here to repeat the color. doesn't work yet
    // ramp_material.map.wrapS = ramp_material.map.wrapT = THREE.RepeatWrapping;
    // ramp_material.map.repeat.set(5, 5);

    ramp = new Physijs.ConvexMesh(ramp_geo, ramp_material, 0, {
        restitution: 1,
        friction: 0.2,
    });
    ramp.position.set(-1, 0, 60);
    ramp.rotation.y = Math.PI / 2;
    ramp.receiveShadow = true;
    ramp.castShadow = true;
    scene.add(ramp);
}
