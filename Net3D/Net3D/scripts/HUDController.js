HUDController = function () {
    this.elements = [];
    this.data = {};
    this.hudtop = document.createElement('div');
    this.hudtop.style.position = 'absolute';
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
    var loadButton = document.createElement('div');
    loadButton.className = "hudbutton";
    loadButton.textContent = text;
    //loadButton.style.left = pos.left;
    //loadButton.style.top = pos.top;
    loadButton.addEventListener("click", onclick);
    this.hudtop.appendChild(loadButton);
    var element = {};
    element.elem = loadButton;
    element.name = name;
    this.elements.push(element)
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
    var obj = {};
    obj.name = name;
    obj.elem = chooseArea;
    this.elements.push(obj);
}

HUDController.prototype.addData = function () {

}