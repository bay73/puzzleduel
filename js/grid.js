var gridElement = function(puzzle){
  // Element of the grid.
  this.puzzle = puzzle;
  this.isClue = false;
  this.data = {};
  this.elements = {};
  this.data = {text: null, image: null, color: null, textColor: null};
  this.pencilData = null;
  this.clickSwitch = null;
  this.dragSwitch = null;
  this.pencilClickSwitch = null;
  this.pencilDragSwitch = null;
  this.chooserValues = null;
  this.dragProcessor = null;
}

gridElement.prototype.distanceSquare = function(point1, point2) {
  // Utility function to find disatnce between points
  return (point1.x-point2.x)*(point1.x-point2.x) + (point1.y-point2.y)*(point1.y-point2.y);
}

// Data control functions
gridElement.prototype.clearData = function() {
  this.data = {text: null, image: null, color: null, textColor: null};
  this.redraw();
}

gridElement.prototype.setClue = function(clueData) {
  this.isClue = true;
  this.data = Object.assign({text: null, image: null, color: null, textColor: null}, clueData);
  this.redraw();
}

gridElement.prototype.switchToData = function(data) {
  var oldData = this.data;
  var self = this;
  this.puzzle.addStep(()=>{self.data = oldData; self.redraw()});
  this.data = Object.assign({text: null, image: null, color: null, textColor: null}, data);
  this.pencilData = null;
  this.redraw();
}

gridElement.prototype.setPencilData = function(data) {
  this.pencilData = Object.assign({text: null, image: null, color: null, textColor: null}, data);
  this.redraw();
}

// Process events
gridElement.prototype.compareData = function(data, template) {
  function same(value1, value2) {
    return (typeof value1 == "undefined" || value2 == value1) && (typeof value1 != "undefined" || value2 == null);
  }
  return same(data.image, template.image) && same(data.text, template.text)
      && same(data.color, template.color) && same(data.textColor, template.textColor);
}

gridElement.prototype.findCurrent = function(dataArray) {
  for (var i=0; i<dataArray.length; i++){
    if (this.compareData(dataArray[i], this.data)) {
       return i;
    }
  }
  return 0;
}

gridElement.prototype.findCurrentPencil = function(dataArray) {
  if (this.pencilData != null && typeof this.pencilData === "object") {
    for (var i=0; i<dataArray.length; i++){
      if (this.compareData(dataArray[i], this.pencilData)) {
         return i;
      }
    }
  }
  return 0;
}

gridElement.prototype.processClick = function() {
  // Element get click event.
  if (this.puzzle.pencilMarkMode) {
    if (this.clickSwitch != null) {
      var currentIndex = this.findCurrentPencil(this.pencilClickSwitch);
      this.setPencilData(this.pencilClickSwitch[(currentIndex + 1)%this.clickSwitch.length]);
    }
  } else {
    if (this.clickSwitch != null) {
      var currentIndex = this.findCurrent(this.clickSwitch);
      this.switchToData(this.clickSwitch[(currentIndex + 1)%this.clickSwitch.length]);
    }
  }
  return null;
}

gridElement.prototype.switchOnDrag = function() {
  // Switch state of element when it's drag over (initiated by anothe elements).
  if (this.puzzle.pencilMarkMode) {
    if (this.dragSwitch != null) {
      var currentIndex = this.findCurrentPencil(this.pencilDragSwitch);
      this.setPencilData(this.pencilDragSwitch[(currentIndex + 1)%this.dragSwitch.length]);
    }
  } else {
    if (this.dragSwitch != null) {
      var currentIndex = this.findCurrent(this.dragSwitch);
      this.switchToData(this.dragSwitch[(currentIndex + 1)%this.dragSwitch.length]);
    }
  }  
  return null;
}


gridElement.prototype.getValue = function() {
  if (this.clickSwitch != null) {
    var currentIndex = this.findCurrent(this.clickSwitch);
    return this.clickSwitch[currentIndex].returnValue;
  }
}

// Drawing utility
gridElement.prototype.snapImage = function(center, size, image) {
  return this.puzzle.snap.image(
    this.puzzle.imageUrl(image),
    center.x-size/2, center.y-size/2, size, size);
}


gridElement.prototype.snapText = function(center, size, text) {
  var width = size;
  if (text!=null && text.length==1) {
    width = 0.55*size;
  }
  var textElement = this.puzzle.snap.text(
    center.x-width/2, center.y + size*0.35, text);
  var attr = Object.assign({}, this.puzzle.gridProperty.font);
  Object.assign(attr, {"font-size": size,"textLength": width });
  textElement.attr(attr);
  return textElement;
}


// Drawing
// render - creates element frame
// draw - creates all snap elements needed for data
gridElement.prototype.draw = function() {
  if (typeof this.elements.path == "undefined") {
    this.elements.path = this.render();
  }
  this.clearElements();
  if (this.data.color) {
    this.elements.color = this.drawColor();
  }
  if (this.data.image) {
    this.elements.image = this.drawImage();
  }
  if (this.data.text) {
    this.elements.text = this.drawText();
  }
  if (this.pencilData && this.pencilData.color) {
    this.elements.pencilColor = this.drawPencilColor();
  }
  if (this.pencilData && this.pencilData.image) {
    this.elements.pencilImage = this.drawPencilImage();
  }
  if (this.pencilData && this.pencilData.text) {
    this.elements.pencilText = this.drawPencilText();
  }
}

gridElement.prototype.redraw = function() {
  this.draw();
}

gridElement.prototype.clearElements = function() {
  // Removes all visual elements.
  var clearElementIfExists = function(element) {
    if (typeof element != "undefined" && element != null) {
      if (typeof element === "object") {
        element.remove();
      } else if  (typeof element === "array") {
        element.forEach(item => item.remove());
      }
    }
  }
  this.clearColor();
  clearElementIfExists(this.elements.image);
  this.elements.image = null;
  clearElementIfExists(this.elements.text);
  this.elements.text = null;
  this.clearPencilColor();
  clearElementIfExists(this.elements.pencilImage);
  this.elements.pencilImage = null;
  clearElementIfExists(this.elements.pencilTex);
  this.elements.pencilText = null;
}

gridElement.prototype.markError = function() {
  var center = this.center();
  var errorElem = this.puzzle.snap.circle(center.x, center.y, 0);
  errorElem.attr({fill: this.puzzle.colorSchema.errorColor, opacity: 0.5});
  var radius = this.puzzle.size.unitSize/2;
  // Blinking animation
  var errorInterval = setInterval(() => {
      errorElem.attr({r: 0});
      errorElem.animate({r: radius}, 200);
    }, 400);
  // Remove animation after 5 sec.
  setTimeout(() => {errorElem.remove(); clearInterval(errorInterval);}, 5000);
}

// Functions to implement by children classes.
gridElement.prototype.processDragEnd = function(startElement) {
  return false;
}

gridElement.prototype.processDragMove = function(startElement) {
  return false;
}

gridElement.prototype.supportMouse = function() {
  return this.clickSwitch != null || this.chooserValues != null || this.dragProcessor != null;
}

gridElement.prototype.canDragStart = function() {
  return this.dragProcessor != null ;
}

gridElement.prototype.center = function() {
  // Returns the center point of the element.
  throw 'center is not implemented for ' + this.constructor.name + '!';
}

gridElement.prototype.isPointInside = function(position) {
  // Check the mouse pointing to the element.
  throw 'isPointInside is not implemented for ' + this.constructor.name + '!';
}

gridElement.prototype.render = function() {
  // Renders the element. Returns the snap element.
  throw 'render is not implemented for ' + this.constructor.name + '!';
}

gridElement.prototype.render = function() {
  // Renders the element. Returns the snap element.
  throw 'render is not implemented for ' + this.constructor.name + '!';
}

gridElement.prototype.drawColor = function() {
  // Paint the element. Returns the snap element.
  throw 'drawColor is not implemented for ' + this.constructor.name + '!';
}

gridElement.prototype.clearColor = function() {
  // Paint the element. Returns the snap element.
  throw 'clearColor is not implemented for ' + this.constructor.name + '!';
}

gridElement.prototype.drawImage = function() {
  // Put image to the element. Returns the snap element.
  throw 'drawImage is not implemented for ' + this.constructor.name + '!';
}

gridElement.prototype.drawText = function() {
  // Put text to the element. Returns the snap element.
  throw 'drawText is not implemented for ' + this.constructor.name + '!';
}

gridElement.prototype.drawPencilColor = function() {
  // Paint pencil color for the element. Returns the snap element.
  throw 'drawPencilColor is not implemented for ' + this.constructor.name + '!';
}

gridElement.prototype.clearPencilColor = function() {
  // Paint pencil color for the element. Returns the snap element.
  throw 'clearPencilColor is not implemented for ' + this.constructor.name + '!';
}

gridElement.prototype.drawPencilImage = function() {
  // Put pencil image to the element. Returns the snap element.
  throw 'drawPencilImage is not implemented for ' + this.constructor.name + '!';
}

gridElement.prototype.drawPencilText = function() {
  // Put pencil text to the element. Returns the snap element.
  throw 'drawPencilText is not implemented for ' + this.constructor.name + '!';
}

gridElement.prototype.getCoordinates = function() {
  // Returns the coordinate of element in the grid.
  throw 'getCoordinates is not implemented for ' + this.constructor.name + '!';
}

