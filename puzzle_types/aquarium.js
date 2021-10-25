if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {

check:function(dimension, clues, data){
  let dim = util.parseDimension(dimension);
  let cells = util.create2DArray(dim.rows, dim.cols, false)
  var areas = [];
  var bottom = [];
  var right = [];

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = (value == "1");
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    if (key=="areas") {
      areas = value;
    } else if (key=="bottom") {
      bottom = value;
    } else if (key=="right") {
      right = value;
    } else {
      var pos = util.parseCoord(key);
      if (value=="cross"){
        cells[pos.y][pos.x] = false;
      }
    }
  }
  var res = Checker.checkAreas(cells, areas);
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

checkAreas: function(cells, areas) {
  for (var i = 0; i < areas.length; i++) {
    var area = areas[i];
    var res = Checker.checkArea(cells, area);
    if (res.status != "OK") {
      return res;
    }
  }
  return {status: "OK"};
},
checkArea: function(cells, area) {
  let topFill = cells.rows;
  let bottomEmpty = -1;
  for (var j = 0; j < area.length; j++) {
    var pos = util.parseCoord(area[j]);
    if (cells[pos.y][pos.x]) {
      topFill = Math.min(topFill, pos.y);
    } else {
      bottomEmpty = Math.max(bottomEmpty, pos.y);
    }
  }
  if (topFill <= bottomEmpty) {
    return {status: "The cells must be filled up from the bottom up in the area", errors: area};
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
};

module.exports = Checker;
