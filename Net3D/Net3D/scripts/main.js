var shp;
var dbf;
var apa;
var meas;
var mouse = { x: 0.0, y: 0.0 };
var fileInput;
var camera, hudcamera, controls, scene, hudscene, renderer, container;
var oda;
var buildLoad = false, isoLoad = false, antennaLoad = false;
var canvas, ctx, texture, sprite, oldintersect;

var min = {
    x: 0,
    y: 0,
    z: -1.5
};
var max = {
    x: 476839.25 - 475084.25,
    y: 553191.75 - 551864.25,
    z: 4.5
};
var res = {
    x: 1 / 2.5,
    y: 1 / 2.5,
    z: 1 / 1.5
};
var step = {
    x: 4,
    y: 4,
    z: 2
}


initialize();

function saveStatus(target) {
    fileInput = target.files;
    if (fileInput.length == 2) {
        var file1 = fileInput[0];
        var file2 = fileInput[1];
        //regular expressions!!!
        if (file1.name.match(/.*\.shp/) && file2.name.match(/.*\.dbf/)) {
            SHPParser.load(file1, shpLoad, shpLoadError);
            DBFParser.load(file2, dbfLoad, dbfLoadError);
        }
        else if (file1.name.match(/.*\.dbf/) && file2.name.match(/.*\.shp/)) {
            SHPParser.load(file2, shpLoad, shpLoadError);
            DBFParser.load(file1, dbfLoad, dbfLoadError);
        }
    }
    else if (fileInput.length == 1) {
        var file1 = fileInput[0];
        if (file1.name.match(/.*\.oda/)) {
            ODAParser.load(file1, odaLoad, odaLoadError);
        }
    }
    else
        throw (new Error("None or wrong file(s)!"));

}

function loadAntenna(target) {
    fileInput = target.files;
    if (fileInput.length < 1)
        throw (new Error("No file selected"));

    var file = fileInput[0];
    if (file.name.match(/.*\.apa/)) {
        APAParser.load(file, apaLoad, apaLoadError);
    }
    else
        throw (new Error("Probably wrong file type!"));
}

function loadMeasurement(target) {
    fileInput = target.files;
    if (fileInput.length < 1)
        throw (new Error("No file selected"));

    var file = fileInput[0];
    if (file.name.match(/.*\.txt/)) {
        MEASParser.load(file, measLoad, measLoadError);
    }
    else
        throw (new Error("Probably wrong file type!"));
}

function shpLoad(sh) {
    shp = sh;
    if (shp && dbf) {
        buildLoad = true;
    }
}

function dbfLoad(db) {
    dbf = db;
    if (shp && dbf) {
        buildLoad = true;
    }
}

function apaLoad(ap) {
    apa = ap;
    if (apa) {
        antennaLoad = true;
    }
}

function measLoad(mea) {
    meas = mea;

    if (meas) {
        var worker = new THREE.SHPWorker();
        meas = worker.fill(meas);
        meas = worker.expand(meas);
        meas = worker.extract(meas);

        isoLoad = true;
    }
}

function odaLoad(od) {
    //oda = od;
    //if (oda) {
    //    buildLoad = true;
    //}
}

function shpLoadError() {
    console.log('shp file failed to load');
}

function dbfLoadError() {
    console.log('dbf file failed to load');
}

function apaLoadError() {
    console.log('Antenna file failed to load');
}

function measLoadError() {
    console.log('Measurement file failed to load');
}

function odaLoadError() {
    console.log('oda file failed to load');
}

function initialize() {
    var width = window.innerWidth;
    var height = (window.innerWidth / 16) * 9;
    scene = new THREE.Scene();
    hudscene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 16 / 9, 2, 5000);
    hudcamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.1, 100);
    hudcamera.position.z = 10;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio);

    container = document.getElementById('ThreeJS');
    container.appendChild(renderer.domElement);
    renderer.setClearColor(0xeeeeee, 1);
    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = 10;

    camera.up = new THREE.Vector3(0, 0, 1);

    var axisHelper = new THREE.AxisHelper(2000);
    scene.add(axisHelper);

    geometry = new THREE.PlaneGeometry(max.x, max.y);
    material = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
    var plane = new THREE.Mesh(geometry, material);
    plane.position.x = max.x / 2;
    plane.position.y = max.y / 2;
    plane.receiveShadow = true;

    scene.add(plane);

    window.addEventListener('resize', onWindowResize, false);
    //document.addEventListener('mousemove', onMouseMoveDoc, false);

    //canvas = document.createElement('canvas');
    //canvas.style.border = "1px solid #d3d3d3";
    //ctx = canvas.getContext('2d');
    //ctx.font = "Bold 25px Arial";
    //ctx.fillStyle = "#000000";
    //ctx.fillText('Testing', 10, 25);

    //texture = new THREE.Texture(canvas);
    //texture.needsUpdate = true;

    //var SprMat = new THREE.SpriteMaterial({ map: texture}) //Alter to HUD!
    //sprite = new THREE.Sprite(SprMat);
    //sprite.scale.set(4, 2, 1);
    //sprite.position.set(0, 0, 1);
    //hudscene.add(sprite);

    setupGui();

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    var light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-50, -50, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    updateGUI(camera.position, controls.target, false);

    render();
}

function onMouseMoveDoc(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    updateGUI(camera.position, controls.target, false);

    //sprite.position.set(mouse.x, mouse.y + 25, 1);
}
function onWindowResize() {
    renderer.setSize(window.innerWidth, (window.innerWidth / 16) * 9);
}

function addBuild() {
    var worker = new THREE.SHPWorker();
    if (shp && dbf) {
        console.log('ok', shp);
        var loader = new THREE.SHPLoader();
        var Obj = loader.createModel(shp, true, dbf);
        //Obj.rotation.setFromVector3(new THREE.Vector3(-Math.PI / 2, 0, 0), 'XYZ');
        Obj.scale.set(1000, 1000, 0.001);
        var edges = [];
        for (var i = 0; i < Obj.children.length; i++) {
            edges[i] = new THREE.EdgesHelper(Obj.children[i], 0x000000);
        }
    }

    if (oda) {
        var loader = new ODAParser();
        var Obj = loader.createModel(oda); //IMPLEMENTIEREN!!
    }

    scene.add(Obj);
}

function addAntenna() {
    var worker = new THREE.SHPWorker();
    var antPos = new THREE.Vector3();
    var AntGeom;

    AntGeom = worker.createAntenna(apa);

    var antennaPat = new THREE.Mesh(AntGeom, new THREE.MeshLambertMaterial({
        color: 0xef1366,
        //opacity: 0.8,
        //transparent: true,
        side: THREE.BackSide
    }));

    antennaPat.scale.set(25, 25, 25);
    antennaPat.position.set(antPos.x, antPos.y, antPos.z);
    antennaPat.castShadow = true;
    antennaPat.receiveShadow = true;

    scene.add(antennaPat);
}

function addIso() {
    var Walker = new CubeMarcher();

    if (true) {
        var Volumepainter = new VolumeVisualizer();
        var volume = Volumepainter.dot(meas[0], min, max, res, step);
        volume.name = "dots";
        scene.add(volume);

        //camera.position.y = 500;
        //camera.position.x = volume.children[0].geometry.vertices[0].x;
        //camera.position.z = volume.children[0].geometry.vertices[0].z;
        //controls.target = volume.geometry.vertices[0];
    }
    if (true) {
        var geosurf = Walker.march(meas[0], -79, min, max, res);


        var isosurf = new THREE.Mesh(geosurf, new THREE.MeshBasicMaterial({
            color: guiController.isocolor,
            opacity: 0.8,
            transparent: true,
            side: THREE.DoubleSide
        }));
        isosurf.name = "isosurf";

        camera.position.z = 750;
        camera.position.x = isosurf.geometry.vertices[0].x;
        camera.position.y = isosurf.geometry.vertices[0].y;

        controls.target = isosurf.geometry.vertices[0];

        scene.add(isosurf);

        updateGUI(camera.position, controls.target, true);

        //var values = Walker.createExample(10, -3, 3, antPos);

        //var geosurf1 = Walker.march(values, 5, -3, 3, 10);
        //var isosurf1 = new THREE.Mesh(geosurf1, new THREE.MeshBasicMaterial({
        //    color: 0x008800,
        //    opacity: 0.8,
        //    transparent: true,
        //    side: THREE.DoubleSide
        //}));

        //var geosurf2 = Walker.march(values, 1.25, -3, 3, 10);
        //var isosurf2 = new THREE.Mesh(geosurf2, new THREE.MeshBasicMaterial({
        //    color: 0x008800,
        //    opacity: 0.35,
        //    transparent: true,
        //    side: THREE.DoubleSide
        //}));

        //var geosurf3 = Walker.march(values, 0.75, -3, 3, 10);
        //var isosurf3 = new THREE.Mesh(geosurf3, new THREE.MeshBasicMaterial({
        //    color: 0x00ff00,
        //    opacity: 0.1,
        //    transparent: true,
        //    side: THREE.DoubleSide
        //}));

        //scene.add(isosurf2);
        //scene.add(isosurf3);
    }
}


function updateRay() {
    var dir = new THREE.Vector3(mouse.x, mouse.y, 1);
    dir.unproject(camera);
    var ray = new THREE.Raycaster(camera.position, dir.sub(camera.position).normalize());

    var objs = ray.intersectObjects(scene.children, true);

    if (objs.length > 0) {
        if (objs[0].object != oldintersect) {
            if (oldintersect)
                oldintersect.material.color.setHex(oldintersect.currentHex);
            oldintersect = objs[0].object;
            oldintersect.currentHex = oldintersect.material.color.getHex();
            oldintersect.material.color.setHex(0xffff00);

            //if (objs[0].object.id) {
            //    ctx.clearRect(0, 0, 640, 480);
            //    var message = "" + objs[0].object.id;
            //    var metrics = ctx.measureText(message);
            //    var width = metrics.width;

            //    ctx.fillStyle = "#111111"; 
            //    ctx.fillRect(0, 0, width + 8, 25 + 8);
            //    ctx.fillStyle = "#cccccc";
            //    ctx.fillRect(2, 2, width + 4, 25 + 4);
            //    ctx.fillStyle = "#111111";
            //    ctx.fillText(message, 4, 20);
            //    texture.needsUpdate = true;
            //}
            //else {
            //    ctx.clearRect(0, 0, 300, 300);
            //    texture.needsUpdate = true;
            //}
        }
    }
    else {
        if (oldintersect)
            oldintersect.material.color.setHex(oldintersect.currentHex);
        oldintersect = null;
        //ctx.clearRect(0, 0, 300, 300);
        //texture.needsUpdate = true;
    }
}


function render() {
    if (buildLoad) {
        addBuild();
        buildLoad = false;
    }
    if (isoLoad) {
        addIso();
        isoLoad = false;
    }
    if (antennaLoad) {
        addAntenna();
        antennaLoad = false;
    }

    //updateRay();

    controls.update();
    requestAnimationFrame(render);

    //camera.lookAt(new THREE.Vector3(isosurf.geometry.vertices[0].x, 0, isosurf.geometry.vertices[0].z));
    renderer.clear();
    renderer.render(scene, camera);
    //renderer.clearDepth();
    //renderer.render(hudscene, hudcamera);
}
//render();




//var width = window.innerWidth;
//var height = (window.innerWidth / 16) * 9;
//var scene = new THREE.Scene();
//var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);

//var renderer = new THREE.WebGLRenderer({ antialias: true });
//renderer.setSize(width, height);
//document.body.appendChild(renderer.domElement);
//renderer.setClearColor(0xeeeeee, 1);

//var geometry = new THREE.BoxGeometry(1, 1, 1);
//var material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
//var cube = new THREE.Mesh(geometry, material);
//cube.position.y = 0.5;

//geometry = new THREE.ConeGeometry(Math.sqrt(2) / 2, 1, 4);
//var cone = new THREE.Mesh(geometry, material);

//geometry = new THREE.PlaneGeometry(50, 50, 10, 10);
//material = new THREE.MeshLambertMaterial({ color: 0x888888 });
//var plane = new THREE.Mesh(geometry, material);
//plane.rotation.x = -Math.PI / 2
//plane.receiveShadow = true;

//var PointLight = new THREE.PointLight(0xffffff, 1, 200, 1.5);
//PointLight.position.set(50, 50, 50)
//PointLight.castShadow = true;

//scene.add(plane)
//scene.add(PointLight)
//scene.add(cube);
//scene.add(cone);
//cone.position.y = 1.5;
//cone.rotation.y = Math.PI * 0.25;

//renderer.shadowMapEnabled = true;
//cone.castShadow = true;
//cone.receiveShadow = true;
//cube.castShadow = true;
//cube.receiveShadow = true;

//camera.position.y = 5
//function render(t) {
//    renderer.setSize(window.innerWidth, (window.innerWidth / 16) * 9);
//    requestAnimationFrame(render);
//    camera.position.x = Math.sin(t * 0.001) * 5;
//    camera.position.z = Math.cos(t * 0.001) * 10;
//    //cube.rotation.x += 0.1;
//    //cube.rotation.y += 0.1;

//    camera.lookAt(scene.position)
//    renderer.clear();
//    renderer.render(scene, camera);
//}
//render(new Date().getTime());
