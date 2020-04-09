const util = require('./util');

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false)
  var bottom = [];
  var right = [];
  var top = [];
  var left = [];

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    if (key=="bottom") {
      bottom = value;
    } else if (key=="right") {
      right = value;
    } else if (key=="top") {
      top = value;
    } else if (key=="left") {
      left = value;
    }
  }
  var res = Checker.checkNoEmptyCells(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkAllClues(cells, bottom, top, right, left, "black", "grey");
  if (res.status == "OK") {
    return res;
  }
  return Checker.checkAllClues(cells, bottom, top, right, left, "grey", "black");
},

checkNoEmptyCells: function(cells) {
  var coord = util.findWrongValue(cells, ["grey", "black"]);
  if (coord){
    return {
      status: "All cells should be painted",
      errors: [coord]
    };
  }
  return {status: "OK"};
},
checkAllClues: function(cells, bottom, top, right, left, color1, color2) {
  var res = Checker.checkColumnClues(cells, bottom, color1);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkColumnClues(cells, top, color2);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRowClues(cells, right, color1);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRowClues(cells, left, color2);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkColumnClues: function(cells, clues, color) {
  for (var x=0; x < cells.cols; x++) {
    if (clues[x] && clues[x] != "white") {
      res = Checker.checkColumnClue(cells, x, clues[x], color);
      if (res) {
        return {status: "Wrong max length of painted cell block in the column", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkColumnClue: function(cells, column, clue, color) {
  var max = 0;
  var current = 0;
  var cellList = [];
  for (var y=0; y < cells.rows; y++) {
    cellList.push(util.coord(column, y));
    if (cells[y][column]==color) current++;
    else current=0;
    if (current > max) max = current;
  }
  if (max.toString() != clue) return cellList;
  return null;
},
checkRowClues: function(cells, clues, color) {
  for (var y=0; y < cells.rows; y++) {
    if (clues[y] && clues[y] != "white") {
      res = Checker.checkRowClue(cells, y, clues[y], color);
      if (res) {
        return {status: "Wrong max length of painted cell block in the row", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkRowClue: function(cells, row, clue, color) {
  var max = 0;
  var current = 0;
  var cellList = [];
  for (var x=0; x < cells.cols; x++) {
    cellList.push(util.coord(x, row));
    if (cells[row][x]==color) current++;
    else current=0;
    if (current > max) max = current;
  }
  if (max.toString() != clue) return cellList;
  return null;
},
};

module.exports = Checker;
