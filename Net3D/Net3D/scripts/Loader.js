GuiInterface = function () { };

GuiInterface.prototype.loadBuildings = function (path) {
    var uri = 'api/Building/Get/' + path.replace(".", ";");
    $.ajax({
        url: uri,
        type: "GET",
        datatype: "json",
        beforeSend: function () { },
        complete: function () { }
    })
    .done(function (data) {
        var Build = new BuildingLoader();
        Build.addBuild(data);
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
        var Simul = new SimulationLoader();
        Simul.expand(data);
        meas = data;
        Simul.visualize();
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