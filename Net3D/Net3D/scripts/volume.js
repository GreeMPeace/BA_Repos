VolumeVisualizer = function () { };

VolumeVisualizer.prototype.dot = function (values, min, max, res, step) {
    var geom = new THREE.BufferGeometry();
    var vertices = [], colors = [];
    var num = {};
    num.x = (max.x - min.x) * res.x + 1;
    num.y = (max.y - min.y) * res.y + 1;
    num.z = (max.z - min.z) * res.z + 1;
    for (i = 0; i < num.x; i += step.x) {
        for (j = 0; j < num.y; j += step.y) {
            for (k = 0; k < num.z; k += step.z) {
                if (values[i][j][k] == -1000)
                    continue;
                var value = (values[i][j][k] + 50) / -70;
                var color = new THREE.Color("hsl(0, 100%, 50%)");
                color.setHSL((1 - value) / 3, 1, 0.5);
                vertices.push(min.x + i / res.x);
                vertices.push(min.y + j / res.y);
                vertices.push(min.z + k / res.z);
                colors.push(color.r);
                colors.push(color.g);
                colors.push(color.b);
            }
        }
    }
    var positions = new Float32Array(vertices);
    var farben = new Float32Array(colors);
    geom.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.addAttribute('color', new THREE.BufferAttribute(farben, 3))
    return new THREE.Points(geom, new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
        size: 1
    }));
}

VolumeVisualizer.prototype.cube = function (values, min, max, res, step) {
    var grid = {}, vertlist = new Array(12);
    var cubeindex;
    var cubes = new THREE.Object3D();
    var num = {}
    num.x = (max.x - min.x) * res.x + 1;
    num.y = (max.y - min.y) * res.y + 1;
    num.z = (max.z - min.z) * res.z + 1;
    grid.val = [];
    grid.p = [];
    for (var i = 0; i < num.x - step.x; i+=step.x) {
        for (var j = 0; j < num.y - step.y; j+=step.y) {
            for (var k = 0; k < num.z - step.z; k+=step.z) {

                grid.val[0] = values[i][j][k];
                grid.val[1] = values[i + step.x][j][k];
                grid.val[2] = values[i + step.x][j + step.y][k];
                grid.val[3] = values[i][j + step.y][k];
                grid.val[4] = values[i][j][k + step.z];
                grid.val[5] = values[i + step.x][j][k + step.z];
                grid.val[6] = values[i + step.x][j + step.y][k + step.z];
                grid.val[7] = values[i][j + step.y][k + step.z];

                if (grid.val[0] == -1000 || grid.val[1] == -1000 || grid.val[2] == -1000 || grid.val[3] == -1000 || grid.val[4] == -1000 || grid.val[5] == -1000 || grid.val[6] == -1000 || grid.val[7] == -1000)
                    continue;

                grid.p[0] = new THREE.Vector3(min.x + i / res.x, min.y + j / res.y, min.z + k / res.z);
                grid.p[1] = new THREE.Vector3(min.x + (i + step.x) / res.x, min.y + j / res.y, min.z + k / res.z);
                grid.p[2] = new THREE.Vector3(min.x + (i + step.x) / res.x, min.y + (j + step.y) / res.y, min.z + k / res.z);
                grid.p[3] = new THREE.Vector3(min.x + i / res.x, min.y + (j + step.y) / res.y, min.z + k / res.z);
                grid.p[4] = new THREE.Vector3(min.x + i / res.x, min.y + j / res.y, min.z + (k + step.z) / res.z);
                grid.p[5] = new THREE.Vector3(min.x + (i + step.x) / res.x, min.y + j / res.y, min.z + (k + step.z) / res.z);
                grid.p[6] = new THREE.Vector3(min.x + (i + step.x) / res.x, min.y + (j + step.y) / res.y, min.z + (k + step.z) / res.z);
                grid.p[7] = new THREE.Vector3(min.x + i / res.x, min.y + (j + step.y) / res.y, min.z + (k + step.z) / res.z);

                var box = placeCube(grid, step.x / res.x, step.y / res.y, step.z / res.z);

                cubes.add(box);
            }
        }
    }
    return cubes;
};

function placeCube(grid, wx, wy, wz) {
    var geom = new THREE.Geometry();

    var mat = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        transparent: true
    });

    var colors = [];
    for (var i = 0; i < 8; i++) {
        geom.vertices.push(grid.p[i]);
        var value = (grid.val[i] + 50) / -70;
        var color = new THREE.Color("hsl(0, 100%, 50%)");
        color.setHSL((1 - value) / 3, 1, 0.5);
        colors.push(color);
        mat.opacity = (1 - value)/2;
    }

    geom.faces.push(new THREE.Face3(0, 3, 1));
    geom.faces.push(new THREE.Face3(3, 2, 1));
    geom.faces.push(new THREE.Face3(3, 0, 4));
    geom.faces.push(new THREE.Face3(3, 4, 7));
    geom.faces.push(new THREE.Face3(0, 1, 5));
    geom.faces.push(new THREE.Face3(0, 5, 4));
    geom.faces.push(new THREE.Face3(1, 2, 6));
    geom.faces.push(new THREE.Face3(1, 6, 5));
    geom.faces.push(new THREE.Face3(2, 3, 7));
    geom.faces.push(new THREE.Face3(2, 7, 6));
    geom.faces.push(new THREE.Face3(7, 4, 5));
    geom.faces.push(new THREE.Face3(7, 5, 6));

    var faceind = ['a', 'b', 'c'];
    for (var i = 0; i < 12; i++) {
        for (var j = 0; j < 3; j++) {
            geom.faces[i].vertexColors[j] = colors[geom.faces[i][faceind[j]]];
        }
    }


    return new THREE.Mesh(geom, mat);
}