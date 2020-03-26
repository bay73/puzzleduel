// Default puzzle with square grid.
var squarePuzzle = function(typeCode) {
  this.typeCode = typeCode;
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
  var rect = this.snap.rect(x, y, this.cellSize, this.cellSize);
  rect.attr({
    fill: "none",
    stroke: "#000",
    strokeWidth: 1
  });
}

squarePuzzle.prototype.createBoard = function() {
  this.cells = [];
  for (var y = 0; y < this.rows; y++) {
    this.cells[y] = new Array(this.cols);
    for (var x = 0; x < this.cols; x++) {
      if (x==y) {
        this.cells[y][x] = {col: x, row: y, value: 0};
      } else {
        this.cells[y][x] = {col: x, row: y, value: 0};
      }
    }
  }
}


