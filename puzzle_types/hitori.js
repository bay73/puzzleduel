const util = require('./util');

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false)
  var cluecells = util.create2DArray(dim.rows, dim.cols, "")

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = (value == "1");
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    var pos = util.parseCoord(key);
    if (cluecells[pos.y]){
      cluecells[pos.y][pos.x] = value;
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
  var res = Checker.checkColumns(cluecells, cells);
  if (res.status != "OK") {
    return res;
  }
  return Checker.checkRows(cluecells, cells);
},

checkConnected: function(cells) {
  if (!util.checkConnected(cells, false)) {
    return {status: "White area should be connected"};
  }
  return {status: "OK"};
},
checkRows: function(cluecells, cells) {
  for (var y = 0; y < cells.rows; y++) {
    var positionsToCheck = [];
    for (var x = 0; x < cells.cols; x++) {
      if (!cells[y][x]) {
        positionsToCheck.push({x:x, y:y});
      }
    }
    var result = Checker.findRepeat(cluecells, positionsToCheck);
    if (result) {
      return {status: "Unpainted cells should contain different digits in row", errors: result};
    }
  }
  return {status: "OK"};
},
checkColumns: function(cluecells, cells) {
  for (var x = 0; x < cells.cols; x++) {
    var positionsToCheck = [];
    for (var y = 0; y < cells.rows; y++) {
      if (!cells[y][x]) {
        positionsToCheck.push({x:x, y:y});
      }
    }
    var result = Checker.findRepeat(cluecells, positionsToCheck);
    if (result) {
      return {status: "Unpainted cells should contain different digits in row", errors: result};
    }
  }
  return {status: "OK"};
},

findRepeat: function(cells, positionsToCheck){
  var repeat = false;
  var cellList = [];
  for (var a = 0; a < positionsToCheck.length; a++) {
    for (var b = a + 1; b < positionsToCheck.length; b++) {
      var colorA = cells[positionsToCheck[a].y][positionsToCheck[a].x];
      var colorB = cells[positionsToCheck[b].y][positionsToCheck[b].x];
      if (colorA != null && colorB != null colorA != "" && colorB != "" && colorA == colorB) {
        return [util.coord(positionsToCheck[a].x,positionsToCheck[a].y), util.coord(positionsToCheck[b].x,positionsToCheck[b].y)];
      }
    }
  }
  return null;
},
checkNotouch: function(cells) {
  var res = Checker.findTouch(cells);
  if (res){
    return {status: "Blackened cells shouldn't sharing an edge", errors: res};
  }
  return {status: "OK"};
},
findTouch: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (y<cells.rows-1 && cells[y][x] && cells[y+1][x]){
        return [util.coord(x,y), util.coord(x,y+1)];
      }
      if (x<cells.cols-1 && cells[y][x] && cells[y][x+1]){
        return [util.coord(x,y), util.coord(x+1,y)];
      }
    }
  }
  return null;
}
};

module.exports = Checker;
