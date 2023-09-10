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
      res = Checker.checkTopClue(cells, x, top[x]);
      if (res) {
        return {status: "Wrong sum of visible buldings in the row", errors: res};
      }
    }
    if (bottom[x] && bottom[x] != "white") {
      res = Checker.checkBottomClue(cells, x, bottom[x]);
      if (res) {
        return {status: "Wrong sum of visible buldings in the row", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkTopClue: function(cells, column, clue) {
  var lastValue = 0;
  var visible = 0;
  var cellList = [];
  for (var y=0; y < cells.rows; y++) {
    cellList.push(util.coord(column, y));
    if (parseInt(cells[y][column]) > lastValue) {
      lastValue = parseInt(cells[y][column]);
      visible+=lastValue;
    }
  }
  if (visible.toString() != clue) return cellList;
  return null;
},
checkBottomClue: function(cells, column, clue) {
  var lastValue = 0;
  var visible = 0;
  var cellList = [];
  for (var y=cells.rows-1; y >=0; y--) {
    cellList.push(util.coord(column, y));
    if (parseInt(cells[y][column]) > lastValue) {
      lastValue = parseInt(cells[y][column]);
      visible+=lastValue;
    }
  }
  if (visible.toString() != clue) return cellList;
  return null;
},
checkRowClues: function(cells, left, right, digits) {
  for (var y=0; y < cells.rows; y++) {
    if (left[y] && left[y] != "white") {
      res = Checker.checkLeftClue(cells, y, left[y]);
      if (res) {
        return {status: "Wrong sum of visible buldings in the row", errors: res};
      }
    }
    if (right[y] && right[y] != "white") {
      res = Checker.checkRightClue(cells, y, right[y]);
      if (res) {
        return {status: "Wrong sum of visible buldings in the row", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkLeftClue: function(cells, row, clue) {
  var lastValue = 0;
  var visible = 0;
  var cellList = [];
  for (var x=0; x < cells.cols; x++) {
    cellList.push(util.coord(x, row));
    if (parseInt(cells[row][x]) > lastValue) {
      lastValue = parseInt(cells[row][x]);
      visible+=lastValue;
    }
  }
  if (visible.toString() != clue) return cellList;
  return null;
},
checkRightClue: function(cells, row, clue) {
  var lastValue = 0;
  var visible = 0;
  var cellList = [];
  for (var x=cells.cols-1; x >=0; x--) {
    cellList.push(util.coord(x, row));
    if (parseInt(cells[row][x]) > lastValue) {
      lastValue = parseInt(cells[row][x]);
      visible+=lastValue;
    }
  }
  if (visible.toString() != clue) return cellList;
  return null;
},
};

module.exports = Checker;
