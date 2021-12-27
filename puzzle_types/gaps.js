if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false)
  var bottom = [];
  var right = [];

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x]= (value == "white_circle");
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
  }
  var res = Checker.checkTouch(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRows(cells, right);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkColumns(cells, bottom);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkTouch: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cells[y][x]) {
        var touch = null;
        if(y>0 && cells[y-1][x]) touch = util.coord(x,y-1);
        if(x>0 && cells[y][x-1]) touch = util.coord(x-1,y);
        if(y>0 && x>0 && cells[y-1][x-1]) touch = util.coord(x-1,y-1);
        if(y>0 && x<cells.cols-1 && cells[y-1][x+1]) touch = util.coord(x+1,y-1);
        if(y<cells.rows-1 && x>0 && cells[y+1][x-1]) touch = util.coord(x-1,y+1);
      }
      if (touch!=null) {
        return {status: "Cells with circles shouldn't touch", errors: [touch, util.coord(x,y)]}
      }
    }
  }
  return {status: "OK"};
},
checkRows: function(cells, clues) {
  for (var y = 0; y < cells.rows; y++) {
    var circleCount = 0;
    var cellList = [];
    var first = null;
    var last = null;
    for (var x = 0; x < cells.cols; x++) {
      cellList.push(util.coord(x, y));
      if (cells[y][x]) {
        circleCount++;
        last = x;
        if (first == null) {
          first = x;
        }
      }
    }
    if (circleCount!=2) {
      return {status: "Each row should have exactly two circles", errors: cellList}
    }
    if (clues[y] && clues[y] != "white") {
      var dist = last - first - 1;
      if (dist.toString() != clues[y]) {
        return {status: "Wrong number of cells between circles in the row", errors: cellList};
      }
    }
  }
  return {status: "OK"};
},
checkColumns: function(cells, clues) {
  for (var x = 0; x < cells.cols; x++) {
    var circleCount = 0;
    var cellList = [];
    var first = null;
    var last = null;
    for (var y = 0; y < cells.rows; y++) {
      cellList.push(util.coord(x, y));
      if (cells[y][x]) {
        circleCount++;
        last = y;
        if (first == null) {
          first = y;
        }
      }
    }
    if (circleCount!=2) {
      return {status: "Each column should have exactly two circles", errors: cellList}
    }
    if (clues[x] && clues[x] != "white") {
      var dist = last - first - 1;
      if (dist.toString() != clues[x]) {
        return {status: "Wrong number of cells between circles in the column", errors: cellList};
      }
    }
  }
  return {status: "OK"};
},
};

module.exports = Checker;
