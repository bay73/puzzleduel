define(["square","controller_helper"], function() {

areaPuzzleType = function(puzzleData, controls, settings) {
  this.maxAreaSize = 2;
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
  areaPuzzleType.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(fillominoPuzzleType.prototype, areaPuzzleType.prototype);

doubleChocoPuzzleType = function(puzzleData, controls, settings) {
  areaPuzzleType.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(doubleChocoPuzzleType.prototype, areaPuzzleType.prototype);

arafPuzzleType = function(puzzleData, controls, settings) {
  this.maxAreaSize = 100;
  areaPuzzleType.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(arafPuzzleType.prototype, areaPuzzleType.prototype);

AreaJoiner = function() {
  this.areaCount = 0;
  // area data for each cell - {parent: , volume: , children: }.
  this.areaData = [];
}

// "root" cell for the area - returns the same value for all cells in one area.
AreaJoiner.prototype.root = function(areaIndex) {
  if (this.areaData[areaIndex].parent == areaIndex) return areaIndex;
  return this.root(this.areaData[areaIndex].parent);
}

  // join areas to which belongs two cells.
AreaJoiner.prototype.join = function(area1, area2) {
  var root1 = this.root(area1);
  var root2 = this.root(area2);
  // If both areas have the same root - nothing to do
  if (root1 == root2) return;
  // Include smaller area into bigger one
  if (this.areaData[root1].volume > this.areaData[root2].volume) {
    this.areaData[root2].parent = root1;
    this.areaData[root1].volume += this.areaData[root2].volume;
    this.areaData[root1].children.push(...this.areaData[root2].children)
  } else {
    this.areaData[root1].parent = root2;
    this.areaData[root2].volume += this.areaData[root1].volume;
    this.areaData[root2].children.push(...this.areaData[root1].children)
  }
}

AreaJoiner.prototype.addArea = function(areaName) {
  let areaNum = this.areaCount;
  this.areaData[areaNum] = {name: areaName, parent: areaNum, volume: 1, children: [areaName]};
  this.areaCount++;
  return areaNum;
}

AreaJoiner.prototype.getAreaCoordinates = function(areaIndex) {
  return this.areaData[this.root(areaIndex)].children;
}

areaPuzzleType.prototype.processClueData = function(data) {
  squarePuzzle.prototype.processClueData.call(this, data);
  this.recountConnectorAreas();
}

areaPuzzleType.prototype.recountConnectorAreas = function() {
  if (!this.typeProperties.recountConnector) {
    return;
  }
  var isConnected = function (connector) {
    return connector.getValue() == "1" || connector.getValue() == "line";
  }
  var areaJoiner = new AreaJoiner();
  var areaForCell = [];
  var cellCount = 0;
  // Create area for each cells
  for (var y = 0; y < this.rows; y++) {
    areaForCell[y] = new Array(this.cols);
    for (var x = 0; x < this.cols; x++) {
      areaForCell[y][x] = areaJoiner.addArea(this.cells[y][x].getCoordinates());
    }
  }
  this.prejoinAreas(areaJoiner, areaForCell);
  // Join all areas by connectors
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      if (x < this.cols-1 && isConnected(this.connectors[y][x]['h'])) {
        areaJoiner.join(areaForCell[y][x], areaForCell[y][x+1]);
      }
      if (y < this.rows-1 && isConnected(this.connectors[y][x]['v'])) {
        areaJoiner.join(areaForCell[y][x], areaForCell[y+1][x]);
      }
    }
  }
  
  // For each edge check areas for both cells
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      for (var s = 1; s < 3; s++) {
        var edge = this.edges[y][x][s];
        var edgeAreas = [];
        for (var c=0; c<edge.allCells.length; c++) {
          var cellArea = areaJoiner.root(areaForCell[edge.allCells[c].row][edge.allCells[c].col]);
          if (!edgeAreas.includes(cellArea)) {
            edgeAreas.push(cellArea);
          }
        }
        needEdge = false;
        if (edgeAreas.length == 2) {
          needEdge = this.needEdgeBetwenAreas(areaJoiner.getAreaCoordinates(edgeAreas[0]), areaJoiner.getAreaCoordinates(edgeAreas[1]));
        }
        edge.setGray(needEdge);
      }
    }
  }
}

// join some cells into areas based on clues.
areaPuzzleType.prototype.prejoinAreas = function(areaJoiner, areaForCell) {
  return;
}

// Connect if both areas have more than one cell.
areaPuzzleType.prototype.needEdgeBetwenAreas = function(area1Coordinates, area2Coordinates) {
  return area1Coordinates.length > 1 && area2Coordinates.length > 1 && area1Coordinates.length + area2Coordinates.length > this.maxAreaSize;
}

// Any two cells is a full area
dominoType.prototype.needEdgeBetwenAreas = function(area1Coordinates, area2Coordinates) {
  return area1Coordinates.length > 1 || area2Coordinates.length > 1;
}

galaxiesType.prototype.prejoinAreas = function(areaJoiner, areaForCell) {
  // For each edge with a clue join two cells
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      for (var s = 1; s < 3; s++) {
        var edge = this.edges[y][x][s];
        if (edge.isClue && edge.allCells.length == 2) {
          var baseArea = areaForCell[edge.allCells[0].row][edge.allCells[0].col];
          for (var c=1; c<edge.allCells.length; c++) {
            var nextArea = areaForCell[edge.allCells[c].row][edge.allCells[c].col]
            areaJoiner.join(baseArea, nextArea);
          }
        }
      }
    }
  }
  // For each internal node with a clue join two cells
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      var node = this.nodes[y][x][2];
      if (node.isClue && node.allCells.length > 1) {
        var baseArea = areaForCell[node.allCells[0].row][node.allCells[0].col];
        for (var c=1; c<node.allCells.length; c++) {
          var nextArea = areaForCell[node.allCells[c].row][node.allCells[c].col]
          areaJoiner.join(baseArea, nextArea);
        }
      }
    }
  }
}

// If a single cell contains clue, then it's considered as a full area
galaxiesType.prototype.needEdgeBetwenAreas = function(area1Coordinates, area2Coordinates) {
  var self = this;
  function isFullArea(areaCoordinates) {
    if (areaCoordinates.length > 1) {
      return true;
    }
    let coord = self.decodeCoordinate(areaCoordinates[0]);
    if (self.cells[coord.y] && self.cells[coord.y][coord.x]) {
      return self.cells[coord.y][coord.x].isClue;
    }
    return false;
  }
  return isFullArea(area1Coordinates) && isFullArea(area2Coordinates);
}

// If areas of any size contains different digits, then put edge
fillominoPuzzleType.prototype.needEdgeBetwenAreas = function(area1Coordinates, area2Coordinates) {
  if (area1Coordinates.length > 1 && area2Coordinates.length > 1 && area1Coordinates.length + area2Coordinates.length > this.maxAreaSize) {
    return true;
  }
  var self = this;
  function getDigits(areaCoordinates) {
    var digits = [];
    for (let i=0; i < areaCoordinates.length; i++) {
      let coord = self.decodeCoordinate(areaCoordinates[i]);
      if (self.cells[coord.y] && self.cells[coord.y][coord.x]) {
        let value = self.cells[coord.y][coord.x].data.text;
        if (value && !digits.includes(value)) {
          digits.push(value)
        }
      }
    }
    return digits;
  }
  function hasDifferent(setOne, setTwo) {
    if (setOne.length == 0 || setTwo.length == 0) {
      return false;
    }
    for (let i=0; i<setOne.length; i++) {
      if (!setTwo.includes(setOne[i])) {
        return true;
      }
    }
    return false;
  }
  if (hasDifferent(getDigits(area1Coordinates), getDigits(area2Coordinates))) {
    return true;
  }
  if (area1Coordinates.length > 1 && getDigits(area2Coordinates).includes('1')) {
    return true;
  }
  if (area2Coordinates.length > 1 && getDigits(area1Coordinates).includes('1')) {
    return true;
  }
  return false;
}

doubleChocoPuzzleType.prototype.needEdgeBetwenAreas = function(area1Coordinates, area2Coordinates) {
  if (area1Coordinates.length <= 1 || area2Coordinates.length <= 1) {
    return false;
  }
  var self = this;
  function getColorCount(areaCoordinates, isGrey) {
    var colorCount = 0;
    for (let i=0; i < areaCoordinates.length; i++) {
      let coord = self.decodeCoordinate(areaCoordinates[i]);
      if (self.cells[coord.y] && self.cells[coord.y][coord.x]) {
        let value = self.cells[coord.y][coord.x].data.color;
        if (isGrey && value==self.colorSchema.lightGreyColor) {
          colorCount++;
        }
        if (!isGrey && value!=self.colorSchema.lightGreyColor) {
          colorCount++;
        }
      }
    }
    return colorCount;
  }
  const grey1Count = getColorCount(area1Coordinates, true)
  const grey2Count = getColorCount(area2Coordinates, true)
  const white1Count = getColorCount(area1Coordinates, false)
  const white2Count = getColorCount(area2Coordinates, false)
  if ((grey1Count==0 || grey2Count==0) && (white1Count==0 || white2Count==0)) {
    return false;
  }
  return true;
}

// If areas of any size contains more than two digits, then put edge
arafPuzzleType.prototype.needEdgeBetwenAreas = function(area1Coordinates, area2Coordinates) {
  var self = this;
  function getDigitsCount(areaCoordinates) {
    var digitsCount = 0;
    for (let i=0; i < areaCoordinates.length; i++) {
      let coord = self.decodeCoordinate(areaCoordinates[i]);
      if (self.cells[coord.y] && self.cells[coord.y][coord.x]) {
        let value = self.cells[coord.y][coord.x].data.text;
        if (value) {
          digitsCount++;
        }
      }
    }
    return digitsCount;
  }
  if (getDigitsCount(area1Coordinates) + getDigitsCount(area2Coordinates) > 2) {
    return true;
  }
  return false;
}

// Prevent including blacken cells into areas for solution submission
dominoType.prototype.canJoinAreas = function(pos1, pos2) {
  if (this.cells[pos1.y][pos1.x].data.color==this.colorSchema.gridColor) {
    return false;
  }
  if (this.cells[pos2.y][pos2.x].data.color==this.colorSchema.gridColor) {
    return false;
  }
  return areaPuzzleType.prototype.canJoinAreas.call(this, pos1, pos2);
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

squarePuzzleConnector.prototype.revertTo = function(oldData, oldPencilData, noLogging) {
  squareGridElement.prototype.revertTo.call(this, oldData, oldPencilData, noLogging);
  if (!(this.puzzle instanceof areaPuzzleType)) {
    return;
  }
  this.puzzle.recountConnectorAreas();
}

squarePuzzleConnector.prototype.switchToData = function(data, noLogging) {
  squareGridElement.prototype.switchToData.call(this, data, noLogging);
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

squarePuzzleCell.prototype.revertTo = function(oldData, oldPencilData, noLogging) {
  squareGridElement.prototype.revertTo.call(this, oldData, oldPencilData, noLogging);
  if (!(this.puzzle instanceof fillominoPuzzleType)) {
    return;
  }
  this.puzzle.recountConnectorAreas();
}

squarePuzzleCell.prototype.switchToData = function(data, noLogging) {
  squareGridElement.prototype.switchToData.call(this, data, noLogging);
  if (!(this.puzzle instanceof fillominoPuzzleType)) {
    return;
  }
  this.puzzle.recountConnectorAreas();
}

squarePuzzleEdge.prototype.revertTo = function(oldData, oldPencilData, noLogging) {
  squareGridElement.prototype.revertTo.call(this, oldData, oldPencilData, noLogging);
  if (!(this.puzzle instanceof areaPuzzleType)) {
    return;
  }
  this.puzzle.recountConnectorAreas();
}

squarePuzzleEdge.prototype.switchToData = function(data, noLogging) {
  squareGridElement.prototype.switchToData.call(this, data, noLogging);
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
    return 'bold';
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

  if (typeCode =="abc_division") {
    var letters = self.dimensionExtra;
    this.maxAreaSize = letters.length;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addLetters(letters))
      .add(controller().forSolver().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.asAreaConnector()))
      .build(this);

  } else if (typeCode == "domino_hunt"){
    var letters = self.dimensionExtra;
    this.maxAreaSize = 2;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.BLACK)
        .addLetters(letters))
      .add(controller().forSolver().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.asAreaConnector()))
      .build(this);

  } else if (typeCode == "foseruzu"){
    this.maxAreaSize = Number(self.dimensionExtra);
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(0,3))
      .add(controller().forSolver().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.asAreaConnector()))
      .build(this);

  } else if (typeCode == "neighbors"){
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addLetters('?')
        .addNumbers(1,10))
      .add(controller().forSolver().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.asAreaConnector()))
      .build(this);

  } else if (typeCode == "shikaku"){
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1,99))
      .add(controller().forSolver().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.asAreaConnector()))
      .build(this);

  } else if (typeCode == "araf"){
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1,99))
      .add(controller().forSolver().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.asAreaConnector()))
      .build(this);

  } else if (typeCode == "black_white"){
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE)
        .addItem(StdItem.BLACK_CIRCLE))
      .add(controller().forSolver().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.asAreaConnector()))
      .build(this);

  } else if (typeCode == "squares_and_rectangles"){
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE)
        .addItem(StdItem.BLACK_CIRCLE))
      .add(controller().forAuthor().edge().clickSwitch()
        .addItem(StdItem.HUGE_WHITE_CIRCLE)
        .addItem(StdItem.HUGE_BLACK_CIRCLE))
      .add(controller().forAuthor().node().clickSwitch()
        .addItem(StdItem.HUGE_WHITE_CIRCLE)
        .addItem(StdItem.HUGE_BLACK_CIRCLE))
      .add(controller().forSolver().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.asAreaConnector()))
      .build(this);

  } else if (typeCode == "two_apiece"){
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE)
        .addItem(StdItem.BLACK_CIRCLE))
      .add(controller().forSolver().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.asAreaConnector()))
      .build(this);

  } else if (typeCode == "l_shapes"){
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.WHITE_CIRCLE)
        .addItem(StdItem.BLACK_CIRCLE))
      .add(controller().forSolver().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.asAreaConnector()))
      .build(this);

  } else if (typeCode == "spiral_galaxies"){
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().clickSwitch()
        .addItem(StdItem.SMALL_CIRCLE))
      .add(controller().forAuthor().edge().clickSwitch()
        .addItem(StdItem.BLACK_CIRCLE))
      .add(controller().forAuthor().node().clickSwitch()
        .addItem(StdItem.BLACK_CIRCLE))
      .add(controller().forSolver().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.asAreaConnector()))
      .build(this);
  }
}

fillominoPuzzleType.prototype.setTypeProperties = function(typeCode) {
  var self = this;
  if (typeCode =="fillomino") {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addNumbers(1,15))
      .add(controller().forSolver().cell().noClue().chooser(true)
        .addNumbers(1,10,undefined,undefined,false))
      .add(controller().forSolver().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.asAreaConnector()))
      .build(this);
  } else if (typeCode =="pentomino_division") {
    var letters = "FILNPTUVWXYZ"
    this.maxAreaSize = 5;
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addLetters(letters))
      .add(controller().forSolver().cell().noClue().chooser(true)
        .addLetters(letters))
      .add(controller().forSolver().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.asAreaConnector()))
      .build(this);
  }
}

doubleChocoPuzzleType.prototype.setTypeProperties = function(typeCode) {
  var self = this;
  if (typeCode =="double_choco" || typeCode =="double_choco_inverse" || typeCode =="double_choco_notouch" || typeCode =="double_choco_consecutive" ) {
    this.typeProperties = decribePuzzleType()
      .add(controller().forAuthor().cell().chooser()
        .addItem(StdItem.LIGHT_GREY)
        .addNumbers(1,9,StdColor.LIGHT_GREY, undefined, (i)=>"grey" + i.toString())
        .addNumbers(22,22,StdColor.LIGHT_GREY, undefined, (i)=>"grey" + i.toString())
        .addNumbers(1,9)
        .addNumbers(22,22)
        )
      .add(controller().forSolver().edge().toAreas().clickSwitch().withDrag()
        .addItem(StdItem.BLACK.asAreaBorder()))
      .add(controller().forSolver().connector().drag()
        .addItem(StdItem.LINE.asAreaConnector()))
      .build(this);
  }
}
})
