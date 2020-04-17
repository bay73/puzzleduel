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
      res = Checker.checkTopClue(cells, x, top[x]);
      if (res) {
        return {status: "The first two digits in the column should be " + top[x], errors: res};
      }
    }
    if (bottom[x] && bottom[x] != "white") {
      res = Checker.checkBottomClue(cells, x, bottom[x]);
      if (res) {
        return {status: "The last two digits in the column should be " + bottom[x], errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkTopClue: function(cells, column, clue) {
  var bad = false;
  var cellList = [];
  for (var y=0; y < 2; y++) {
    cellList.push(util.coord(column, y));
    bad = bad || !Checker.checkDigitForClue(clue, parseInt(cells[y][column]))
  }
  if (bad) return cellList;
  return null;
},
checkBottomClue: function(cells, column, clue) {
  var bad = false;
  var cellList = [];
  for (var y=cells.rows-1; y >= cells.rows-2; y--) {
    cellList.push(util.coord(column, y));
    bad = bad || !Checker.checkDigitForClue(clue, parseInt(cells[y][column]))
  }
  if (bad) return cellList;
  return null;
},
checkRowClues: function(cells, left, right, digits) {
  for (var y=0; y < cells.rows; y++) {
    if (left[y] && left[y] != "white") {
      res = Checker.checkLeftClue(cells, y, left[y]);
      if (res) {
        return {status: "The first two digits in the row should be " + left[y], errors: res};
      }
    }
    if (right[y] && right[y] != "white") {
      res = Checker.checkRightClue(cells, y, right[y]);
      if (res) {
        return {status: "The last two digits in the row should be " + right[y], errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkLeftClue: function(cells, row, clue) {
  var bad = false;
  var cellList = [];
  for (var x=0; x < 2; x++) {
    cellList.push(util.coord(x, row));
    bad = bad || !Checker.checkDigitForClue(clue, parseInt(cells[row][x]))
  }
  if (bad) return cellList;
  return null;
},
checkRightClue: function(cells, row, clue) {
  var bad = false;
  var cellList = [];
  for (var x=cells.cols-1; x >=cells.cols-2; x--) {
    cellList.push(util.coord(x, row));
    bad = bad || !Checker.checkDigitForClue(clue, parseInt(cells[row][x]))
  }
  if (bad) return cellList;
  return null;
},
checkDigitForClue: function (clue, digit){
  if (clue == "big") return digit > 4;
  if (clue == "small") return digit < 5;
  if (clue == "odd") return digit%2==1;
  if (clue == "even") return digit%2==0;
},
};

module.exports = Checker;
