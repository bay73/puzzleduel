Checker = function() {
  this.checker_name="Tapa";
}

Checker.prototype.check = function(dimension, clues, data){
  // Create array
  this.parseDimension(dimension);
  cells = [];
  for (var y = 0; y < this.rows; y++) {
    cells[y] = new Array(this.cols);
    for (var x = 0; x < this.cols; x++) {
      cells[y][x] = new Cell(this, y, x);
    }
  }

  // Parse data.
  for (const [key, value] of Object.entries(data)) {
    var x = key.charCodeAt(0) - 'a'.charCodeAt(0);
    var y = parseInt(key.substring(1)) - 1;
    if (cells[y] && cells[y][x]){
      cells[y][x].setValue(value);
    }
  }
  // Parse clues.
  for (const [key, value] of Object.entries(clues)) {
    var x = key.charCodeAt(0) - 'a'.charCodeAt(0);
    var y = parseInt(key.substring(1)) - 1;
    cells[y][x].setClue(value);
  }
  var res = this.check2x2(cells);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
}

Checker.prototype.parseDimension = function(dimension) {
  // Parse dimension string to values.
  var dimensions = dimension.split("x");
  this.rows = dimensions[1];
  this.cols = dimensions[0];
}

Checker.prototype.check2x2 = function(cells) {
  for (var y = 0; y < this.rows - 1; y++) {
    for (var x = 0; x < this.cols - 1; x++) {
      if (cells[y][x].value == "black" && cells[y+1][x].value == "black" && cells[y][x+1].value == "black" && cells[y+1][x+1].value == "black"){
        return {status: "No 2x2 squares are allowed" , errors: [cells[y][x].coord(), cells[y+1][x].coord(), cells[y][x+1].coord(), cells[y+1][x+1].coord() ]};
      }
    }
  }
  return {status: "OK"};
}

Cell = function(checker, row, col){
  this.checker = checker;
  this.row = row;
  this.col = col;
  this.clue = null;
  this.value = null;
}

Cell.prototype.setValue = function(value) {
  this.value = value;
}

Cell.prototype.setClue = function(clue) {
  this.value = null;
  this.clue = clue;
}

Cell.prototype.coord = function() {
  return String.fromCharCode('a'.charCodeAt(0) + this.col) + (this.row+1).toString();
}

module.exports = function() {
  return new Checker();
};
