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
      if (["1", "2", "3", "4"].includes(value)) {
        cells[pos.y][pos.x] = value;
      }  
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  var res = Checker.checkValues(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkConnected(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkNoTouch(cells);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkNoTouch: function(cells) {
  var res = Checker.findTouch(cells);
  if (res){
    return {status: "Two cells sharing an edge shouldn't contain the same numbers", errors: res};
  }
  return {status: "OK"};
},
findTouch: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (y<cells.rows-1&&cells[y][x]&&cells[y][x]==cells[y+1][x]){
        return [util.coord(x,y), util.coord(x,y+1)];
      }
      if (x<cells.cols-1&&cells[y][x]&&cells[y][x]==cells[y][x+1]){
        return [util.coord(x,y), util.coord(x+1,y)];
      }
    }
  }
  return null;
},
checkValues: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cells[y][x]) {
        let count = Checker.countNeighbours(cells, x, y);
        if (count.toString() != cells[y][x]) {
          return {status: "Wrong number of neighbours for the cell", errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},
checkConnected: function(cells) {
  if (!util.checkConnected(cells, ["1","2","3","4"])) {
    return {status: "Area occupied by the digits should be connected"};
  }
  return {status: "OK"};
},
countNeighbours: function(cells, x, y) {
  let count = 0;
  if (y<cells.rows-1&&cells[y+1][x]){
     count++;
  }
  if (y>0&&cells[y-1][x]){
     count++;
  }
  if (x<cells.cols-1&&cells[y][x+1]){
     count++;
  }
  if (x>0&&cells[y][x-1]){
     count++;
  }
  return count;
},
};

module.exports = Checker;
