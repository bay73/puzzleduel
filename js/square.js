define(["base","grid","mouse"], function() {

squarePuzzle = function(puzzleData, controls, settings) {
  basePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(squarePuzzle.prototype, basePuzzle.prototype);

squarePuzzle.prototype.parseDimension = function(dimension) {
  var dimensions = dimension.split("x");
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
  if (this.typeProperties.needEdges) {
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
    if (this.typeProperties.outerEdges) {
      for (var y = 0; y < this.rows; y++) {
        for (var x = 0; x < this.cols; x++) {
          for (var i=0; i<4; i++){
            if (this.typeProperties.outerEdges && this.edges[y][x][i].allCells.length==1) {
              this.edges[y][x][i].isFinal = true;
              this.edges[y][x][i].data = {text: null, image: null, color: this.colorSchema.gridColor, textColor: null};
            }
          }
        }
      }
    }
  }
  if (this.typeProperties.needNodes) {
    this.nodes = [];
    for (var y = 0; y < this.rows; y++) {
      this.nodes[y] = new Array(this.cols);
      for (var x = 0; x < this.cols; x++) {
        this.nodes[y][x] = new Array(4);
        for (var i=0; i<4; i++){
          if (i==0 && typeof this.nodes[y-1] != "undefined" && typeof this.nodes[y-1][x] != "undefined") {
            this.nodes[y][x][i] = this.nodes[y-1][x][3];
            this.nodes[y][x][i].allCells.push({col:x, row:y, side: i});
          } else if (i==0 && typeof this.nodes[y] != "undefined" && typeof this.nodes[y][x-1] != "undefined") {
            this.nodes[y][x][i] = this.nodes[y][x-1][1];
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
  if (this.typeProperties.needConnectors) {
    this.connectors = [];
    for (var y = 0; y < this.rows; y++) {
      this.connectors[y] = new Array(this.cols);
      for (var x = 0; x < this.cols; x++) {
        this.connectors[y][x] = {};
        if (x < this.cols - 1) {
          this.connectors[y][x]['h'] = new squarePuzzleConnector(this, x, y, 'h');
          this.elements.push(this.connectors[y][x]['h']);
        }
        if (y < this.rows - 1) {
          this.connectors[y][x]['v'] = new squarePuzzleConnector(this, x, y, 'v');
          this.elements.push(this.connectors[y][x]['v']);
        }
        if (x > 0) {
          this.connectors[y][x-1]['h'].allCells.push({col:x, row:y, side: '-h'});
        }
        if (y > 0) {
          this.connectors[y-1][x]['v'].allCells.push({col:x, row:y, side: '-v'});
        }
      }
    }
  }
}

squarePuzzle.prototype.decodeCoordinate = function(key) {
  return {x: key.charCodeAt(0) - 'a'.charCodeAt(0), y: parseInt(key.substring(1)) - 1};
}

squarePuzzle.prototype.initController = function () {
  if (typeof this.controller != 'undefined') {
    this.controller.detachEvents();
  }
  this.controller = new mouseController(this.elements);
  this.controller.attachEvents(this.snap);
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      if (typeof this.typeProperties.cellController == "function") {
        this.typeProperties.cellController(this.cells[y][x]);
      }
      if (typeof this.typeProperties.edgeController == "function") {
        for (var i=0; i<4; i++){
          this.typeProperties.edgeController(this.edges[y][x][i]);
        }
      }
      if (typeof this.typeProperties.nodeController == "function") {
        for (var i=0; i<4; i++){
          this.typeProperties.nodeController(this.nodes[y][x][i]);
        }
      }
      if (typeof this.typeProperties.connectorController == "function") {
        if (this.connectors[y][x]['v']) {
          this.typeProperties.connectorController(this.connectors[y][x]['v']);
        }
        if (this.connectors[y][x]['h']) {
          this.typeProperties.connectorController(this.connectors[y][x]['h']);
        }
      }
    }
  }
}

squarePuzzle.prototype.initEditController = function() {
  if (typeof this.controller != 'undefined') {
    this.controller.detachEvents();
  }
  this.controller = new mouseController(this.elements);
  this.controller.attachEvents(this.snap);
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      if (typeof this.typeProperties.cellEditController == "function") {
        this.typeProperties.cellEditController(this.cells[y][x]);
      }
      if (typeof this.typeProperties.edgeEditController == "function") {
        for (var i=0; i<4; i++){
          this.typeProperties.edgeEditController(this.edges[y][x][i]);
        }
      }
      if (typeof this.typeProperties.nodeEditController == "function") {
        for (var i=0; i<4; i++){
          this.typeProperties.nodeEditController(this.nodes[y][x][i]);
        }
      }
      if (typeof this.typeProperties.connectorEditController == "function") {
        if (this.connectors[y][x]['v']) {
          this.typeProperties.connectorEditController(this.connectors[y][x]['v']);
        }
        if (this.connectors[y][x]['h']) {
          this.typeProperties.connectorEditController(this.connectors[y][x]['h']);
        }
      }
    }
  }
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
  var height = rows*unitSize + this.topGap + unitSize / (isSafari ? 1.5 : 4);
  this.chooserSize = Math.min(25 + this.leftGap + unitSize / 2, unitSize * (isSafari ? 1.4 : 1.6));

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
    if (key=="areas") {
      this.drawAreas(value);
    } else if (key=="edges") {
      this.drawEdgeClues(value);
    } else if (key=="nodes") {
      this.drawNodeClues(value);
    } else {
      var coord = this.decodeCoordinate(key);
      if (this.cells[coord.y] && this.cells[coord.y][coord.x]) {
        this.cells[coord.y][coord.x].setClue(this.decodeClue(value));
      }
    }
  }
}

squarePuzzle.prototype.drawAreas = function(areas) {
  for(var i=0; i<areas.length;i++) {
    var area = areas[i];
    for (var j=0;j<area.length;j++) {
      var coord = this.decodeCoordinate(area[j]);
      this.cells[coord.y][coord.x].area = i;
    }
  }
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      if (x < this.cols-1 && this.cells[y][x].area != this.cells[y][x+1].area) {
        this.edges[y][x][1].setClue({color: this.colorSchema.gridColor});
      }
      if (y < this.rows-1 && this.cells[y][x].area != this.cells[y+1][x].area) {
        this.edges[y][x][2].setClue({color: this.colorSchema.gridColor});
      }
    }
  }
}

squarePuzzle.prototype.drawEdgeClues = function(edges) {
  for (const [key, value] of Object.entries(edges)) {
    var part = key.split("-");
    var coord = this.decodeCoordinate(part[0]);
    var side = part[1]=="b" ? 2 : 1;
    this.edges[coord.y][coord.x][side].setClue(this.decodeClue(value));
  }
}

squarePuzzle.prototype.drawNodeClues = function() {
  for (const [key, value] of Object.entries(this.nodes)) {
    var coord = this.decodeCoordinate(key);
    this.nodes[coord.y][coord.x][0].setClue(this.decodeClue(value));
  }
}

squarePuzzle.prototype.collectData = function() {
  var data = {};
  var edgeData = {};
  var nodeData = {};
  var connectorData = {};
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
      if (element instanceof squarePuzzleConnector) {
         connectorData[coord] = value;
      }
    }
  });
  if (Object.keys(edgeData).length != 0) {
    if (this.typeProperties.collectAreas) {
      data["areas"] = this.computeAreas();
    } else {
      data["edges"] = edgeData;
    }
  }
  if (Object.keys(nodeData).length != 0) {
    data["nodes"] = nodeData;
  }
  if (Object.keys(connectorData).length != 0) {
    data["connectors"] = connectorData;
  }
  return data;
}

squarePuzzle.prototype.computeAreas = function() {
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
  var areaData = []
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
      if (x < this.cols-1 && this.edges[y][x][1].getValue() != "1") {
        join(areaLink[y][x], areaLink[y][x+1]);
      }
      if (y < this.rows-1 && this.edges[y][x][2].getValue() != "1") {
        join(areaLink[y][x], areaLink[y+1][x]);
      }
    }
  }
  var areasObject = {};
  for (var i = 0; i< cellCount; i++) {
    var r = root(i);
    if (!(r in areasObject)) {
      areasObject[r] = [];
    }
    areasObject[r].push(areaData[i].name);
  }
  var areas = [];
  for (r in areasObject) {
    areas.push(areasObject[r])
  }
  return areas;
}

squarePuzzle.prototype.showErrorCells = function(result) {
  if (!Array.isArray(result.errors)) return;
  result.errors.forEach(key => {
    var coord = this.decodeCoordinate(key);
    this.cells[coord.y][coord.x].markError();
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
  var path = this.puzzle.snap.polygon([].concat.apply([], this.cellCorners().map(corner => [corner.x, corner.y])));
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
  if (Array.isArray(this.pencilData)) {
    throw 'changeColor is unsupported as pencil mark!';
  } else {
    var attr = Object.assign({}, this.puzzle.gridProperty.pencilCell);
    Object.assign(attr, {fill: this.pencilData.color});
    this.elements.path.attr(attr);
  }
}

squarePuzzleCell.prototype.clearPencilColor = function() {
  this.elements.path.attr(this.puzzle.gridProperty.cell);
}

squarePuzzleCell.prototype.drawPencilImage = function() {
  if (Array.isArray(this.pencilData)) {
    var pencilGroup = this.puzzle.snap.group();
    for (var i=0;i<this.pencilData.length;i++) {
      if (this.pencilData[i].image) {
        var attr = this.pencilMarkAttribute(this.pencilData[i]);
        pencilGroup.append(this.snapImage(attr.center, this.puzzle.size.unitSize/attr.rows, this.pencilData[i].image));
      }
    }
    return pencilGroup;
  } else {
    return this.snapImage(this.center(), this.puzzle.size.unitSize*0.6, this.pencilData.image);
  }
}

squarePuzzleCell.prototype.drawPencilText = function() {
  if (Array.isArray(this.pencilData)) {
    var pencilGroup = this.puzzle.snap.group();
    for (var i=0;i<this.pencilData.length;i++) {
      if (this.pencilData[i].text) {
        var attr = this.pencilMarkAttribute(this.pencilData[i]);
        pencilGroup.append(this.snapText(attr.center, this.puzzle.size.unitSize*0.8/attr.rows, this.pencilData[i].text));
      }
    }
    return pencilGroup;
  } else {
    return this.snapText(this.center(), this.puzzle.size.unitSize*0.4, this.pencilData.text);
  }
}

squarePuzzleCell.prototype.pencilMarkAttribute = function(pencilMark) {
  var markRows = 4;
  if (this.chooserValues.length <= 10) {
    markRows = 3;
  }
  if (this.chooserValues.length <= 5) {
    markRows = 2;
  }
  var pencilIndex = 0;
  for (var j=0; j<this.chooserValues.length; j++){
    if (this.compareData(this.chooserValues[j], pencilMark)) {
      pencilIndex = j;
    }
  }
  var row = Math.floor((pencilIndex - 1)/markRows);
  var col = (pencilIndex - 1)%markRows;
  if (this.chooserValues.length == 3 && pencilIndex == 2) {
    row = 1;
  }
  return {
    rows: markRows,
    center: {
      x: this.center().x + this.puzzle.size.unitSize*(col - (markRows-1)/2)/markRows,
      y: this.center().y + this.puzzle.size.unitSize*(row - (markRows-1)/2)/markRows
    }
  }
}

squarePuzzleCell.prototype.isPointInside = function(position) {
  var center = this.center();
  return 2*Math.abs(position.x - center.x) < this.puzzle.size.unitSize
      && 2*Math.abs(position.y - center.y) < this.puzzle.size.unitSize;
}

squarePuzzleCell.prototype.hasMultiPencil = function() {
  return this.puzzle.typeProperties.cellMultiPencil;
}

squarePuzzleCell.prototype.processDragMove = function(startElement) {
  if (startElement.constructor.name != this.constructor.name) {
    return false;
  }
  var commonConnector = this.commonConnector(startElement);
  if (!commonConnector) {
    return false;
  }
  commonConnector.switchOnDrag();
  return {newMouseStartElement: this};
}

squarePuzzleCell.prototype.commonConnector = function(startElement) {
  if (this == startElement) {
    return null;
  }
  if (this.col == startElement.col && Math.abs(this.row - startElement.row) == 1) {
    var col = this.col;
    var row = this.row < startElement.row ? this.row : startElement.row;
    var side = 'v';
  }
  if (this.row == startElement.row && Math.abs(this.col - startElement.col) == 1) {
    var col = this.col < startElement.col ? this.col : startElement.col;
    var row = this.row;
    var side = 'h';
  }
  if (side) {
    return this.puzzle.connectors[row][col][side];
  }
  return null;
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


// connector of square grid ///////////////////////////////////////////
var squarePuzzleConnector = function(puzzle, col, row, side) {
  squareGridElement.call(this, puzzle, col, row);
  this.side = side;
  this.allCells = [];
  this.allCells.push({col:this.col, row:this.row, side: this.side});
}

Object.setPrototypeOf(squarePuzzleConnector.prototype, squareGridElement.prototype);

squarePuzzleConnector.prototype.getCoordinates = function() {
  return String.fromCharCode('a'.charCodeAt(0) + this.col) + (this.row+1).toString() + "-"+ this.side;
}

squarePuzzleConnector.prototype.center = function() {
  var corners = this.cellCorners();
  if (this.side=='v') {
    var start = corners[2];
    var end = corners[3];
  }
  if (this.side=='h') {
    var start = corners[1];
    var end = corners[2];
  }
  return {x: (start.x+end.x)/2, y: (start.y+end.y)/2};
}

squarePuzzleConnector.prototype.render = function() {
  return null;
}

squarePuzzleConnector.prototype.drawColor = function() {
  var s = this.puzzle.size.unitSize;
  var base = this.baseCorner();
  var start = {x: base.x + s/2, y: base.y + s/2};
  if (this.side =='v') {
    var end = {x: start.x, y: start.y + s};
  }
  if (this.side =='h') {
    var end = {x: start.x + s, y: start.y};
  }
  var path = this.puzzle.snap.line(start.x, start.y,  end.x, end.y);
  var attr = Object.assign({}, this.puzzle.gridProperty.connector);
  Object.assign(attr, {stroke: this.data.color});
  path.attr(attr);
  return path;
}

squarePuzzleConnector.prototype.clearColor = function() {
  if (this.elements.color) {
    this.elements.color.remove();
  }
}

squarePuzzleConnector.prototype.drawImage = function() {
  // Connector doesn't support images
  return null;
}

squarePuzzleConnector.prototype.drawText = function() {
  // Connector doesn't support text
  return null;
}

squarePuzzleConnector.prototype.drawPencilColor = function() {
  var s = this.puzzle.size.unitSize;
  var base = this.baseCorner();
  var start = {x: base.x + s/2, y: base.y + s/2};
  if (this.side =='v') {
    var end = {x: start.x, y: start.y + s};
  }
  if (this.side =='h') {
    var end = {x: start.x + s, y: start.y};
  }
  var path = this.puzzle.snap.line(start.x, start.y,  end.x, end.y);
  var attr = Object.assign({}, this.puzzle.gridProperty.pencilConnector);
  Object.assign(attr, {stroke: this.pencilData.color});
  path.attr(attr);
  return path;
}

squarePuzzleConnector.prototype.clearPencilColor = function() {
  if (this.elements.pencilColor) {
    this.elements.pencilColor.remove();
  }
}

squarePuzzleConnector.prototype.drawPencilImage = function() {
  // Connector doesn't support images
  return null;
}

squarePuzzleConnector.prototype.drawPencilText = function() {
  // Connector doesn't support text
  return null;
}

squarePuzzleConnector.prototype.isPointInside = function(position) {
  // Connector catch mouse events
  return false;
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
