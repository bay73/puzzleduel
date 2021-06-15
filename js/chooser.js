chooserBuilder = function(mouseController) {
  this.mouseController = mouseController;
  this.snap = mouseController.snap;
  this.chooserFilter = this.snap.filter("<feColorMatrix type='matrix' values='-.17 -.17 -.17 0 1 -.22 -.22 -.22 0 1 -.33 -.33 -.33 0 1 0 0 0 1 0'/>");
  this.element = null;
  this.chooserElements = [];
  this.highlighted = null;
}


chooserBuilder.prototype.createChooser = function(element) {
  if (this.chooserElements.length > 0) {
    if (this.element == element) {
      return;
    }
    this.remove();
  }
  var chooserSize = element.puzzle.chooserSize;
  if (chooserSize > 0) {
    this.element = element;
    this.drawChooser(element, chooserSize);
  }
}

chooserBuilder.prototype.remove = function() {
  this.chooserElements.forEach(elem => elem.remove());
  this.element = null;
  this.chooserElements = [];
  this.mouseController.removeChooserListener();
}

chooserBuilder.prototype.drawChooser = function(element, chooserSize){
  var center = element.center();
  var background = new chooserBackground(this, center, chooserSize);
  background.draw(center, chooserSize);
  this.chooserElements.push(background);
  var values = element.chooserData();
  var angle = Math.PI * 2 / values.length;
  var distance = 1. / (1. + Math.sin(angle/2));
  for (var i=0;i<values.length;i++){
    var toggler = new chooserToggler(this, center, i*angle, distance, chooserSize, i);
    toggler.draw(values[i]);
    this.chooserElements.push(toggler);
  }
}

chooserBuilder.prototype.processMove = function(position) {
  if (this.highlighted) {
    this.highlighted.highlight(false);
    this.highlighted = null;
  }
  this.highlighted = this.elementForPosition(position);
  if (this.highlighted) {
    this.highlighted.highlight(true);
  }
}

chooserBuilder.prototype.elementForPosition = function(position) {
  var elementForPosition = null
  this.chooserElements.forEach(element => elementForPosition = element.isPointInside(position)?element:elementForPosition);
  return elementForPosition;
}


///////////////////////////////////////////////////////

chooserElement = function(chooserBuilder, center, size) {
  this.chooserBuilder = chooserBuilder;
  this.snap = chooserBuilder.snap;
  this.center = center;
  this.size = size;
  this.drawElements = [];
}

chooserElement.prototype.remove = function() {
  this.drawElements.forEach(elem => elem.remove());
  this.drawElements = [];
}

chooserElement.prototype.isPointInside = function(position) {
  return this.distanceSquare(position, this.center) < this.size*this.size;
}

chooserElement.prototype.canDragStart = function() {
  return false;
}

chooserElement.prototype.distanceSquare = function(point1, point2) {
  // Utility function to find disatnce between points
  return (point1.x-point2.x)*(point1.x-point2.x) + (point1.y-point2.y)*(point1.y-point2.y);
}

chooserElement.prototype.useChooser = function() {
  return false;
}

////////////////////////////////////////////////
chooserToggler = function(chooserBuilder, chooserCenter, angle, distance, chooserSize, index) {
  var size = chooserSize*(1.-distance);
  var center = {
    x: chooserCenter.x + Math.sin(angle)*chooserSize*distance,
    y: chooserCenter.y - Math.cos(angle)*chooserSize*distance
  };
  this.distance = distance;
  this.valueIndex = index;
  chooserElement.call(this, chooserBuilder, center, size);
}

Object.setPrototypeOf(chooserToggler.prototype, chooserElement.prototype);

chooserToggler.prototype.draw = function(value) {
  var puzzle = this.chooserBuilder.element.puzzle;
  this.togglerCircle = this.snap.circle(this.center.x, this.center.y, this.size);
  this.togglerCircle.attr({stroke: "#430", strokeWidth: 2, fill: "#750", opacity: 0.1});
  this.defaultOpacity = 0.1;
  if (typeof puzzle.typeProperties.toChooserShow=="function") {
    showValue = puzzle.typeProperties.toChooserShow(value);
  } else {
    showValue = value;
  }
  if (showValue.color) {
    this.togglerCircle.attr({fill: showValue.color, opacity: 0.5});
    this.defaultOpacity = 0.5;
  }
  this.drawElements.push(this.togglerCircle);

  if (showValue.image) {
    var togglerImage = this.snap.image(
      puzzle.imageUrl(showValue.image),
      this.center.x - this.size,
      this.center.y - this.size,
      this.size*2,
      this.size*2);
    togglerImage.attr({filter: this.chooserBuilder.chooserFilter});
    this.drawElements.push(togglerImage);
  }
  if (showValue.text) {
    var width = this.size*1.2;
    if (showValue.text!=null && showValue.text.length==1) {
      width = 0.6*this.size;
    }
    var togglerText = this.snap.text(
      this.center.x-width/2, this.center.y + this.size*0.4, showValue.text);
    var attr = Object.assign({}, puzzle.gridProperty.font);
    var textColor = showValue.textColor;
    if (typeof textColor == 'undefined'){
      textColor = "white";
      var filter = "";
    } else {
      var filter = this.chooserBuilder.chooserFilter;
    }
    Object.assign(attr, {"fill": textColor, "filter": filter, "font-size": this.size*1.2,"textLength": width });
    togglerText.attr(attr);
    this.drawElements.push(togglerText);
  }

}

chooserToggler.prototype.processDragEnd = function() {
  this.chooserBuilder.element.switchOnChooser(this.valueIndex);
  this.chooserBuilder.remove();
  return false;
}

chooserToggler.prototype.processClick = function() {
  this.chooserBuilder.element.switchOnChooser(this.valueIndex);
  this.chooserBuilder.remove();
}

chooserToggler.prototype.highlight = function(isOn) {
  this.togglerCircle.attr({opacity: this.defaultOpacity + (isOn ? 0.4 : 0)});
}

///////////////////////////////////////////////////////////////////

chooserBackground = function(chooserBuilder, center, size) {
  chooserElement.call(this, chooserBuilder, center, size);
}

Object.setPrototypeOf(chooserBackground.prototype, chooserElement.prototype);

chooserBackground.prototype.draw = function(size) {
  var circle = this.snap.circle(this.center.x, this.center.y, this.size);
  circle.attr({fill: "#750", opacity: 0.5});
  this.drawElements.push(circle);
}

chooserBackground.prototype.processDragEnd = function() {
  return false;
}

chooserBackground.prototype.processClick = function() {
  this.chooserBuilder.remove();
}

chooserBackground.prototype.highlight = function() {
}

