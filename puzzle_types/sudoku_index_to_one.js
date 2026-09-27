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
  var res = Checker.checkColumnClues(cells, top, bottom, digits);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRowClues(cells, left, right, digits);
  if (res.status != "OK") {
    return res;
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
  return {status: "OK"};
},
checkColumnClues: function(cells, top, bottom, digits) {
  for (var x=0; x < cells.cols; x++) {
    if (top[x] && top[x] != "white") {
      res = Checker.checkColumnClue(cells, x, parseInt(top[x]), 1, digits);
      if (res) {
        return {status: "The column clue is not correct", errors: res};
      }
    }
    if (bottom[x] && bottom[x] != "white") {
      res = Checker.checkColumnClue(cells, x, parseInt(bottom[x]), -1, digits);
      if (res) {
        return {status: "The column clue is not correct", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkColumnClue: function(cells, column, clue, direction, digits) {
  var firstIndex = Checker.getIndex(clue, direction, cells.rows)
  var indexValue = parseInt(cells[firstIndex][column])
  var secondIndex = Checker.getIndex(indexValue, direction, cells.rows)
  if (cells[secondIndex][column] != "1") {
    return [util.coord(column, firstIndex),util.coord(column, secondIndex)]
  }
  return null;
},
checkRowClues: function(cells, left, right, digits) {
  for (var y=0; y < cells.rows; y++) {
    if (left[y] && left[y] != "white") {
      res = Checker.checkRowClue(cells, y, parseInt(left[y]), 1, digits);
      if (res) {
        return {status: "The row clue is not correct", errors: res};
      }
    }
    if (right[y] && right[y] != "white") {
      res = Checker.checkRowClue(cells, y, parseInt(right[y]), -1, digits);
      if (res) {
        return {status: "The row clue is not correct", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkRowClue: function(cells, row, clue, direction, digits) {
  var firstIndex = Checker.getIndex(clue, direction, cells.cols)
  var indexValue = parseInt(cells[row][firstIndex])
  var secondIndex = Checker.getIndex(indexValue, direction, cells.cols)
  if (cells[row][secondIndex] != "1") {
    return [util.coord(firstIndex, row),util.coord(secondIndex, row)]
  }
  return null;
},
getIndex: function(value, direction, maxValue) {
  if (direction == 1) {
    return value - 1;
  } else {
    return maxValue - value;
  }
}
};

module.exports = Checker;
