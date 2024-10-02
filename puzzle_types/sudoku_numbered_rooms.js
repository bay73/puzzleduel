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
        return {status: "The column clue is not correct", errors: res};
      }
    }
    if (bottom[x] && bottom[x] != "white") {
      res = Checker.checkColumnClue(cells, x, bottom[x], -1, digits);
      if (res) {
        return {status: "The column clue is not correct", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkColumnClue: function(cells, column, clue, direction, digits) {
  var firstValue = parseInt(cells[0][column]);
  var lastValue = parseInt(cells[cells.rows - 1][column]);
  var numberAtFirst = cells[firstValue - 1][column];
  if (direction == 1 && numberAtFirst != clue) return [util.coord(column, firstValue - 1)];
  var numberAtLast = cells[cells.rows - lastValue][column];
  if (direction == -1 && numberAtLast != clue) return [util.coord(column, cells.rows - lastValue)];
  return null;
},
checkRowClues: function(cells, left, right, digits) {
  for (var y=0; y < cells.rows; y++) {
    if (left[y] && left[y] != "white") {
      res = Checker.checkRowClue(cells, y, left[y], 1, digits);
      if (res) {
        return {status: "The row clue is not correct", errors: res};
      }
    }
    if (right[y] && right[y] != "white") {
      res = Checker.checkRowClue(cells, y, right[y], -1, digits);
      if (res) {
        return {status: "The row clue is not correct", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkRowClue: function(cells, row, clue, direction, digits) {
  var firstValue = parseInt(cells[row][0]);
  var lastValue = parseInt(cells[row][cells.cols - 1]);
  var numberAtFirst = cells[row][firstValue - 1];
  if (direction == 1 && numberAtFirst != clue) return [util.coord(firstValue - 1, row)];
  var numberAtLast = cells[row][cells.cols - lastValue];
  if (direction == -1 && numberAtLast != clue) return [util.coord(cells.cols - lastValue, row)];
  return null;
},
};

module.exports = Checker;
