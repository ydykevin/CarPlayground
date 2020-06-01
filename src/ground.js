"use strict";

Physijs.scripts.worker = "js/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

var ground, ground_material;

function createGround() {
    // Materials
    ground_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({ color: 0xffce85 }),
        0.2, // low friction
        0.6 // high restitution
    );

    // Ground
    var NoiseGen = new SimplexNoise();

    var ground_geometry = new THREE.PlaneGeometry(300, 300, 10, 10);
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
}
