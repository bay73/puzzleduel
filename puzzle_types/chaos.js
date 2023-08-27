if (typeof util=="undefined") {
  var util = require('./util');
}

var Checker = {
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
  var res = Checker.checkAntiknight(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkThreeInRow(cells);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkNoEmptyCells: function(cells) {
  var coord = util.findWrongValue(cells, ["1", "2", "3", "4"]);
  if (coord){
    return {
      status: "All cells should be filled",
      errors: [coord]
    };
  }
  return {status: "OK"};
},
checkAntiknight: function(cells) {
  var res = Checker.findKnightOfSameColor(cells);
  if (res){
    return {status: "Two cells connected by the knight move should contain different digits", errors: res};
  }
  return {status: "OK"};
},
findKnightOfSameColor: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (x>1 && y<cells.rows-1&&cells[y][x]==cells[y+1][x-2]){
        return [util.coord(x,y), util.coord(x-2,y+1)];
      }
      if (x<cells.cols-2 && y<cells.rows-1&&cells[y][x]==cells[y+1][x+2]){
        return [util.coord(x,y), util.coord(x+2,y+1)];
      }
      if (x>0 && y<cells.rows-2&&cells[y][x]==cells[y+2][x-1]){
        return [util.coord(x,y), util.coord(x-1,y+2)];
      }
      if (x<cells.cols-1 && y<cells.rows-2&&cells[y][x]==cells[y+2][x+1]){
        return [util.coord(x,y), util.coord(x+1,y+2)];
      }
    }
  }
  return null;
},
checkThreeInRow: function(cells) {
  var res = Checker.findThreeInRow(cells);
  if (res){
    return {status: "Three cells in a row shouldn't contain the same digits", errors: res};
  }
  return {status: "OK"};
},
findThreeInRow: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (y<cells.rows-2&&cells[y][x]==cells[y+1][x]&&cells[y][x]==cells[y+2][x]){
        return [util.coord(x,y), util.coord(x,y+1), util.coord(x,y+2)];
      }
      if (x<cells.cols-2&&cells[y][x]==cells[y][x+1]&&cells[y][x]==cells[y][x+2]){
        return [util.coord(x,y), util.coord(x+1,y), util.coord(x+2,y)];
      }
      if (x<cells.cols-2&&y<cells.rows-2&&cells[y][x]==cells[y+1][x+1]&&cells[y][x]==cells[y+2][x+2]){
        return [util.coord(x,y), util.coord(x+1,y+1), util.coord(x+2,y+2)];
      }
      if (x>1 && y<cells.rows-2&&cells[y][x]==cells[y+1][x-1]&&cells[y][x]==cells[y+2][x-2]){
        return [util.coord(x,y), util.coord(x-1,y+1), util.coord(x-2,y+2)];
      }
    }
  }
  return null;
}
};

module.exports = Checker;
