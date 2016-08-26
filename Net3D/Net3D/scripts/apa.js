APAParser = function () { };

APAParser.load = function (src, callback, onerror) {
    //var reader = new FileReader();
    //reader.onload = function (obj) {
    //    var d = new APAParser().parse(obj.target.result, src);
    //    callback(d);
    //}
    //reader.onerror = onerror;
    //reader.readAsText(src);
    var uri = 'api/Antenna';
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
        apa = data;
        if (apa) {
            antennaLoad = true;
        }
        //$.each(data, function (i, item) {
        //    alert("" + item.height);
        //});
    })
    .fail(function (a, b, c) {
        alert("Error")
    });
};

APAParser.prototype.parse = function (Buffer, src) {
    var lines = Buffer.split(/\n/);
    var vals = [];
    var antenna = [];

    for (var i = 0; i < lines.length; i++) {
        vals = [];
        if (lines[i].match(/\*.*/))
            continue;
        if (!(lines[i].match(/^\s+.*/)))
            continue;
        vals = lines[i].split(/\s+/);
        antenna[antenna.length] = {};
        antenna[antenna.length - 1].verAng = Number(vals[1]);
        antenna[antenna.length - 1].horAng = Number(vals[2]);
        antenna[antenna.length - 1].dirStr = Number(vals[3]);
    }
    return antenna;
};