var scene, hudscene, width, height, camera, hudcamera, renderer, container, hudcon;
var meas;
var buildings = [], antennas = [];

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
    x: 3,
    y: 3,
    z: 2
};


initialize();
render();

function initialize() {
    width = window.innerWidth;
    height = window.innerHeight;
    scene = new THREE.Scene();
    hudscene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 2, 5000);
    hudcamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 10);
    hudcamera.position.z = 10;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio);

    container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);
    renderer.setClearColor(0xeeeeee, 1);
    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = 200;

    camera.up = new THREE.Vector3(0, 0, 1);

    var axisHelper = new THREE.AxisHelper(2000);
    scene.add(axisHelper);

    window.addEventListener('resize', onWindowResize, false);
    //document.addEventListener('mousemove', onMouseMoveDoc, false);

    setupGui();

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    var light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-50, -50, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    updateGUI(camera.position, controls.target, false);

    var hudelement = document.createElement('div');
    var picture = document.createElement('img');
    var left = document.createElement('div');
    var right = document.createElement('div');
    left.innerText = "lower";
    left.style.position = "absolute";
    left.style.left = "0px";
    right.innerText = "higher";
    right.style.position = "absolute";
    right.style.right = "0px";
    hudelement.appendChild(picture);
    hudelement.appendChild(left);
    hudelement.appendChild(right);
    picture.setAttribute("src", "data/Colorstrip.png");
    hudelement.style.position = "absolute";
    hudelement.style.bottom = '20px';
    hudelement.style.right = '5px';
    hudelement.style.zIndex = "2";
    hudelement.style.backgroundColor = "#FFFFFF"
    container.appendChild(hudelement);

    hudcon = new HUDController();
    hudcon.addButton("loadFrank", "Load", guiController.loadFrank);

    var content = ["Mode: Single", "Single", "Maximum", "Distribution"];
    var funcs = [null, function () {
        guiController.mode = 'single';
        var loader = new SimulationLoader();
        loader.visualize();
    }, function () {
        guiController.mode = 'max';
        var loader = new SimulationLoader();
        loader.visualize();
    }, function () {
        guiController.mode = 'distribution';
        var loader = new SimulationLoader();
        loader.visualize();
    }];
    hudcon.addDropdown("modes", content, funcs);
    //var loadButton = document.createElement('div');
    //loadButton.className = "hudbutton";
    //loadButton.textContent = "Load Frankfurt";
    ////loadButton.style.left = "10px";
    ////loadButton.style.top = "10px";
    //loadButton.addEventListener("click", guiController.loadFrank);
    //container.appendChild(loadButton);

    //var chooseArea = document.createElement('div');
    //chooseArea.className = "drpdown";
    ////chooseArea.style.left = "300px";
    ////chooseArea.style.top = "10px";
    //var chooseButton = document.createElement('button');
    //chooseButton.className = "drpbutton";
    //chooseButton.textContent = "Choose Mode";
    //chooseArea.appendChild(chooseButton);
    //var ItemArea = document.createElement('div');
    //ItemArea.className = "drp-content";
    //var elem = document.createElement('a');
    //elem.textContent = "Item 1";
    //ItemArea.appendChild(elem);
    //var elem = document.createElement('a');
    //elem.textContent = "BiggerElement";
    //ItemArea.appendChild(elem);
    //var elem = document.createElement('a');
    //elem.textContent = "S";
    //ItemArea.appendChild(elem);
    //chooseArea.appendChild(ItemArea);
    //container.appendChild(chooseArea);
}

function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    hudcamera.left = -width / 2;
    hudcamera.right = width / 2;
    hudcamera.top = height / 2;
    hudcamera.bottom = -height / 2;
    hudcamera.updateProjectionMatrix();

    RealData.updateSprites();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    controls.update();
    requestAnimationFrame(render);

    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(hudscene, hudcamera);
}