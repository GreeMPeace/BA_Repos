SimulationLoader = function (data) {
    this.min = data.min;
    this.max = data.max;
    this.values = data.vals;

    this.offset = [0, 0];
    this.expand();

    if (buildingcon) {
        this.offset[0] = this.min[0] - buildingcon.min[0];
        this.offset[1] = this.min[1] - buildingcon.min[1];
    }
    min.x = this.offset[0];
    min.y = this.offset[1];
    min.z = this.min[2];
    max.x = this.max[0] - this.min[0] + this.offset[0];
    max.y = this.max[1] - this.min[1] + this.offset[1];
    max.z = this.max[2];
};

SimulationLoader.prototype.expand = function () {
    if (this.values[0][0][0].length != 1)
        return;

    for (var n = 0; n < this.values.length; n++) {
        for (var i = 0; i < this.values[n].length; i++) {
            for (var j = 0; j < this.values[n][i].length; j++) {
                this.values[n][i][j].push(this.values[n][i][j][0]);
                this.values[n][i][j].push(this.values[n][i][j][0]);
                this.values[n][i][j].push(this.values[n][i][j][0]);
                this.values[n][i][j].push(this.values[n][i][j][0]);
            }
        }
    }

    this.min[2] -= 3;
    this.max[2] += 3;
};


SimulationLoader.prototype.visualize = function () {
    if (this.values) {
        if (guiController.mode == 'single') {
            walker = new CubeMarcher();
            var index = Number(guiController.source) - 1;
            var geosurf = new walker.march(this.values[index], guiController.isolevel, min, max, res);
            var isosurf = new THREE.Mesh(geosurf, new THREE.MeshBasicMaterial({
                color: guiController.isocolor,
                opacity: 0.8,
                transparent: true,
                side: THREE.DoubleSide
            }));
            isosurf.name = "isosurf";
            var oldsurf = scene.getObjectByName("isosurf");
            if (oldsurf) {
                oldsurf.geometry.dispose();
                scene.remove(oldsurf);
            }
            scene.add(isosurf);

            var olddots = scene.getObjectByName("dots");
            if (olddots) {
                olddots.geometry.dispose();
                scene.remove(olddots);
            }
            var Volumepainter = new VolumeVisualizer();
            var volume = Volumepainter.dot(this.values[Number(guiController.source) - 1], min, max, res, step);
            volume.name = "dots";
            if (!guiController.dots) {
                volume.visible = false;
            }
            scene.add(volume);

        }
        if (guiController.mode == 'max') {

            var oldsurf = scene.getObjectByName("isosurf");
            if (oldsurf) {
                oldsurf.geometry.dispose();
                scene.remove(oldsurf);
            }
            var olddots = scene.getObjectByName("dots");
            if (olddots) {
                olddots.geometry.dispose();
                scene.remove(olddots);
            }
            if (guiController.dots) {
                this.addMaxPoints(true);
            }
            else {
                this.addMaxPoints(false);
            }
        }
        if (guiController.mode == 'distribution') {

            var oldsurf = scene.getObjectByName("isosurf");
            if (oldsurf) {
                oldsurf.geometry.dispose();
                scene.remove(oldsurf);
            }
            var olddots = scene.getObjectByName("dots");
            if (olddots) {
                olddots.geometry.dispose();
                scene.remove(olddots);
            }
            var Volumepainter = new VolumeVisualizer();
            var volume = Volumepainter.dotAntennas(this.values, min, max, res, step);
            volume.name = "dots";

            if (!guiController.dots) {
                volume.visible = false;
            }
            scene.add(volume);
        }
    }

    //var Walker = new CubeMarcher();

    //if (true) {
    //    var Volumepainter = new VolumeVisualizer();
    //    var volume = Volumepainter.dot(meas[0], min, max, res, step);
    //    volume.name = "dots";
    //    scene.add(volume);

    //    //camera.position.y = 500;
    //    //camera.position.x = volume.children[0].geometry.vertices[0].x;
    //    //camera.position.z = volume.children[0].geometry.vertices[0].z;
    //    //controls.target = volume.geometry.vertices[0];
    //}
    //if (true) {
    //    var geosurf = Walker.march(meas[0], -79, min, max, res);


    //    var isosurf = new THREE.Mesh(geosurf, new THREE.MeshBasicMaterial({
    //        color: guiController.isocolor,
    //        opacity: 0.8,
    //        transparent: true,
    //        side: THREE.DoubleSide
    //    }));
    //    isosurf.name = "isosurf";

    //    camera.position.z = 750;
    //    camera.position.x = isosurf.geometry.vertices[0].x;
    //    camera.position.y = isosurf.geometry.vertices[0].y;

    //    controls.target = isosurf.geometry.vertices[0];

    //    scene.add(isosurf);

    //    updateGUI(camera.position, controls.target, true);
    //}
};

SimulationLoader.prototype.addMaxPoints = function (vis) {
    var Volumepainter = new VolumeVisualizer();
    var maxes = [];
    for (var n = 0; n < this.values.length; n++) {
        for (var i = 0; i < this.values[n].length; i++) {
            if (n == 0)
                maxes[i] = [];
            for (var j = 0; j < this.values[n][i].length; j++) {
                if (n == 0)
                    maxes[i][j] = [];
                for (var k = 0; k < this.values[n][i][j].length; k++) {
                    if (maxes[i][j][k] < this.values[n][i][j][k] || n == 0)
                        maxes[i][j][k] = this.values[n][i][j][k];
                }
            }
        }
    }
    var volume = Volumepainter.dot(maxes, min, max, res, step);
    volume.name = "dots";
    volume.visible = vis;
    scene.add(volume);
}