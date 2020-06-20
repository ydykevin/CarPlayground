"use strict";

Physijs.scripts.worker = "js/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

var block_material, loader;

function createWalls() {
    //loader = new THREE.TextureLoader();
    block_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
        0.4, // friction
        0.6 // restitution
    );
    createWall1();
    createWall2();
    createWall4();
}

function createWall4() {
    var arrX1 = [-40, -45, -50, -55, -60];
    var size = arrX1.length;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            createBlock(5, 90, 3 + i * 5, arrX1[j]);
        }
    }
}

function createWall2() {
    var arrX = [-45, -50, -55, -60, -65];
    for (var i = 0; i < arrX.length; i++) {
        createBlock(5, -10, 3, arrX[i]);
    }

    var arrX2 = [-45, -50, -55, -60];
    for (var i = 0; i < arrX2.length; i++) {
        createBlock(5, -10, 8, arrX[i] - 2.5);
    }
    var arrX2 = [-45, -50, -55];
    for (var i = 0; i < arrX2.length; i++) {
        createBlock(5, -10, 13, arrX[i] - 2.5);
    }

    var arrX3 = [-45, -50];
    for (var i = 0; i < arrX3.length; i++) {
        createBlock(5, -10, 18, arrX[i] - 2.5);
    }
    var arrX3 = [-45];
    for (var i = 0; i < arrX3.length; i++) {
        createBlock(5, -10, 23, arrX[i] - 2.5);
    }
}

function createWall1() {
    var arrX1 = [-40, -46, -52, -58, -64];
    var size = arrX1.length;
    for (var i = 0; i < size; i++) {
        createBlock(5, 40, 3, arrX1[i]);
    }
    size--;

    for (var i = 0; i < size; i++) {
        createBlock(5, 40, 8, arrX1[i] - 2.5);
    }
    size--;

    for (var i = 0; i < size; i++) {
        createBlock(5, 40, 13, arrX1[i] - 5);
    }
    size--;

    for (var i = 0; i < size; i++) {
        createBlock(5, 40, 18, arrX1[i] - 7.5);
    }
    size--;

    for (var i = 0; i < size; i++) {
        createBlock(5, 40, 23, arrX1[i] - 10);
    }
}

var count = 0;

function createBlock(size, x, y, z) {
    var block = new Physijs.BoxMesh(
        new THREE.BoxGeometry(size, size, size),
        block_material
    );
    block.castShadow = block.receiveShadow = true;
    block.position.set(x, y, z);
    block.name = "block" + count;
    count++;
    scene.add(block);
}

function delete3DOBJ(objName) {
    var selectedObject = scene.getObjectByName(objName);
    scene.remove(selectedObject);
}
function clearWall() {
    for (var i = 0; i < count; i++) {
        let block_name = "block" + i;
        delete3DOBJ(block_name);
    }
    count = 0;
}
function resetWall() {
    console.log("Reset Wall");
    clearWall();
    createWalls();
}
