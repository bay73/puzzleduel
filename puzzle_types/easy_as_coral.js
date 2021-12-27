if (typeof util=="undefined") {
  var util = require('./util');
}

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
      cells[pos.y][pos.x] = (value=="black");
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
  var res = Checker.checkNo2x2(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkConnected(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkWhiteConnectedToEdge(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkColumnClues(cells, top, bottom);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRowClues(cells, left, right);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkNo2x2: function(cells, color) {
  var res = util.find2x2(cells, [true]);
  if (res){
    return {status: "No 2x2 black squares are allowed", errors: res};
  }
  return {status: "OK"};
},

checkConnected: function(cells) {
  if (!util.checkConnected(cells, true)) {
    return {status: "Black area should be connected"};
  }
  return {status: "OK"};
},

checkWhiteConnectedToEdge: function(cells) {
  var filled = util.create2DArray(cells.rows, cells.cols, false)
  for (var i=0; i<cells.cols; i++) {
    util.fillConnected(cells, {x:i, y:0}, [false], filled);
    util.fillConnected(cells, {x:i, y:cells.rows - 1}, [false], filled);
  }
  for (var j=0; j<cells.rows; j++) {
    util.fillConnected(cells, {x:0, y:j}, [false], filled);
    util.fillConnected(cells, {x:cells.cols - 1, y:j}, [false], filled);
  }
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (!cells[y][x] && !filled[y][x]){
        return {status: "All white cells should be connected to the edge of the grid", errors: [util.coord(x, y)]};
      };
    }
  }
  return {status: "OK"};
},
checkColumnClues: function(cells, top, bottom) {
  for (var x=0; x < cells.cols; x++) {
    if (top[x] && top[x] != "white") {
      res = Checker.checkColumnClue(cells, x, top[x], 1);
      if (res) {
        return {status: "Wrong first fragment in the row", errors: res};
      }
    }
    if (bottom[x] && bottom[x] != "white") {
      res = Checker.checkColumnClue(cells, x, bottom[x], -1);
      if (res) {
        return {status: "Wrong last fragment in the row", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkColumnClue: function(cells, column, clue, direction) {
  var firstEnd = false;
  var first = 0;
  var last = 0;
  var current = 0;
  var cellList = [];
  for (var y=0; y < cells.rows; y++) {
    cellList.push(util.coord(column, y));
    if (cells[y][column]) {
      current++;
      last = current;
      if (!firstEnd) {
        first = current;
      }
    } else {
      current = 0;
      if (first != 0) {
        firstEnd = true;
      }
    }
  }
  if (direction == 1 && first != clue) return cellList;
  if (direction == -1 && last != clue) return cellList;
  return null;
},
checkRowClues: function(cells, left, right) {
  for (var y=0; y < cells.rows; y++) {
    if (left[y] && left[y] != "white") {
      res = Checker.checkRowClue(cells, y, left[y], 1);
      if (res) {
        return {status: "Wrong first fragment in the row", errors: res};
      }
    }
    if (right[y] && right[y] != "white") {
      res = Checker.checkRowClue(cells, y, right[y], -1);
      if (res) {
        return {status: "Wrong last fragment in the row", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkRowClue: function(cells, row, clue, direction) {
  var firstEnd = false;
  var first = 0;
  var last = 0;
  var current = 0;
  var cellList = [];
  for (var x=0; x < cells.cols; x++) {
    cellList.push(util.coord(x, row));
    if (cells[row][x]) {
      current++;
      last = current;
      if (!firstEnd) {
        first = current;
      }
    } else {
      current = 0;
      if (first != 0) {
        firstEnd = true;
      }
    }
  }
  if (direction == 1 && first != clue) return cellList;
  if (direction == -1 && last != clue) return cellList;
  return null;
},
};

module.exports = Checker;
