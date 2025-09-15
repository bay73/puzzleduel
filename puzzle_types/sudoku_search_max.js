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
  var arrows = util.create2DArray(dim.rows, dim.cols, "")

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
      if (value.startsWith("arrow")) {
        arrows[pos.y][pos.x] = value;
      } else {
        cells[pos.y][pos.x] = value;
      }
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
  var res = Checker.checkArrows(cells, arrows);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkArrows: function(cells, arrows) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (arrows[y][x] == "arrow_r") {
        let diff = Checker.searchMaxInRow(cells, y) - x;
        if (cells[y][x] != diff.toString()) {
          return {status: "The digit should be equal to the distance to the maximum value in the row", errors: [util.coord(x, y)]};
        }
      }
      if (arrows[y][x] == "arrow_l") {
        let diff = x - Checker.searchMaxInRow(cells, y);
        if (cells[y][x] != diff.toString()) {
          return {status: "The digit should be equal to the distance to the maximum value in the row", errors: [util.coord(x, y)]};
        }
      }
      if (arrows[y][x] == "arrow_u") {
        let diff = y - Checker.searchMaxInColumn(cells, x);
        console.log(diff)
        if (cells[y][x] != diff.toString()) {
          return {status: "The digit should be equal to the distance to the maximum value in the column", errors: [util.coord(x, y)]};
        }
      }
      if (arrows[y][x] == "arrow_d") {
        let diff = Checker.searchMaxInColumn(cells, x) - y;
        if (cells[y][x] != diff.toString()) {
          return {status: "The digit should be equal to the distance to the maximum value in the column", errors: [util.coord(x, y)]};
        }
      }
    }
  }
  return {status: "OK"};
},
searchMaxInRow: function(cells, row) {
  let max = cells.cols;
  for (var x = 0; x < cells.cols; x++) {
    if (cells[row][x] == max.toString()) {
      return x; 
    }
  }
  return -1;
},
searchMaxInColumn: function(cells, col) {
  let max = cells.rows;
  for (var y = 0; y < cells.rows; y++) {
    if (cells[y][col] == max.toString()) {
      return y; 
    }
  }
  return -1;
},
};

module.exports = Checker;
