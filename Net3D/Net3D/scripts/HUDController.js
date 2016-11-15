HUDController = function () {
    this.elements = [];
    this.figures = [];
    this.data = document.createElement('div');
    this.data.className = 'data-area';
    this.data.style.bottom = '0px';
    this.data.style.left = '0px';
    container.appendChild(this.data);
    this.hudtop = document.createElement('div');
    this.hudtop.style.position = 'fixed';
    this.hudtop.style.top = '0px';
    this.hudtop.style.left = '0px';
    container.appendChild(this.hudtop);
};

HUDController.prototype.getByName = function (name) {
    for (var i = 0; i < this.elements.length; i++) {
        if (this.elements[i].name == name)
            return this.elements[i].elem;
    }
    return null;
};

HUDController.prototype.addButton = function (name, text, onclick) {
    var loadButton = document.createElement('button');
    loadButton.className = "hudbutton";
    loadButton.textContent = text;
    //loadButton.style.left = pos.left;
    //loadButton.style.top = pos.top;
    loadButton.addEventListener("click", onclick);
    this.hudtop.appendChild(loadButton);
    this.elements[name] = loadButton;
};

HUDController.prototype.addDropdown = function (name, text, onclick) {
    var chooseArea = document.createElement('div');
    chooseArea.className = "drpdown";
    var chooseButton = document.createElement('button');
    chooseButton.className = "drpbutton";
    chooseButton.textContent = text[0];
    chooseArea.appendChild(chooseButton);
    var ItemArea = document.createElement('div');
    ItemArea.className = "drp-content";
    var elem;
    for (var i = 1; i < text.length; i++) {
        elem = document.createElement('a');
        elem.textContent = text[i];
        elem.addEventListener("click", onclick[i]);
        ItemArea.appendChild(elem);
    }
    chooseArea.appendChild(ItemArea);
    this.hudtop.appendChild(chooseArea);
    this.elements[name] = chooseArea;
};

HUDController.prototype.addData = function (onclick) {
    var xcoord = document.createElement('p');
    xcoord.textContent = "x: ";
    this.figures['xcoord'] = xcoord;
    this.data.appendChild(xcoord);
    var ycoord = document.createElement('p');
    ycoord.textContent = "y: ";
    this.figures['ycoord'] = ycoord
    this.data.appendChild(ycoord);
    var zcoord = document.createElement('p');
    zcoord.textContent = "z: ";
    this.figures['zcoord'] = zcoord
    this.data.appendChild(zcoord);
    var xtar = document.createElement('p');
    xtar.textContent = "xtar: ";
    this.figures['xtar'] = xtar;
    this.data.appendChild(xtar);
    var ytar = document.createElement('p');
    ytar.textContent = "ytar: ";
    this.figures['ytar'] = ytar;
    this.data.appendChild(ytar);
    var ztar = document.createElement('p');
    ztar.textContent = "ztar: ";
    this.figures['ztar'] = ztar;
    this.data.appendChild(ztar);
    var isolevel = document.createElement('p');
    isolevel.textContent = "isolevel: ";
    this.figures['isolevel'] = isolevel;
    this.data.appendChild(isolevel);
    this.data.addEventListener("click", onclick);
};

HUDController.prototype.updateData = function (position, target) {
    this.figures['xcoord'].textContent = "x: " + position.x.toFixed(2);
    this.figures['ycoord'].textContent = "y: " + position.y.toFixed(2);
    this.figures['zcoord'].textContent = "z: " + position.z.toFixed(2);
    this.figures['xtar'].textContent = "xtar: " + target.x.toFixed(2);
    this.figures['ytar'].textContent = "ytar: " + target.y.toFixed(2);
    this.figures['ztar'].textContent = "ztar: " + target.z.toFixed(2);
    this.figures['isolevel'].textContent = "isolevel: " + guiController.isolevel;
};