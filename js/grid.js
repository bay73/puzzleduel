var gridElement = function(puzzle){
  // Element of the grid.
  this.puzzle = puzzle;
  this.isClue = false;
  this.isFinal = false;
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
  if (!this.isFinal) {
    this.data = {text: null, image: null, color: null, textColor: null};
    this.pencilData = null;
    this.redraw();
  }
}

gridElement.prototype.setClue = function(clueData) {
  this.isClue = true;
  if (this.isFinal) {
    this.data = Object.assign(this.data, clueData);
  } else {
    this.data = Object.assign({text: null, image: null, color: null, textColor: null}, clueData);
  }
  this.redraw();
}

gridElement.prototype.revertTo = function(oldData, oldPencilData, noLogging) {
  this.data = oldData;
  this.pencilData = oldPencilData;
  if (noLogging) {
  } else {
    var coord = this.getLogCoordinates();
    let logItem = this.dataToLog(oldData);
    logItem.a = "revert";
    this.puzzle.logStep(coord, logItem);
  }
  this.redraw();
}

gridElement.prototype.switchToData = function(data, noLogging) {
  var oldData = Object.assign({}, this.data);
  if (noLogging==true) {
  } else {
    if (this.hasMultiPencil()) {
      var oldPencilData = [];
      if (this.pencilData) {
        for (var i=0; i<this.pencilData.length; i++){
          oldPencilData.push(Object.assign({}, this.pencilData[i]));
        }
      }
    } else {
      var oldPencilData = Object.assign({}, this.pencilData);
    }
    var self = this;
    var coord = this.getLogCoordinates();
    this.puzzle.addStep(()=>self.revertTo(oldData, oldPencilData, false));
    this.puzzle.logStep(coord, this.dataToLog(data))
  }
  this.data = Object.assign({text: null, image: null, color: null, textColor: null}, data);
  if (!data.keepPencil) {
    this.pencilData = null;
  }
  this.redraw();
}

gridElement.prototype.dataToLog = function(data) {
  if (Array.isArray(data)) {
    let self = this;
    let result = [];
    data.forEach(item => result.push(self.dataToLog(item)));
    return result;
  } else {
    let result  = {};
    if (data.text) {
      result.t = data.text;
    }
    if (data.image) {
      result.i = data.image;
    }
    if (data.color) {
      result.c = data.color;
    }
    if (data.textColor) {
      result.f = data.textColor;
    }
    return result;
  }
}

gridElement.prototype.applyLogData = function(logData) {
  function decodeLogData(logData) {
    let data = {text: null, image: null, color: null, textColor: null};
    if (logData) {
      if (logData.t) {
        data.text = logData.t;
      }
      if (logData.c) {
        data.color = this.puzzle.decodeColor(logData.c);
      }
      if (logData.i) {
        data.image = logData.i;
      }
      if (logData.f) {
        data.textColor = logData.f;
      }
    }
    return data
  }
  if (logData && logData.a=='pencil') {
    var data;
    if(Array.isArray(logData.v)) {
      data = logData.v.map(item => decodeLogData(item));
    } else {
      data = decodeLogData(logData.v);
    }
    this.pencilData = data;
    this.redraw();
  } else {
    this.switchToData(decodeLogData(logData), true);
  }
}

gridElement.prototype.setPencilData = function(data, noLogging) {
  if (noLogging) {
  } else {
    var oldData = Object.assign({}, this.data);
    if (this.hasMultiPencil()) {
      var oldPencilData = [];
      if (this.pencilData) {
        for (var i=0; i<this.pencilData.length; i++){
          oldPencilData.push(Object.assign({}, this.pencilData[i]));
        }
      }
    } else {
      var oldPencilData = Object.assign({}, this.pencilData);
    }
    var self = this;
    this.puzzle.addStep(()=>self.revertTo(oldData, oldPencilData, false));
  }
  if (this.hasMultiPencil()){
    if (!this.pencilData) {
      this.pencilData = [];
    }
    var bFound = false;
    for (var i=0; i<this.pencilData.length; i++){
      if (this.compareData(this.pencilData[i], data)) {
        this.pencilData.splice(i,1);
        bFound = true;
      }
    }
    if (!bFound) {
      this.pencilData.push(Object.assign({text: null, image: null, color: null, textColor: null}, data));
    }
  } else {
    this.pencilData = Object.assign({text: null, image: null, color: null, textColor: null}, data);
  }
  if (noLogging) {
  } else {
    let logItem = {a: "pencil", v: this.dataToLog(this.pencilData)};
    this.puzzle.logStep(this.getLogCoordinates(), logItem);
  }
  this.redraw();
}

// Process events
gridElement.prototype.compareData = function(data, template) {
  function same(value1, value2) {
    return value2 == value1 || (typeof value1 == "undefined" && typeof value2 == "undefined") || (typeof value1 == "undefined" && value2 == null) || (value1 == null && typeof value2 == "undefined");
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
    if (this.pencilClickSwitch != null) {
      var currentIndex = this.findCurrentPencil(this.pencilClickSwitch);
      this.setPencilData(this.pencilClickSwitch[(currentIndex + 1)%this.pencilClickSwitch.length], false);
      return true;
    }
  } else {
    if (this.clickSwitch != null) {
      var currentIndex = this.findCurrent(this.clickSwitch);
      this.switchToData(this.clickSwitch[(currentIndex + 1)%this.clickSwitch.length], false);
      return true;
    }
  }
  return false;
}

gridElement.prototype.switchOnDrag = function() {
  // Switch state of element when it's drag over (initiated by anothe elements).
  if (this.puzzle.pencilMarkMode) {
    if (this.pencilDragSwitch != null) {
      var currentIndex = this.findCurrentPencil(this.pencilDragSwitch);
      this.setPencilData(this.pencilDragSwitch[(currentIndex + 1)%this.pencilDragSwitch.length], false);
    }
  } else {
    if (this.dragSwitch != null) {
      var currentIndex = this.findCurrent(this.dragSwitch);
      this.switchToData(this.dragSwitch[(currentIndex + 1)%this.dragSwitch.length], false);
    }
  }  
  return null;
}

gridElement.prototype.switchOnChooser = function(index) {
  if (this.chooserValues != null) {
    if (this.puzzle.typeProperties.usePlus10 > 0 && this.chooserValues.length > this.puzzle.typeProperties.usePlus10 && index == this.puzzle.typeProperties.usePlus10) {
      var currentIndex = this.findCurrent(this.chooserValues);
      index = currentIndex + 10;
      if (index >= this.chooserValues.length) {
        index -= this.chooserValues.length;
      }
    }
    if (this.puzzle.pencilMarkMode) {
      this.setPencilData(this.chooserValues[index], false);
    } else {
      this.switchToData(this.chooserValues[index], false);
    }
  }
  return null;
}

gridElement.prototype.getValue = function() {
  if (this.clickSwitch != null) {
    var currentIndex = this.findCurrent(this.clickSwitch);
    if (this.clickSwitch[currentIndex].returnValue) {
      return this.clickSwitch[currentIndex].returnValue;
    }
  }
  if (this.chooserValues != null) {
    var currentIndex = this.findCurrent(this.chooserValues);
    if (this.chooserValues[currentIndex].returnValue) {
      return this.chooserValues[currentIndex].returnValue;
    }
  }
  if (this.dragSwitch != null) {
    var currentIndex = this.findCurrent(this.dragSwitch);
    if (this.dragSwitch[currentIndex].returnValue) {
      return this.dragSwitch[currentIndex].returnValue;
    }
  }
  return null;
}

// Drawing utility
gridElement.prototype.snapImage = function(center, size, imageName) {
  function addBase64Source(sourceImg, defElement) {
      const canvas = document.createElement('canvas');
      canvas.width = sourceImg[0].naturalWidth;
      canvas.height = sourceImg[0].naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(sourceImg[0], 0, 0);
      const base64String = canvas.toDataURL('image/png');
      $(defElement.node).attr("xlink:href", base64String)
  }
  const snap = this.puzzle.snap;
  const imageId = imageName + "-" + Math.round(size).toString()
  if ($(snap.defs).children("image#"+imageId).length == 0) {
    let defElement = snap.image(this.puzzle.imageUrl(imageName), 0, 0, size, size).toDefs()
    $(defElement.node).attr("id", imageId)
    const sourceImg = $("<img src='"+this.puzzle.imageUrl(imageName)+"'>")
    // Wait until the source image is fully loaded
    if (!sourceImg.complete) {
      sourceImg.on("load", function () {
        addBase64Source(sourceImg, defElement);
      });
    } else {
      addBase64Source(sourceImg, defElement);
    }
  }
  const element = snap.use(imageId)
  element.attr({
    x: center.x-size/2,
    y: center.y-size/2
  })
  return element
}


gridElement.prototype.snapText = function(center, size, text) {
  var width = size;
  if (text=="I") {
    width = 0.25*size;
  } else if (text!=null && text.length==1) {
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
  if (typeof this.elements.group == "undefined") {
    this.elements.group = this.puzzle.snap.g();
    this.elements.path = this.render();
  }
  this.clearElements();
  if (Array.isArray(this.pencilData)) {
    this.elements.pencilImage = this.drawPencilImage();
    this.elements.pencilText = this.drawPencilText();
  } else {
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
  if (this.data.color) {
    this.elements.color = this.drawColor();
  }
  if (this.data.image) {
    this.elements.image = this.drawImage();
  }
  if (this.data.text) {
    this.elements.text = this.drawText();
  }
  var group = this.elements.group;
  var addElementIfExists = function(element) {
    if (typeof element != "undefined" && element != null) {
      if (typeof element === "object") {
        group.add(element);
      } else if  (typeof element === "array") {
        element.forEach(item => {
          group.add(item);
        });
      }
    }
  }
  addElementIfExists(this.elements.path);
  addElementIfExists(this.elements.pencilColor);
  addElementIfExists(this.elements.pencilImage);
  addElementIfExists(this.elements.pencilText);
  addElementIfExists(this.elements.color);
  addElementIfExists(this.elements.image);
  addElementIfExists(this.elements.text);
}

gridElement.prototype.redraw = function() {
  this.draw();
}

gridElement.prototype.clearElements = function() {
  // Removes all visual elements.
  var group = this.elements.group;
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
  clearElementIfExists(this.elements.pencilText);
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

gridElement.prototype.useChooser = function() {
  return this.chooserValues != null;
}

gridElement.prototype.oneClickChooser = function() {
  return !this.disableOneClickChooser;
}

gridElement.prototype.chooserData = function() {
  if (this.puzzle.typeProperties.usePlus10 > 0 && this.chooserValues.length > this.puzzle.typeProperties.usePlus10) {
    var values = this.chooserValues.slice(0, this.puzzle.typeProperties.usePlus10);
    values.push({text: "+10"});
    return values;
  } else {
    return this.chooserValues;
  }
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

gridElement.prototype.getLogCoordinates = function() {
  // Returns the coordinate of element in the grid suitable fo logging.
  throw 'getLogCoordinates is not implemented for ' + this.constructor.name + '!';
}

gridElement.prototype.hasMultiPencil = function() {
  return false;
}

