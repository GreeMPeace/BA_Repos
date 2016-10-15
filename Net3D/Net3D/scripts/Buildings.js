BuildingLoader = function () { };

BuildingLoader.prototype.createModel = function (obj) {
    var city = new THREE.Object3D();
    var path = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1));
    var tube = new THREE.TubeGeometry(path);
    tube.tangents = [new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 1)];
    tube.normals = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, 0, 0)];
    tube.binormals = [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0)];

    for (var i = 0; i < obj.length; i++) {
        var build = new THREE.Shape();
        var first = new THREE.Vector2(obj[i].x[0], obj[i].y[0]);
        var length = obj[i].x.length;
        build.moveTo(first.x, first.y);
        for (var j = 1; j < length; j++) {
            build.lineTo(obj[i].x[j], obj[i].y[j]);
        }
        build.lineTo(first.x, first.y);
        path = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, obj[i].height));
        var geom = build.extrude({
            extrudePath: path,
            frames: tube
        });
        city.add(new THREE.Mesh(
            geom,
            new THREE.MeshLambertMaterial({ color: 0x5c6f84, /*wireframe: true*/ })
            ));
    }
    city.castShadow = true;
    city.receiveShadow = true;
    return city;
};

BuildingLoader.prototype.addBuild = function (building) {

    var Obj = this.createModel(building);

    scene.add(Obj);
}