guiController = {
    xpos: 0.1,
    ypos: 0.1,
    zpos: 0.1,
    xtar: 0.1,
    ytar: 0.1,
    ztar: 0.1,
    xmouse: 0.1,
    ymouse: 0.1,
    isocolor: "#00f0ff",
    source: '1',
    dots: true,
    isolevel: -79.0
};

var gui = new dat.GUI();

function setupGui() {
    var folder;

    folder = gui.addFolder("Position");

    folder.add(guiController, "xpos").step(0.25).name("Position X:").onFinishChange(changeVals);
    folder.add(guiController, "ypos").step(0.25).name("Position Y:").onFinishChange(changeVals);
    folder.add(guiController, "zpos").step(0.25).name("Position Z:").onFinishChange(changeVals);

    folder = gui.addFolder("Target");

    folder.add(guiController, "xtar").step(0.25).name("Target X:").onFinishChange(changeVals);
    folder.add(guiController, "ytar").step(0.25).name("Target Y:").onFinishChange(changeVals);
    folder.add(guiController, "ztar").step(0.25).name("Target Z:").onFinishChange(changeVals);

    folder = gui.addFolder("Mouse");

    folder.add(guiController, "xmouse").step(0.01).name("Mouse X:");
    folder.add(guiController, "ymouse").step(0.01).name("Mouse Y:");

    folder = gui.addFolder("Visuals");

    folder.addColor(guiController, "isocolor").onChange(changeVals);
    folder.add(guiController, "isolevel", -120, -20, 1).onFinishChange(changeIso);
    folder.add(guiController, "dots").name("Dotcloud:").onChange(changeDots);
    folder.add(guiController, "source", []).name("Dataset:").onChange(changeIso);
    return;

}

function changeVals() {
    var isosurf = scene.getObjectByName("isosurf");
    camera.position.x = guiController.xpos;
    camera.position.y = guiController.ypos;
    camera.position.z = guiController.zpos;
    controls.target.x = guiController.xtar;
    controls.target.y = guiController.ytar;
    controls.target.z = guiController.ztar;
    if (isosurf)
        isosurf.material.color.setHex(guiController.isocolor.replace('#', '0x'));
    return;
}

function changeDots() {
    if (guiController.dots) {
        var Volumepainter = new VolumeVisualizer();
        var volume = Volumepainter.dot(meas[Number(guiController.source) - 1], min, max, res, step);
        volume.name = "dots";
        scene.add(volume);
    }
    else {
        var olddots = scene.getObjectByName("dots");
        if (olddots) {
            olddots.geometry.dispose();
            scene.remove(olddots);
        }
    }
}

function changeIso() {
    if (meas) {
        walker = new CubeMarcher();
        var index = Number(guiController.source) - 1;
        var geosurf = new walker.march(meas[index], guiController.isolevel, min, max, res);
        var isosurf = new THREE.Mesh(geosurf, new THREE.MeshBasicMaterial({
            color: guiController.isocolor,
            opacity: 0.8,
            transparent: true,
            side: THREE.DoubleSide
        }));
        isosurf.name = "isosurf";
        var oldsurf = scene.getObjectByName("isosurf");
        oldsurf.geometry.dispose();
        scene.remove(oldsurf);
        scene.add(isosurf);
        if (guiController.dots) {
            var olddots = scene.getObjectByName("dots");
            if (olddots) {
                olddots.geometry.dispose();
                scene.remove(olddots);

                var Volumepainter = new VolumeVisualizer();
                var volume = Volumepainter.dot(meas[Number(guiController.source) - 1], min, max, res, step);
                volume.name = "dots";
                scene.add(volume);
            }
        }
        return;
    }
}

function updateGUI(position, target, iso) {
    guiController.xpos = position.x;
    guiController.ypos = position.y;
    guiController.zpos = position.z;
    guiController.xtar = target.x;
    guiController.ytar = target.y;
    guiController.ztar = target.z;
    guiController.xmouse = mouse.x;
    guiController.ymouse = mouse.y;
    if (iso) {
        var template = [];
        for (var i = 0; i < meas.length; i++)
            template.push(i + 1);

        gui.__folders.Visuals.__controllers[3].remove();
        gui.__folders.Visuals.__controllers.pop();
        gui.__folders.Visuals.add(guiController, "source", template)
    }
    for (var i = 0; i < gui.__folders.Position.__controllers.length; i++) {
        gui.__folders.Position.__controllers[i].updateDisplay();
    }
    for (var i = 0; i < gui.__folders.Target.__controllers.length; i++) {
        gui.__folders.Target.__controllers[i].updateDisplay();
    }
    for (var i = 0; i < gui.__folders.Mouse.__controllers.length; i++) {
        gui.__folders.Mouse.__controllers[i].updateDisplay();
    }
}