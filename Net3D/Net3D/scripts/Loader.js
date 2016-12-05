GuiInterface = function () { };

GuiInterface.prototype.loadBuildings = function (path) {
    var uri = 'api/Building/Get/' + path.replace(".", ";");
    $.ajax({
        url: uri,
        type: "GET",
        datatype: "json",
    })
    .done(function (data) {
        buildingcon = new BuildingLoader(data);
        buildingcon.addBuild();
    })
    .fail(function (a, b, c) {
        alert("Error")
    });
};

GuiInterface.prototype.loadSimulation = function (path) {
    var uri = 'api/Measurement/GetSimulation/' + path.replace(".", ";") + "?dimensions=703-532-1";
    $.ajax({
        url: uri,
        type: "GET",
        datatype: "json",
        beforeSend: function () { },
        complete: function () { }
    })
    .done(function (data) {
        simulcon = new SimulationLoader(data);
        simulcon.visualize();

        var num = ["Source: 1"], func = [null];
        for (var i = 0; i < data.vals.length; i++) {
            num.push("" + (i + 1));
            func.push(new Function("if(guiController.source == " + (i+1) + ") {return;} guiController.source = " + (i+1) + "; if(guiController.mode == 'single'){simulcon.visualize();} hudcon.elements['Source'].children[0].textContent = 'Source: " + (i+1) + "';"));
        }
        hudcon.addDropdown("Source", num, func);
    })
    .fail(function (a, b, c) {
        alert("Error")
    });
};

GuiInterface.prototype.loadRealData = function (path) {
    var uri = 'api/Measurement/GetReal/' + path.replace(".", ";");
    $.ajax({
        url: uri,
        type: "GET",
        datatype: "json",
        beforeSend: function () { },
        complete: function () { }
    })
    .done(function (data) {
        var Real = new RealData(data);
        Real.display();
    })
    .fail(function (a, b, c) {
        alert("Error")
    });
};

GuiInterface.prototype.loadAntenna = function (path) {
    var uri = 'api/Antenna/Get';
    var result;
    $.ajax({
        url: uri,
        type: "GET",
        data: "Allgon_7333_00_1900.apa",
        datatype: "json",
        beforeSend: function () { },
        complete: function () { }
    })
    .done(function (data) {
        var Ant = new AntennaLoader();
        Ant.addAntenna(data);
    })
    .fail(function (a, b, c) {
        alert("Error")
    });
};