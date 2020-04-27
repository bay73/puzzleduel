const util = require('./util');

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false)
  var nodes = util.create2DArray(dim.rows, dim.cols, false)
  var bottom = [];
  var right = [];

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (typeof cells[pos.y] != 'undefined'){
      cells[pos.y][pos.x]= (value == "black");
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    if (key=="bottom") {
      bottom = value;
    }
    if (key=="right") {
      right = value;
    }
    if (key=="nodes") {
      for (const [coord, clue] of Object.entries(value)) {
        var pos = util.parseCoord(coord);
        if (typeof nodes[pos.y] != 'undefined') {
          nodes[pos.y][pos.x] = (clue == 'battenberg');
        }
      }
    }
  }
  var res = Checker.checkColumnClues(cells, bottom);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRowClues(cells, right);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkBattenberg(cells, nodes);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkColumnClues: function(cells, clues) {
  for (var x=0; x < cells.cols; x++) {
    if (clues[x] && clues[x] != "white") {
      res = Checker.checkColumnClue(cells, clues[x], x);
      if (res) {
        return {status: "Wrong number of blackened cells in the column", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkColumnClue: function(cells, clue, col) {
  var blackCount = 0;
  var cellList = [];
  for (var y=0; y < cells.rows; y++) {
    cellList.push(util.coord(col, y));
    if (cells[y][col]) blackCount++;
  }
  if (blackCount.toString() != clue) return cellList;
  return null;
},
checkRowClues: function(cells, clues) {
  for (var y=0; y < cells.rows; y++) {
    if (clues[y] && clues[y] != "white") {
      res = Checker.checkRowClue(cells, clues[y], y);
      if (res) {
        return {status: "Wrong number of blackened cells in the row", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkRowClue: function(cells, clue, row) {
  var blackCount = 0;
  var cellList = [];
  for (var x=0; x < cells.cols; x++) {
    cellList.push(util.coord(x, row));
    if (cells[row][x]) blackCount++;
  }
  if (blackCount.toString() != clue) return cellList;
  return null;
},
checkBattenberg: function(cells, nodes) {
  for (var x = 0; x < cells.cols - 1; x++) {
    for (var y = 0; y < cells.rows - 1; y++) {
      var isBattenberg = cells[y][x] == cells[y+1][x+1] && cells[y][x+1] == cells[y+1][x] && cells[y][x] != cells[y][x+1];
      if (isBattenberg && !nodes[y][x]) {
        return {status: "Cells shouldn't form 'chess' pattern",
                errors: [util.coord(x,y), util.coord(x+1,y), util.coord(x,y+1), util.coord(x+1,y+1)]};
      }
      if (!isBattenberg && nodes[y][x]) {
        return {status: "Cells should form 'chess' pattern",
                errors: [util.coord(x,y), util.coord(x+1,y), util.coord(x,y+1), util.coord(x+1,y+1)]};
      }
    }
  }
  return {status: "OK"};
},
};

module.exports = Checker;
