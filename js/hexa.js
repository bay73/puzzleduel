define(["base","grid","mouse"], function() {

hexaPuzzle = function(puzzleData, controls, settings) {
  basePuzzle.call(this, puzzleData, controls, settings);
}

Object.setPrototypeOf(hexaPuzzle.prototype, basePuzzle.prototype);

hexaPuzzle.prototype.parseDimension = function(dimension) {
  if (dimension.includes("-")) {
    var part = dimension.split("-");
    var size = part[0];
    this.demensionExtra = part[1];
  } else {
    var size = dimension;
  }
  // Hexa grid has vertical simmetrical.
  // rows - size of the vertical sides of the grid
  // cols - size of top (and bottom) inclined sedes
  this.rows = parseInt(size.split("x")[1]);
  this.cols = parseInt(size.split("x")[0]);
}

hexaPuzzle.prototype.createBoard = function() {
  this.elements = [];
  // 
  this.cells = [];
  for (var y = 0; y < this.rows + this.cols - 1; y++) {
    this.cells[y] = new Array(2*this.cols - 1);
    for (var x = 0; x < 2*this.cols - 1; x++) {
      if (y - x < this.rows && x - y < this.cols) {
        this.cells[y][x] = new hexaPuzzleCell(this, x, y);
        this.elements.push(this.cells[y][x]);
      }
    }
  }
  if (this.typeProperties.needEdges) {
    this.edges = [];
    for (var y = 0; y < this.rows + this.cols - 1; y++) {
      this.edges[y] = new Array(2*this.cols - 1);
      for (var x = 0; x < 2*this.cols - 1; x++) {
        if (y - x < this.rows && x - y < this.cols) {
          this.edges[y][x] = new Array(6);
          for (var i=0; i<6; i++){
             if (i==0 && typeof this.edges[y-1] != "undefined" && typeof this.edges[y-1][x] != "undefined") {
               this.edges[y][x][i] = this.edges[y-1][x][3];
               this.edges[y][x][i].allCells.push({col:x, row:y, side: i});
             }else if (i==4 && typeof this.edges[y][x-1] != "undefined") {
               this.edges[y][x][i] = this.edges[y][x-1][1];
               this.edges[y][x][i].allCells.push({col:x, row:y, side: i});
             }else if (i==5 && typeof this.edges[y-1] != "undefined"  && typeof this.edges[y-1][x-1] != "undefined") {
               this.edges[y][x][i] = this.edges[y-1][x-1][2];
               this.edges[y][x][i].allCells.push({col:x, row:y, side: i});
             } else {
               this.edges[y][x][i] = new hexaPuzzleEdge(this, x, y, i);
               this.elements.push(this.edges[y][x][i]);
             }
           }
        }
      }
    }
    if (this.typeProperties.outerEdges) {
      for (var y = 0; y < this.rows + this.cols - 1; y++) {
        for (var x = 0; x < 2*this.cols - 1; x++) {
          if (this.cells[y] && this.cells[y][x]) {
            for (var i=0; i<6; i++){
              if (this.edges[y][x][i].allCells.length==1) {
                this.edges[y][x][i].isFinal = true;
                this.edges[y][x][i].data = {text: null, image: null, color: this.colorSchema.gridColor, textColor: null};
              }
            }
          }
        }
      }
    }
  }
  if (this.typeProperties.needNodes) {
    this.nodes = [];
    for (var y = 0; y < this.rows + this.cols - 1; y++) {
      this.nodes[y] = new Array(2*this.cols - 1);
      for (var x = 0; x < 2*this.cols - 1; x++) {
        if (y - x < this.rows && x - y < this.cols) {
          this.nodes[y][x] = new Array(6);
          for (var i=0; i<6; i++){
            if (i==0 && typeof this.nodes[y-1] != "undefined" && typeof this.nodes[y-1][x] != "undefined") {
              this.nodes[y][x][i] = this.nodes[y-1][x][4];
              this.nodes[y][x][i].allCells.push({col:x, row:y, side: i});
            } else if (i==0 && typeof this.nodes[y-1] != "undefined" && typeof this.nodes[y-1][x-1] != "undefined") {
              this.nodes[y][x][i] = this.nodes[y-1][x-1][2];
              this.nodes[y][x][i].allCells.push({col:x, row:y, side: i});
            } else if (i==1 && typeof this.nodes[y-1] != "undefined" && typeof this.nodes[y-1][x] != "undefined") {
              this.nodes[y][x][i] = this.nodes[y-1][x][3];
              this.nodes[y][x][i].allCells.push({col:x, row:y, side: i});
            } else if (i==4 && typeof this.nodes[y][x-1] != "undefined") {
              this.nodes[y][x][i] = this.nodes[y][x-1][2];
              this.nodes[y][x][i].allCells.push({col:x, row:y, side: i});
            } else if (i==5 && typeof this.nodes[y][x-1] != "undefined") {
              this.nodes[y][x][i] = this.nodes[y][x-1][1];
              this.nodes[y][x][i].allCells.push({col:x, row:y, side: i});
            } else if (i==5 && typeof this.nodes[y-1] != "undefined" && typeof this.nodes[y-1][x-1] != "undefined") {
              this.nodes[y][x][i] = this.nodes[y-1][x-1][3];
              this.nodes[y][x][i].allCells.push({col:x, row:y, side: i});
            } else {
              this.nodes[y][x][i] = new hexaPuzzleNode(this, x, y, i);
              this.elements.push(this.nodes[y][x][i]);
            }
          }
        }
      }
    }
  }
}

hexaPuzzle.prototype.initController = function () {
  if (typeof this.controller != 'undefined') {
    this.controller.detachEvents();
  }
  this.controller = new mouseController(this.elements);
  this.controller.attachEvents(this.snap);
  for (var y = 0; y < this.rows + this.cols - 1; y++) {
    for (var x = 0; x < 2*this.cols - 1; x++) {
      if (this.cells[y] && this.cells[y][x]) {
        if (typeof this.typeProperties.cellController == "function") {
          this.typeProperties.cellController(this.cells[y][x]);
        }
        for (var i=0; i<6; i++){
          if (typeof this.typeProperties.edgeController == "function") {
            this.typeProperties.edgeController(this.edges[y][x][i]);
          }
        }
        for (var i=0; i<6; i++){
          if (typeof this.typeProperties.nodeController == "function") {
            this.typeProperties.nodeController(this.nodes[y][x][i]);
          }
        }
      }
    }
  }
}

hexaPuzzle.prototype.initEditController = function() {
  if (typeof this.controller != 'undefined') {
    this.controller.detachEvents();
  }
  this.controller = new mouseController(this.elements);
  this.controller.attachEvents(this.snap);
  for (var y = 0; y < this.rows + this.cols - 1; y++) {
    for (var x = 0; x < 2*this.cols - 1; x++) {
      if (this.cells[y] && this.cells[y][x]) {
        if (typeof this.typeProperties.cellEditController == "function") {
          this.typeProperties.cellEditController(this.cells[y][x]);
        }
        for (var i=0; i<6; i++){
          if (typeof this.typeProperties.edgeEditController == "function") {
            this.typeProperties.edgeEditController(this.edges[y][x][i]);
          }
        }
        for (var i=0; i<6; i++){
          if (typeof this.typeProperties.nodeEditController == "function") {
            this.typeProperties.nodeEditController(this.nodes[y][x][i]);
          }
        }
      }
    }
  }
}

hexaPuzzle.prototype.findSize = function() {
  var width = this.snap.node.clientWidth;
  if (width==0) {
    width = $(this.snap.node).parent().parent().parent().width();
  }
  var hSizeLimit = width*0.90;
  var vSizeLimit = window.innerHeight*0.67;
  var cols = this.cols;
  var rows = this.rows;
  // unitCell - radius of a hexagon cell
  var unitSize = Math.min(hSizeLimit / (3*cols-1), vSizeLimit / ((cols+rows-1)*Math.sqrt(3)));
  var leftGap = (width - unitSize * (3*cols-1)) /2;
  var topGap = 1;
  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  var height = ((cols+rows-1)*Math.sqrt(3))*unitSize + topGap + unitSize / (isSafari ? 1.5 : 2);
  this.chooserSize = Math.min(25 + leftGap + unitSize*0.9, unitSize * (isSafari ? 2.1 : 2.3));

  return {height: height, width: width, unitSize: unitSize, leftGap: leftGap, topGap: topGap, baseThickness: unitSize < 36 ? 7 : Math.round(unitSize/5)};
}

hexaPuzzle.prototype.drawBoard = function() {
  this.elements.forEach(element => element.draw())
}

hexaPuzzle.prototype.clearAll = function(data) {
  this.elements.forEach(element => element.clearData())
}

hexaPuzzle.prototype.showClues = function(data) {
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

hexaPuzzle.prototype.drawAreas = function(areas) {
  for(var i=0; i<areas.length;i++) {
    var area = areas[i];
    for (var j=0;j<area.length;j++) {
      var coord = this.decodeCoordinate(area[j]);
      this.cells[coord.y][coord.x].area = i;
    }
  }
  for (var y = 0; y < this.rows + this.cols - 1; y++) {
    for (var x = 0; x < 2*this.cols - 1; x++) {
      if (y - x < this.rows && x - y < this.cols) {
        if (x < 2*this.cols - 2 && x+1-y < this.cols && this.cells[y][x].area != this.cells[y][x+1].area) {
          this.edges[y][x][1].setClue({color: this.colorSchema.gridColor});
        }
        if (y < this.rows + this.cols - 2 && y+1-x < this.rows && x-(y+1) < this.cols && this.cells[y][x].area != this.cells[y+1][x].area) {
          this.edges[y][x][3].setClue({color: this.colorSchema.gridColor});
        }
        if (x < 2*this.cols - 2 && y < this.rows + this.cols - 2 && this.cells[y][x].area != this.cells[y+1][x+1].area) {
          this.edges[y][x][2].setClue({color: this.colorSchema.gridColor});
        }
      }
    }
  }
}

hexaPuzzle.prototype.drawEdgeClues = function(edges) {
  for (const [key, value] of Object.entries(edges)) {
    var part = key.split("-");
    var coord = this.decodeCoordinate(part[0]);
    if (part[1]=="b") {
      var side = 2;
    } else if (part[1]=="r") {
      var side = 1;
    } else {
      var side = parseInt(part[1]);
    }
    this.edges[coord.y][coord.x][side].setClue(this.decodeClue(value));
  }
}

hexaPuzzle.prototype.drawNodeClues = function(nodes) {
  for (const [key, value] of Object.entries(nodes)) {
    var part = key.split("-");
    var coord = this.decodeCoordinate(part[0]);
    if (typeof part[1]=="undefined") {
      var side = 2;
    } else {
      var side = parseInt(part[1]);
    }
    this.nodes[coord.y][coord.x][side].setClue(this.decodeClue(value));
  }
}


hexaPuzzle.prototype.collectData = function() {
  var data = {};
  var edgeData = {};
  var nodeData = {};
  this.elements.forEach(element => {
    var value = element.getValue();
    if (value != null) {
      var coord = element.getCoordinates();
      if (element instanceof hexaPuzzleCell) {
         data[coord] = value;
      }
      if (element instanceof hexaPuzzleEdge) {
         edgeData[coord] = value;
      }
      if (element instanceof hexaPuzzleNode) {
         nodeData[coord] = value;
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
  return data;
}

hexaPuzzle.prototype.computeAreas = function() {
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
  for (var y = 0; y < this.rows + this.cols - 1; y++) {
    areaLink[y] = new Array(2*this.cols - 1);
    for (var x = 0; x < 2*this.cols - 1; x++) {
      if (y - x < this.rows && x - y < this.cols) {
        areaData[cellCount] = {name: this.cells[y][x].getCoordinates(), parent: cellCount, volume: 1};
        areaLink[y][x] = cellCount;
        cellCount++;
      }
    }
  }
  for (var y = 0; y < this.rows + this.cols - 1; y++) {
    for (var x = 0; x < 2*this.cols - 1; x++) {
      if (y - x < this.rows && x - y < this.cols) {
        if (x < 2*this.cols - 2 && x+1-y < this.cols && this.canJoinAreas({x:x,y:y}, {x:x+1,y:y})) {
          join(areaLink[y][x], areaLink[y][x+1]);
        }
        if (y < this.rows + this.cols - 2 && y+1-x < this.rows && x-(y+1) < this.cols && this.canJoinAreas({x:x,y:y}, {x:x,y:y+1})) {
          join(areaLink[y][x], areaLink[y+1][x]);
        }
        if (x < 2*this.cols - 2 && y < this.rows + this.cols - 2 && this.canJoinAreas({x:x,y:y}, {x:x+1,y:y+1})) {
          join(areaLink[y][x], areaLink[y+1][x+1]);
        }
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

hexaPuzzle.prototype.canJoinAreas = function(pos1, pos2) {
  function isBold(edge) {
    return edge.getValue() == "1" || edge.getValue() == "bold";
  }
  if (pos1.x == pos2.x && pos1.y == pos2.y-1) {
    return !isBold(this.edges[pos1.y][pos1.x][3]);
  }
  if (pos1.x == pos2.x && pos1.y-1 == pos2.y) {
    return !isBold(this.edges[pos2.y][pos2.x][3]);
  }
  if (pos1.x == pos2.x-1 && pos1.y == pos2.y) {
    return !isBold(this.edges[pos1.y][pos1.x][1]);
  }
  if (pos1.x-1 == pos2.x && pos1.y == pos2.y) {
    return !isBold(this.edges[pos2.y][pos2.x][1]);
  }
  if (pos1.x == pos2.x-1 && pos1.y == pos2.y-1) {
    return !isBold(this.edges[pos1.y][pos1.x][2]);
  }
  if (pos1.x-1 == pos2.x && pos1.y-1 == pos2.y) {
    return !isBold(this.edges[pos2.y][pos2.x][2]);
  }
}

hexaPuzzle.prototype.decodeCoordinate = function(key) {
  return {x: key.charCodeAt(0) - 'a'.charCodeAt(0), y: parseInt(key.substring(1)) - 1};
}

hexaPuzzle.prototype.getElementByCoordinate = function(coordinate) {
  let parts = coordinate.split('-');
  coord = this.decodeCoordinate(parts[0])
  if (parts.length==1) {
    return this.cells[coord.y][coord.x];
  } else {
    switch (parts[1].charAt(0)) {
      case 'e':
        return this.typeProperties.needEdges ? this.edges[coord.y][coord.x][parts[1].slice(1)] : null;
      case 'n':
        return this.typeProperties.needNodes ? this.nodes[coord.y][coord.x][parts[1].slice(1)] : null;
      default:
        return null;
    }
  }
}

hexaPuzzle.prototype.showErrorCells = function(result) {
  if (!Array.isArray(result.errors)) return;
  result.errors.forEach(key => {
    var coord = this.decodeCoordinate(key);
    this.cells[coord.y][coord.x].markError();
  });
}


// base element  of hexa grid ///////////////////////////////////////////
var hexaGridElement = function(puzzle, col, row) {
  gridElement.call(this, puzzle);
  this.col = col;
  this.row = row;
}

Object.setPrototypeOf(hexaGridElement.prototype, gridElement.prototype);

hexaGridElement.prototype.baseCorner = function() {
  var s = this.puzzle.size.unitSize;
  var h = s * Math.sqrt(3)/2.;
  return {
    x: this.puzzle.size.leftGap + s/2 + this.col * s*3/2,
    y: this.puzzle.size.topGap + (this.puzzle.cols - 1) * h + this.row * h * 2 - this.col * h
  };
}

hexaGridElement.prototype.cellCorners = function() {
  var s = this.puzzle.size.unitSize;
  var h = s * Math.sqrt(3)/2.;
  var baseCorner = this.baseCorner();
  return [
    baseCorner,
    {x: baseCorner.x + s,       y: baseCorner.y},
    {x: baseCorner.x + s + s/2, y: baseCorner.y + h},
    {x: baseCorner.x + s,       y: baseCorner.y + 2*h},
    {x: baseCorner.x,           y: baseCorner.y + 2*h},
    {x: baseCorner.x - s/2,     y: baseCorner.y + h}
  ];
}

// cell of hexa grid ///////////////////////////////////////////
var hexaPuzzleCell = function(puzzle, col, row) {
  hexaGridElement.call(this, puzzle, col, row);
}

Object.setPrototypeOf(hexaPuzzleCell.prototype, hexaGridElement.prototype);

hexaPuzzleCell.prototype.getCoordinates = function() {
  return String.fromCharCode('a'.charCodeAt(0) + this.col) + (this.row+1).toString();
}

hexaPuzzleCell.prototype.getLogCoordinates = function() {
  return String.fromCharCode('a'.charCodeAt(0) + this.col) + (this.row+1).toString();
}

hexaPuzzleCell.prototype.center = function() {
  var s = this.puzzle.size.unitSize;
  var h = s * Math.sqrt(3)/2.;
  var corner = this.baseCorner();
  return {
    x: corner.x + s/2,
    y: corner.y + h
  };
}

hexaPuzzleCell.prototype.render = function() {
  var path = this.puzzle.snap.polygon([].concat.apply([], this.cellCorners().map(corner => [corner.x, corner.y])));
  path.attr(this.puzzle.gridProperty.cell);
  return path;
}

hexaPuzzleCell.prototype.drawColor = function() {
  var attr = Object.assign({}, this.puzzle.gridProperty.cell);
  Object.assign(attr, {fill: this.data.color});
  this.elements.path.attr(attr);
}

hexaPuzzleCell.prototype.clearColor = function() {
  this.elements.path.attr(this.puzzle.gridProperty.cell);
}

hexaPuzzleCell.prototype.drawImage = function() {
  return this.snapImage(this.center(), this.puzzle.size.unitSize*1.7, this.data.image);
}

hexaPuzzleCell.prototype.drawText = function() {
  var text = this.snapText(this.center(), this.puzzle.size.unitSize, this.data.text);
  var textColor = this.data.textColor;
  if (typeof textColor=='undefined') {
    textColor = this.isClue ? this.puzzle.colorSchema.clueColor: this.puzzle.colorSchema.textColor;
  }
  text.attr({"fill": textColor});
  return text;
}

hexaPuzzleCell.prototype.drawPencilColor = function() {
  var attr = Object.assign({}, this.puzzle.gridProperty.pencilCell);
  Object.assign(attr, {fill: this.pencilData.color});
  this.elements.path.attr(attr);
}

hexaPuzzleCell.prototype.clearPencilColor = function() {
  this.elements.path.attr(this.puzzle.gridProperty.cell);
}

hexaPuzzleCell.prototype.drawPencilImage = function() {
  return this.snapImage(this.center(), this.puzzle.size.unitSize, this.pencilData.image);
}

hexaPuzzleCell.prototype.drawPencilText = function() {
  return this.snapText(this.center(), this.puzzle.size.unitSize*0.5, this.pencilData.text);
}

hexaPuzzleCell.prototype.isPointInside = function(position) {
  var center = this.center();
  return this.distanceSquare(position, center) < this.puzzle.size.unitSize*this.puzzle.size.unitSize;
}

hexaPuzzleCell.prototype.processDragEnd = function(startElement) {
  if (this.dragProcessor == null) {
    return false;
  }
  if (typeof this.dragProcessor=='function') {
    return this.dragProcessor(startElement);
  } else {
    return false;
  }
}

hexaPuzzleCell.prototype.processDragMove = function(startElement) {
  if (!this.processDragEnd(startElement)) {
    return false;
  }
  return {newMouseStartElement: this};
}

// edge of hexa grid ///////////////////////////////////////////
var hexaPuzzleEdge = function(puzzle, col, row, side) {
  hexaGridElement.call(this, puzzle, col, row);
  this.side = side;
  this.allCells = [];
  this.allCells.push({col:this.col, row:this.row, side: this.side});
}

Object.setPrototypeOf(hexaPuzzleEdge.prototype, hexaGridElement.prototype);

hexaPuzzleEdge.prototype.getCoordinates = function() {
  return String.fromCharCode('a'.charCodeAt(0) + this.col) + (this.row+1).toString() + "-"+ this.side;
}

hexaPuzzleEdge.prototype.getLogCoordinates = function() {
  return String.fromCharCode('a'.charCodeAt(0) + this.col) + (this.row+1).toString() + "-e"+ this.side;
}

hexaPuzzleEdge.prototype.center = function() {
  var corners = this.cellCorners();
  var start = corners[this.side];
  var end = corners[(this.side+1)%6];
  return {x: (start.x+end.x)/2, y: (start.y+end.y)/2};
}

hexaPuzzleEdge.prototype.render = function() {
  return null;
}

hexaPuzzleEdge.prototype.drawColor = function() {
  var corners = this.cellCorners();
  var start = corners[this.side];
  var end = corners[(this.side+1)%6];
  var path = this.puzzle.snap.line(start.x, start.y,  end.x, end.y);
  var attr = Object.assign({}, this.puzzle.gridProperty.edge);
  Object.assign(attr, {stroke: this.data.color});
  path.attr(attr);
  return path;
}

hexaPuzzleEdge.prototype.clearColor = function() {
  if (this.elements.color) {
    this.elements.color.remove();
    this.elements.color = null;
  }
}

hexaPuzzleEdge.prototype.drawImage = function() {
  return this.snapImage(this.center(), this.puzzle.size.unitSize*0.8, this.data.image)
}

hexaPuzzleEdge.prototype.drawText = function() {
  var text = this.snapText(this.center(), this.puzzle.size.unitSize*0.6, this.data.text);
  var textColor = this.data.textColor;
  if (typeof textColor=='undefined') {
    textColor = this.isClue ? this.puzzle.colorSchema.clueColor: this.puzzle.colorSchema.textColor;
  }
  text.attr({"fill": textColor});
  return text;
}

hexaPuzzleEdge.prototype.drawPencilColor = function() {
  var corners = this.cellCorners();
  var start = corners[this.side];
  var end = corners[(this.side+1)%6];
  var path = this.puzzle.snap.line(start.x, start.y,  end.x, end.y);
  var attr = Object.assign({}, this.puzzle.gridProperty.pencilEdge);
  Object.assign(attr, {stroke: this.pencilData.color});
  path.attr(attr);
  return path;
}

hexaPuzzleEdge.prototype.clearPencilColor = function() {
  if (this.elements.pencilColor) {
    this.elements.pencilColor.remove();
    this.elements.pencilColor = null;
  }
}

hexaPuzzleEdge.prototype.drawPencilImage = function() {
  return this.snapImage(this.center(), this.puzzle.size.unitSize*0.5, this.pencilData.image);
}

hexaPuzzleEdge.prototype.drawPencilText = function() {
  return this.snapText(this.center(), this.puzzle.size.unitSize*0.3, this.pencilData.text);
}

hexaPuzzleEdge.prototype.isPointInside = function(position) {
  var middle = this.center();
  return this.distanceSquare(position, middle) < this.puzzle.size.unitSize*this.puzzle.size.unitSize/6;
}


// node of hexa grid ///////////////////////////////////////////
var hexaPuzzleNode = function(puzzle, col, row, side) {
  hexaGridElement.call(this, puzzle, col, row);
  this.side = side;
  this.allCells = [];
  this.allCells.push({col:this.col, row:this.row, side: this.side});
}

Object.setPrototypeOf(hexaPuzzleNode.prototype, hexaGridElement.prototype);

hexaPuzzleNode.prototype.getCoordinates = function() {
  return String.fromCharCode('a'.charCodeAt(0) + this.col) + (this.row+1).toString() + "-"+ this.side;
}
hexaPuzzleNode.prototype.getLogCoordinates = function() {
  return String.fromCharCode('a'.charCodeAt(0) + this.col) + (this.row+1).toString() + "-n"+ this.side;
}

hexaPuzzleNode.prototype.center = function() {
  return this.cellCorners()[this.side];
}

hexaPuzzleNode.prototype.isPointInside = function(position) {
  var point = this.center();
  return this.distanceSquare(position, point) < this.puzzle.size.unitSize*this.puzzle.size.unitSize/8;
}

hexaPuzzleNode.prototype.render = function() {
  return null;
}

hexaPuzzleNode.prototype.drawColor = function() {
  var point = this.center();
  var path = this.puzzle.snap.circle(point.x, point.y, this.puzzle.size.unitSize*0.2);
  var attr = Object.assign({}, this.puzzle.gridProperty.node);
  Object.assign(attr, {fill: this.data.color});
  path.attr(attr);
  return path;
}

hexaPuzzleNode.prototype.clearColor = function() {
  if (this.elements.color) {
    this.elements.color.remove();
    this.elements.color = null;
  }
}

hexaPuzzleNode.prototype.drawImage = function() {
  return this.snapImage(this.center(), this.puzzle.size.unitSize*0.5, this.data.image)
}

hexaPuzzleNode.prototype.drawText = function() {
  var text = this.snapText(this.center(), this.puzzle.size.unitSize*0.4, this.data.text);
  var textColor = this.data.textColor;
  if (typeof textColor=='undefined') {
    textColor = this.isClue ? this.puzzle.colorSchema.clueColor: this.puzzle.colorSchema.textColor;
  }
  text.attr({"fill": textColor});
  return text;
}

hexaPuzzleNode.prototype.drawPencilColor = function() {
  var point = this.center();
  var path = this.puzzle.snap.circle(point.x, point.y, this.puzzle.size.unitSize*0.1);
  var attr = Object.assign({}, this.puzzle.gridProperty.pencilNode);
  Object.assign(attr, {fill: this.pencilData.color});
  return path;
}

hexaPuzzleNode.prototype.clearPencilColor = function() {
  if (this.elements.pencilColor) {
    this.elements.pencilColor.remove();
    this.elements.pencilColor = null;
  }
}

hexaPuzzleNode.prototype.drawPencilImage = function() {
  return this.snapImage(this.center(), this.puzzle.size.unitSize*0.3, this.pencilData.image);
}

hexaPuzzleNode.prototype.drawPencilText = function() {
  return this.snapText(this.center(), this.puzzle.size.unitSize*0.2, this.pencilData.text);
}

hexaPuzzleNode.prototype.processDragEnd = function(startElement) {
  if (startElement.constructor.name != this.constructor.name) {
    return false;
  }
  var commonEdge = this.commonEdge(startElement);
  if (!commonEdge) {
    return false;
  }
  commonEdge.switchOnDrag();
  return true;
}

hexaPuzzleNode.prototype.processDragMove = function(startElement) {
  if (!this.processDragEnd(startElement)) {
    return false;
  }
  return {newMouseStartElement: this};
}

hexaPuzzleNode.prototype.commonEdge = function(otherNode) {
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
        if (one.side == 0 && two.side == 5) {
          return this.puzzle.edges[two.row][two.col][two.side];
        }
        if (one.side == 5 && two.side == 0) {
          return this.puzzle.edges[one.row][one.col][one.side];
        }
      }
    }
  }
  return null;
}

})
