if (typeof util=="undefined") {
  var util = require('./util');
}

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
  return Checker.checkAreas(cells, cluecells);
},
checkAreas: function(cells, cluecells) {
  for (var y0 = 0; y0 < cells.rows; y0++) {
    for (var x0 = 0; x0 < cells.cols; x0++) {
      var topLeftCell = cells[y0][x0];
      if ((y0 == 0 || cells[y0-1][x0] != topLeftCell) && (x0 == 0 || cells[y0][x0-1] != topLeftCell)) {
        var x1 = x0 + 1;
        for (; x1 < cells.cols; x1++) {
          if (cells[y0][x1] != topLeftCell) break;
        }
        var y1 = y0 + 1;
        for (; y1 < cells.rows; y1++) {
          if (cells[y1][x0] != topLeftCell) break;
        }
        var rectangleArea = (y1-y0)*(x1-x0)
        var cellsInRectangle = 0
        for (y = y0; y < y1; y++) {
          for (x = x0; x < x1; x++) {
            if (cells[y][x] == topLeftCell) {
              cellsInRectangle++;
            }
          }
        }
        var connected = util.findConnected(cells, {x:x0, y:y0}, [topLeftCell]);
        var connectedCount = 0;
        var clueCount = 0;
        var connectedCoords = []
        for (var y = 0; y < cells.rows; y++) {
          for (var x = 0; x < cells.cols; x++) {
            if (connected[y][x]){
              connectedCount++;
              connectedCoords.push(util.coord(x,y))
            }
          }
        }
        if (topLeftCell) {
          if (cellsInRectangle != rectangleArea || connectedCount != rectangleArea) {
            return {status: "Shaded area should have rectnagular or square shape", errors: connectedCoords};
          }
        } else {
          if (cellsInRectangle == rectangleArea && connectedCount == rectangleArea) {
            return {status: "Unshaded area should have non-rectnagular shape", errors: connectedCoords};
          }
        }
        for (var y = 0; y < cells.rows; y++) {
          for (var x = 0; x < cells.cols; x++) {
            if (connected[y][x] && cluecells[y][x] != "" && cluecells[y][x] != connectedCount.toString()) {
              return {status: "The clue is not correct", errors: [util.coord(x,y)]};
            }
          }
        }
      }
    }
  }
  return {status: "OK"};
}
};

module.exports = Checker;
