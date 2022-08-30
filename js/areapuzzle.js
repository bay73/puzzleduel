define(["square","controller_helper"], function() {

areaPuzzleType = function(puzzleData, controls, settings) {
  squarePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(areaPuzzleType.prototype, squarePuzzle.prototype);

galaxiesType = function(puzzleData, controls, settings) {
  areaPuzzleType.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(galaxiesType.prototype, areaPuzzleType.prototype);

dominoType = function(puzzleData, controls, settings) {
  areaPuzzleType.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(dominoType.prototype, areaPuzzleType.prototype);

fillominoPuzzleType = function(puzzleData, controls, settings) {
  squarePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(fillominoPuzzleType.prototype, squarePuzzle.prototype);

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

dominoType.prototype.recountConnectorAreas = function() {
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
        var cellBigAreas = [];
        var cellAreas = [];
        for (var c=0; c<edge.allCells.length; c++) {
          var cellArea = root(areaLink[edge.allCells[c].row][edge.allCells[c].col]);
          if (areaData[cellArea].volume > 1 || this.isAreaRoot(this.cells[edge.allCells[c].row][edge.allCells[c].col])) {
            if (!cellBigAreas.includes(cellArea)) {
              cellBigAreas.push(cellArea)
            }
          } else {
            if (!cellAreas.includes(cellArea)) {
              cellAreas.push(cellArea)
            }
          }
        }
        if (cellBigAreas.length > 1) {
          edge.setGray(true);
        } else if (cellBigAreas.length==1 && cellAreas.length > 0){
          edge.setGray(true);
        } else {
          edge.setGray(false);
        }
      }
    }
  }
}

dominoType.prototype.canJoinAreas = function(pos1, pos2) {
  if (this.cells[pos1.y][pos1.x].data.color==this.colorSchema.gridColor) {
    return false;
  }
  if (this.cells[pos2.y][pos2.x].data.color==this.colorSchema.gridColor) {
    return false;
  }
  return areaPuzzleType.prototype.canJoinAreas.call(this, pos1, pos2);
}


areaPuzzleType.prototype.isAreaRoot = function(cell) {
  return false;
}

galaxiesType.prototype.isAreaRoot = function(cell) {
  return cell.isClue;
}

areaPuzzleType.prototype.addConnector = function(connector) {
  return;
}

dominoType.prototype.addConnector = function(connector) {
  let puzzle = this;
  connector.allCells.forEach(cell=> {
    puzzle.cells[cell.row][cell.col].connectors.forEach(otherConnector => {
      if (otherConnector != connector) {
        otherConnector.data.color = null;
        otherConnector.redraw();
      }
    });
  });
  return;
}

squarePuzzleConnector.prototype.revertTo = function(oldData) {
  squareGridElement.prototype.revertTo.call(this, oldData);
  if (!(this.puzzle instanceof areaPuzzleType)) {
    return;
  }
  this.puzzle.recountConnectorAreas();
}

squarePuzzleConnector.prototype.switchToData = function(data) {
  squareGridElement.prototype.switchToData.call(this, data);
  if (!(this.puzzle instanceof areaPuzzleType)) {
    return;
  }
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
  this.puzzle.addConnector(this);
  this.puzzle.recountConnectorAreas();
}

fillominoPuzzleType.prototype.processClueData = function(data) {
  squarePuzzle.prototype.processClueData.call(this, data);
  this.recountCellBorders();
}

fillominoPuzzleType.prototype.recountCellBorders = function() {
  if (this.editMode) {
    return;
  }
  function differentText(oneData, otherData) {
    return oneData.text && otherData.text && oneData.text != otherData.text;
  }
  for (let row=0; row < this.rows - 1; row++) {
    for (let col=0; col < this.cols; col++) {
      var edge = this.edges[row][col][2];
      edge.setGray(differentText(this.cells[row][col].data, this.cells[row+1][col].data));
    }
  }
  for (let row=0; row < this.rows; row++) {
    for (let col=0; col < this.cols-1; col++) {
      var edge = this.edges[row][col][1];
      edge.setGray(differentText(this.cells[row][col].data, this.cells[row][col+1].data));
    }
  }
}

squarePuzzleCell.prototype.revertTo = function(oldData) {
  squareGridElement.prototype.revertTo.call(this, oldData);
  if (!(this.puzzle instanceof fillominoPuzzleType)) {
    return;
  }
  this.puzzle.recountCellBorders();
}

squarePuzzleCell.prototype.switchToData = function(data) {
  squareGridElement.prototype.switchToData.call(this, data);
  if (!(this.puzzle instanceof fillominoPuzzleType)) {
    return;
  }
  this.puzzle.recountCellBorders();
}

squarePuzzleEdge.prototype.revertTo = function(oldData) {
  squareGridElement.prototype.revertTo.call(this, oldData);
  if (!(this.puzzle instanceof areaPuzzleType)) {
    return;
  }
  this.puzzle.recountConnectorAreas();
}

squarePuzzleEdge.prototype.switchToData = function(data) {
  squareGridElement.prototype.switchToData.call(this, data);
  if (!(this.puzzle instanceof areaPuzzleType)) {
    return;
  }
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
         edge.pencilClickSwitch = [{},{color: self.colorSchema.gridColor}];
         edge.pencilDragSwitch = [{},{color: self.colorSchema.gridColor}];
       }
    },
    nodeController: node => node.dragProcessor = true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      cell.chooserValues = [{}];
      for (var i = 0; i < self.dimensionExtra.length; i++) {
        cell.chooserValues.push({text: self.dimensionExtra[i], returnValue: self.dimensionExtra[i]});
      }
    },
    collectAreas: !this.editMode,
    recountConnector: !this.editMode,
  }

  typeProperties["domino_hunt"] = {
    needNodes: true,
    needConnectors: true,
    edgeController: edge => {
       if (edge.allCells.length > 1) {
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.pencilClickSwitch = [{},{color: self.colorSchema.gridColor}];
         edge.pencilDragSwitch = [{},{color: self.colorSchema.gridColor}];
       }
    },
    nodeController: node => node.dragProcessor = true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"}]);
    },
    cellEditController: cell => {
      cell.isClue = true;
      cell.chooserValues = [{}, {color: self.colorSchema.gridColor, returnValue: "black"}];
      for (var i = 0; i < self.dimensionExtra.length; i++) {
        cell.chooserValues.push({text: self.dimensionExtra[i], returnValue: self.dimensionExtra[i]});
      }
    },
    collectAreas: !this.editMode,
    recountConnector: !this.editMode,
    decodeClue: value => {
      if (value=="black") {
        return {color: self.colorSchema.gridColor}
      } else {
        return {text: value}
      }
    },
  }

  typeProperties["foseruzu"] = {
    needNodes: true,
    needConnectors: true,
    edgeController: edge => {
       if (edge.allCells.length > 1) {
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.pencilClickSwitch = [{},{color: self.colorSchema.gridColor}];
         edge.pencilDragSwitch = [{},{color: self.colorSchema.gridColor}];
       }
    },
    nodeController: node => node.dragProcessor = true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"}]);
    },
    cellEditController: cell => setNumberChooser(cell, 0, 3),
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
         edge.pencilClickSwitch = [{},{color: self.colorSchema.gridColor}];
         edge.pencilDragSwitch = [{},{color: self.colorSchema.gridColor}];
       }
    },
    nodeController: node => node.dragProcessor = true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"}]);
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
         edge.pencilClickSwitch = [{},{color: self.colorSchema.gridColor}];
         edge.pencilDragSwitch = [{},{color: self.colorSchema.gridColor}];
       }
    },
    nodeController: node => node.dragProcessor = true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"}]);
    },
    cellEditController: cell => setNumberChooser(cell, 1, 99),
    collectAreas: !this.editMode,
    recountConnector: !this.editMode,
    usePlus10: this.editMode?10:0,
  }

  typeProperties["araf"] = {
    needNodes: true,
    needConnectors: true,
    edgeController: edge => {
       if (edge.allCells.length > 1) {
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.pencilClickSwitch = [{},{color: self.colorSchema.gridColor}];
         edge.pencilDragSwitch = [{},{color: self.colorSchema.gridColor}];
       }
    },
    nodeController: node => node.dragProcessor = true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"}]);
    },
    cellEditController: cell => setNumberChooser(cell, 1, 99),
    collectAreas: !this.editMode,
    recountConnector: !this.editMode,
    usePlus10: this.editMode?10:0,
  }

  typeProperties["black_white"] = {
    needNodes: true,
    needConnectors: true,
    edgeController: edge => {
       if (edge.allCells.length > 1) {
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.pencilClickSwitch = [{},{color: self.colorSchema.gridColor}];
         edge.pencilDragSwitch = [{},{color: self.colorSchema.gridColor}];
       }
    },
    nodeController: node => node.dragProcessor = true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "white_circle"},{image: "black_circle", returnValue: "black_circle"}];},
    collectAreas: !this.editMode,
    decodeClue: value => {return {image: value} },
    recountConnector: !this.editMode,
  }

  typeProperties["two_apiece"] = {
    needNodes: true,
    needConnectors: true,
    edgeController: edge => {
       if (edge.allCells.length > 1) {
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.pencilClickSwitch = [{},{color: self.colorSchema.gridColor}];
         edge.pencilDragSwitch = [{},{color: self.colorSchema.gridColor}];
       }
    },
    nodeController: node => node.dragProcessor = true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "white_circle"},{image: "black_circle", returnValue: "black_circle"}];},
    collectAreas: !this.editMode,
    decodeClue: value => {return {image: value} },
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
         edge.pencilClickSwitch = [{},{color: self.colorSchema.gridColor}];
         edge.pencilDragSwitch = [{},{color: self.colorSchema.gridColor}];
       }
    },
    nodeController: node => node.dragProcessor = true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "small_circle", returnValue: "small_circle"}];},
    nodeEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "black_circle", returnValue: "black_circle"}];},
    edgeEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "black_circle", returnValue: "black_circle"}];},
    decodeClue: value => {return {image: value} },
    collectAreas: !this.editMode,
    recountConnector: !this.editMode,
  }

  typeProperties["l_shapes"] = {
    needNodes: true,
    needConnectors: true,
    edgeController: edge => {
       if (edge.allCells.length > 1) {
         edge.clickSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.dragSwitch = [{},{color: self.colorSchema.gridColor, returnValue: "1"}];
         edge.pencilClickSwitch = [{},{color: self.colorSchema.gridColor}];
         edge.pencilDragSwitch = [{},{color: self.colorSchema.gridColor}];
       }
    },
    nodeController: node => node.dragProcessor = true,
    cellController: cell => {
      cell.dragProcessor = true;
    },
    connectorController: connector => {
      setDragSwitch(connector, false, [{},{color: self.colorSchema.greyColor, returnValue: "1"}]);
    },
    cellEditController: cell => {cell.isClue = true; cell.clickSwitch = [{},{image: "white_circle", returnValue: "white_circle"},{image: "black_circle", returnValue: "black_circle"}];},
    collectAreas: !this.editMode,
    decodeClue: value => {return {image: value} },
    recountConnector: !this.editMode,
  }

  if (typeCode in typeProperties) {
    this.typeProperties = Object.assign({}, this.typeProperties,  typeProperties[typeCode]);
  }
}

fillominoPuzzleType.prototype.setTypeProperties = function(typeCode) {
  var self = this;
  if (typeCode =="fillomino") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,15))
      .add(controller().forSolver().cell().noClue().chooser()
        .addNumbers(0,10,"",true))
      .add(controller().forSolver().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .build(this);
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
