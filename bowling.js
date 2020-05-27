function createBowling() {
  // Bumpers
  var bumper,
    bumper_geom = new THREE.BoxGeometry(2, 1, 50);

  bumper = new Physijs.BoxMesh(bumper_geom, ground_material, 0, {
    restitution: 0.2,
  });
  bumper.position.y = 1;
  bumper.position.x = -24;
  bumper.receiveShadow = true;
  bumper.castShadow = true;
  scene.add(bumper);

  bumper = new Physijs.BoxMesh(bumper_geom, ground_material, 0, {
    restitution: 0.2,
  });
  bumper.position.y = 1;
  bumper.position.x = 24;
  bumper.receiveShadow = true;
  bumper.castShadow = true;
  scene.add(bumper);

  bumper = new Physijs.BoxMesh(bumper_geom, ground_material, 0, {
    restitution: 0.2,
  });
  bumper.position.y = 1;
  bumper.position.z = -24;
  bumper.rotation.y = Math.PI / 2;
  bumper.receiveShadow = true;
  bumper.castShadow = true;
  scene.add(bumper);

  bumper = new Physijs.BoxMesh(bumper_geom, ground_material, 0, {
    restitution: 0.2,
  });
  bumper.position.y = 1;
  bumper.position.z = 24;
  bumper.rotation.y = Math.PI / 2;
  bumper.receiveShadow = true;
  bumper.castShadow = true;
  scene.add(bumper);

  var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  var sphereMaterial = new THREE.MeshLambertMaterial({ wireframe: false });
  var sphere = new Physijs.SphereMesh(sphereGeometry, sphereMaterial);
  sphere.position.x = 10;
  sphere.position.y = 2;
  bumper.add(sphere);
}
