if (typeof util=="undefined") {
  var util = require('./util');
}
if (typeof sudoku_util=="undefined") {
  var sudoku_util = require('./sudoku_util');
}

var Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, "")

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  colors = [];
  for (var i=1;i<=parseInt(dim.rows);i++) {
    colors.push(i.toString());
  }
  var res = sudoku_util.checkAreaMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = sudoku_util.checkRowMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = sudoku_util.checkColumnMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkQueens(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkQueens: function(cells, colors) {
  var errorCells = [];
  for (var c = 0; c < colors.length; c++) {
    var res = Checker.findQueenOnSameDiagonal(cells, colors[c]);
    if (!res) {
      return {status: "OK"};
    } else {
      errorCells.push(...res); 
    }
  }
  return {status: "There should be a digits which does not repeat on any diagonal", errors: errorCells};
},
findQueenOnSameDiagonal: function(cells, queenDigit) {
  var maxDistance = Math.max(cells.rows, cells.cols);
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cells[y][x] != queenDigit) {
        continue;
      }
      for (var d = 1; d < maxDistance; d++) {
        if (y+d < cells.rows && x-d >= 0 && cells[y+d][x-d] == queenDigit) {
          return [util.coord(x,y), util.coord(x-d,y+d)];
        }
        if (y+d < cells.rows && x+d < cells.cols && cells[y+d][x+d] == queenDigit) {
          return [util.coord(x,y), util.coord(x+d,y+d)];
        }
      }
    }
  }
  return null;
}
};

module.exports = Checker;
