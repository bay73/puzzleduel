if (typeof util=="undefined") {
  var util = require('./util');
}
if (typeof sudoku_util=="undefined") {
  var sudoku_util = require('./sudoku_util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, "")
  var shades = util.create2DArray(dim.rows, dim.cols, false)

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  // Parse clues.
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      if (value.startsWith("-")) {
        shades[pos.y][pos.x] = true;
        if (value.length > 1) {
          cells[pos.y][pos.x] = value.substring(1);
        }
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
  var res = Checker.checkParity(cells, shades);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkParity: function(cells, shades) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (shades[y][x]) {
        if (parseInt(cells[y][x])%2 != 0) {
          return {status: "Shaded cell should contain even digit", errors: [util.coord(x,y)]};
        }
      } else {
        if (parseInt(cells[y][x])%2 == 0) {
          return {status: "White cell should contain odd digit", errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},
};

module.exports = Checker;
