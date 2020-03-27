// Default puzzle with square grid.
var squarePuzzle = function(typeCode, id, dimension) {
  this.id = id;
  this.typeCode = typeCode;
  this.initImages();
  this.parseDimension(dimension);
  this.createBoard();
}

squarePuzzle.prototype.createBoard = function() {
  this.cells = [];
  for (var y = 0; y < this.rows; y++) {
    this.cells[y] = new Array(this.cols);
    for (var x = 0; x < this.cols; x++) {
      this.cells[y][x] = new squarePuzzleCell(this, x, y);
    }
  }
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
      this.cells[y][x].renderCell();
    }
  }
  this.snap.node.setAttribute("height", this.snap.getBBox().height + 20);
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
    this.cells[y][x].setClue(value);
  }
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      if (!this.cells[y][x].isClue) {
        this.cells[y][x].setRegular(this.togglers);
      }
      this.cells[y][x].syncCell();
    }
  }
}

squarePuzzle.prototype.preloadImages = function(imageList) {
  imageList.forEach(name => new Image().src = this.imageUrl(name));
}

squarePuzzle.prototype.imageUrl = function(imageName) {
  return "images/"+imageName+".png";
}

var squarePuzzleCell = function(puzzle, col, row) {
  this.puzzle = puzzle;
  this.col = col;
  this.row = row;
  this.isClue = false;
  this.value = "white";
  this.togglers = []
  this.cellSize = this.puzzle.cellSize;
}

squarePuzzleCell.prototype.setClue = function(value) {
  this.isClue = true;
  this.value = value;
}

squarePuzzleCell.prototype.setRegular = function(togglers) {
  this.togglers = togglers;
  this.valueIndex = 0;
  this.value = this.togglers[this.valueIndex];
  this.attachController();
}

squarePuzzleCell.prototype.renderCell = function() {
  this.cellSize = this.puzzle.cellSize;
  var x = this.puzzle.leftGap + this.col*this.cellSize;
  var y = this.puzzle.topGap + this.row*this.cellSize;
  this.rect = this.puzzle.snap.rect(x, y, this.cellSize, this.cellSize);
  this.rect.attr({
    fill: "none",
    stroke: "#000",
    strokeWidth: 1
  });
  this.element = this.puzzle.snap.image(this.puzzle.imageUrl(this.value), x, y, this.cellSize, this.cellSize);
}

squarePuzzleCell.prototype.syncCell = function() {
  if (this.element != undefined) {
    this.element.attr({href: this.puzzle.imageUrl(this.value)});
  }
}

squarePuzzleCell.prototype.toggleCell = function() {
  this.valueIndex++;
  if (this.valueIndex >= this.togglers.length) this.valueIndex = 0;
  this.value = this.togglers[this.valueIndex];
  this.syncCell();
}

squarePuzzleCell.prototype.attachController = function() {
  if (this.togglers.length > 1 && this.element != undefined) {
    var cell = this;
    this.element.click(() => cell.toggleCell());
  }
}

squarePuzzle.prototype.initImages = function() {
  this.clues = [];
  this.togglers = [];
  if(this.typeCode == "tapa_classic") {
    this.clues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "1_1", "1_2", "1_3", "1_4", "1_5", "2_2", "2_3", "2_4", "3_3", "1_1_1", "1_1_2", "1_1_3", "1_2_2", "1_1_1_1"];
    this.togglers = ["white", "black", "x"];
  }
  this.preloadImages(this.clues);
  this.preloadImages(this.togglers);
}

squarePuzzle.prototype.parseDimension = function(dimension) {
  var dimensions = dimension.split("x");
  this.rows = dimensions[1];
  this.cols = dimensions[0];
}
