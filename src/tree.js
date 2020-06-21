var L = 30;

var query_params = load_url_query_params();

var color_options = {
  branch_color: query_params["branch_color"] || "#502716",
  leaf_color: query_params["leaf_color"] || "#12520e",
};

var angle_options = {
  angle: parseFloat(query_params["angle"]) || 54,
  dihedral: parseFloat(query_params["dihedral"]) || (1 / 2.618034) * 360, //golden ratio,
};

var topology_options = {
  aspect_ratio: parseFloat(query_params["aspect_ratio"]) || 10,
  shortening_factor: parseFloat(query_params["shortening_factor"]) || 0.75,
  core_branch:
    query_params["core_branch"] === undefined ||
    query_params["core_branch"] === "true",
  num_branches: parseInt(query_params["num_branches"]) || 4,
};
var generations = parseInt(query_params["generations"]) || 4;

function load_url_query_params() {
  var query_params = {};
  decodeURIComponent(location.search)
    .substr(1)
    .split("&")
    .forEach(function (item) {
      query_params[item.split("=")[0]] = item.split("=")[1];
    });
  console.log(query_params);
  return query_params;
}

var gui;
var branchMaterial, leafMaterial, treeObject;

function hexstr_to_int(hexstring) {
  return parseInt("0x" + hexstring.slice(1));
}

branchMaterial = new THREE.MeshLambertMaterial({
  color: hexstr_to_int(color_options.branch_color),
  ambient: 0x404040,
});
leafMaterial = new THREE.MeshLambertMaterial({
  color: hexstr_to_int(color_options.leaf_color),
  ambient: 0x404040,
});

function update_colors() {
  leafMaterial.color.setHex(hexstr_to_int(color_options.leaf_color));
  branchMaterial.color.setHex(hexstr_to_int(color_options.branch_color));
}

// Recursive methods for generating trees/branches/leaves

function createBranch(generations_left, size, topology_options) {
  var to = topology_options;
  var base_radius = 1.2;
  var base_length = size;

  if (generations_left === 0) {
    // Last generation of the tree. Let's make some leaves.
    var leafObject = new THREE.Object3D();
    leafObject.generation = 0;

    var leaf = new THREE.Mesh(
      new THREE.SphereGeometry(base_radius * 2, 4, 4),
      leafMaterial
    );
    leaf.position.y = base_radius;

    leafObject.add(leaf);
    return leafObject;
  } else {
    // Not the last generation.
    // Let's make a branch and recursively construct daughter branches
    var branchObject = new THREE.Object3D();
    branchObject.generation = generations_left;

    // The branch itself.
    var branch = new THREE.Mesh(
      new THREE.CylinderGeometry(
        base_radius * to.shortening_factor,
        base_radius,
        base_length,
        8,
        1,
        true
      ),
      branchMaterial
    );
    branch.position.y = base_length / 2;
    branchObject.add(branch);

    // The continuation of the branch
    if (to.core_branch) {
      var nextCoreBranch = createBranch(
        generations_left - 1,
        size * to.shortening_factor,
        to
      );
      nextCoreBranch.position.y = base_length;
      nextCoreBranch.is_core_branch = true;
      branchObject.add(nextCoreBranch);
    }

    // Daughter branches
    // for (var i = 0; i < to.num_branches; i++) {
    //   var daughterBranch = createBranch(
    //     generations_left - 1,
    //     size * to.shortening_factor,
    //     to
    //   );
    //   daughterBranch.position.y = base_length;
    //   daughterBranch.is_core_branch = false;
    //   daughterBranch.branch_id = i;
    //   branchObject.add(daughterBranch);
    // }
    branchObject.position.y = base_length / 2;

    // branchObject.tweak = function (angle_options) {
    //   var ao = angle_options;
    //   alert(_);
    //   _.each(branchObject.children, function (child) {
    //     if (!(child instanceof THREE.Mesh)) {
    //       // We don't want to rotate all branches; just the non-core branches.
    //       if (!child.is_core_branch) {
    //         child.rotation.z = (ao.angle * Math.PI) / 180;
    //         child.rotation.y =
    //           ((ao.dihedral * branchObject.generation +
    //             (360 * child.branch_id) / to.num_branches) *
    //             Math.PI) /
    //           180;
    //       }
    //       if (branchObject.generation > 1) {
    //         child.tweak(angle_options);
    //       }
    //     }
    //   });
    // };
    return branchObject;
  }
}

function createTree(generations, topology_options) {
  var treeObj = createBranch(generations, L, topology_options);
  treeObj.is_core_branch = true;
  treeObj.position.y = -20;
  treeObj.position.x = 120;
  treeObj.position.z = 60;
  treeObj.name = "Tree";
  console.log(treeObj);

  return treeObj;
}

function init_TREE_GUI() {
  var gui = new dat.GUI();

  var h = gui.addFolder("Color settings");
  h.addColor(color_options, "branch_color").name("Branch Color");
  h.addColor(color_options, "leaf_color").name("Leaf Color");

  var h = gui.addFolder("Angle settings");
  h.add(angle_options, "angle")
    .min(0.0)
    .max(120.0)
    .step(0.5)
    .name("Trunk-branch angle");
  h.add(angle_options, "dihedral")
    .min(-180.0)
    .max(180.0)
    .step(0.5)
    .name("Dihedral rotation");

  var h = gui.addFolder("Topology settings");
  h.add(window, "generations").min(1).max(6).step(1).name("Generations");
  h.add(topology_options, "num_branches")
    .min(1)
    .max(6)
    .step(1)
    .name("Daughter count");
  h.add(topology_options, "aspect_ratio")
    .min(1.0)
    .max(20.0)
    .step(0.1)
    .name("Aspect ratio");
  h.add(topology_options, "shortening_factor")
    .min(0.6)
    .max(1.5)
    .step(0.01)
    .name("Shrinking ratio");
  h.add(topology_options, "core_branch").name("Z-axis continuation");
  h.add(window, "setup_tree").name("Rerender the tree");
}

function setup_tree() {
  var prev_tree = this.find(scene.children, function (child) {
    return child.name === "Tree";
  });
  if (prev_tree) {
    scene.remove(prev_tree);
  }
  treeObject = createTree(generations, topology_options);
  scene.add(treeObject);
}

function animate() {
  requestAnimationFrame(animate);
  treeObject.tweak(angle_options);
  update_colors();
  renderer.render(scene, camera);
  treeObject.rotation.y += 0.02;
}
