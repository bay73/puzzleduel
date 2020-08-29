var mouseController = function(elements){
  this.elements = elements;
  this.mouseStartElement = null;
  this.dragHandler = null;
}

mouseController.prototype.attachEvents = function(snap) {
  this.snap = snap;
  var self = this;
  this.snap.node.addEventListener("mousedown", function(event){self.onMouseDown(event)});
  this.snap.node.addEventListener("touchstart", function(event){self.onMouseDown(event)});
  this.snap.node.addEventListener("mouseup", function(event){self.onMouseUp(event)});
  this.snap.node.addEventListener("touchend", function(event){self.onMouseUp(event)});
  this.snap.node.addEventListener("touchcancel", function(event){self.onMouseUp(event)});
}

mouseController.prototype.onMouseDown = function(event) {
  event.preventDefault();
  var element = this.eventElement(event);
  if (element != null) {
    this.mouseStartElement = element;
    if (element.canDragStart()){
      self = this;
      this.dragHandler = {};
      this.dragHandler.listener = function(event){self.onMouseMove(event)};
      this.dragHandler.leaveListener = function(event){self.onMouseLeave(event)};
      this.snap.node.addEventListener("touchmove", this.dragHandler.listener, {passive: true});
      this.snap.node.addEventListener("mousemove", this.dragHandler.listener, {passive: true});
      this.snap.node.addEventListener("mouseleave", this.dragHandler.leaveListener, {passive: true});
    }
  }
}

mouseController.prototype.onMouseUp = function(event) {
  event.preventDefault();
  if (this.mouseStartElement != null) {
    var element = this.eventElement(event);
    if (element) {
      if (element == this.mouseStartElement) {
        element.processClick();
      } else {
        element.processDragEnd(this.mouseStartElement);
      }
    }
    this.mouseStartElement = null;
  }
  if (this.dragHandler) {
    if (this.dragHandler.path) {
      this.dragHandler.path.remove();
    }
    this.snap.node.removeEventListener("touchmove", this.dragHandler.listener);
    this.snap.node.removeEventListener("mousemove", this.dragHandler.listener);
    this.snap.node.removeEventListener("mouseleave", this.dragHandler.leaveListener);
    this.dragHandler = null;
  }
}

mouseController.prototype.onMouseLeave = function(event) {
  this.mouseStartElement = null;
  if (this.dragHandler) {
    if (this.dragHandler.path) {
      this.dragHandler.path.remove();
    }
    this.snap.node.removeEventListener("touchmove", this.dragHandler.listener);
    this.snap.node.removeEventListener("mousemove", this.dragHandler.listener);
    this.snap.node.removeEventListener("mouseleave", this.dragHandler.leaveListener);
    this.dragHandler = null;
  }
}

mouseController.prototype.onMouseMove = function(event) {
  if (!this.dragHandler) {
    return;
  }
  if (this.dragHandler.path) {
    this.dragHandler.path.remove();
  }
  var element = this.eventElement(event);
  if (element == null) {
    return;
  }
  var moveResult = element.processDragMove(this.mouseStartElement);
  if (moveResult) {
    if (moveResult.stopDrag) {
      this.dragHandler = null;
      this.mouseStartElement = null;
    } else {
      this.mouseStartElement = moveResult.newMouseStartElement;
    }
  }
  if (!this.dragHandler) {
    return;
  }
  var end = this.transformPoint(this.eventPosition(event));
  var start = this.mouseStartElement.center();
  this.dragHandler.path = this.snap.line(start.x, start.y,  end.x, end.y);
  this.dragHandler.path.attr(Object.assign({stroke: this.mouseStartElement.puzzle.colorSchema.traceColor}, this.mouseStartElement.puzzle.gridProperty.edge));
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
  var eventElement = null;
  this.elements.forEach(element => eventElement = element.supportMouse() && element.isPointInside(position)?element:eventElement);
  return eventElement;
}

