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
  var res = Checker.checkClues(cells, shades);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkClues: function(cells, clues) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (x < cells.cols-1) {
        var res = Checker.compareCells(cells, clues, {x:x, y:y}, {x:x+1, y:y})
        if (res) {
          return {status: "Value in the shaded cell should be bigger than value in the white cell", errors: res};
        }
      }
      if (y < cells.rows-1) {
        var res = Checker.compareCells(cells, clues, {x:x, y:y}, {x:x, y:y+1})
        if (res) {
          return {status: "Value in the shaded cell should be bigger than value in the white cell", errors: res};
        }
      }
    }
  }
  return {status: "OK"};
},
compareCells: function(cells, clues, one, two) {
  if (clues[one.y][one.x] && !clues[two.y][two.x]) {
    return Checker.compareValues(cells, two, one);
  }
  if (!clues[one.y][one.x] && clues[two.y][two.x]) {
    return Checker.compareValues(cells, one, two);
  }
  return null;
},
compareValues: function(cells, white, black) {
  if (cells[white.y][white.x] >= cells[black.y][black.x]) {
    return [util.coord(white.x,white.y), util.coord(black.x,black.y)];
  }
  return null;
},
};

module.exports = Checker;
