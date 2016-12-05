guiController = {
    isocolor: "#00f0ff",
    source: 1,
    dots: true,
    isolevel: -79.0,
    mode: 'single',
    registered: [],
    dens: "medium"
};

var Regdialog;

function loadFrankfurt() {
    return function () {
        var Inter = new GuiInterface();
        Inter.loadBuildings();
        if(guiController.mode)
        Inter.loadSimulation();
    }
}

function loadReal() {
    return function () {
        var Inter = new GuiInterface();
        Inter.loadRealData();
    }
}

function makeMax() {
}

function setupGui() {

    Regdialog = $("#register-dialog-form").dialog({
        autoOpen: false,
        height: 500,
        width: 500,
        modal: true,
        buttons: {
            "Register Dataset": registration,
            Cancel: function () {
                Regdialog.dialog("close");
            }
        },
    });

    Loaddialog = $("#load-dialog-form").dialog({
        autoOpen: false,
        height: 400,
        width: 400,
        modal: true,
        buttons: {
            "Submit": loadordel,
            Cancel: function () {
                Loaddialog.dialog("close");
            }
        },
    });

    Datadialog = $("#data-dialog-form").dialog({
        autoOpen: false,
        height: 400,
        width: 400,
        modal: true,
        buttons: {
            "Submit": function () {
                changeVals();
                Datadialog.dialog("close");
            },
            Cancel: function () {
                Datadialog.dialog("close");
            }
        },
    });


    loadRegisteredSets();

    hudcon = new HUDController();
    hudcon.addButton("register", "Register", function () { Regdialog.dialog("open") });
    hudcon.addButton("load", "Load/ Del", function () {
        var name = $("#loadname");
        name.empty();
        for (var i = 0; i < guiController.registered.length; i++) {
            var option = $("<option></option>").text(guiController.registered[i]).val(guiController.registered[i]);
            name.append(option);
        }
        Loaddialog.dialog("open");
    });

    var modecontent = ["Mode: Single", "Single", "Maximum", "Distribution"];
    var modefuncs = [null, function () {
        guiController.mode = 'single';
        simulcon.visualize();
        hudcon.elements["modes"].children[0].textContent = "Mode: Single";
    }, function () {
        guiController.mode = 'max';
        simulcon.visualize();
        hudcon.elements["modes"].children[0].textContent = "Mode: Max";
    }, function () {
        guiController.mode = 'distribution';
        simulcon.visualize();
        hudcon.elements["modes"].children[0].textContent = "Mode: Distr";
    }];
    hudcon.addDropdown("modes", modecontent, modefuncs);

    hudcon.addData(function () {
        $("#xcoord").val(camera.position.x.toFixed(2));
        $("#ycoord").val(camera.position.y.toFixed(2));
        $("#zcoord").val(camera.position.z.toFixed(2));
        $("#xtar").val(controls.target.x.toFixed(2));
        $("#ytar").val(controls.target.y.toFixed(2));
        $("#ztar").val(controls.target.z.toFixed(2));
        $("#isolevel").val(guiController.isolevel.toFixed(2));
        $("#isocolor").val(guiController.isocolor);
        Datadialog.dialog("open");
    });
    return;
}

function loadordel() {
    var name = $("#loadname");
    var type2 = $("#loadtype2");
    if (type2[0].checked) {
        var uri = "/api/Dataset/Remove/" + name[0].value;

        $.ajax({
            url: uri,
            type: "DELETE",
            datatype: "json"
        })
        .done(function (data) {
            var index = guiController.registered.indexOf(data);
            guiController.registered.splice(index, 1);
        })
        .fail(function () {
            alert("Could not be deleted!");
        });
    }
    else {
        var uri = "/api/Dataset/Get/" + name[0].value;

        $.ajax({
            url: uri,
            type: "GET",
            datatype: "json"
        })
        .fail(function () {
            alert("Could not get the Data.")
        })
        .done(function (data) {
            var load = new GuiInterface();

            if (data.data[3] != "none")
                load.loadBuildings(data.data[3]);

            if (data.data[2] == "simulation") {
                load.loadSimulation(data.data[1]);
            }
            else
                load.loadRealData(data.data[1]);
        });
    }
}

function registration() {
    var name = $("#name");
    var datafile = $("#data");
    var simtype = $("#type1");
    var realtype = $("#type2");
    var builds = $("#building");
    var tip = $("#registerTips");
    var error = "";

    var data = [];
    if (name[0].value != "")
        data.push(name[0].value);
    else
        error = "Enter a name";
    if (datafile[0].files.length == 1)
        data.push(datafile[0].files[0].name);
    else
        error = "Enter a path";
    if (simtype[0].checked)
        data.push(simtype[0].value);
    else
        data.push(realtype[0].value);
    if (builds[0].files.length == 1)
        data.push(builds[0].files[0].name);
    else
        data.push("none");

    if (error != "") {
        tip[0].value = error;
        return;
    }

    var uri = "api/Dataset/Register"
    $.ajax({
        url: uri,
        type: "POST",
        datatype: "json",
        data: { data: data }
    })
    .fail(function () {
        alert("Error");
    })
    .done(function (data) {
        guiController.registered.push(data);
    });
}

function loadRegisteredSets() {
    var uri = "/api/Dataset/GetAll"

    $.ajax({
        url: uri,
        type: "GET",
        datatype: "json"
    })
    .done(function (data) {
        for (var i = 0; i < data.length; i++) {
            guiController.registered.push(data[i]);
        }
    });
}

function changeVals() {
    var crit = false;
    var x = $("#xcoord");
    var y = $("#ycoord");
    var z = $("#zcoord");
    var xtar = $("#xtar");
    var ytar = $("#ytar");
    var ztar = $("#ztar");
    var iso = $("#isolevel");
    var col = $("#isocolor");
    var d1 = $("#dens1");
    var d2 = $("#dens2");
    var d3 = $("#dens3");
    var isosurf = scene.getObjectByName("isosurf");
    if (x[0].value != "")
        camera.position.x = Number(x[0].value);
    if (y[0].value != "")
        camera.position.y = Number(y[0].value);
    if (z[0].value != "")
        camera.position.z = Number(z[0].value);
    if (xtar[0].value != "")
        controls.target.x = Number(xtar[0].value);
    if (ytar[0].value != "")
        controls.target.y = Number(ytar[0].value);
    if (ztar[0].value != "")
        controls.target.z = Number(ztar[0].value);
    if (isosurf) {
        guiController.isocolor = col[0].value;
        isosurf.material.color.set(guiController.isocolor);
        crit = true;
    }
    if (d1[0].checked) {
        step.x = 3;
        step.y = 3;
        step.z = 2;
        crit = true;
    }
    else if (d2[0].checked) {
        step.x = 2;
        step.y = 2;
        step.z = 2;
        crit = true;
    }
    else if (d3[0].checked) {
        step.x = 1;
        step.y = 1;
        step.z = 1;
        crit = true;
    }
    if (iso[0].value != "") {
        var temp = guiController.isolevel;
        guiController.isolevel = Number(iso[0].value);
        if (isosurf)
        {
            crit = true;
        }
    }

    if (crit) {
        changeIso();
    }
    hudcon.updateData(camera.position, controls.target);
    return;
}

function changeDots() {
    if (guiController.dots) {
        var olddots = scene.getObjectByName("dots");
        if (olddots) {
            olddots.visible = true;
        }
    }
    else {
        var olddots = scene.getObjectByName("dots");
        if (olddots) {
            olddots.visible = false;
        }
    }
}

function changeIso() {
    simulcon.visualize();
    //if (meas) {
    //    if (guiController.mode == 'single') {
    //        walker = new CubeMarcher();
    //        var index = Number(guiController.source) - 1;
    //        var geosurf = new walker.march(meas[index], guiController.isolevel, min, max, res);
    //        var isosurf = new THREE.Mesh(geosurf, new THREE.MeshBasicMaterial({
    //            color: guiController.isocolor,
    //            opacity: 0.8,
    //            transparent: true,
    //            side: THREE.DoubleSide
    //        }));
    //        isosurf.name = "isosurf";
    //        var oldsurf = scene.getObjectByName("isosurf");
    //        if (oldsurf) {
    //            oldsurf.geometry.dispose();
    //            scene.remove(oldsurf);
    //        }
    //        scene.add(isosurf);

    //        var olddots = scene.getObjectByName("dots");
    //        if (olddots) {
    //            olddots.geometry.dispose();
    //            scene.remove(olddots);
    //        }
    //        var Volumepainter = new VolumeVisualizer();
    //        var volume = Volumepainter.dot(meas[Number(guiController.source) - 1], min, max, res, step);
    //        volume.name = "dots";
    //        if (!guiController.dots) {
    //            volume.visible = false;
    //        }
    //        scene.add(volume);

    //    }
    //}
    //if (guiController.mode == 'max') {
            
    //    var oldsurf = scene.getObjectByName("isosurf");
    //    if (oldsurf) {
    //        oldsurf.geometry.dispose();
    //        scene.remove(oldsurf);
    //    }
    //    var olddots = scene.getObjectByName("dots");
    //    if (olddots) {
    //        olddots.geometry.dispose();
    //        scene.remove(olddots);
    //    }
    //    var loadSimu = new SimulationLoader();
    //    if (guiController.dots) {
    //        loadSimu.addMaxPoints(true);
    //    }
    //    else{
    //        loadSimu.addMaxPoints(false);
    //    }
    //}
    //if (guiController.mode == 'Distribution') {
            
    //    var oldsurf = scene.getObjectByName("isosurf");
    //    if (oldsurf) {
    //        oldsurf.geometry.dispose();
    //        scene.remove(oldsurf);
    //    }
    //    var olddots = scene.getObjectByName("dots");
    //    if (olddots) {
    //        olddots.geometry.dispose();
    //        scene.remove(olddots);
    //    }
    //    var Volumepainter = new VolumeVisualizer();
    //    var volume = Volumepainter.dotAntennas(meas, min, max, res, step);
    //    volume.name = "dots";
                
    //    if (!guiController.dots) {
    //        volume.visible = false;
    //    }
    //    scene.add(volume);
    //}
    
}

//function updateGUI(position, target, iso) {
//    hudcon.updateData(position, target);
//}

