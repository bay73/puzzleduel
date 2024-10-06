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
  goodColors = []
  for (var i=1;i<=parseInt(dim.rows);i++) {
    colors.push(i.toString());
    if (i>=3 && i<=7) {
      goodColors.push(i.toString());
    }
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
  var isConnected = util.checkConnected(cells, goodColors);
  if (!isConnected) {
    return {status: "Cells with digits 3,4,5,6,7 should form single connected area", errors: Checker.connectedGoodCells(cells, goodColors)};
  }
  return {status: "OK"};
},
connectedGoodCells: function(cells, goodColors) {
  let filedFirst = util.firstConnected(cells, goodColors);
  let goodCells = [];
  if (filedFirst) {
    for (var y = 0; y < filedFirst.rows; y++) {
      for (var x = 0; x < filedFirst.cols; x++) {
        if (filedFirst[y][x]){
          goodCells.push(util.coord(x, y))
        }
      }
    }
  }
  return goodCells;
}
};

module.exports = Checker;
