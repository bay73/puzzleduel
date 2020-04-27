const util = require('./util');

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var part = dimension.split("-");
  var letters = [];
  for (var i=0;i<part[1].length;i++) {
     letters.push(part[1].charAt(i));
  }
  var dim = util.parseDimension(part[0]);
  var cells = util.create2DArray(dim.rows, dim.cols, "")
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
  var res = Checker.checkColumnMagic(cells, letters);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRowMagic(cells, letters);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkColumnClues(cells, top, bottom, letters);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRowClues(cells, left, right, letters);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkRowMagic: function(cells, colors) {
  var res = util.checkOnceInRows(cells, colors);
  if (res){
    return {status: "All letters should be exactly once in every row", errors: res};
  }
  return {status: "OK"};
},
checkColumnMagic: function(cells, colors) {
  var res = util.checkOnceInColumns(cells, colors);
  if (res){
    return {status: "All letters should be exactly once in every column", errors: res};
  }
  return {status: "OK"};
},
checkColumnClues: function(cells, top, bottom, letters) {
  for (var x=0; x < cells.cols; x++) {
    if (top[x] && top[x] != "white") {
      res = Checker.checkColumnClue(cells, x, top[x], 1, letters);
      if (res) {
        return {status: "Wrong first letter in the row", errors: res};
      }
    }
    if (bottom[x] && bottom[x] != "white") {
      res = Checker.checkColumnClue(cells, x, bottom[x], -1, letters);
      if (res) {
        return {status: "Wrong last letter in the row", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkColumnClue: function(cells, column, clue, direction, letters) {
  var first = null;
  var last = "";
  var cellList = [];
  for (var y=0; y < cells.rows; y++) {
    cellList.push(util.coord(column, y));
    if (letters.includes(cells[y][column])) {
      last = cells[y][column];
      if (!first) {
        first = cells[y][column];
      }
    }
  }
  if (direction == 1 && first != clue) return cellList;
  if (direction == -1 && last != clue) return cellList;
  return null;
},
checkRowClues: function(cells, left, right, letters) {
  for (var y=0; y < cells.rows; y++) {
    if (left[y] && left[y] != "white") {
      res = Checker.checkRowClue(cells, y, left[y], 1, letters);
      if (res) {
        return {status: "Wrong first letter in the row", errors: res};
      }
    }
    if (right[y] && right[y] != "white") {
      res = Checker.checkRowClue(cells, y, right[y], -1, letters);
      if (res) {
        return {status: "Wrong last letter in the row", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkRowClue: function(cells, row, clue, direction, letters) {
  var first = null;
  var last = "";
  var cellList = [];
  for (var x=0; x < cells.cols; x++) {
    cellList.push(util.coord(x, row));
    if (letters.includes(cells[row][x])) {
      last = cells[row][x];
      if (!first) {
        first = cells[row][x];
      }
    }
  }
  if (direction == 1 && first != clue) return cellList;
  if (direction == -1 && last != clue) return cellList;
  return null;
},
};

module.exports = Checker;
