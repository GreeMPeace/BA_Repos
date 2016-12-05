var scene, hudscene, width, height, camera, hudcamera, renderer, container, hudcon, realcon, simulcon, buildingcon, stats;
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
    x: 2,
    y: 2,
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
    renderer.shadowMap.enabled = true;
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

    stats = new Stats();
    stats.dom.style.position = "fixed";
    stats.dom.style.left = "500px";
    container.appendChild(stats.dom)


    var light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);

    var light2 = new THREE.PointLight(0x404040, 1); // soft white light
    light2.position.x = -100;
    light2.position.y = -100;
    light2.position.z = 50;
    light2.shadowCameraVisible = true;
    //scene.add(light2);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-50, -50, 50);
    directionalLight.castShadow = true;
    //directionalLight.shadow.camera.near = 0;
    //directionalLight.shadow.camera.far = 500;

    //directionalLight.shadow.camera.left = -5;
    //directionalLight.shadow.camera.right = 5;
    //directionalLight.shadow.camera.top = 5;
    //directionalLight.shadow.camera.bottom = -5;
    scene.add(directionalLight);

    //var loader = new GuiInterface();
    //loader.loadAntenna("test");

    

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    hudcon.updateData(camera.position, controls.target);
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

    stats.update();
    renderer.clear();
    renderer.render(scene, camera);
}