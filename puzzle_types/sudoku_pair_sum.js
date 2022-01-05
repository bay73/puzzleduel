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
  var bottomEdges = util.create2DArray(dim.rows, dim.cols, "")
  var rightEdges = util.create2DArray(dim.rows, dim.cols, "")

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    if (key=="edges"){
      for (var [edgeKey, edgeValue] of Object.entries(value)) {
        var part = edgeKey.split("-");
        var pos = util.parseCoord(part[0]);
        if (part[1]=="b" || part[1]=="2") {
          if (bottomEdges[pos.y]){
            bottomEdges[pos.y][pos.x] = edgeValue.replace(/^\++/, '');
          }
        }
        if (part[1]=="r" || part[1]=="1") {
          if (rightEdges[pos.y]){
            rightEdges[pos.y][pos.x] = edgeValue.replace(/^\++/, '');
          }
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
  var res = Checker.checkRightClues(cells, rightEdges);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkBottomClues(cells, bottomEdges);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkRightClues: function(cells, clues){
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols - 1; x++) {
      if (clues[y][x] && clues[y][x] != "") {
        sum = parseInt(cells[y][x]) + parseInt(cells[y][x+1]);
        if (sum.toString() != clues[y][x]) {
          return {status: "The clue is not correct", errors: [util.coord(x,y), util.coord(x+1,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},
checkBottomClues: function(cells, clues){
  for (var y = 0; y < cells.rows - 1; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (clues[y][x] && clues[y][x] != "") {
        sum = parseInt(cells[y][x]) + parseInt(cells[y+1][x]);
        if (sum.toString() != clues[y][x]) {
          return {status: "The clue is not correct", errors: [util.coord(x,y), util.coord(x,y+1)]};
        }
      }
    }
  }
  return {status: "OK"};
}
};

module.exports = Checker;
