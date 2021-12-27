if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, "X")
  var bottom = [];
  var right = [];

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
    } else {
      var pos = util.parseCoord(key);
      if (value=="cross"){
        cells[pos.y][pos.x] = "X";
      }
    }
  }
  var res = Checker.checkConnected(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkNotouch(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkColumnClues(cells, bottom);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRowClues(cells, right);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkConnected: function(cells) {
  if (!util.checkConnected(cells, "X")) {
    return {status: "White area should be connected"};
  }
  return {status: "OK"};
},
checkNotouch: function(cells) {
  var res = Checker.findTouch(cells);
  if (res){
    return {status: "Cells with digits shouldn't share an edge", errors: res};
  }
  return {status: "OK"};
},
findTouch: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (y<cells.rows-1 && cells[y][x] != "X" && cells[y+1][x] != "X"){
        return [util.coord(x,y), util.coord(x,y+1)];
      }
      if (x<cells.cols-1 && cells[y][x] != "X" && cells[y][x+1] != "X"){
        return [util.coord(x,y), util.coord(x+1,y)];
      }
    }
  }
  return null;
},
checkColumnClues: function(cells, clues) {
  for (var x=0; x < cells.cols; x++) {
    if (clues[x] && clues[x] != "white") {
      res = Checker.checkColumnClue(cells, clues[x], x);
      if (res.status != "OK") {
        return res;
      }
    }
  }
  return {status: "OK"};
},
checkColumnClue: function(cells, clue, col) {
  var digitCount = 0;
  var product = 1;
  var cellList = [];
  for (var y=0; y < cells.rows; y++) {
    cellList.push(util.coord(col, y));
    if (cells[y][col] != "X") {
      digitCount++;
      product *= parseInt(cells[y][col]);
    }
  }
  if (digitCount != 2) {
    return {status: "There should be 2 digits in the column", errors: cellList};
  }
  if (product.toString() != clue) {
    return {status: "Wrong product for the column", errors: cellList};
  }
  return {status: "OK"};
},
checkRowClues: function(cells, clues) {
  for (var y=0; y < cells.rows; y++) {
    if (clues[y] && clues[y] != "white") {
      res = Checker.checkRowClue(cells, clues[y], y);
      if (res.status != "OK") {
        return res;
      }
    }
  }
  return {status: "OK"};
},
checkRowClue: function(cells, clue, row) {
  var digitCount = 0;
  var product = 1;
  var cellList = [];
  for (var x=0; x < cells.cols; x++) {
    cellList.push(util.coord(x, row));
    if (cells[row][x] != "X") {
      digitCount++;
      product *= parseInt(cells[row][x]);
    }
  }
  if (digitCount != 2) {
    return {status: "There should be 2 digits in the row", errors: cellList};
  }
  if (product.toString() != clue) {
    return {status: "Wrong product for the row", errors: cellList};
  }
  return {status: "OK"};
},
};

module.exports = Checker;
