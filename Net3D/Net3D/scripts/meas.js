MEASParser = function () { };

MEASParser.load = function (src, callback, onerror) {
    //var reader = new FileReader();
    //reader.onload = function (obj) {
    //    var d = new MEASParser().parse(obj.target.result, src);
    //    callback(d);
    //}
    //reader.onerror = onerror;
    //reader.readAsText(src);

    var uri = 'api/Measurement/GetSimulation/703-532-1';
    var result;
    $.ajax({
        url: uri,
        type: "GET",
        datatype: "json",
        beforeSend: function () { },
        complete: function () { }
    })
    .done(function (data) {
        meas = data;
        if (meas) {
            isoLoad = true;
        }
        //$.each(data, function (i, item) {
        //    alert("" + item.height);
        //});
    })
    .fail(function (a, b, c) {
        alert("Error")
    });
};

MEASParser.prototype.parse = function (Buffer, src) {
    var lines = Buffer.split(/\n/);
    var values = [];
    var line;

    for (var i = 0; i < lines.length - 1; i++) {
        if (i == 0)
            continue;
        values[values.length] = {};
        line = [];
        line = lines[i].split(/\s+/);
        values[values.length - 1].x = Number(line[1]);
        values[values.length - 1].y = Number(line[2]);
        values[values.length - 1].z = Number(line[3]);
        values[values.length - 1].vals = [];
        for (var j = 4; j < line.length - 1; j++)
            values[values.length - 1].vals[j-4] = Number(line[j]);
    }
    
    return values;
};