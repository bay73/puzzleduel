// Default puzzle with square grid.
var squarePuzzle = function(typeCode, id) {
  this.id = id;
  this.typeCode = typeCode;
  this.initImages();
  this.rows = 7
  this.cols = 7;
  this.createBoard();
}

squarePuzzle.prototype.findCellSize = function() {
  var size = this.snap.node.clientWidth;
  // Temporary add some random gaps
  // TODO: compute using vertical size of the screen
  this.leftGap = 50;
  this.topGap = 5;
  hSize = size - 2 * this.leftGap;
  this.cellSize = hSize / this.cols;
}
 
squarePuzzle.prototype.render = function(snap) {
  this.snap = snap;
  this.findCellSize();
  var board = this.snap.rect(this.leftGap, this.topGap, this.cols * this.cellSize, this.rows * this.cellSize);
  board.attr({
      fill: "#fff",
      stroke: "#000",
      strokeWidth: 5
  });
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      this.renderCell(this.cells[y][x]);
    }
  }
  this.snap.node.setAttribute("height", this.snap.getBBox().height + 20);
}

squarePuzzle.prototype.renderCell = function(cell) {
  var x = this.leftGap + cell.col*this.cellSize;
  var y = this.topGap + cell.row*this.cellSize;
  cell.rect = this.snap.rect(x, y, this.cellSize, this.cellSize);
  cell.rect.attr({
    fill: "none",
    stroke: "#000",
    strokeWidth: 1
  });
  cell.element = this.snap.image(this.imageUrl(cell.value), x, y, this.cellSize, this.cellSize);
}

squarePuzzle.prototype.syncCell = function(cell) {
  cell.element.attr({href: this.imageUrl(cell.value)});
}

squarePuzzle.prototype.createBoard = function() {
  this.cells = [];
  for (var y = 0; y < this.rows; y++) {
    this.cells[y] = new Array(this.cols);
    for (var x = 0; x < this.cols; x++) {
      this.cells[y][x] = {puzzle: this, col: x, row: y, valueIndex:0, value: "white", togglers: this.togglers};
    }
  }
}

squarePuzzle.prototype.start = function() {
  data = {
    'a1': '1_1',
    'b2': '3_3',
    'b6': '7',
    'c3': '1_1_3',
    'd4': '1_1_3',
    'e5': '1_1_3',
    'f2': '5'
  };
  for (const [key, value] of Object.entries(data)) {
    var x = key.charCodeAt(0) - 'a'.charCodeAt(0);
    var y = parseInt(key.substring(1)) - 1;
    this.cells[y][x].value = value;
    this.cells[y][x].togglers = [];
    this.syncCell(this.cells[y][x]);
  }
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      this.attachController(this.cells[y][x]);
    }
  }
}

squarePuzzle.prototype.preloadImages = function(imageList) {
  imageList.forEach(name => new Image().src = this.imageUrl(name));
}

squarePuzzle.prototype.imageUrl = function(imageName) {
  return "images/"+imageName+".png";
}

squarePuzzle.prototype.toggleCell = function(cell) {
  cell.valueIndex++;
  if (cell.valueIndex >= cell.togglers.length) cell.valueIndex = 0;
  cell.value = cell.togglers[cell.valueIndex];
  cell.puzzle.syncCell(cell);
}

squarePuzzle.prototype.attachController = function(cell) {
  if (cell.togglers.length > 1) {
    toggleCell = this.toggleCell;
    cell.element.click(() => toggleCell(cell));
  }
}

squarePuzzle.prototype.initImages = function() {
  if(this.typeCode == "tapa_classic") {
    this.clues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "1_1", "1_2", "1_3", "1_4", "1_5", "2_2", "2_3", "2_4", "3_3", "1_1_1", "1_1_2", "1_1_3", "1_2_2", "1_1_1_1"];
    this.togglers = ["white", "black", "x"];
  }
  this.preloadImages(this.clues);
  this.preloadImages(this.togglers);
}


