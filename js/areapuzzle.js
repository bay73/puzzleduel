define(["square"], function() {

areaPuzzleType = function(puzzleData, controls, settings) {
  squarePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(areaPuzzleType.prototype, squarePuzzle.prototype);

galaxiesType = function(puzzleData, controls, settings) {
  areaPuzzleType.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(galaxiesType.prototype, areaPuzzleType.prototype);

areaPuzzleType.prototype.recountConnectorAreas = function() {
  if (!this.typeProperties.recountConnector) {
    return;
  }
  var areaData = []
  var root = function(area) {
    if (areaData[area].parent == area) return area;
    return root(areaData[area].parent);
  }
  var join = function(area1, area2) {
    var root1 = root(area1);
    var root2 = root(area2);
    if (root1 == root2) return;
    if (areaData[root1].volume > areaData[root2].volume) {
      areaData[root2].parent = root1;
      areaData[root1].volume += areaData[root2].volume;
    } else {
      areaData[root1].parent = root2;
      areaData[root2].volume += areaData[root1].volume;
    }
  }
  var areaLink = [];
  var cellCount = 0;
  for (var y = 0; y < this.rows; y++) {
    areaLink[y] = new Array(this.cols);
    for (var x = 0; x < this.cols; x++) {
      areaData[cellCount] = {name: this.cells[y][x].getCoordinates(), parent: cellCount, volume: 1};
      areaLink[y][x] = cellCount;
      cellCount++;
    }
  }
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      if (x < this.cols-1 && this.connectors[y][x]['h'].getValue() == "1") {
        join(areaLink[y][x], areaLink[y][x+1]);
      }
      if (y < this.rows-1 && this.connectors[y][x]['v'].getValue() == "1") {
        join(areaLink[y][x], areaLink[y+1][x]);
      }
    }
  }
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      for (var s = 1; s < 3; s++) {
        var edge = this.edges[y][x][s];
        var cellAreas = [];
        for (var c=0; c<edge.allCells.length; c++) {
          var cellArea = root(areaLink[edge.allCells[c].row][edge.allCells[c].col]);
          if (!cellAreas.includes(cellArea)) {
            if (areaData[cellArea].volume > 1
               || this.isAreaRoot(this.cells[edge.allCells[c].row][edge.allCells[c].col])) {
              cellAreas.push(cellArea);
            }
          }
        }
        if (cellAreas.length > 1) {
          edge.setGray(true);
        } else {
          edge.setGray(false);
        }
      }
    }
  }
}

areaPuzzleType.prototype.isAreaRoot = function(cell) {
  return false;
}

galaxiesType.prototype.isAreaRoot = function(cell) {
  return cell.isClue;
}

squarePuzzleConnector.prototype.revertTo = function(oldData) {
  squareGridElement.prototype.revertTo.call(this, oldData);
  this.puzzle.recountConnectorAreas();
}

squarePuzzleConnector.prototype.switchToData = function(data) {
  squareGridElement.prototype.switchToData.call(this, data);
  if (this.allCells.length >= 2) {
    var cell1 = this.allCells[0];
    var cell2 = this.allCells[1];
    for (var i=0;i<4;i++) {
      var edge = this.puzzle.edges[cell1.row][cell1.col][i];
      if (edge) {
        for (var c=0; c<edge.allCells.length; c++) {
          if (edge.allCells[c].col==cell2.col && edge.allCells[c].row==cell2.row) {
            edge.data.color = null;
            edge.redraw();
          }
        }
      }
    }
  }
  this.puzzle.recountConnectorAreas();
}

squarePuzzleEdge.prototype.revertTo = function(oldData) {
  squareGridElement.prototype.revertTo.call(this, oldData);
  this.puzzle.recountConnectorAreas();
}

squarePuzzleCell.prototype.chooserData = function() {
  if (this.puzzle.typeCode == "shikaku") {
    var values = this.chooserValues.slice(0, 10);
    values.push({text: "+10"});
    return values;
  } else {
    return squareGridElement.prototype.chooserData.call(this);
  }
}

squarePuzzleCell.prototype.switchOnChooser = function(index) {
  if (this.puzzle.typeCode == "shikaku" && index == 10) {
    var currentIndex = this.findCurrent(this.chooserValues);
    var newIndex = currentIndex + 10;
    if (newIndex >= this.chooserValues.length) {
      newIndex -= this.chooserValues.length;
    }
    return squareGridElement.prototype.switchOnChooser.call(this, newIndex);
  } else  {
    return squareGridElement.prototype.switchOnChooser.call(this, index);
  }
}

squarePuzzleEdge.prototype.switchToData = function(data) {
  squareGridElement.prototype.switchToData.call(this, data);
  if (this.allCells.length >= 2) {
    var cell1 = this.allCells[0];
    var cell2 = this.allCells[1];
    var sides = ["v", "h"];
    for (var i=0;i<2;i++) {
      var connector = this.puzzle.connectors[cell1.row][cell1.col][sides[i]];
      if (connector) {
        for (var c=0; c<connector.allCells.length; c++) {
          if (connector.allCells[c].col==cell2.col && connector.allCells[c].row==cell2.row) {
            connector.data.color = null;
            connector.redraw();
            this.puzzle.recountConnectorAreas();
          }
        }
      }
    }
  }
}

squarePuzzleEdge.prototype.getValue = function() {
  if (this.data.color == this.puzzle.colorSchema.greyColor) {
    return '1';
  }
  return squareGridElement.prototype.getValue.call(this);
}

squarePuzzleEdge.prototype.setGray = function(needGray) {
  if (needGray && !this.data.color) {
    this.data.color = this.puzzle.colorSchema.greyColor;
    this.redraw();
  }
  if (!needGray && this.data.color == this.puzzle.colorSchema.greyColor) {
    this.data.color = null;
    this.redraw();
  }
}

areaPuzzleType.prototype.setTypeProperties = function(typeCode) {
  var self = this;
  var typeProperties = {}

  typeProperties["abc_division"] = {
    needNodes: true,
    needConnectors: true,
    edgeController: edge => {
       if (edge.allCells.length > 1) {
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeController: node => node.dragProcessor = true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: 1}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      cell.chooserValues = [{}];
      for (var i = 0; i < self.letters.length; i++) {
        cell.chooserValues.push({text: self.letters[i], returnValue: self.letters[i]});
      }
    },
    collectAreas: !this.editMode,
    recountConnector: !this.editMode,
  }

  typeProperties["foseruzu"] = {
    needNodes: true,
    needConnectors: true,
    edgeController: edge => {
       if (edge.allCells.length > 1) {
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeController: node => node.dragProcessor = true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: 1}]);
    },
    cellEditController: cell => setNumberChooser(cell, 0, 4),
    collectAreas: !this.editMode,
    recountConnector: !this.editMode,
  }

  typeProperties["neighbors"] = {
    needNodes: true,
    needConnectors: true,
    edgeController: edge => {
       if (edge.allCells.length > 1) {
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeController: node => node.dragProcessor = true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: 1}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      var chooserValues = [{},{text: '?', returnValue: '?'}];
      for (var i=1; i<=10; i++) {
        chooserValues.push({text: i.toString(), returnValue: i.toString()});
      }
      cell.chooserValues = chooserValues;
    },
    collectAreas: !this.editMode,
    recountConnector: !this.editMode,
  }

  typeProperties["shikaku"] = {
    needNodes: true,
    needConnectors: true,
    edgeController: edge => {
       if (edge.allCells.length > 1) {
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
       }
    },
    nodeController: node => node.dragProcessor = true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: 1}]);
    },
    cellEditController: cell => setNumberChooser(cell, 1, 99),
    collectAreas: !this.editMode,
    recountConnector: !this.editMode,
  }

  typeProperties["spiral_galaxies"] = {
    needNodes: true,
    needConnectors: true,
    edgeController: edge => {
       if (edge.allCells.length > 1) {
         if (edge.isClue && edge.data.image == "black_circle") {
           edge.clickSwitch = [{image: "black_circle"},{image: "black_circle", color: self.colorSchema.gridColor, returnValue: "1"}];
           edge.dragSwitch = [{image: "black_circle"},{image: "black_circle", color: self.colorSchema.gridColor, returnValue: "1"}];
         } else {
           edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
           edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         }
       }
    },
    nodeController: node => node.dragProcessor = true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: 1}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "small_circle", returnValue: "small_circle"}];},
    nodeEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "black_circle", returnValue: "black_circle"}];},
    edgeEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "black_circle", returnValue: "black_circle"}];},
    decodeClue: value => {return {image: value} },
    collectAreas: !this.editMode,
    recountConnector: !this.editMode,
  }

  if (typeCode in typeProperties) {
    this.typeProperties = Object.assign({}, this.typeProperties,  typeProperties[typeCode]);
  }
}

areaPuzzleType.prototype.parseDimension = function(dimension) {
  if (this.typeCode == "abc_division") {
    // Parse dimension string to values.
    var part = dimension.split("-");
    squarePuzzle.prototype.parseDimension.call(this, part[0]);
    this.letters = part[1];
  } else {
    squarePuzzle.prototype.parseDimension.call(this, dimension);
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
