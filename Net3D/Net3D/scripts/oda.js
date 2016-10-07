ODAParser = function () { };

ODAParser.load = function (src, callback, onerror) {
    var reader = new
        FileReader();
    reader.onload = function (obj) {
        var d = new ODAParser().parse(obj.target.result, src);
        callback(d);
    }
    reader.onerror = onerror;
    reader.readAsText(src);
};

ODAParser.prototype.parse = function (Buffer, src) {
    //var lines = Buffer.split(/\n/);
    //var vals = [];
    //var buildings = [];
    //var start = false
    //var num

    //for (var i = 0; i < lines.length; i++) {
    //    vals = [];
    //    if (!lines[i].match(/BEGIN_BUILDINGS/) && !start)
    //        continue;
    //    if (lines[i].match(/BEGIN_BUILDINGS/)) {
    //        start = true;
    //        continue;
    //    }
    //    if (lines[i].match(/END_BUILDINGS/))
    //        break;
    //    vals = lines[i].split(/\s+/);
    //    num = vals[2];
    //    buildings[buildings.length] = {};
    //    buildings[buildings.length - 1].x = [];
    //    buildings[buildings.length - 1].y = [];
    //    for (var j = 0; j < num; j++) {
    //        buildings[buildings.length - 1].x[j] = Number(vals[2 * j + 3].substring(0, vals[2 * j + 3].length - 1));
    //        buildings[buildings.length - 1].y[j] = Number(vals[2 * j + 4]);
    //    }
    //    buildings[buildings.length - 1].height = Number(vals[2 * num + 3]);
    //}
    //return buildings;

    var uri = 'api/Building/Get/Frakfurt';
    var result;
    $.ajax({
        url: uri,
        type: "GET",
        datatype: "json",
        beforeSend: function () { },
        complete: function () { }
    })
    .done(function (data) {
        oda = data;
        addBuild();
        //$.each(data, function (i, item) {
        //    alert("" + item.height);
        //});
    })
    .fail(function (a, b, c) {
        alert("Error")
    });
};

ODAParser.prototype.createModel = function (obj) {
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
            new THREE.MeshLambertMaterial({ color: 0x9c8dc7, /*wireframe: true*/ })
            ));
    }
    //city.rotation.setFromVector3(new THREE.Vector3(-Math.PI / 2, 0, 0), 'XYZ');
    //city.castShadow = true;
    //city.receiveShadow = true;
    return city;
}