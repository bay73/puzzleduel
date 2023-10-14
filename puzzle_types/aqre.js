if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false);
  var clue = util.create2DArray(dim.rows, dim.cols, "");
  var areas;

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
    } else {
      var pos = util.parseCoord(key);
      if (clue[pos.y]){
        if (value=="cross") {
          cells[pos.y][pos.x] = false;
        } else {
          clue[pos.y][pos.x] = value;
        }
      }
    }
  }
  var res = Checker.checkConnected(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkCountInAreas(cells, clue, areas);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkNot4InRow(cells);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkConnected: function(cells) {
  if (!util.checkConnected(cells, [true])) {
    return {status: "Shaded area should be connected"};
  }
  return {status: "OK"};
},
checkCountInAreas: function(cells, clue, areas) {
  for (var a=0; a<areas.length; a++) {
    var area = areas[a];
    var blackCount = 0;
    var clueInArea = null;
    for (var i=0;i<area.length;i++) {
      var pos = util.parseCoord(area[i]);
      if (cells[pos.y][pos.x]) {
        blackCount++;
      }
      if (clue[pos.y][pos.x]) {
        clueInArea = clue[pos.y][pos.x];
      }
    }
    if (clueInArea) {
      if (blackCount != parseInt(clueInArea)) {
       return {status: "The clue is not correct", errors: area};
      }
    }
  }
  return {status: "OK"};
},
checkNot4InRow: function(cells) {
  var res = Checker.find4InRow(cells);
  if (res){
    return {status: "Four cells of the same color shouldn't form a continious line", errors: res};
  }
  return {status: "OK"};
},

find4InRow: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (x + 3 < cells.cols) {
        if (cells[y][x] == cells[y][x+1] && cells[y][x] == cells[y][x+2] && cells[y][x] == cells[y][x+3]) {
          return [util.coord(x,y), util.coord(x+1,y), util.coord(x+2,y), util.coord(x+3,y)];
        }
      }
      if (y + 3 < cells.rows) {
        if (cells[y][x] == cells[y+1][x] && cells[y][x] == cells[y+2][x] && cells[y][x] == cells[y+3][x]) {
          return [util.coord(x,y), util.coord(x,y+1), util.coord(x,y+2), util.coord(x,y+3)];
        }
      }
    }
  }
  return null;
},
};

module.exports = Checker;
