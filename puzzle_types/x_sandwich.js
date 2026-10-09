if (typeof util=="undefined") {
  var util = require('./util');
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
  for (var i=1;i<=parseInt(dim.rows)/2;i++) {
    digits.push(i.toString());
  }
  var res = Checker.checkRowMagic(cells, digits);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkColumnMagic(cells, digits);
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
checkRowMagic: function(cells, colors) {
  var res = Checker.checkTwiceInRows(cells, colors);
  if (res){
    return {status: "All digits should be exactly two times in every row", errors: res};
  }
  return {status: "OK"};
},
checkColumnMagic: function(cells, colors) {
  var res = Checker.checkTwiceInColumns(cells, colors);
  if (res){
    return {status: "All digits should be exactly two times in every column", errors: res};
  }
  return {status: "OK"};
},
checkTwiceInRows: function(cells, colors) {
  // Returns list of cells in row which is wring.
  for (var y = 0; y < cells.rows; y++) {
    var positionsToCheck = [];
    for (var x = 0; x < cells.cols; x++) {
      positionsToCheck.push({x:x, y:y});
    }
    var result = Checker.checkTwiceInList(cells, positionsToCheck, colors);
    if (result) {
      return result;
    }
  }
  return null;
},
checkTwiceInColumns: function(cells, colors) {
  // Returns list of cells in column which is wring.
  for (var x = 0; x < cells.cols; x++) {
    var positionsToCheck = [];
    for (var y = 0; y < cells.rows; y++) {
      positionsToCheck.push({x:x, y:y});
    }
    var result = Checker.checkTwiceInList(cells, positionsToCheck, colors);
    if (result) {
      return result;
    }
  }
  return null;
},
checkTwiceInList: function(cells, positionsToCheck, colorsToCheck) {
  // Returns list of cells if something is wrong
  // or null if everything is Ok
  var colorsPresent = {};
  var repeat = 0;
  var cellList = [];
  for (var i = 0; i < positionsToCheck.length; i++) {
    cellList.push(util.coord(positionsToCheck[i].x,positionsToCheck[i].y));
    var color = cells[positionsToCheck[i].y][positionsToCheck[i].x];
    if (colorsToCheck.includes(color)) {
      if (colorsPresent[color] > 0) {
        colorsPresent[color]++;
      } else {
        colorsPresent[color]=1;
      }
    }
  }
  var all = true;
  for (var i=0;i<colorsToCheck.length;i++) {
    if (colorsPresent[colorsToCheck[i]] != 2) {
      all = false;
    }
  }
  if (!all) {
    return cellList;
  }
  return null;
},
checkColumnClues: function(cells, top, bottom, digits) {
  for (var x=0; x < cells.cols; x++) {
    if (top[x] && top[x] != "white") {
      res = Checker.checkTopClue(cells, x, top[x]);
      if (res) {
        return {status: "Wrong sum in the row", errors: res};
      }
    }
    if (bottom[x] && bottom[x] != "white") {
      res = Checker.checkBottomClue(cells, x, bottom[x]);
      if (res) {
        return {status: "Wrong sum in the row", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkTopClue: function(cells, column, clue) {
  var sum = 0;
  var cellList = [];
  var first = cells[0][column];
  cellList.push(util.coord(column, 0));
  for (var y=1; y < cells.rows; y++) {
    cellList.push(util.coord(column, y));
    if (cells[y][column]==first) break;
    sum += parseInt(cells[y][column])
  }
  if (sum.toString() != clue) return cellList;
  return null;
},
checkBottomClue: function(cells, column, clue) {
  var sum = 0;
  var cellList = [];
  var first = cells[cells.rows-1][column];
  cellList.push(util.coord(column, cells.rows-1));
  for (var y=cells.rows-2; y >=0; y--) {
    cellList.push(util.coord(column, y));
    if (cells[y][column]==first) break;
    sum += parseInt(cells[y][column])
  }
  if (sum.toString() != clue) return cellList;
  return null;
},
checkRowClues: function(cells, left, right, digits) {
  for (var y=0; y < cells.rows; y++) {
    if (left[y] && left[y] != "white") {
      res = Checker.checkLeftClue(cells, y, left[y]);
      if (res) {
        return {status: "Wrong sum in the row", errors: res};
      }
    }
    if (right[y] && right[y] != "white") {
      res = Checker.checkRightClue(cells, y, right[y]);
      if (res) {
        return {status: "Wrong sum in the row", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkLeftClue: function(cells, row, clue) {
  var sum = 0;
  var cellList = [];
  var first = cells[row][0];
  cellList.push(util.coord(0, row));
  for (var x=1; x < cells.cols; x++) {
    cellList.push(util.coord(x, row));
    if (cells[row][x]==first) break;
    sum += parseInt(cells[row][x])
  }
  if (sum.toString() != clue) return cellList;
  return null;
},
checkRightClue: function(cells, row, clue) {
  var sum = 0;
  var cellList = [];
  var first = cells[row][cells.cols-1];
  cellList.push(util.coord(cells.cols-1, row));
  for (var x=cells.cols-2; x >=0; x--) {
    cellList.push(util.coord(x, row));
    if (cells[row][x]==first) break;
    sum += parseInt(cells[row][x])
  }
  if (sum.toString() != clue) return cellList;
  return null;
},
};

module.exports = Checker;
