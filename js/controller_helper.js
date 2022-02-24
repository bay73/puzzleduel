decribePuzzleType = function() {
  return new PuzzleTypeBuilder();
}

controller = function() {
  return new ControllerBuilder();
}

controllerItem = function(data) {
  return new ControllerItemBuilder(data);
}

PuzzleTypeBuilder = function() {
  this.controllers = [];
}

PuzzleTypeBuilder.prototype.add = function(controller) {
  this.controllers.push(controller);
  if (controller.addDrag) {
    dragController = Object.assign(new controller.constructor, controller);
    dragController.type = ControllerBuilder.DRAG_SWITCH;
    this.controllers.push(dragController);
  }
  return this;
}

PuzzleTypeBuilder.prototype.build = function(puzzle) {
  var controllers = this.controllers;
  var typeDesc = {};

  var needDrag = function(elementType, editMode) {
    return controllers.filter(controller => (typeof editMode=="undefined" || controller.editMode==editMode)
                                             && controller.type == ControllerBuilder.DRAG_SWITCH
                                             && controller.elementType == elementType
                             ).length > 0;
  }
  var addDragProcessingIfNeeded = function(oldFunction, editMode, dragElementType) {
    if (!needDrag(dragElementType, editMode)) {
      return oldFunction;
    }
    if (typeof oldFunction == "function") {
      return function(gridElement) {
        gridElement.dragProcessor = true;
        oldFunction(gridElement);
      }
    } else {
      return function(gridElement) {
        gridElement.dragProcessor = true;
      }
    }
  }
  var combineControllers = function(contollerList) {
    if (contollerList.length==0) {
      return undefined;
    }
    return function(gridElement){
      for(let i=0;i<contollerList.length;i++){
        if (typeof contollerList[i].condition=="function") {
          if (contollerList[i].condition(gridElement)) {
            contollerList[i].controller(gridElement);
          }
        } else {
          contollerList[i].controller(gridElement);
        }
      }
    }
  }
  var extractControllers = function(elementType, editMode) {
    return combineControllers(controllers.
      filter(controller=>controller.editMode==editMode && controller.elementType == elementType).
      map(controller => {return {condition: controller.condition, controller: controller.build()};}));
  }
  typeDesc.cellController = extractControllers(ControllerBuilder.CELL, false);
  typeDesc.cellController = addDragProcessingIfNeeded(typeDesc.cellController, false, ControllerBuilder.CONNECTOR)
  typeDesc.cellEditController = extractControllers(ControllerBuilder.CELL, true);
  typeDesc.cellEditController = addDragProcessingIfNeeded(typeDesc.cellEditController,true, ControllerBuilder.CONNECTOR)

  typeDesc.edgeController = extractControllers(ControllerBuilder.EDGE, false);
  typeDesc.edgeEditController = extractControllers(ControllerBuilder.EDGE, true);

  typeDesc.nodeController = extractControllers(ControllerBuilder.NODE, false);
  typeDesc.nodeController = addDragProcessingIfNeeded(typeDesc.nodeEditController, false, ControllerBuilder.EDGE)
  typeDesc.nodeEditController = extractControllers(ControllerBuilder.NODE, true);
  typeDesc.nodeEditController = addDragProcessingIfNeeded(typeDesc.nodeEditController, true, ControllerBuilder.EDGE)

  typeDesc.connectorController = extractControllers(ControllerBuilder.CONNECTOR, false);
  typeDesc.connectorEditController = extractControllers(ControllerBuilder.CONNECTOR, true);


  typeDesc.needEdges = this.controllers.filter(controller=>controller.elementType == ControllerBuilder.EDGE).length > 0;
  typeDesc.needNodes = this.controllers.filter(controller=>controller.elementType == ControllerBuilder.NODE).length > 0;
  if (needDrag(ControllerBuilder.EDGE)) {
    typeDesc.needNodes = true;
  }
  typeDesc.needConnectors = this.controllers.filter(controller=>controller.elementType == ControllerBuilder.CONNECTOR).length > 0;
  var clueValues = {};
  this.controllers.forEach(controller => {
    if (controller.editMode) {
      controller.items.forEach(item => {
        if (typeof item.data.returnValue != "undefined" && item.data.returnValue != null) {
          let data = Object.assign({}, item.data);
          delete data.returnValue;
          clueValues[item.data.returnValue] = data;
        }
      });
    }
  });
  typeDesc.decodeClue = function(value, puzzle) {
    return processControllerGenericData(clueValues[value], puzzle);
  }
  typeDesc.collectAreas = this.controllers.filter(controller=>controller.collectAreas && controller.editMode==puzzle.editMode).length > 0;

  return typeDesc;
}

ControllerBuilder = function() {
  this.editMode = false;
  this.type = undefined;
  this.elementType = undefined;
  this.condition = undefined;
  this.collectAreas = false;
  this.addDrag = false;
  this.items = [StdItem.EMPTY];
}

ControllerBuilder.CHOOSER = 1;
ControllerBuilder.CLICK_SWITCH = 2;
ControllerBuilder.DRAG_SWITCH = 3;

ControllerBuilder.CELL = 1;
ControllerBuilder.EDGE = 2;
ControllerBuilder.NODE = 3;
ControllerBuilder.CONNECTOR = 4;


ControllerBuilder.prototype.forAuthor = function(){
  this.editMode = true;
  return this;
}

ControllerBuilder.prototype.forSolver = function(){
  this.editMode = false;
  return this;
}

ControllerBuilder.prototype.chooser = function(){
  if (typeof this.type!="undefined") {
    throw "Controller type is already defined"
  }
  if (this.elementType==ControllerBuilder.CONNECTOR) {
    throw "chooser can't be used for connector conroller"
  }
  this.type = ControllerBuilder.CHOOSER;
  return this;
}

ControllerBuilder.prototype.clickSwitch = function(){
  if (typeof this.type!="undefined") {
    throw "Controller type is already defined"
  }
  if (this.elementType==ControllerBuilder.CONNECTOR) {
    throw "click switch can't be used for connector conroller"
  }
  this.type = ControllerBuilder.CLICK_SWITCH;
  return this;
}

ControllerBuilder.prototype.drag = function(){
  if (typeof this.type!="undefined") {
    throw "Controller type is already defined"
  }
  if (this.elementType!=ControllerBuilder.EDGE && this.elementType!=ControllerBuilder.CONNECTOR) {
    throw "drag conroller can be used only for edges and connectors"
  }
  this.type = ControllerBuilder.DRAG_SWITCH;
  return this;
}

ControllerBuilder.prototype.noClue = function(){
  if (typeof this.condition!="undefined") {
    throw "Controller condition is already defined"
  }
  this.condition = gridElement => !gridElement.isClue;
  return this;
}

ControllerBuilder.prototype.clue = function(...clueItems){
  if (typeof this.condition!="undefined") {
    throw "Controller condition is already defined"
  }
  if (clueItems.length == 0) {
    this.condition = gridElement => gridElement.isClue;
  } else {
    this.condition = gridElement => containClues(gridElement, clueItems);
  }
  return this;
}

ControllerBuilder.prototype.cell = function(){
  if (typeof this.elementType!="undefined") {
    throw "Controller element type is already defined"
  }
  this.elementType = ControllerBuilder.CELL;
  return this;
}

ControllerBuilder.prototype.edge = function(){
  if (typeof this.elementType!="undefined") {
    throw "Controller element type is already defined"
  }
  this.elementType = ControllerBuilder.EDGE;
  return this;
}

ControllerBuilder.prototype.node = function(){
  if (typeof this.elementType!="undefined") {
    throw "Controller element type is already defined"
  }
  this.elementType = ControllerBuilder.NODE;
  return this;
}

ControllerBuilder.prototype.connector = function(){
  if (typeof this.elementType!="undefined") {
    throw "Controller element type is already defined"
  }
  this.elementType = ControllerBuilder.CONNECTOR;
  return this;
}

ControllerBuilder.prototype.toAreas = function(needAreas){
  if (this.elementType!=ControllerBuilder.EDGE) {
    throw "toAreas() can be used only for edge conroller"
  }
  this.collectAreas = needAreas || true;
  return this;
}

ControllerBuilder.prototype.withDrag = function(withDarg){
  if (this.type!=ControllerBuilder.CLICK_SWITCH || this.elementType!=ControllerBuilder.EDGE) {
    throw "withDrag() can be used only for click switch edge conroller"
  }
  this.addDrag = withDarg || true;
  return this;
}

ControllerBuilder.prototype.addNumbers = function(start, end){
  for (var i=start; i<=end; i++) {
    this.addItem(controllerItem({text: i.toString(), returnValue: i.toString()}));
  }
  return this;
}

ControllerBuilder.prototype.addItem = function(item){
  this.items.push(item);
  return this;
}


ControllerBuilder.prototype.build = function(){
  var self = this;
  if (this.type==ControllerBuilder.CHOOSER) {
    return function(gridElement) {
      if (self.editMode) {
        gridElement.isClue = true;
        gridElement.chooserValues = self.items.map(item => processControllerData(item.data, null, gridElement.puzzle, false));
      } else {
        gridElement.chooserValues = self.items.map(item => processControllerData(item.data, gridElement, gridElement.puzzle, false));
      }
    }
  } else if (this.type==ControllerBuilder.CLICK_SWITCH) {
    return function(gridElement) {
      if (self.editMode) {
        gridElement.isClue = true;
        gridElement.clickSwitch = self.items.map(item => processControllerData(item.data, null, gridElement.puzzle, false));
      } else {
        gridElement.clickSwitch = self.items.map(item => processControllerData(item.data, gridElement, gridElement.puzzle, false));
        gridElement.pencilClickSwitch = self.items.map(item => processControllerData(item.data, gridElement, gridElement.puzzle, true));
      }
    }
  } else if (this.type==ControllerBuilder.DRAG_SWITCH) {
    return function(gridElement) {
      if (self.editMode) {
        gridElement.isClue = true;
        gridElement.dragSwitch = self.items.map(item => processControllerData(item.data, null, gridElement.puzzle, false));
      } else {
        gridElement.dragSwitch = self.items.map(item => processControllerData(item.data, gridElement, gridElement.puzzle, false));
        gridElement.pencilDragSwitch = self.items.map(item => processControllerData(item.data, gridElement, gridElement.puzzle, true));
      }
    }
  } else {
    throw 'controller type is not defined!';
  }
}

processControllerGenericData = function(data, puzzle) {
  return processControllerData(data, null, puzzle, false, true);
}


processControllerData = function(data, element, puzzle, isPencil, ignoreReturnValue) {
  var executeOrGet = function(oldDecoration, newDecoration, puzzle, isPencil) {
    if (typeof newDecoration == "function") {
      var value = newDecoration.call(null, puzzle, isPencil);
    } else {
      var value = newDecoration;
    }
    if (typeof value == "undefined" || value == null){
      return oldDecoration;
    } else {
      return value;
    }
  }
  var copyDecorations = function(to, from, puzzle, isPencil) {
    to.text = executeOrGet(to.text, from.text, puzzle, isPencil);
    to.image = executeOrGet(to.image, from.image, puzzle, isPencil);
    to.color = executeOrGet(to.color, from.color, puzzle, isPencil);
    to.textColor = executeOrGet(to.textColor, from.textColor, puzzle, isPencil);
    if (!isPencil && !ignoreReturnValue) {
      to.returnValue = executeOrGet(to.returnValue, from.returnValue, puzzle, isPencil);
    }
    return to;
  }
  var result = {};
  if (element!=null && !puzzle.editMode && !isPencil) {
    result = copyDecorations(result, element.data, puzzle, isPencil);
  }
  result = copyDecorations(result, data, puzzle, isPencil);
  return result;
}

containClues = function(gridElement, clueItems) {
  for (let i=0;i<clueItems.length;i++) {
    let clueItem = clueItems[i];
    let data = processControllerData(clueItem.data, gridElement, gridElement.puzzle);
    if (gridElement.compareData(gridElement.data, data)) {
      return true;
    }
  }
  return false;
} 

ControllerItemBuilder = function(data){
  this.data = data;
}

ControllerItemBuilder.prototype.submitAs = function(value){
  var newData = Object.assign({}, this.data);
  newData.returnValue = value;
  return new ControllerItemBuilder(newData);
}

ControllerItemBuilder.prototype.doNotSubmit = function(){
  return this.submitAs(undefined);
}

ControllerItemBuilder.prototype.asAreaBorder = function(){
  return this.submitAs("1");
}

StdItem = {
EMPTY: controllerItem({}),
BLACK: controllerItem({color: (puzzle, isPencil) => isPencil?puzzle.colorSchema.greyColor:puzzle.colorSchema.gridColor, returnValue: "black"}),
GREY: controllerItem({color: (puzzle, isPencil) => isPencil?puzzle.colorSchema.lightGreyColor:puzzle.colorSchema.greyColor, returnValue: "grey"}),
WHITE_CIRCLE: controllerItem({image: "white_circle", returnValue: "white_circle"}),
BLACK_CIRCLE: controllerItem({image: "black_circle", returnValue: "black_circle"}),
CROSS: controllerItem({image: "cross", returnValue: "cross"}),
STAR: controllerItem({image: "star", returnValue: "star"}),
}

