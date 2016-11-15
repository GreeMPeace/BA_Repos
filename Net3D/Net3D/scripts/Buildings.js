BuildingLoader = function (data) {
    this.obj = data.lBuildings;
    this.min = data.min;

    this.offset = [0, 0];

    if (simulcon) {
        this.offset[0] = this.min[0] - simulcon.min[0];
        this.offset[1] = this.min[1] - simulcon.min[0];
    }
};

BuildingLoader.prototype.createModel = function () {
    var city = new THREE.Object3D();
    var path = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1));
    var tube = new THREE.TubeGeometry(path);
    tube.tangents = [new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 1)];
    tube.normals = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, 0, 0)];
    tube.binormals = [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0)];

    for (var i = 0; i < this.obj.length; i++) {
        var build = new THREE.Shape();
        var first = new THREE.Vector2(this.obj[i].x[0] + this.offset[0], this.obj[i].y[0] + this.offset[1]);
        var length = this.obj[i].x.length;
        build.moveTo(first.x, first.y);
        for (var j = 1; j < length; j++) {
            build.lineTo(this.obj[i].x[j] + this.offset[0], this.obj[i].y[j] + this.offset[1]);
        }
        build.lineTo(first.x, first.y);
        path = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, this.obj[i].height));
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

BuildingLoader.prototype.addBuild = function () {

    var Obj = this.createModel(this.obj);

    scene.add(Obj);
}