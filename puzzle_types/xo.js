if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, "")

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  var res = Checker.checkNoEmptyCells(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkNot4InRow(cells);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkNot4InRow: function(cells) {
  var res = Checker.find4InRow(cells);
  if (res){
    return {status: "Four identical symbols shouldn't form a continious line", errors: res};
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
      if (x + 3 < cells.cols && y + 3 < cells.rows) {
        if (cells[y][x] == cells[y+1][x+1] && cells[y][x] == cells[y+2][x+2] && cells[y][x] == cells[y+3][x+3]) {
          return [util.coord(x,y), util.coord(x+1,y+1), util.coord(x+2,y+2), util.coord(x+3,y+3)];
        } 
      }
      if (x - 3 >= 0 && y + 3 < cells.rows) {
        if (cells[y][x] == cells[y+1][x-1] && cells[y][x] == cells[y+2][x-2] && cells[y][x] == cells[y+3][x-3]) {
          return [util.coord(x,y), util.coord(x-1,y+1), util.coord(x-2,y+2), util.coord(x-3,y+3)];
        } 
      }
    }
  }
  return null;
},

checkNoEmptyCells: function(cells) {
  var coord = util.findWrongValue(cells, ["X", "O", "black"]);
  if (coord){
    return {
      status: "All cells should be filled",
      errors: [coord]
    };
  }
  return {status: "OK"};
},
};

module.exports = Checker;
