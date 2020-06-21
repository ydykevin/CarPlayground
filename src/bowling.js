"use strict";

Physijs.scripts.worker = "js/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

var pin = new Array(10);
var bumper_left, bumper_right, pin_material, ball_material, ground_material, ball_size;
var texture_loader = new THREE.TextureLoader();
var json_loader = new THREE.JSONLoader();

var listener = new THREE.AudioListener();

function createBowling() {
  createBumpers();
  createBowlingBall();
  createBowlingPin();
  createHint();
}

function delete3DOBJ(objName) {
  var selectedObject = scene.getObjectByName(objName);
  scene.remove(selectedObject);
  // animate();
}
function clearBowling() {
  delete3DOBJ("ball");
  console.log("remove Bowling Ball");
  for (var i = 0; i < 10; i++) {
    var pinName = "pin" + i;
    delete3DOBJ(pinName);
    console.log("remove " + pinName);
  }
}
function resetBowling() {
  clearBowling();
  createBowlingBall();
  createBowlingPin();
}

function createBumpers() {
  // color of the ground
  ground_material = Physijs.createMaterial(
    new THREE.MeshBasicMaterial({ color: 0xffad33 }),
    0.2, // low friction
    0.6 // high restitution
  );

  // Bumpers
  var bumper_geom = new THREE.BoxGeometry(1, 10, 100);

  bumper_left = new Physijs.BoxMesh(bumper_geom, ground_material, 0, {
    restitution: 0.2,
  });
  bumper_left.position.y = 1;
  bumper_left.position.z = 20;
  bumper_left.position.x = 45;
  bumper_left.rotation.y = Math.PI / 2;
  bumper_left.receiveShadow = false;
  bumper_left.castShadow = true;
  scene.add(bumper_left);

  bumper_right = new Physijs.BoxMesh(bumper_geom, ground_material, 0, {
    restitution: 0.2,
  });
  bumper_right.position.y = 1;
  bumper_right.position.z = -10;
  bumper_right.position.x = 45;
  bumper_right.rotation.y = Math.PI / 2;
  bumper_right.receiveShadow = false;
  bumper_right.castShadow = true;
  scene.add(bumper_right);
}

function createBowlingBall() {
  ball_material = Physijs.createMaterial(
    new THREE.MeshBasicMaterial({
      map: loader.load("/img/bowlingBall.png"),
    })
  );

  json_loader.load("model/bowling/bowling-ball.json", function (geometry) {
    var ball = new Physijs.BoxMesh(geometry, ball_material);
    ball.position.set(80, 0.5, 2);
    ball.scale.set(ball_size, ball_size, ball_size);
    console.log(ball_size)
    // ball.rotateX(Math.PI);
    ball.castShadow = true;
    ball.name = "ball";
    scene.add(ball);
  });
}

function init_BALL_GUI() {
  var params = {
    color: 0xff00ff,
    size: 3
  };

  var gui = new dat.GUI();

  var folder = gui.addFolder("BALL");

  folder.addColor(params, "color").onChange(function () {
    ball.set(params.color);
  });
  folder.add(params, "size").onChange(function() {
    ball_size = params.size
  })
  folder.open();
}

function createBowlingPin() {
  pin_material = Physijs.createMaterial(new THREE.MeshLambertMaterial());

  json_loader.load("model/bowling/bowling-pin.json", function (
    geometry,
    materials
  ) {
    var faceMaterial = new THREE.MultiMaterial(materials);

    for (var i = 0, xpin1 = -6, xpin2 = -4, xpin3 = -2; i < 10; i++) {
      pin[i] = new Physijs.BoxMesh(geometry, faceMaterial);
      pin[i].castShadow = true;
      pin[i].scale.set(2, 2, 2);
      pin[i].name = "pin" + i;
      // console.log(pin[i].name)
      pin[i].addEventListener("collision", function (
        other_object,
        relative_velocity,
        relative_rotation,
        contact_normal
      ) {
        // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
        var audio = document.createElement("audio");
        var source = document.createElement("source");
        source.src = "../audio/pin.ogg";
        audio.appendChild(source);
        audio.play();
      });

      pin[i].position.y = 8;

      if (i > 5) {
        pin[i].position.x = 0;
        pin[i].position.z = xpin1;
        xpin1 += 6;
      } else if (i > 2) {
        pin[i].position.x = 5;
        pin[i].position.z = xpin2;
        xpin2 += 6;
      } else if (i > 0) {
        pin[i].position.x = 10;
        pin[i].position.z = xpin3;
        xpin3 += 6;
      } else pin[i].position.x = 15;

      scene.add(pin[i]);
    }
  });
}

function createHint() {
  texture_loader.load("../img/hint.png", function (texture) {
    var geometry = new THREE.BoxGeometry(80, 50, 0.1);
    var material = new THREE.MeshPhongMaterial({ map: texture });
    var hint = new THREE.Mesh(geometry, material);
    hint.position.set(120, 0, 0);
    hint.rotateX((270 * Math.PI) / 180);
    hint.rotateZ((90 * Math.PI) / 180);
    scene.add(hint);
    console.log("Add Hint");
  });
}
