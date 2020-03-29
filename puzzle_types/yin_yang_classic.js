Checker = function() {
  this.checker_name="Yin Yang";
}

var Util = {
  create2DArray: function(rows, cols, defaultValue) {
    var cells = [];
    for (var y = 0; y < rows; y++) {
      cells[y] = new Array(cols);
      for (var x = 0; x < cols; x++) {
        cells[y][x] = defaultValue;
      }
    }
    cells.rows = rows;
    cells.cols = cols;
    return cells;
  },

  parseDimension: function(dimension) {
    // Parse dimension string to values.
    var dimensions = dimension.split("x");
    return {
      rows: dimensions[1],
      cols: dimensions[0]
    } 
  },

  parseCoord: function(coord) {
    return {
      x: coord.charCodeAt(0) - 'a'.charCodeAt(0),
      y: parseInt(coord.substring(1)) - 1
    }
  },

  coord: function(x, y) {
    return String.fromCharCode('a'.charCodeAt(0) + x) + (y+1).toString();
  }
}

Checker.prototype.check = function(dimension, clues, data){
  // Create array
  var dim = Util.parseDimension(dimension);
  cells = Util.create2DArray(dim.rows, dim.cols, "")

  // Parse data.
  for (const [key, value] of Object.entries(data)) {
    var pos = Util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  // Parse clues.
  for (const [key, value] of Object.entries(clues)) {
    var pos = Util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  var res = this.checkNoEmptyCells(cells, ["white_circle", "black_circle"]);
  if (res.status != "OK") {
    return res;
  }
  var res = this.checkNo2x2(cells, "white_circle");
  if (res.status != "OK") {
    return res;
  }
  var res = this.checkNo2x2(cells, "black_circle");
  if (res.status != "OK") {
    return res;
  }
  var res = this.checkConnected(cells, "white_circle");
  if (res.status != "OK") {
    return res;
  }
  var res = this.checkConnected(cells, "black_circle");
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
}

Checker.prototype.checkNo2x2 = function(cells, color) {
  for (var y = 0; y < cells.rows - 1; y++) {
    for (var x = 0; x < cells.cols - 1; x++) {
      if (cells[y][x] == color && cells[y+1][x] == color && cells[y][x+1] == color && cells[y+1][x+1] == color){
        return {
          status: "No 2x2 squares are allowed",
          errors: [Util.coord(x,y), Util.coord(x+1,y), Util.coord(x,y+1), Util.coord(x+1,y+1)]
        };
      }
    }
  }
  return {status: "OK"};
}

Checker.prototype.checkConnected = function(cells, color) {
  var first = this.findFirst(cells, color);
  if(first) {
    var filled = Util.create2DArray(cells.rows, cells.cols, false)
    this.fill(cells, filled, first, color);
    if (!this.checkAllFilled(cells, filled, color)) {
      return {status: "Area of one color should be connected"};
    }
  }
  return {status: "OK"};
}

Checker.prototype.checkNoEmptyCells = function(cells, goodValues) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (!goodValues.includes(cells[y][x])){
        return {
          status: "All cells should be filled",
          errors: [Util.coord(x,y)]
        };
      }
    }
  }
  return {status: "OK"};
}

Checker.prototype.findFirst = function(cells, color) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cells[y][x] == color){
       return {x:x, y:y};
      }
    }
  }
  return null;
}

Checker.prototype.fill = function(cells, filled, position, color){
  if (!filled[position.y][position.x] && cells[position.y][position.x] == color) {
    filled[position.y][position.x] = true;
    if (position.y > 0) this.fill(cells, filled, {x: position.x, y:position.y - 1}, color);
    if (position.x > 0) this.fill(cells, filled, {x: position.x - 1, y:position.y}, color);
    if (position.y + 1 < cells.rows) this.fill(cells, filled, {x: position.x, y:position.y + 1}, color);
    if (position.x + 1 < cells.cols) this.fill(cells, filled, {x: position.x + 1, y:position.y}, color);
  }
}

Checker.prototype.checkAllFilled = function(cells, filled, color){
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cells[y][x] == color && !filled[y][x]){
        return false;
      }
    }
  }
  return true;
}

module.exports = function() {
  return new Checker();
};
