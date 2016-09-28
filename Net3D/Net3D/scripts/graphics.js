THREE.SHPWorker = function () { };

var p = THREE.SHPWorker.prototype;

p.placeAntenna = function (obj, scene) {
    var idx = 0, max = 0, mid = { x: 0, y: 0 }, xtot = 0, ytot = 0;
    var pos = new THREE.Vector3();
    for (var i = 0; i < obj.children.length; i++) {
        for (j = 0; j < obj.children[i].geometry.vertices.length; j++) {
            if (obj.children[i].geometry.vertices[j].z * obj.scale.z > max) {
                max = obj.children[i].geometry.vertices[j].z * obj.scale.z;
                idx = i;
            }
        }
    }

    for (j = 0; j < obj.children[idx].geometry.vertices.length; j++) {
        xtot += obj.children[idx].geometry.vertices[j].x * obj.scale.x;
        ytot += obj.children[idx].geometry.vertices[j].y * obj.scale.y;
    }
    mid.x = xtot / obj.children[idx].geometry.vertices.length;
    mid.y = ytot / obj.children[idx].geometry.vertices.length;


    var geo = new THREE.ConeGeometry(max / 4, max, 20, 1, true);
    var mat = new THREE.MeshBasicMaterial({ color: 0x555555 });
    var antenna = new THREE.Mesh(geo, mat);
    antenna.position.x = mid.x;
    antenna.translateY(1.5 * max);
    antenna.position.z = -mid.y;
    obj.add(antenna);

    pos.copy(antenna.position);
    pos.y += 0.5 * max;

    return pos;
};

p.createAntenna = function (obj) {
    var geom = new THREE.Geometry();
    var vertex = new THREE.Vector3();
    var vertex1 = new THREE.Vector3();
    var face = new THREE.Face3();
    var min = obj.dirStr[0];
    var max = obj.dirStr[0];

    for (var m = 0; m < 181 * 360; m++) {
        if (min > obj.dirStr[m]) {
            min = obj.dirStr[m];
        }
        if (max < obj.dirStr[m]) {
            max = obj.dirStr[m];
        }
    }
    for (var i = 0; i <= 180; i += 6) {
        if (i != 0 && i != 180) {
            for (var j = 0; j < 360; j += 6) {
                vertex.x = Math.cos(obj.horAng[i * 360 + j] * 2 * Math.PI / 360) * Math.sin(obj.verAng[i * 360 + j] * 2 * Math.PI / 360);
                vertex.z = Math.cos(obj.verAng[i * 360 + j] * 2 * Math.PI / 360);
                vertex.y = Math.sin(obj.horAng[i * 360 + j] * 2 * Math.PI / 360) * Math.sin(obj.verAng[i * 360 + j] * 2 * Math.PI / 360);
                vertex.multiplyScalar((obj.dirStr[i * 360 + j] - min) / (max - min));
                geom.vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
            }
        }
        if (i == 0) {
            vertex1 = new THREE.Vector3(0, 0, 1);
            vertex1.multiplyScalar((obj.dirStr[0] - min) / (max - min));
            continue;
        }
        if (i == 180) {
            vertex = new THREE.Vector3(0, 0, -1);
            vertex.multiplyScalar((obj.dirStr[180 * 360] - min) / (max - min));
            geom.vertices.push(new THREE.Vector3(vertex1.x, vertex1.y, vertex1.z));
            geom.vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
            continue;
        }
    }

    for (var i = 0; i < 180 / 6 - 1; i++) {
        for (var j = 0; j < 360 / 6; j++) {
            if (i == 0) {
                face.a = 29 * 60;
                face.c = j;
                face.b = (j + 1) % (360 / 6);
                geom.faces.push(new THREE.Face3(face.a, face.b, face.c));
                face.a = j;
                face.b = (j + 1) % (360 / 6);
                face.c = (i + 1) * 360 / 6 + j;
                geom.faces.push(new THREE.Face3(face.a, face.b, face.c));
                continue;
            }
            if (i == 180 / 6 - 2) {
                face.c = 29 * 60 + 1;
                face.a = i * 360 / 6 + j;
                face.b = i * 360 / 6 + (j + 1) % 60;
                geom.faces.push(new THREE.Face3(face.a, face.b, face.c));
                face.c = i * 360 / 6 + j;
                face.b = i * 360 / 6 + (j + 1) % 60;
                face.a = (i - 1) * 360 / 6 + (j + 1) % 60;
                geom.faces.push(new THREE.Face3(face.a, face.b, face.c));
                continue;
            }
            face.a = (i - 1) * 360 / 6 + (j + 1) % 60;
            face.c = i * 360 / 6 + j;
            face.b = i * 360 / 6 + (j + 1) % 60;
            geom.faces.push(new THREE.Face3(face.a, face.b, face.c));
            face.a = i * 360 / 6 + j;
            face.b = i * 360 / 6 + (j + 1) % 60;
            face.c = (i + 1) * 360 / 6 + j;
            geom.faces.push(new THREE.Face3(face.a, face.b, face.c));
        }
    }
    return geom;
};

p.expand = function (values) {
    var newValue = {};
    var val1 = [], val2 = [], val3 = [], val4 = [];
    var end = values.length;
    newValue.x;
    newValue.y;
    newValue.z;
    newValue.vals = [];
    for (var i = 0; i < end; i++) {
        newValue = {};
        newValue.x = values[i].x;
        newValue.y = values[i].y;
        newValue.z = values[i].z + 1.5;
        newValue.vals = values[i].vals;
        val3.push(newValue);
        newValue = {};
        newValue.x = values[i].x;
        newValue.y = values[i].y;
        newValue.z = values[i].z + 3;
        newValue.vals = values[i].vals;
        val4.push(newValue);
        newValue = {};
        newValue.x = values[i].x;
        newValue.y = values[i].y;
        newValue.z = values[i].z - 1.5;
        newValue.vals = values[i].vals;
        val2.push(newValue);
        newValue = {};
        newValue.x = values[i].x;
        newValue.y = values[i].y;
        newValue.z = values[i].z - 3;
        newValue.vals = values[i].vals;
        val1.push(newValue);
    }
    values = values.concat(val3);
    values = values.concat(val4);
    values = val2.concat(values);
    values = val1.concat(values);
    return values;
};

p.fill = function (values) {
    var xdiff, ydiff, zdiff, xrang, yrang, zrang;
    var lastx = values[0].x;
    var lasty = values[0].y;
    var lastz = values[0].z;
    var boolx = true, booly = true, boolz = true;

    for (var l = 0, m = 0; l < values.length; l++) {
        if (lastx != values[l].x && boolx) {
            xrang = m++;
            xdiff = Math.abs(lastx - values[l].x);
            boolx = false;
        }
        if (lasty != values[l].y && booly) {
            yrang = m++;
            ydiff = Math.abs(lasty - values[l].y);
            booly = false;
        }
        if (lastz != values[l].z && boolz) {
            zrang = m++;
            zdiff = Math.abs(lastz - values[l].z);
            boolz = false;
        }
        if (!boolx && !booly && !boolz)
            break;
        if (l == values.length - 1) {
            if (m < 2)
                throw new Error("no valid values");
            if (boolx)
                xrang = 2;
            if (booly)
                yrang = 2;
            if (boolz)
                zrang = 2;
        }
    }



    for (var l = 0; l < values.length; l++) {
        if (Math.abs(lastx - values[l].x) > xdiff && l % (xlookup[xrang][yrang] * dim.x) != 0) {
            introduce(values, l, lastx, xdiff, 'x');
            l--;
        }
        if (Math.abs(lasty - values[l].y) > ydiff && l % (ylookup[yrang][zrang] * dim.y) != 0) {
            introduce(values, l, lasty, ydiff, 'y');
            l--;
        }
        if (Math.abs(lastz - values[l].z) > zdiff && l % (zlookup[zrang][xrang] * dim.z) != 0) {
            introduce(values, l, lastz, zdiff, 'z');
            l--;
        }

        lastx = values[l].x;
        lasty = values[l].y;
        lastz = values[l].z;
    }
    return values;

};

function introduce(values, i, lastv, diff, coord) {
    const newpoint = {};
    if (coord == 'x') {
        newpoint.x = lastv + diff;
        newpoint.y = values[i - 1].y;
        newpoint.z = values[i - 1].z;
        newpoint.vals = new Array(values[i - 1].vals.length);
        for (var j = 0; j < newpoint.vals.length; j++) {
            newpoint.vals[j] = -1000;
        }
        values.splice(i, 0, newpoint);
    }
    else if (coord == 'y') {
        newpoint.y = lastv + diff;
        newpoint.x = values[i - 1].x;
        newpoint.z = values[i - 1].z;
        newpoint.vals = new Array(values[i - 1].vals.length);
        for (var j = 0; j < newpoint.vals.length; j++) {
            newpoint.vals[j] = -1000;
        }
        values.splice(i, 0, newpoint);
    }
    else if (coord == 'z') {
        newpoint.z = lastv + diff;
        newpoint.y = values[i - 1].y;
        newpoint.x = values[i - 1].x;
        newpoint.vals = []
        for (var j = 0; j < newpoint.vals.length; j++) {
            newpoint.vals[j] = -1000;
        }
        values.splice(i, 0, newpoint);
    }
}

p.extract = function (values) {
    var vals = [];
    var xfac = 0, yfac = 0, zfac = 0;
    var lastx, lasty, lastz;
    var boolx = true, booly = true, boolz = true;

    lastx = values[0].x;
    lasty = values[0].y;
    lastz = values[0].z;

    for (var l = 0; l < values.length; l++) {
        if (!boolx && !booly && !boolz)
            break;
        if (lastx != values[l].x && boolx) {
            xfac = l;
            boolx = false;
        }
        if (lasty != values[l].y && booly) {
            yfac = l;
            booly = false;
        }
        if (lastz != values[l].z && boolz) {
            zfac = l;
            boolz = false;
        }
    }

    for (var m = 0; m < values[0].vals.length; m++) {
        vals[m] = [];
        for (var i = 0; i < dimnew.x ; i++) {
            vals[m][i] = [];
            for (var j = 0; j < dimnew.y ; j++) {
                vals[m][i][j] = [];
                for (var k = 0; k < dimnew.z ; k++) {
                    vals[m][i][j][k] = values[i * xfac + j * yfac + k * zfac].vals[m];
                }
            }
        }
    }
    return vals;
};





var dim = {
    x: 703,
    y: 532,
    z: 1
};

var dimnew = {
    x: 703,
    y: 532,
    z: 5
}

var xlookup = [[0, 1, 1], [dim.y, 0, dim.z], [dim.y * dim.z, dim.y * dim.z, 0]];
var ylookup = [[0, 1, 1], [dim.z, 0, dim.x], [dim.x * dim.z, dim.x * dim.z, 0]];
var zlookup = [[0, 1, 1], [dim.x, 0, dim.y], [dim.y * dim.x, dim.y * dim.x, 0]];