const util = require('./util');
const sudoku_util = require('./sudoku_util');

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
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
    } else {
      var pos = util.parseCoord(key);
      if (cells[pos.y]){
        cells[pos.y][pos.x] = value;
      }
    }
  }
  var digits = [];
  for (var i=1;i<=parseInt(dim.rows);i++) {
    digits.push(i.toString());
  }
  var res = sudoku_util.checkAreaMagic(cells, digits);
  if (res.status != "OK") {
    return res;
  }
  var res = sudoku_util.checkRowMagic(cells, digits);
  if (res.status != "OK") {
    return res;
  }
  var res = sudoku_util.checkColumnMagic(cells, digits);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkColumnClues(cells, top, bottom, digits);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRowClues(cells, left, right, digits);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkColumnClues: function(cells, top, bottom, digits) {
  for (var x=0; x < cells.cols; x++) {
    if (top[x] && top[x] != "white") {
      res = Checker.checkColumnClue(cells, x, top[x], 1, digits);
      if (res) {
        return {status: top[x] + " should be the sum of the first " + cells[0][x] + " digits in the column", errors: res};
      }
    }
    if (bottom[x] && bottom[x] != "white") {
      res = Checker.checkColumnClue(cells, x, bottom[x], -1, digits);
      if (res) {
        return {status: bottom[x] + " should be the sum of the last " + cells[cells.rows - 1][x] + " digits in the column", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkColumnClue: function(cells, column, clue, direction, digits) {
  var firstValue = parseInt(cells[0][column]);
  var lastValue = parseInt(cells[cells.rows - 1][column]);
  var firstSum = 0;
  var lastSum = 0;
  var cellList = [];
  for (var y=0; y < cells.rows; y++) {
    cellList.push(util.coord(column, y));
    if (y < firstValue) {
      firstSum = firstSum + parseInt(cells[y][column]);
    }
    if (y > cells.rows - lastValue - 1) {
      lastSum = lastSum + parseInt(cells[y][column]);
    }
  }
  if (direction == 1 && firstSum.toString() != clue) return cellList;
  if (direction == -1 && lastSum.toString() != clue) return cellList;
  return null;
},
checkRowClues: function(cells, left, right, digits) {
  for (var y=0; y < cells.rows; y++) {
    if (left[y] && left[y] != "white") {
      res = Checker.checkRowClue(cells, y, left[y], 1, digits);
      if (res) {
        return {status: left[y] + " should be the sum of the first " + cells[y][0] + " digits in the row", errors: res};
      }
    }
    if (right[y] && right[y] != "white") {
      res = Checker.checkRowClue(cells, y, right[y], -1, digits);
      if (res) {
        return {status: right[y] + " should be the sum of the last " + cells[y][cells.cols - 1] + " digits in the row", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkRowClue: function(cells, row, clue, direction, digits) {
  var firstValue = parseInt(cells[row][0]);
  var lastValue = parseInt(cells[row][cells.cols - 1]);
  var firstSum = 0;
  var lastSum = 0;
  var cellList = [];
  for (var x=0; x < cells.cols; x++) {
    cellList.push(util.coord(x, row));
    if (x < firstValue) {
      firstSum = firstSum + parseInt(cells[row][x]);
    }
    if (x > cells.cols - lastValue - 1) {
      lastSum = lastSum + parseInt(cells[row][x]);
    }
  }
  if (direction == 1 && firstSum.toString() != clue) return cellList;
  if (direction == -1 && lastSum.toString() != clue) return cellList;
  return null;
},
};

module.exports = Checker;
