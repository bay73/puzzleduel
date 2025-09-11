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
  var nodes = util.create2DArray(dim.rows, dim.cols, false)

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    if (key=="nodes") {
      for (const [coord, clue] of Object.entries(value)) {
        var pos = util.parseCoord(coord);
        if (typeof nodes[pos.y] != 'undefined') {
          nodes[pos.y][pos.x] = (clue == 'battenberg');
        }
      }
    } else {
      var pos = util.parseCoord(key);
      if (cells[pos.y]){
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
  var res = Checker.checkBattenberg(cells, nodes);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkBattenberg: function(cells, nodes) {
  for (var x = 0; x < cells.cols - 1; x++) {
    for (var y = 0; y < cells.rows - 1; y++) {
      let a = parseInt(cells[y][x])%2
      let b = parseInt(cells[y][x+1])%2
      let c = parseInt(cells[y+1][x])%2
      let d = parseInt(cells[y+1][x+1])%2
      var isBattenberg = a == d && b == c && a != b;
      if (isBattenberg && !nodes[y][x]) {
        return {status: "Cells shouldn't form 'chess' pattern",
                errors: [util.coord(x,y), util.coord(x+1,y), util.coord(x,y+1), util.coord(x+1,y+1)]};
      }
      if (!isBattenberg && nodes[y][x]) {
        return {status: "Cells should form 'chess' pattern",
                errors: [util.coord(x,y), util.coord(x+1,y), util.coord(x,y+1), util.coord(x+1,y+1)]};
      }
    }
  }
  return {status: "OK"};
},
};

module.exports = Checker;
