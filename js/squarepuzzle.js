define(["square"], function() {

squarePuzzleType = function(puzzleData, controls, settings) {
  squarePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(squarePuzzleType.prototype, squarePuzzle.prototype);

squarePuzzleType.prototype.setTypeProperties = function(typeCode) {
  var self = this;
  var typeProperties = {}

  typeProperties["hitori"] = {
    cellController: cell => setClickSwitch(cell, true, [{},{color: "#303030", returnValue: "1"},{image: "white_circle"}], [{},{color: "#808080"},{image: "white_circle"}]),
    cellEditController: cell => setNumberChooser(cell, 0, 16),
  }

  typeProperties["snake_dutch"] = {
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: "#606060", returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      if (cell.isClue && cell.data.image != "cross") {
        setClueClickSwitch(cell, [{},{color: "#606060", returnValue: "1"}], [{},{color: "#a0a0a0"}]);
      }
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "white_circle"},{image: "black_circle", returnValue: "black_circle"},{image: "cross", returnValue: "cross"}];},
    decodeClue: value => {return {image: value} },
  }

  typeProperties["starbattle"] = {
    needNodes: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{image: "star", returnValue: "star"},{image: "cross"}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    decodeClue: value => {return {image: value} },
    collectAreas: this.editMode,
  }

  typeProperties["lits"] = {
    needNodes: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: "#606060", returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    decodeClue: value => {return {image: value} },
    collectAreas: this.editMode,
  }

  typeProperties["heyawake"] = {
    needNodes: true,
    cellController: cell => {
      if (!cell.isClue || cell.data.image != "cross") {
        setClickSwitch(cell, true, [{},{color: "#606060", returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      }
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{}, {image: "cross", returnValue: "cross"}];
      for (var i=0; i<=10; i++) {
       chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    decodeClue: value => {return value=="cross"?{image: "cross"}:{text: value};},
  }

  typeProperties["snake_belarusian"] = {
    needNodes: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: "#606060", returnValue: "1"},{image: "cross"}], [{},{image: "white_circle"},{image: "cross"}]);
      if (cell.isClue && cell.data.image != "cross") {
        setClueClickSwitch(cell, [{},{color: "#605030", returnValue: "1"},{image: "cross"}], [{},{image: "white_circle"},{image: "cross"}]);
      }
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{color: "tan", returnValue: "1"}];},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    decodeClue: value => {return value=="1"?{color: "tan"}:{} },
    collectAreas: this.editMode,
  }

  typeProperties["sudoku_irregular"] = {
    needNodes: true,
    cellController: cell => {if (!cell.isClue) {setNumberChooser(cell, 1, self.rows);}},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, self.rows);},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    cellMultiPencil: true,
  }

  typeProperties["suguru"] = {
    needNodes: true,
    cellController: cell => {if (!cell.isClue) {setNumberChooser(cell, 1, 6);}},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 6);},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    cellMultiPencil: true,
  }

  typeProperties["ripple_effect"] = {
    needNodes: true,
    cellController: cell => {if (!cell.isClue) {setNumberChooser(cell, 1, 6);}},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 6);},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    cellMultiPencil: true,
  }

  typeProperties["fence"] = {
    thickEdges: true,
    outerEdges: false,
    needNodes: true,
    cellController: cell => setClickSwitch(cell, true, [{},{image: "cross"},{image: "white_circle"}]),
    edgeController: edge => {
      setClickSwitch(edge, false, [{},{color: self.colorSchema.lineColor, returnValue: 1},{image: "cross"}]);
      setDragSwitch(edge, false, [{},{color: self.colorSchema.lineColor}]);
    },
    nodeController: node => node.dragProcessor = true,
    cellEditController: cell => setNumberChooser(cell, 0, 4),
  }

  typeProperties["lighthouses"] = {
    cellController: cell => {
      setClickSwitch(cell, false, [{},{image: "boat", returnValue: "boat"},{image: "cross"}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{},{image: "cross", returnValue: "cross"}];
      for (var i=0; i<=10; i++) {
       chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {return value=="cross"?{image: "cross"}:{text: value};},
  }

  typeProperties["loop_minesweeper"] = {
    needConnectors: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{image: "cross"},{image: "white_circle"}]);
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 0, 8);},
  }

  typeProperties["every_second_turn"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "white_circle"}];},
    decodeClue: value => {return {image: value} },
  }

  if (typeCode in typeProperties) {
    this.typeProperties = Object.assign({}, this.typeProperties,  typeProperties[typeCode]);
  }
}

function setClickSwitch(element, withClues, clickSwitch, pencilClickSwitch) {
  if (element.isClue && !withClues) {
    return;
  }
  element.clickSwitch = clickSwitch.map(val => Object.assign({}, element.data, val))
  if (typeof pencilClickSwitch != "undefined") {
    element.pencilClickSwitch = pencilClickSwitch;
  } else {
    element.pencilClickSwitch = clickSwitch.map(val => {var clone = Object.assign({}, val); delete clone.returnValue; return clone});
  }
}

function setClueClickSwitch(element, clickSwitch, pencilClickSwitch) {
  if (!element.isClue) {
    return;
  }
  element.clickSwitch = clickSwitch.map(val => Object.assign({}, element.data, val))
  if (typeof pencilClickSwitch != "undefined") {
    element.pencilClickSwitch = pencilClickSwitch;
  } else {
    element.pencilClickSwitch = clickSwitch.map(val => {var clone = Object.assign({}, val); delete clone.returnValue; return clone});
  }
}

function setNumberClues(cell, start, end) {
  cell.isClue = true;
  var clickSwitch = [{}];
  for (var i=start; i<=end; i++) {
    clickSwitch.push({text: i.toString(), returnValue: i.toString()});
  }
  cell.clickSwitch = clickSwitch;
}

function setNumberChooser(cell, start, end) {
  cell.isClue = true;
  var chooserValues = [{}];
  for (var i=start; i<=end; i++) {
    chooserValues.push({text: i.toString(), returnValue: i.toString()});
  }
  cell.chooserValues = chooserValues;
}

function setDragSwitch(element, withClues, dragSwitch, pencilDragSwitch) {
  if (element.isClue && !withClues) {
    return;
  }
  element.dragSwitch = dragSwitch.map(val => Object.assign({}, element.data, val))
  if (typeof pencilDragSwitch != "undefined") {
    element.pencilDragSwitch = pencilDragSwitch;
  } else {
    element.pencilDragSwitch = dragSwitch.map(val => {var clone = Object.assign({}, val); delete clone.returnValue; return clone});
  }
}

})
