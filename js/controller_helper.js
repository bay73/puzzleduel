// Creates puzzle type descriptor.
decribePuzzleType = function() {
  return new PuzzleTypeBuilder();
}

// Creates controller descriptor.
controller = function() {
  return new ControllerBuilder();
}

// Creates controller item descriptor.
controllerItem = function(data) {
  return new ControllerItemBuilder(data, false);
}

PuzzleTypeBuilder = function() {
  this.controllers = [];
  this.outerCellType = undefined;
  this.outerColor = {};
  this.upgradeClue = undefined;
}

// Adds new controller to the puzzle type descriptor.
PuzzleTypeBuilder.prototype.add = function(controller) {
  this.controllers.push(controller);
  if (controller.addDrag) {
    dragController = Object.assign(new controller.constructor, controller);
    dragController.type = ControllerBuilder.DRAG_SWITCH;
    this.controllers.push(dragController);
  }
  if (controller.conditions.length > 0) {
    controller.condition = function(gridElement) {
      for (var i=0; i<controller.conditions.length;i++) {
        if (!controller.conditions[i](gridElement)) {
          return false;
        }
      }
      return true;
    };
  }
  return this;
}

// Adds new controller to the puzzle type descriptor.
PuzzleTypeBuilder.prototype.useOuterCells = function(outerCellType) {
  this.outerCellType = outerCellType;
  return this;
}

// Defines color schema for outer cells
PuzzleTypeBuilder.prototype.useOuterColors = function(sides, color) {
  this.outerColor[sides] = color;
  return this;
}

// Adds function which converts clues from the old to the new format.
PuzzleTypeBuilder.prototype.addUpgradeClue = function(upgradeClue){
  this.upgradeClue = upgradeClue;
  return this;
}

// Build puzzle type descriptor.
PuzzleTypeBuilder.prototype.build = function(puzzle) {
  var self = this;
  var controllers = this.controllers;
  var typeDesc = Object.assign({}, puzzle.typeProperties);

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


  //  typeDesc.needEdges = this.controllers.filter(controller=>controller.elementType == ControllerBuilder.EDGE).length > 0;
  typeDesc.needNodes = this.controllers.filter(controller=>controller.elementType == ControllerBuilder.NODE).length > 0;
  if (needDrag(ControllerBuilder.EDGE)) {
    typeDesc.needNodes = true;
  }
  typeDesc.needConnectors = this.controllers.filter(controller=>controller.elementType == ControllerBuilder.CONNECTOR).length > 0;
  typeDesc.recountConnector = this.controllers.filter(controller=>controller.useAsAreaConnector).length > 0;
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
    if (!value) {
      return {};
    }
    if (!clueValues[value]) {
      throw "Unrecognized clue value " + value;
    }
    return processControllerGenericData(clueValues[value], puzzle);
  }
  typeDesc.collectAreas = this.controllers.filter(controller=>controller.collectAreas && controller.editMode==puzzle.editMode).length > 0;
  typeDesc.needBottom = this.outerCellType & StdOuter.BOTTOM;
  typeDesc.needRight = this.outerCellType & StdOuter.RIGHT;
  typeDesc.needTop = this.outerCellType & StdOuter.TOP;
  typeDesc.needLeft = this.outerCellType & StdOuter.LEFT;
  if (Object.keys(this.outerColor).length) {
    typeDesc.outerColorMap = (cell) => {
      for (const [key, value] of Object.entries(self.outerColor)) {
        if((key & StdOuter.TOP) && cell.row < 0) return processControllerData(value, cell, cell.puzzle, false);
        if((key & StdOuter.BOTTOM) && cell.row >= cell.puzzle.rows) return processControllerData(value, cell, cell.puzzle, false);
        if((key & StdOuter.LEFT) && cell.col < 0) return processControllerData(value, cell, cell.puzzle, false);
        if((key & StdOuter.RIGHT) && cell.col >= cell.puzzle.cols) return processControllerData(value, cell, cell.puzzle, false);
      }
    };
  }

  let usePlus10 = {edit: 0, solve: 0};
  this.controllers
    .filter(controller=>controller.isNumberController && controller.items.length>10)
    .forEach(controller=>{
      if (controller.editMode && controller.Number10Item > usePlus10.edit) {
        usePlus10.edit = controller.Number10Item;
      }
      if (!controller.editMode && controller.Number10Item > usePlus10.edit) {
        usePlus10.solve = controller.Number10Item;
      }
    });
  typeDesc.usePlus10 = puzzle.editMode?usePlus10.edit:usePlus10.solve;
  typeDesc.cellMultiPencil =
    this.controllers
      .filter(controller=>controller.editMode)
      .filter(controller=>controller.isNumberController && controller.items.length>4)
      .length > 0;

  if (typeof this.upgradeClue != "undefined") {
    typeDesc.upgradeClue = this.upgradeClue;
  }
  return typeDesc;
}

ControllerBuilder = function() {
  this.editMode = false;
  this.type = undefined;
  this.pasteFn = undefined;
  this.elementType = undefined;
  this.outerCells = false;
  this.condition = undefined;
  this.conditions = [];
  this.collectAreas = false;
  this.addDrag = false;
  this.items = [StdItem.EMPTY];
  this.isNumberController = false;
  this.useAsAreaConnector = false;
}

ControllerBuilder.CHOOSER = 1;
ControllerBuilder.CLICK_SWITCH = 2;
ControllerBuilder.DRAG_SWITCH = 3;
ControllerBuilder.DRAG_COPY = 4;
ControllerBuilder.DRAG_COPY_PATSE = 5;

ControllerBuilder.CELL = 1;
ControllerBuilder.EDGE = 2;
ControllerBuilder.NODE = 3;
ControllerBuilder.CONNECTOR = 4;

// Defines controller which is used in puzzle edit mode.
ControllerBuilder.prototype.forAuthor = function(){
  this.editMode = true;
  return this;
}

// Defines controller which is used in puzzle solving mode.
ControllerBuilder.prototype.forSolver = function(){
  this.editMode = false;
  return this;
}

// Defines controller as a values chooser.
ControllerBuilder.prototype.chooser = function(disableOneClick){
  if (typeof this.type!="undefined") {
    throw "Controller type is already defined"
  }
  if (this.elementType==ControllerBuilder.CONNECTOR) {
    throw "chooser can't be used for connector conroller"
  }
  this.type = ControllerBuilder.CHOOSER;
  this.disableOneClickChooser = disableOneClick || false;
  return this;
}

// Defines controller which switch the element state on click.
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

// Defines controller which switch the element state on drag-n-drop.
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

// Defines controller which copy the element state on drag.
ControllerBuilder.prototype.copy = function(){
  if (typeof this.type!="undefined") {
    throw "Controller type is already defined"
  }
  if (this.elementType!=ControllerBuilder.CELL) {
    throw "drag conroller can be used only for cells"
  }
  this.type = ControllerBuilder.DRAG_COPY;
  return this;
}

// Defines controller which copy-paste the element state on drag-n-drop.
ControllerBuilder.prototype.copyPaste = function(pasteFn){
  if (typeof this.type!="undefined") {
    throw "Controller type is already defined"
  }
  if (this.elementType!=ControllerBuilder.CELL) {
    throw "drag conroller can be used only for cells"
  }
  this.type = ControllerBuilder.DRAG_COPY_PASTE;
  this.pasteFn = pasteFn;
  return this;
}

// Applies controller only to inner cells.
ControllerBuilder.prototype.inner = function(){
  this.conditions.push(gridElement => !gridElement.outerCell);
  return this;
}

// Applies controller only to outer cells.
ControllerBuilder.prototype.outer = function(){
  this.conditions.push(gridElement => gridElement.outerCell);
  this.outerCells = true;
  return this;
}

// Applies controller only to elements without clues.
ControllerBuilder.prototype.noClue = function(){
  this.conditions.push(gridElement => !gridElement.isClue);
  return this;
}

// Applies controller only to elements with clues.
ControllerBuilder.prototype.clue = function(...clueItems){
  if (clueItems.length == 0) {
    this.conditions.push(gridElement => gridElement.isClue);
  } else {
    this.conditions.push(gridElement => containClues(gridElement, clueItems));
  }
  return this;
}

// Defines controller for cells.
ControllerBuilder.prototype.cell = function(){
  if (typeof this.elementType!="undefined") {
    throw "Controller element type is already defined"
  }
  this.elementType = ControllerBuilder.CELL;
  return this;
}

// Defines controller for edges.
ControllerBuilder.prototype.edge = function(){
  if (typeof this.elementType!="undefined") {
    throw "Controller element type is already defined"
  }
  this.elementType = ControllerBuilder.EDGE;
  return this;
}

// Defines controller for nodes.
ControllerBuilder.prototype.node = function(){
  if (typeof this.elementType!="undefined") {
    throw "Controller element type is already defined"
  }
  this.elementType = ControllerBuilder.NODE;
  return this;
}

// Defines controller for connectors.
ControllerBuilder.prototype.connector = function(){
  if (typeof this.elementType!="undefined") {
    throw "Controller element type is already defined"
  }
  this.elementType = ControllerBuilder.CONNECTOR;
  return this;
}

// For edge controllers - convert edges to areas while submitting.
ControllerBuilder.prototype.toAreas = function(needAreas){
  if (this.elementType!=ControllerBuilder.EDGE) {
    throw "toAreas() can be used only for edge conroller"
  }
  this.collectAreas = needAreas || true;
  return this;
}

// Duplicates clickSwitch controller to drag-n-drop.
ControllerBuilder.prototype.withDrag = function(withDarg){
  if (this.type!=ControllerBuilder.CLICK_SWITCH || this.elementType!=ControllerBuilder.EDGE) {
    throw "withDrag() can be used only for click switch edge conroller"
  }
  this.addDrag = withDarg || true;
  return this;
}

// Adds item to the controller.
ControllerBuilder.prototype.addItem = function(item){
  if (item.useAsAreaConnector) {
    this.useAsAreaConnector = true;
  }
  this.items.push(item);
  return this;
}

// Adds items with numbers from the given range (ends included).
ControllerBuilder.prototype.addNumbers = function(start, end, color, doNotSubmit){
  this.isNumberController = true;
  this.Number10Item = null;
  for (var i=start; i<=end; i++) {
    if (i==10) {
      this.Number10Item = this.items.length;
    }
    var itemData = {text: i.toString()};
    if (typeof color != "undefined") {
      itemData.color = color.color;
      itemData.textColor = color.textColor;
    }
    if (doNotSubmit) {
    } else {
      itemData.returnValue = i.toString();
    }
    this.addItem(controllerItem(itemData));
  }
  return this;
}

// Adds items with letters from the given list.
ControllerBuilder.prototype.addLetters = function(letters, color){
  for (var i=0; i<letters.length; i++) {
    if (typeof color != "undefined") {
      this.addItem(controllerItem({text: letters[i], color: color.color, textColor: color.textColor, returnValue: letters[i]}));
    } else {
      this.addItem(controllerItem({text: letters[i], returnValue: letters[i]}));
    }
  }
  return this;
}

// Auxiliary method. Don't use in definition.
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
      gridElement.disableOneClickChooser = self.disableOneClickChooser;
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
  } else if (this.type==ControllerBuilder.DRAG_COPY) {
    return function(gridElement) {
      gridElement.dragProcessor = () => false;
      gridElement.drawDragHandler = (end) => gridElement.puzzle.controller.drawCopyHandler(gridElement, end);
    }
  } else if (this.type==ControllerBuilder.DRAG_COPY_PASTE) {
    return function(gridElement) {
      if (self.editMode) {
        gridElement.isClue = true;
      }
      gridElement.dragProcessor = (start) => {
        if (gridElement != start) {
          if (typeof self.pasteFn == 'function') {
            gridElement.switchToData(self.pasteFn(start.data));
          } else {
            gridElement.switchToData(start.data);
          }
          return gridElement;
        } else {
          return false;
        }
      };
      gridElement.drawDragHandler = (end) => gridElement.puzzle.controller.drawCopyHandler(gridElement, end);
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

ControllerItemBuilder = function(data, useAsAreaConnector){
  this.useAsAreaConnector = useAsAreaConnector;
  this.data = data;
}

// Defines the value which is sent for the element when the puzzle is submitted.
ControllerItemBuilder.prototype.submitAs = function(value){
  var newData = Object.assign({}, this.data);
  newData.returnValue = value;
  return new ControllerItemBuilder(newData, this.useAsAreaConnector);
}

// Defines the value which is not sent when the puzzle is submitted.
ControllerItemBuilder.prototype.doNotSubmit = function(){
  return this.submitAs(undefined);
}

// Defines the element which is used as an area border. Should be used for controlles having "toAreas" property.
ControllerItemBuilder.prototype.asAreaBorder = function(){
  return this.submitAs("bold");
}

// Defines the element which is used as an area connector.
ControllerItemBuilder.prototype.asAreaConnector = function(){
  return new ControllerItemBuilder(this.data, true);
}

StdColor = {
BLACK: {color: (puzzle, isPencil) => puzzle.colorSchema.gridColor,
        textColor: "#fff"},
OUTER: {textColor: (puzzle, isPencil) => puzzle.colorSchema.outerClueColor},
DARK_OUTER: {textColor: (puzzle, isPencil) => puzzle.colorSchema.outerClueSecondColor},
}

// Standard items
StdItem = {
EMPTY: controllerItem({}),
BLACK: controllerItem({color: (puzzle, isPencil) => isPencil?puzzle.colorSchema.greyColor:puzzle.colorSchema.gridColor, returnValue: "black"}),
CLUE_COLOR: controllerItem({color: (puzzle, isPencil) => isPencil?puzzle.colorSchema.greyColor:puzzle.colorSchema.clueColor, returnValue: "black"}),
GREY: controllerItem({color: (puzzle, isPencil) => isPencil?puzzle.colorSchema.lightGreyColor:puzzle.colorSchema.greyColor, returnValue: "grey"}),
BRIGHT: controllerItem({color: (puzzle, isPencil) => isPencil?puzzle.colorSchema.lightGreyColor:puzzle.colorSchema.brightColor, returnValue: "bright"}),
LINE: controllerItem({color: (puzzle, isPencil) => puzzle.colorSchema.lineColor, returnValue: "line"}),
WHITE_CIRCLE: controllerItem({image: "white_circle", returnValue: "white_circle"}),
BLACK_CIRCLE: controllerItem({image: "black_circle", returnValue: "black_circle"}),
CROSS: controllerItem({image: "cross", returnValue: "cross"}),
WHITE_CROSS: controllerItem({image: "white_cross", returnValue: "white_cross"}),
STAR: controllerItem({image: "star", returnValue: "star"}),
BULB: controllerItem({image: "bulb", returnValue: "bulb"}),
BATTENBERG: controllerItem({image: "battenberg_small", returnValue: "battenberg"}),
ARROW_U: controllerItem({image: "arrow_u", returnValue: "arrow_u"}),
ARROW_UR: controllerItem({image: "arrow_ur", returnValue: "arrow_ur"}),
ARROW_R: controllerItem({image: "arrow_r", returnValue: "arrow_r"}),
ARROW_DR: controllerItem({image: "arrow_dr", returnValue: "arrow_dr"}),
ARROW_D: controllerItem({image: "arrow_d", returnValue: "arrow_d"}),
ARROW_DL: controllerItem({image: "arrow_dl", returnValue: "arrow_dl"}),
ARROW_L: controllerItem({image: "arrow_l", returnValue: "arrow_l"}),
ARROW_UL: controllerItem({image: "arrow_ul", returnValue: "arrow_ul"}),
}

StdOuter = {
LEFT: 1,
RIGHT: 2,
TOP: 4,
BOTTOM: 8
}
