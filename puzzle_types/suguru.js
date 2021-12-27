if (typeof util=="undefined") {
  var util = require('./util');
}
if (typeof sudoku_util=="undefined") {
  var sudoku_util = require('./sudoku_util');
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
    if (key=="areas") {
      areas = value;
    } else {
      var pos = util.parseCoord(key);
      if (cells[pos.y]){
        cells[pos.y][pos.x] = value;
      }
    }
  }
  var res = Checker.checkAreas(areas, cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkNoTouch(cells);
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
checkNoTouch: function(cells) {
  var res = Checker.findTouch(cells);
  if (res){
    return {status: "Two cells sharing a point should contain different digits", errors: res};
  }
  return {status: "OK"};
},
findTouch: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (y<cells.rows-1&&cells[y][x]==cells[y+1][x]){
        return [util.coord(x,y), util.coord(x,y+1)];
      }
      if (x>0 && y<cells.rows-1&&cells[y][x]==cells[y+1][x-1]){
        return [util.coord(x,y), util.coord(x-1,y+1)];
      }
      if (x<cells.cols-1 && y<cells.rows-1&&cells[y][x]==cells[y+1][x+1]){
        return [util.coord(x,y), util.coord(x+1,y+1)];
      }
      if (x<cells.cols-1 && cells[y][x]==cells[y][x+1]){
        return [util.coord(x,y), util.coord(x+1,y)];
      }
    }
  }
  return null;
}
};

module.exports = Checker;
