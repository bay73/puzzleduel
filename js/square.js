define(["base","grid","mouse"], function() {

squarePuzzle = function(puzzleData, controls, settings) {
  basePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(squarePuzzle.prototype, basePuzzle.prototype);

squarePuzzle.prototype.parseDimension = function() {
  var dimensions = this.dimension.split("x");
  // rows - size of the vertical sides of the grid
  // cols - size of top (and bottom) inclined sedes
  this.rows = parseInt(dimensions[1]);
  this.cols = parseInt(dimensions[0]);
}

squarePuzzle.prototype.createBoard = function() {
  this.elements = [];
  // 
  this.cells = [];
  for (var y = 0; y < this.rows; y++) {
    this.cells[y] = new Array(this.cols);
    for (var x = 0; x < this.cols; x++) {
      this.cells[y][x] = new squarePuzzleCell(this, x, y);
      this.elements.push(this.cells[y][x]);
    }
  }
  //
  this.edges = [];
  for (var y = 0; y < this.rows; y++) {
    this.edges[y] = new Array(this.cols);
    for (var x = 0; x < this.cols; x++) {
      this.edges[y][x] = new Array(4);
      for (var i=0; i<4; i++){
        if (i==0 && typeof this.edges[y-1] != "undefined" && typeof this.edges[y-1][x] != "undefined") {
          this.edges[y][x][i] = this.edges[y-1][x][2];
          this.edges[y][x][i].allCells.push({col:x, row:y, side: i});
        }else if (i==3 && typeof this.edges[y][x-1] != "undefined") {
          this.edges[y][x][i] = this.edges[y][x-1][1];
          this.edges[y][x][i].allCells.push({col:x, row:y, side: i});
        } else {
          this.edges[y][x][i] = new squarePuzzleEdge(this, x, y, i);
          this.elements.push(this.edges[y][x][i]);
        }
      }
    }
  }
  //
  this.nodes = [];
  for (var y = 0; y < this.rows; y++) {
    this.nodes[y] = new Array(this.cols);
    for (var x = 0; x < this.cols; x++) {
      this.nodes[y][x] = new Array(4);
      for (var i=0; i<4; i++){
        if (i==0 && typeof this.nodes[y-1] != "undefined" && typeof this.nodes[y-1][x] != "undefined") {
          this.nodes[y][x][i] = this.nodes[y-1][x][3];
          this.nodes[y][x][i].allCells.push({col:x, row:y, side: i});
        } else if (i==0 && typeof this.nodes[y-1] != "undefined" && typeof this.nodes[y-1][x] != "undefined") {
          this.nodes[y][x][i] = this.nodes[y-1][x][1];
          this.nodes[y][x][i].allCells.push({col:x, row:y, side: i});
        } else if (i==0 && typeof this.nodes[y-1] != "undefined" && typeof this.nodes[y-1][x-1] != "undefined") {
          this.nodes[y][x][i] = this.nodes[y-1][x-1][2];
          this.nodes[y][x][i].allCells.push({col:x, row:y, side: i});
        } else if (i==1 && typeof this.nodes[y-1] != "undefined" && typeof this.nodes[y-1][x] != "undefined") {
          this.nodes[y][x][i] = this.nodes[y-1][x][2];
          this.nodes[y][x][i].allCells.push({col:x, row:y, side: i});
        } else if (i==3 && typeof this.nodes[y][x-1] != "undefined") {
          this.nodes[y][x][i] = this.nodes[y][x-1][2];
          this.nodes[y][x][i].allCells.push({col:x, row:y, side: i});
        } else {
          this.nodes[y][x][i] = new squarePuzzleNode(this, x, y, i);
          this.elements.push(this.nodes[y][x][i]);
        }
      }
    }
  }
}

squarePuzzle.prototype.initController = function () {
  if (typeof this.controller != 'undefined') {
    this.controller.detachEvents();
  }
  this.controller = new mouseController(this.elements);
  this.controller.attachEvents(this.snap);
}

squarePuzzle.prototype.findSize = function() {
  var width = this.snap.node.clientWidth;
  if (width==0) {
    width = $(this.snap.node).parent().parent().parent().width();
  }
  var hSizeLimit = width*0.90;
  var vSizeLimit = window.innerHeight*0.57;
  var cols = this.cols;
  var rows = this.rows;
  // unitCell - length of a cell edge
  var unitSize = Math.min(hSizeLimit / cols, vSizeLimit / rows);
  this.leftGap = (width - unitSize * cols) /2;
  this.topGap = 1;
  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  var height = rows*unitSize + this.topGap + unitSize / (isSafari ? 2 : 4);

  return {height: height, width: width, unitSize: unitSize};
}

squarePuzzle.prototype.drawBoard = function() {
  this.elements.forEach(element => element.draw())
}

squarePuzzle.prototype.clearAll = function(data) {
  this.elements.forEach(element => element.clearData())
}

squarePuzzle.prototype.showClues = function(data) {
  // Parse clues.
  for (const [key, value] of Object.entries(data)) {
    var x = key.charCodeAt(0) - 'a'.charCodeAt(0);
    var y = parseInt(key.substring(1)) - 1;
    if (this.cells[y] && this.cells[y][x]) {
      this.cells[y][x].setClue(this.decodeClue(value));
    }
  }
}

squarePuzzle.prototype.collectData = function() {
  var data = {};
  var edgeData = {};
  var nodeData = {};
  this.elements.forEach(element => {
    var value = element.getValue();
    if (value != null) {
      var coord = element.getCoordinates();
      if (element instanceof squarePuzzleCell) {
         data[coord] = value;
      }
      if (element instanceof squarePuzzleEdge) {
         edgeData[coord] = value;
      }
      if (element instanceof squarePuzzleNode) {
         nodeData[coord] = value;
      }
    }
  });
  if (Object.keys(edgeData).length != 0) {
    data["edges"] = edgeData;
  }
  if (Object.keys(nodeData).length != 0) {
    data["nodes"] = nodeData;
  }
  return data;
}

squarePuzzle.prototype.showErrorCells = function(result) {
  if (!Array.isArray(result.errors)) return;
  result.errors.forEach(coord => {
    var x = coord.charCodeAt(0) - 'a'.charCodeAt(0);
    var y = parseInt(coord.substring(1)) - 1;
    this.cells[y][x].markError();
  });
}


// base element  of square grid ///////////////////////////////////////////
var squareGridElement = function(puzzle, col, row) {
  gridElement.call(this, puzzle);
  this.col = col;
  this.row = row;
}

Object.setPrototypeOf(squareGridElement.prototype, gridElement.prototype);

squareGridElement.prototype.baseCorner = function() {
  var s = this.puzzle.size.unitSize;
  return {
    x: this.puzzle.leftGap + this.col * s,
    y: this.puzzle.topGap + this.row * s
  };
}

squareGridElement.prototype.cellCorners = function() {
  var s = this.puzzle.size.unitSize;
  var baseCorner = this.baseCorner();
  return [
    baseCorner,
    {x: baseCorner.x + s, y: baseCorner.y},
    {x: baseCorner.x + s, y: baseCorner.y + s},
    {x: baseCorner.x,     y: baseCorner.y + s}
  ];
}

// cell of square grid ///////////////////////////////////////////
var squarePuzzleCell = function(puzzle, col, row) {
  squareGridElement.call(this, puzzle, col, row);
}

Object.setPrototypeOf(squarePuzzleCell.prototype, squareGridElement.prototype);

squarePuzzleCell.prototype.getCoordinates = function() {
  return String.fromCharCode('a'.charCodeAt(0) + this.col) + (this.row+1).toString();
}

squarePuzzleCell.prototype.center = function() {
  var s = this.puzzle.size.unitSize;
  var corner = this.baseCorner();
  return {
    x: corner.x + s/2,
    y: corner.y + s/2
  };
}

squarePuzzleCell.prototype.render = function() {
  var path = this.puzzle.snap.polygon(this.cellCorners().flatMap(corner => [corner.x, corner.y]));
  path.attr(this.puzzle.gridProperty.cell);
  return path;
}

squarePuzzleCell.prototype.drawColor = function() {
  var attr = Object.assign({}, this.puzzle.gridProperty.cell);
  Object.assign(attr, {fill: this.data.color});
  this.elements.path.attr(attr);
}

squarePuzzleCell.prototype.clearColor = function() {
  this.elements.path.attr(this.puzzle.gridProperty.cell);
}

squarePuzzleCell.prototype.drawImage = function() {
  return this.snapImage(this.center(), this.puzzle.size.unitSize, this.data.image);
}

squarePuzzleCell.prototype.drawText = function() {
  var text = this.snapText(this.center(), this.puzzle.size.unitSize*0.7, this.data.text);
  text.attr({"fill": this.isClue ? this.puzzle.colorSchema.clueColor : this.puzzle.colorSchema.textColor});
  return text;
}

squarePuzzleCell.prototype.drawPencilColor = function() {
  var attr = Object.assign({}, this.puzzle.gridProperty.pencilCell);
  Object.assign(attr, {fill: this.pencilData.color});
  this.elements.path.attr(attr);
}

squarePuzzleCell.prototype.clearPencilColor = function() {
  this.elements.path.attr(this.puzzle.gridProperty.cell);
}

squarePuzzleCell.prototype.drawPencilImage = function() {
  return this.snapImage(this.center(), this.puzzle.size.unitSize*0.6, this.pencilData.image);
}

squarePuzzleCell.prototype.drawPencilText = function() {
  return this.snapText(this.center(), this.puzzle.size.unitSize*0.4, this.pencilData.text);
}

squarePuzzleCell.prototype.isPointInside = function(position) {
  var center = this.center();
  return 2*Math.abs(position.x - center.x) < this.puzzle.size.unitSize
      && 2*Math.abs(position.y - center.y) < this.puzzle.size.unitSize;
}

// edge of square grid ///////////////////////////////////////////
var squarePuzzleEdge = function(puzzle, col, row, side) {
  squareGridElement.call(this, puzzle, col, row);
  this.side = side;
  this.allCells = [];
  this.allCells.push({col:this.col, row:this.row, side: this.side});
}

Object.setPrototypeOf(squarePuzzleEdge.prototype, squareGridElement.prototype);

squarePuzzleEdge.prototype.getCoordinates = function() {
  return String.fromCharCode('a'.charCodeAt(0) + this.col) + (this.row+1).toString() + "-"+ this.side;
}

squarePuzzleEdge.prototype.center = function() {
  var corners = this.cellCorners();
  var start = corners[this.side];
  var end = corners[(this.side+1)%4];
  return {x: (start.x+end.x)/2, y: (start.y+end.y)/2};
}

squarePuzzleEdge.prototype.render = function() {
  return null;
}

squarePuzzleEdge.prototype.drawColor = function() {
  var corners = this.cellCorners();
  var start = corners[this.side];
  var end = corners[(this.side+1)%4];
  var path = this.puzzle.snap.line(start.x, start.y,  end.x, end.y);
  var attr = Object.assign({}, this.puzzle.gridProperty.edge);
  Object.assign(attr, {stroke: this.data.color});
  path.attr(attr);
  return path;
}

squarePuzzleEdge.prototype.clearColor = function() {
  if (this.elements.color) {
    this.elements.color.remove();
  }
}

squarePuzzleEdge.prototype.drawImage = function() {
  return this.snapImage(this.center(), this.puzzle.size.unitSize*0.7, this.data.image)
}

squarePuzzleEdge.prototype.drawText = function() {
  var text = this.snapText(this.center(), this.puzzle.size.unitSize*0.5, this.data.text);
  text.attr({"fill": this.isClue ? this.puzzle.colorSchema.clueColor : this.puzzle.colorSchema.textColor});
  return text;
}

squarePuzzleEdge.prototype.drawPencilColor = function() {
  var corners = this.cellCorners();
  var start = corners[this.side];
  var end = corners[(this.side+1)%4];
  var path = this.puzzle.snap.line(start.x, start.y,  end.x, end.y);
  var attr = Object.assign({}, this.puzzle.gridProperty.pencilEdge);
  Object.assign(attr, {stroke: this.pencilData.color});
  path.attr(attr);
  return path;
}

squarePuzzleEdge.prototype.clearPencilColor = function() {
  if (this.elements.pencilColor) {
    this.elements.pencilColor.remove();
  }
}

squarePuzzleEdge.prototype.drawPencilImage = function() {
  return this.snapImage(this.center(), this.puzzle.size.unitSize*0.4, this.pencilData.image);
}

squarePuzzleEdge.prototype.drawPencilText = function() {
  return this.snapText(this.center(), this.puzzle.size.unitSize*0.3, this.pencilData.text);
}

squarePuzzleEdge.prototype.isPointInside = function(position) {
  var middle = this.center();
  return this.distanceSquare(position, middle) < this.puzzle.size.unitSize*this.puzzle.size.unitSize/12;
}


// node of square grid ///////////////////////////////////////////
var squarePuzzleNode = function(puzzle, col, row, side) {
  squareGridElement.call(this, puzzle, col, row);
  this.side = side;
  this.allCells = [];
  this.allCells.push({col:this.col, row:this.row, side: this.side});
}

Object.setPrototypeOf(squarePuzzleNode.prototype, squareGridElement.prototype);

squarePuzzleNode.prototype.getCoordinates = function() {
  return String.fromCharCode('a'.charCodeAt(0) + this.col) + (this.row+1).toString() + "-"+ this.side;
}

squarePuzzleNode.prototype.center = function() {
  return this.cellCorners()[this.side];
}

squarePuzzleNode.prototype.isPointInside = function(position) {
  var point = this.center();
  return this.distanceSquare(position, point) < this.puzzle.size.unitSize*this.puzzle.size.unitSize/12;
}

squarePuzzleNode.prototype.render = function() {
  return null;
}

squarePuzzleNode.prototype.drawColor = function() {
  var point = this.center();
  var path = this.puzzle.snap.circle(point.x, point.y, this.puzzle.size.unitSize*0.2);
  var attr = Object.assign({}, this.puzzle.gridProperty.node);
  Object.assign(attr, {fill: this.data.color});
  path.attr(attr);
  return path;
}

squarePuzzleNode.prototype.clearColor = function() {
  if (this.elements.color) {
    this.elements.color.remove();
  }
}

squarePuzzleNode.prototype.drawImage = function() {
  return this.snapImage(this.center(), this.puzzle.size.unitSize*0.7, this.data.image)
}

squarePuzzleNode.prototype.drawText = function() {
  var text = this.snapText(this.center(), this.puzzle.size.unitSize*0.5, this.data.text);
  text.attr({"fill": this.isClue ? this.puzzle.colorSchema.clueColor : this.puzzle.colorSchema.textColor});
  return text;
}

squarePuzzleNode.prototype.drawPencilColor = function() {
  var point = this.center();
  var path = this.puzzle.snap.circle(point.x, point.y, this.puzzle.size.unitSize*0.1);
  var attr = Object.assign({}, this.puzzle.gridProperty.pencilNode);
  Object.assign(attr, {fill: this.pencilData.color});
  return path;
}

squarePuzzleNode.prototype.clearPencilColor = function() {
  if (this.elements.pencilColor) {
    this.elements.pencilColor.remove();
  }
}

squarePuzzleNode.prototype.drawPencilImage = function() {
  return this.snapImage(this.center(), this.puzzle.size.unitSize*0.4, this.pencilData.image);
}

squarePuzzleNode.prototype.drawPencilText = function() {
  return this.snapText(this.center(), this.puzzle.size.unitSize*0.3, this.pencilData.text);
}

squarePuzzleNode.prototype.processDragEnd = function(startElement) {
  if (startElement.constructor.name != this.constructor.name) {
    return false;
  }
  var commonEdge = this.commonEdge(startElement);
  if (!commonEdge) {
    return false;
  }
  commonEdge.switchOnDrag();
}

squarePuzzleNode.prototype.processDragMove = function(startElement) {
  if (startElement.constructor.name != this.constructor.name) {
    return false;
  }
  var commonEdge = this.commonEdge(startElement);
  if (!commonEdge) {
    return false;
  }
  commonEdge.switchOnDrag();
  return {newMouseStartElement: this};
}

squarePuzzleNode.prototype.commonEdge = function(otherNode) {
  for (var i=0; i < this.allCells.length; i++) {
    for (var j=0; j < otherNode.allCells.length; j++) {
      var one = this.allCells[i];
      var two = otherNode.allCells[j];
      if (one.row == two.row && one.col == two.col) {
        // two nodes have common cell
        if (one.side == two.side) {
          // the same node
          return null;
        }
        if (one.side == two.side - 1) {
          return this.puzzle.edges[one.row][one.col][one.side];
        }
        if (one.side == two.side + 1) {
          return this.puzzle.edges[two.row][two.col][two.side];
        }
        if (one.side == 0 && two.side == 3) {
          return this.puzzle.edges[two.row][two.col][two.side];
        }
        if (one.side == 3 && two.side == 0) {
          return this.puzzle.edges[one.row][one.col][one.side];
        }
      }
    }
  }
  return null;
}

})
