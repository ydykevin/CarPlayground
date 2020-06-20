"use strict";

Physijs.scripts.worker = "js/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

var renderer,
    cloudGeo,
    cloudMaterial,
    cloudParticlesRight = [],
    cloudParticles = [],
    cloudParticlesUnder = [],
    flashRight,
    flash,
    rain,
    rainGeo,
    rainCount = 0,
    rainDrop,
    rainMaterial;

function createRain() {
    rainCount = particleDensity * 1000;
    rainGeo = new THREE.Geometry();
    for (let i = 0; i < rainCount; i++) {
        rainDrop = new THREE.Vector3(
            Math.random() * 400 - 200,
            Math.random() * 500 - 250,
            Math.random() * 400 - 200
        );
        rainDrop.velocity = {};
        rainDrop.velocity = 0;
        rainGeo.vertices.push(rainDrop);
    }
    rainMaterial = new THREE.PointsMaterial({
        color: 0x3756a0,
        size: particleSize / 5,
        transparent: true,
    });
    rain = new THREE.Points(rainGeo, rainMaterial);
    rain.name = "rain";
    scene.add(rain);

    createFog();
    createLightning();
    createClouds();
    animate();
    console.log({ array: cloudParticles });
    console.log({
        count: rainCount,
        speed: rainGeo.vertices[0].velocity,
        size: rainMaterial.size,
    });
}

function createLightning() {
    flashRight = new THREE.PointLight(0xffffff, 30, 500, 1.7);
    flashRight.position.set(0, 0, -400);
    scene.add(flashRight);

    flash = new THREE.PointLight(0xffffff, 30, 500, 1.7);
    flash.position.set(-400, 0, 0);
    scene.add(flash);
}

function createFog() {
    scene.fog = new THREE.FogExp2(0x11111f, 0.002);
    renderer.setClearColor(scene.fog.color);
}

function createClouds() {
    let x = 0;
    cloudParticlesRight.name = "cloud_right";
    cloudParticles.name = "cloud";
    let loader = new THREE.TextureLoader();
    loader.load("../img/clouds.png", function (texture) {
        cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
        cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true,
        });
        for (let p = 0; p < 25; p++) {
            //band of cloud on the right border of the playground (-z)
            let cloud_right = new THREE.Mesh(cloudGeo, cloudMaterial);
            cloud_right.position.set(
                Math.random() * 100 - 250 + x,
                Math.random() * 50 + 50,
                -350
            );
            cloud_right.rotation.y = 0.7;
            cloud_right.rotation.z = Math.random() * 360;
            cloud_right.material.opacity = 0.6;
            cloudParticlesRight.push(cloud_right);
            scene.add(cloud_right);

            //band of clouds on the back border of the playground (-x)
            let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
            cloud.position.set(
                -350,
                Math.random() * 200,
                Math.random() * 100 - 250 + x
            );
            cloud.rotation.y = 0.7;
            cloud.rotation.z = Math.random() * 360;
            cloud.material.opacity = 0.6;
            cloudParticles.push(cloud);
            scene.add(cloud);

            x += 25;
        }

        //cloud under the playground
        let cloud_under = new THREE.Mesh(cloudGeo, cloudMaterial);
        cloud_under.position.set(100, -30, Math.random() * 150);
        // cloud_under.rotation.y = 6;
        cloud_under.rotation.x = 99;
        cloud_under.material.opacity = 0.6;
        cloudParticlesUnder.push(cloud_under);
        scene.add(cloud_under);
    });
}

function animate() {
    cloudParticles.forEach((p) => {
        p.rotation.z -= 0.002;
    });
    cloudParticlesUnder.forEach((p) => {
        p.rotation.z -= 0.002;
    });
    cloudParticlesRight.forEach((p) => {
        p.rotation.z -= 0.002;
    });

    //add velocity to the rain
    rainGeo.vertices.forEach((p) => {
        p.velocity -= 0.1 + Math.random() * 0.1;
        p.y += p.velocity;
        if (p.y < -200) {
            p.y = 200;
            p.velocity = 0;
        }
    });
    rainGeo.verticesNeedUpdate = true;
    rain.rotation.y += 0.002;
    //initiate everything
    requestAnimationFrame(animate);
}

function deleteRain() {
    var selectedObject = scene.getObjectByName("rain");
    scene.remove(selectedObject);
}

function deleteClouds() {
    for (let p = 0; p < 25; p++) {
        scene.remove(cloudParticles[p]);
        scene.remove(cloudParticlesRight[p]);
    }
    scene.remove(cloudParticlesUnder[0]);
}
