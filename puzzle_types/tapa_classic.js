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
  var res = this.checkConnected(cells);
  if (res.status != "OK") {
    return res;
  }
  return this.checkClues(cells);
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

Checker.prototype.checkConnected = function(cells) {
  var first = this.findFirstBlack(cells);
  if(first) {
    this.fill(cells, first);
    if (!this.checkAllBlackFilled(cells)) {
      return {status: "Black area should be connected!"};
    }
  }
  return {status: "OK"};
}

Checker.prototype.findFirstBlack = function(cells) {
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      if (cells[y][x].value == "black"){
       return cells[y][x];
      }
    }
  }
  return null;
}

Checker.prototype.fill = function(cells, cell){
  if (!cell.isFilled && cell.value == "black") {
    cell.isFilled = true;
    if (cell.row > 0) this.fill(cells, cells[cell.row - 1][cell.col]);
    if (cell.col > 0) this.fill(cells, cells[cell.row][cell.col - 1]);
    if (cell.row + 1 < this.rows) this.fill(cells, cells[cell.row + 1][cell.col]);
    if (cell.col + 1 < this.cols) this.fill(cells, cells[cell.row][cell.col + 1]);
  }
}

Checker.prototype.checkAllBlackFilled = function(cells){
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      if (cells[y][x].value == "black" && !cells[y][x].isFilled){
        return false;
      }
    }
  }
  return true;
}

Checker.prototype.checkClues = function(cells) {
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      if (cells[y][x].clue){
        if (!this.checkClue(cells, cells[y][x])) {
          return {status: "The clue is not correct" , errors: [cells[y][x].coord()]};
        }
      }
    }
  }
  return {status: "OK"};
}

Checker.prototype.checkClue = function(cells, clueCell) {
  var neighbour = [{y:1,x:0}, {y:1,x:1}, {y:0,x:1}, {y:-1,x:1}, {y:-1,x:0}, {y:-1,x:-1}, {y:0,x:-1}, {y:1,x:-1}]
  var painted = [];
  var paintedCount = -1;
  var prevCell = null;
  var firstCell = null;
  for (var i=0;i<8;i++) {
    if (clueCell.row + neighbour[i].y >=0 && clueCell.row + neighbour[i].y < this.rows
        && clueCell.col + neighbour[i].x >=0 && clueCell.col + neighbour[i].x < this.cols) {
      var cell = cells[clueCell.row + neighbour[i].y][clueCell.col + neighbour[i].x];
    } else {
      var cell = null;
    }
    if (cell && !firstCell) {
      firstCell = cell;
    }
    if (cell && cell.value == 'black') {
      if (prevCell && prevCell.value == 'black') {
        painted[paintedCount]++;
      } else {
        paintedCount++;
        painted[paintedCount] = 1;
      }
    }
    prevCell = cell;
  }
  if (prevCell && prevCell.value == 'black' && firstCell && firstCell.value == 'black') {
    painted[0]+=painted[paintedCount];
    painted.pop();
  }
  painted.sort();
  return (clueCell.clue == painted.join("_"))
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
