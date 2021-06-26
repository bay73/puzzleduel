define(["square"], function() {

squarePuzzleType = function(puzzleData, controls, settings) {
  squarePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(squarePuzzleType.prototype, squarePuzzle.prototype);

squarePuzzleType.prototype.parseDimension = function(dimension) {
  if (this.typeCode == "top_heavy") {
    // Parse dimension string to values.
    var part = dimension.split("-");
    squarePuzzle.prototype.parseDimension.call(this, part[0]);
    this.maxChooserValue = parseInt(part[1]);
  } else {
    squarePuzzle.prototype.parseDimension.call(this, dimension);
  }
}

squarePuzzleType.prototype.setTypeProperties = function(typeCode) {
  var self = this;
  var typeProperties = {}

  typeProperties["hitori"] = {
    cellController: cell => setClickSwitch(cell, true, [{},{color: "#303030", returnValue: "1"},{image: "white_circle"}], [{},{color: "#808080"},{image: "white_circle"}]),
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 0, 16);},
  }

  typeProperties["snake_dutch"] = {
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      if (cell.isClue && cell.data.image != "cross") {
        setClueClickSwitch(cell, [{},{color: self.colorSchema.greyColor, returnValue: "1"}], [{},{color: "#a0a0a0"}]);
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

  typeProperties["chaos"] = {
    needNodes: false,
    cellController: cell => {if (!cell.isClue) {setNumberChooser(cell, 1, 4);}},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 4);},
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
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 0, 4);},
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

  typeProperties["every_second_straight"] = {
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

  typeProperties["passage"] = {
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{},{color: self.colorSchema.clueColor, returnValue: "black"},{image: "cross", returnValue: "cross"}];
      for (var i=0; i<=10; i++) {
       chooserValues.push({color: self.colorSchema.greyColor, text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {
      if (value=="cross") return {image: "cross"};
      else if (value=="black") return {color: self.colorSchema.clueColor, returnValue: "1"}
      else return {color: self.colorSchema.greyColor, text: value};
    },
  }

  typeProperties["simple_loop"] = {
    needNodes: false,
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.textColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{color: self.colorSchema.textColor, returnValue: "black"}];},
    decodeClue: value => {
      if (value=="black") {
        return {color: self.colorSchema.textColor}
      } else {
        return {text: value}
      }
    },
  }

  typeProperties["maxi_loop"] = {
    needNodes: true,
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 99);},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    usePlus10: this.editMode,
  }

  typeProperties["country_road"] = {
    needNodes: true,
    needConnectors: true,
    cellController: cell => {
      setClickSwitch(cell, true, [{},{image: "cross"}]);
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 99);},
    edgeEditController: edge => {
       if (edge.allCells.length > 1) {
         edge.isClue = true;
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeEditController: node => node.dragProcessor = true,
    collectAreas: this.editMode,
    usePlus10: this.editMode,
  }

  typeProperties["double_back"] = {
    needNodes: true,
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: 1}]);
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
  }

  typeProperties["snake_scope"] = {
    needNodes: true,
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      if (cell.isClue && cell.data.image != "cross") {
        setClueClickSwitch(cell, [{},{color: self.colorSchema.greyColor, returnValue: "1"}], [{},{color: "#a0a0a0"}]);
      }
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "cross", returnValue: "cross"}];},
    nodeEditController: node => {
      node.isClue = true;
      var chooserValues = [{}];
      for (var i=0; i<=3; i++) {
        chooserValues.push({color: self.colorSchema.gridColor, text: i.toString(), textColor: "#fff", returnValue: i.toString()});
      }
      node.chooserValues = chooserValues;
    },
    decodeClue: value => {
      if (value=="cross") return {image: "cross"};
      else if (this.editMode) {
        return {text: value};
      } else {
        return {color: self.colorSchema.gridColor, text: value, textColor: "#fff"};
      }
    },
  }

  typeProperties["alternate_loop"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "white_circle"},{image: "black_circle", returnValue: "black_circle"}];},
    decodeClue: value => {return {image: value} },
  }

  typeProperties["masyu"] = {
    needConnectors: true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.lineColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "white_circle"},{image: "black_circle", returnValue: "black_circle"}];},
    decodeClue: value => {return {image: value} },
  }

  typeProperties["kropki"] = {
    cellController: cell => {if (!cell.isClue) {setNumberChooser(cell, 1, self.rows);}},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, self.rows);},
    edgeEditController: edge => {
      if (edge.allCells.length > 1) {
        edge.isClue = true;
        edge.clickSwitch = [{}, {image: "white_dot", returnValue: "white"}, {image: "small_circle", returnValue: "black"}];;
      }
    },
    decodeClue: value => {
      if (value=="white") {
        return {image: "white_dot"}
      } else if (value=="black") {
        return {image: "small_circle"}
      } else {
        return {text: value}
      }
    },
    cellMultiPencil: true,
  }

  typeProperties["kuromasu"] = {
    cellController: cell => {
      setClickSwitch(cell, false, [{},{color: "#606060", returnValue: "1"},{image: "cross"}], [{},{color: "#a0a0a0"},{image: "cross"}]);
      setClueClickSwitch(cell, [{},{image: "cross"}], [{},{image: "cross"}]);
    },
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, 29);},
    usePlus10: this.editMode,
  }

  typeProperties["top_heavy"] = {
    needNodes: false,
    cellController: cell => {if (!cell.isClue) {
      var chooserValues = [{}];
      for (var i=1; i<=self.maxChooserValue; i++) {
        chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      chooserValues.push({image: "white_circle"}, {image: "cross"});
      cell.chooserValues = chooserValues;
    }},
    cellEditController: cell => {cell.isClue = true; setNumberChooser(cell, 1, self.maxChooserValue);},
    cellMultiPencil: true,
  }

  typeProperties["chat_room"] = {
    needConnectors: !this.editMode,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.textColor, returnValue: 1}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{}];
      chooserValues.push({image: 'phone', returnValue: 'phone'});
      chooserValues.push({image: 'big_white_circle', returnValue: 'white_circle'});
      chooserValues.push({image: 'big_black_circle', returnValue: 'black_circle'});
      for (var i=0; i<=99; i++) {
        chooserValues.push({text: i.toString(), image: 'big_white_circle', returnValue: 'white_'+i.toString()});
        chooserValues.push({text: i.toString(), image: 'big_black_circle', textColor: "#fff", returnValue: 'black_'+i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    decodeClue: value => {
      if (value=="phone") {
        return {image: "phone"}
      } else if (value=="black_circle") {
        return {image: "big_black_circle"}
      } else if (value=="white_circle") {
        return {image: "big_white_circle"}
      } else if (value.startsWith("black_")) {
        return {image: "big_black_circle", text: value.substring(6), textColor: "#fff"}
      } else if (value.startsWith("white_")) {
        return {image: "big_white_circle", text: value.substring(6)}
      } else {
        return {text: value}
      }
    },
  }

  typeProperties["slalom"] = {
    needNodes: true,
    needConnectors: false,
    cellController: cell => {
      cell.dragProcessor = null;
      setClickSwitch(cell, false, [{},{image: "slash", returnValue: "/"},{image: "backslash", returnValue: "\\"}]);
      if (cell.isClue && cell.data.image != "cross") {
        setClueClickSwitch(cell, [{},{color: self.colorSchema.greyColor, returnValue: "1"}], [{},{color: "#a0a0a0"}]);
      }
    },
    nodeEditController: node => {
      node.isClue = true;
      var chooserValues = [{}];
      for (var i=0; i<=4; i++) {
        chooserValues.push({color: self.colorSchema.gridColor, text: i.toString(), textColor: "#fff", returnValue: i.toString()});
      }
      node.chooserValues = chooserValues;
    },
    decodeClue: value => {
      return {color: self.colorSchema.gridColor, text: value, textColor: "#fff"};
    },
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

squarePuzzleCell.prototype.chooserData = function() {
  if (this.puzzle.typeCode == "chat_room") {
    var values = this.chooserValues.slice(0, 24);
    values.push({text: "+10"});
    return values;
  } else {
    return squareGridElement.prototype.chooserData.call(this);
  }
}

squarePuzzleCell.prototype.switchOnChooser = function(index) {
  if (this.puzzle.typeCode == "chat_room" && index == 24) {
    var currentIndex = this.findCurrent(this.chooserValues);
    var newIndex = currentIndex + 20;
    if (newIndex >= this.chooserValues.length) {
      newIndex -= this.chooserValues.length;
    }
    return squareGridElement.prototype.switchOnChooser.call(this, newIndex);
  } else  {
    return squareGridElement.prototype.switchOnChooser.call(this, index);
  }
}

})
