var pin = new Array(10);
var bumper;
var textureLoader = new THREE.TextureLoader();
var json_loader = new THREE.JSONLoader();

function createBowling() {
  createBumpers();
  createBowlingBall();
  createBowlingPin();
}

function createBumpers() {
  // Bumpers
  var bumper_geom = new THREE.BoxGeometry(2, 1, 50);

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
}

function createBowlingBall() {
  var imageBall = textureLoader.load("/texture/bowlingBall.png", function (
    texture
  ) {
    console.log("Texture ball is added");
  });
  imageBall.magFilter = THREE.NearestFilter;
  imageBall.minFilter = THREE.NearestFilter;

  ballMaterial = new THREE.ShaderMaterial({
    uniforms: {
      tShine: { type: "t", value: imageBall },
      time: { type: "f", value: 0 },
      weight: { type: "f", value: 0 },
    },
    // vertexShader: document.getElementById( 'vertexShader' ).textContent,
    // fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    shading: THREE.SmoothShading,
  });

  bowlingBall = new THREE.Object3D();
  bowlingBall.position.set(10, 0, 0);
  bowlingBall.rotateX((90 * Math.PI) / 180);

  json_loader.load("model/bowling/bowling-ball.json", function (geometry) {
    ball = new THREE.Mesh(geometry, ballMaterial);
    ball.scale.set(2, 2, 2);
    ball.rotateX(Math.PI);
    ball.position.set(0, 0, 0);
    ball.castShadow = true;
    bowlingBall.add(ball);
    console.log("Model ball is added");
  });

  bumper.add(bowlingBall);
}

function createBowlingPin() {
  json_loader.load("model/bowling/bowling-pin.json", function (
    geometry,
    materials
  ) {
    var material = materials[1];
    material.morphTargets = true;
    material.color.setHex(0xff0000);

    var faceMaterial = new THREE.MultiMaterial(materials);

    for (var i = 0, xpin1 = -60, xpin2 = -40, xpin3 = -20; i < 10; i++) {
      pin[i] = new THREE.Mesh(geometry, faceMaterial);
      pin[i].castShadow = true;
      pin[i].scale.set(15, 15, 15);

      pin[i].position.y = 41;

      if (i > 5) {
        pin[i].position.z = -450;
        ``;
        pin[i].position.x = xpin1;
        xpin1 += 40;
      } else if (i > 2) {
        pin[i].position.z = -420;
        pin[i].position.x = xpin2;
        xpin2 += 40;
      } else if (i > 0) {
        pin[i].position.z = -390;
        pin[i].position.x = xpin3;
        xpin3 += 40;
      } else pin[i].position.z = -360;

      bumper.add(pin[i]);
    }
  });
}
