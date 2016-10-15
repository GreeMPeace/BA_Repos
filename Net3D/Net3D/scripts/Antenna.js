AntennaLoader = function () { };

AntennaLoader.prototype.addAntenna = function (apa) {
    var antPos = new THREE.Vector3();
    var AntGeom;

    AntGeom = this.createAntenna(apa);

    var antennaPat = new THREE.Mesh(AntGeom, new THREE.MeshLambertMaterial({
        color: 0xef1366,
        //opacity: 0.8,
        //transparent: true,
        side: THREE.BackSide
    }));

    antennaPat.scale.set(25, 25, 25);
    antennaPat.castShadow = true;
    antennaPat.receiveShadow = true;

    scene.add(antennaPat);
}

AntennaLoader.prototype.createAntenna = function (obj) {
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
