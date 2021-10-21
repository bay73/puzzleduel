if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var part = dimension.split("-");
  var maxValue = parseInt(part[1]);
  var dim = util.parseDimension(part[0]);
  var cells = util.create2DArray(dim.rows, dim.cols, "")
  var bottom = [];
  var right = [];

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      if (value != "X" && parseInt(value) <= maxValue) { 
        cells[pos.y][pos.x] = value;
      }
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
        cells[pos.y][pos.x] = "";
      }
    }
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
checkNotouch: function(cells) {
  var res = Checker.findTouch(cells);
  if (res){
    return {status: "Cells with digits shouldn't touch", errors: res};
  }
  return {status: "OK"};
},
findTouch: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (y<cells.rows-1 && cells[y][x] != "" && cells[y+1][x] != ""){
        return [util.coord(x,y), util.coord(x,y+1)];
      }
      if (x<cells.cols-1 && cells[y][x] != "" && cells[y][x+1] != ""){
        return [util.coord(x,y), util.coord(x+1,y)];
      }
      if (x<cells.cols-1 && y<cells.rows-1 && cells[y][x] != "" && cells[y+1][x+1] != ""){
        return [util.coord(x,y), util.coord(x+1,y+1)];
      }
      if (x>0 && y<cells.rows-1 && cells[y][x] != "" && cells[y+1][x-1] != ""){
        return [util.coord(x,y), util.coord(x-1,y+1)];
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
  var sum = 0;
  var cellList = [];
  for (var y=0; y < cells.rows; y++) {
    cellList.push(util.coord(col, y));
    if (cells[y][col] != "") {
      sum += parseInt(cells[y][col]);
    }
  }
  if (sum.toString() != clue) {
    return {status: "Wrong sum for the column", errors: cellList};
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
  var sum = 0;
  var cellList = [];
  for (var x=0; x < cells.cols; x++) {
    cellList.push(util.coord(x, row));
    if (cells[row][x] != "") {
      sum += parseInt(cells[row][x]);
    }
  }
  if (sum.toString() != clue) {
    return {status: "Wrong sum for the row", errors: cellList};
  }
  return {status: "OK"};
},
};

module.exports = Checker;
