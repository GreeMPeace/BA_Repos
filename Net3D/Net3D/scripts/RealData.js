function RealData(data) {
    this.min = data.min;
    this.max = data.max;
    this.x = data.x;
    this.y = data.y;
    this.vals = data.vals;
}

RealData.prototype.render = function () {
    var length = 50;
    var xMiddle = (this.max[0] + this.min[0]) / 2;
    var yMiddle = (this.max[1] + this.min[1]) / 2;
    var geometry = new THREE.PlaneGeometry(length, length);
    var xcoeef = length / (this.max[2] - this.min[2]);
    var ycoeef = length / (this.max[3] - this.min[3]);
    var streetmap = new THREE.TextureLoader().load("/Maps/2600_urban_Prx_Aachen.png");
    streetmap.minFilter = THREE.LinearFilter;
    material = new THREE.MeshLambertMaterial({
        //color: 0xeeeeee,
        map: streetmap
    });
    var plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;

    scene.add(plane);

    geometry = new THREE.Geometry();
    for (var i = 0; i < this.vals.length; i++) {
        var vec = new THREE.Vector3(xcoeef * (this.x[i] - xMiddle), ycoeef * (this.y[i] - yMiddle), 0.2);
        geometry.vertices.push(vec);
        var value = (this.vals[i][0] - this.min[4]) / (this.max[4] - this.min[4]);
        var color = new THREE.Color("hsl(0, 100%, 50%)");
        color.setHSL((value) / 3, 1, 0.5);
        geometry.colors.push(color);
    }
    var points = new THREE.Points(geometry, new THREE.PointsMaterial({
        //color: 0xff0000,
        size: 0.2,
        vertexColors: THREE.VertexColors
    }));

    scene.add(points);

    lowerBound = this.min[4];
    upperBound = this.max[4];
    var strip = new THREE.TextureLoader().load("/data/Colorstrip.png", this.addColorstrip);
    //var width = strip.image.width;
};

RealData.prototype.addColorstrip = function addColorstrip(texture) {

    texture.minFilter = THREE.LinearFilter;
    material = new THREE.SpriteMaterial({
        //color: 0xeeeeee,
        map: texture
    });
    var imgwidth = material.map.image.width;
    var imgheight = material.map.image.height;

    var sprite = new THREE.Sprite(material);
    sprite.scale.set(imgwidth, imgheight, 1);
    sprite.position.set(width / 2 - imgwidth / 2 - 5, -height / 2 + 1.5 * imgheight + 5, 1);
    sprite.name = "ColorstripCol";

    hudscene.add(sprite);

    var canvas = document.createElement('canvas');
    canvas.width = imgwidth;
    canvas.height = imgheight;
    var ctx = canvas.getContext('2d');
    ctx.font = "18px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, imgwidth, imgheight);
    ctx.fillStyle = "#000000";
    ctx.fillText(lowerBound.toFixed(2) + "dB", 4, canvas.height/2 + 9);
    var metrics = ctx.measureText(upperBound.toFixed(2) + "dB")
    ctx.fillText(upperBound.toFixed(2) + "dB", canvas.width - metrics.width - 4, canvas.height);

    texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var SprMat = new THREE.SpriteMaterial({ map: texture });
    sprite = new THREE.Sprite(SprMat);
    sprite.scale.set(imgwidth, imgheight, 1);
    sprite.position.set(width / 2 - imgwidth / 2 - 5, -height / 2 + imgheight / 2 + 5, 1);
    sprite.name = "ColorstripNum";

    hudscene.add(sprite);

};

RealData.updateSprites = function () {
    var Strip = hudscene.getObjectByName("ColorstripCol");
    var Legend = hudscene.getObjectByName("ColorstripNum");
    if (Strip != undefined) {
        var imgwidth = Strip.material.map.image.width;
        var imgheight = Strip.material.map.image.height;
        Strip.position.set(width / 2 - imgwidth / 2 - 5, -height / 2 + 1.5 * imgheight + 5, 1);
        Legend.position.set(width / 2 - imgwidth / 2 - 5, -height / 2 + imgheight / 2 + 5, 1);
    }
}

var lowerBound, upperBound;