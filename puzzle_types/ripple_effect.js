const util = require('./util');
const sudoku_util = require('./sudoku_util');

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
    if (key=="areas") {
      areas = value;
    } else {
      var pos = util.parseCoord(key);
      if (cells[pos.y]){
        cells[pos.y][pos.x] = value;
      }
    }
  }
  var res = Checker.checkDistances(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkAreas(areas, cells);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkAreas: function(areas, cells) {
  for (var i = 0; i < areas.length; i++) {
    var area = areas[i];
    var values = {};
    for (var j = 1; j <= area.length; j++) {
      values[j] = false;
    }
    for (var j = 0; j < area.length; j++) {
      var pos = util.parseCoord(area[j]);
      var value = parseInt(cells[pos.y][pos.x]);
      if (value) {
        values[value] = true;
      }
    }
    for (var j = 1; j <= area.length; j++) {
      if (!values[j]) {
        return {status: "Area should contain sequential numbers from 1 to N", errors: area};
      }
    }
  }
  return {status: "OK"};
},
checkDistances: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      var value = parseInt(cells[y][x]);
      for( var dx = 1; dx <= value; dx++) {
        if (x+dx < cells.cols && cells[y][x+dx]==cells[y][x]) {
          return {status: "Distance between digits is too small", errors: [util.coord(x,y), util.coord(x+dx,y)]};
        }
      }
      for( var dy = 1; dy <= value; dy++) {
        if (y+dy < cells.rows && cells[y+dy][x]==cells[y][x]) {
          return {status: "Distance between digits is too small", errors: [util.coord(x,y), util.coord(x,y+dy)]};
        }
      }
    }
  }
  return {status: "OK"};
}
};

module.exports = Checker;
