define(["chooser"], function() {

mouseController = function(elements){
  this.elements = elements;
  this.mouseStartElement = null;
  this.dragHandler = null;
}

mouseController.prototype.attachEvents = function(snap) {
  this.snap = snap;
  this.handlerFilter = this.snap.filter("<feColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.7 0'/>");
  var self = this;
  self.mouseDown = function(event){self.onMouseDown(event)};
  self.mouseUp = function(event){self.onMouseUp(event)};
  this.snap.node.addEventListener("mousedown", self.mouseDown);
  this.snap.node.addEventListener("touchstart", self.mouseDown);
  this.snap.node.addEventListener("mouseup", self.mouseUp);
  this.snap.node.addEventListener("touchend", self.mouseUp);
  this.snap.node.addEventListener("touchcancel", self.mouseUp);
  this.chooserBuilder = new chooserBuilder(this);
}

mouseController.prototype.detachEvents = function() {
  var self = this;
  this.snap.node.removeEventListener("mousedown", self.mouseDown);
  this.snap.node.removeEventListener("touchstart", self.mouseDown);
  this.snap.node.removeEventListener("mouseup", self.mouseUp);
  this.snap.node.removeEventListener("touchend", self.mouseUp);
  this.snap.node.removeEventListener("touchcancel", self.mouseUp);
  this.chooserBuilder.remove();
}

mouseController.prototype.onMouseDown = function(event) {
  event.preventDefault();
  var element = this.eventElement(event);
  this.dragRestarted = false;
  if (element != null) {
    this.mouseStartElement = element;
    this.mouseDownElement = element;
    if (element.canDragStart()){
      self = this;
      this.clearDragHandler();
      this.dragHandler = {};
      this.dragHandler.listener = function(event){self.onMouseMove(event)};
      this.dragHandler.leaveListener = function(event){self.onMouseLeave(event)};
      this.snap.node.addEventListener("touchmove", this.dragHandler.listener, {passive: true});
      this.snap.node.addEventListener("mousemove", this.dragHandler.listener, {passive: true});
      this.snap.node.addEventListener("mouseleave", this.dragHandler.leaveListener, {passive: true});
    }
    if (element.useChooser()) {
      this.chooserBuilder.createChooser(element);
      self = this;
      this.chooserBuilder.listener = function(event){self.onMouseMove(event)};
      this.snap.node.addEventListener("touchmove", this.chooserBuilder.listener, {passive: true});
      this.snap.node.addEventListener("mousemove", this.chooserBuilder.listener, {passive: true});
    }
  }
}

mouseController.prototype.removeChooserListener = function() {
  this.snap.node.removeEventListener("touchmove", this.chooserBuilder.listener);
  this.snap.node.removeEventListener("mousemove", this.chooserBuilder.listener);
}

mouseController.prototype.onMouseUp = function(event) {
  event.preventDefault();
  if (this.mouseStartElement != null) {
    var element = this.eventElement(event);
    if (element) {
      if (element == this.mouseDownElement && !this.dragRestarted) {
        element.processClick();
      } else if (this.mouseStartElement.canDragStart()) {
        element.processDragEnd(this.mouseStartElement);
      }
    }
    this.mouseStartElement = null;
  }
  this.clearDragHandler();
}

mouseController.prototype.onMouseLeave = function(event) {
  this.mouseStartElement = null;
  this.clearDragHandler();
}

mouseController.prototype.onMouseMove = function(event) {
  var position = this.transformPoint(this.eventPosition(event));
  this.chooserBuilder.processMove(position);
  if (this.dragHandler) {
    if (this.dragHandler.path) {
      this.dragHandler.path.remove();
      this.dragHandler.path = null;
    }
    var element = this.eventElement(event);
    if (element != null) {
      var moveResult = element.processDragMove(this.mouseStartElement);
      if (moveResult) {
        if (moveResult.stopDrag) {
          this.clearDragHandler();
          this.mouseStartElement = null;
        } else {
          this.dragRestarted = true;
          this.mouseStartElement = moveResult.newMouseStartElement;
        }
      }
    }
    if (!this.dragHandler) {
      return;
    }
    var end = this.transformPoint(this.eventPosition(event));
    if (typeof this.mouseStartElement.drawDragHandler=="function") {
      this.dragHandler.path = this.mouseStartElement.drawDragHandler(end);
    } else {
      this.dragHandler.path = this.drawLineHandler(this.mouseStartElement, end);
    }
  }
}

mouseController.prototype.drawLineHandler = function(startElement, end) {
  var start = startElement.center();
  var path = this.snap.line(start.x, start.y,  end.x, end.y);
  path.attr(Object.assign({stroke: startElement.puzzle.colorSchema.traceColor}, startElement.puzzle.gridProperty.edge));
  return path;
}

mouseController.prototype.drawCopyHandler = function(startElement, end) {
  var elementGroup = this.snap.group();
  var data = startElement.data;
  var puzzle = startElement.puzzle;
  var unitSize = puzzle.size.unitSize*0.8;

  var circle = this.snap.circle(end.x, end.y, unitSize/2);
  circle.attr({fill: "#fff", opacity: 0.8});
  if (data.color) {
    circle.attr({fill: data.color, opacity: 0.5});
  }
  elementGroup.append(circle);

  if (data.image) {
    var image = this.snap.image(
      puzzle.imageUrl(data.image),
      end.x - unitSize/2,
      end.y - unitSize/2,
      unitSize,
      unitSize);
    image.attr({filter: this.handlerFilter});
    circle.attr({opacity: 0});
    elementGroup.append(image);
  }
  if (data.text) {
    var width = unitSize*0.7;
    if (data.text!=null && data.text.length==1) {
      width = unitSize*0.4;
    }
    var text = this.snap.text(end.x-width/2, end.y + unitSize*0.3, data.text);
    var attr = Object.assign({}, puzzle.gridProperty.font);
    var textColor = data.textColor;
    if (typeof textColor == 'undefined'){
      textColor = puzzle.colorSchema.textColor;
    }
    Object.assign(attr, {"fill": textColor, "filter": this.handlerFilter, "font-size": unitSize*0.7, "textLength": width });
    text.attr(attr);
    circle.attr({opacity: 0});
    elementGroup.append(text);
  }
  return elementGroup;
}


mouseController.prototype.clearDragHandler = function() {
  if (this.dragHandler) {
    if (this.dragHandler.path) {
      this.dragHandler.path.remove();
      this.dragHandler.path = null;
    }
    this.snap.node.removeEventListener("touchmove", this.dragHandler.listener);
    this.snap.node.removeEventListener("mousemove", this.dragHandler.listener);
    this.snap.node.removeEventListener("mouseleave", this.dragHandler.leaveListener);
    this.dragHandler = null;
  }
}

mouseController.prototype.eventPosition =  function(event) {
  if (window.TouchEvent && event instanceof TouchEvent) {
    if(event.type == "touchend") {
      return {x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY};
    } else {
      return {x: event.touches[0].clientX, y: event.touches[0].clientY};
    }
  } else {
    return {x: event.clientX, y: event.clientY};
  }
}

mouseController.prototype.transformPoint = function(position) {
  var p = this.snap.node.createSVGPoint()
  p.x = position.x;
  p.y = position.y;
  return p.matrixTransform(this.snap.node.getScreenCTM().inverse())
}

mouseController.prototype.eventElement = function(event) {
  var position = this.transformPoint(this.eventPosition(event));
  var eventElement = this.chooserBuilder.elementForPosition(position);
  if (eventElement != null) {
    return eventElement;
  }
  this.elements.forEach(element => eventElement = element.supportMouse() && element.isPointInside(position)?element:eventElement);
  return eventElement;
}

})
