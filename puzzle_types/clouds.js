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
      cells[pos.y][pos.x]= (value == "black");
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
  var res = Checker.checkRectangles(cells);
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
checkRectangles: function(cells) {
  var rectangles = util.create2DArray(cells.rows, cells.cols, 0);
  var rectCount = 0;
  for (var x = 0; x < cells.cols; x++) {
    for (var y = 0; y < cells.rows; y++) {
      if (cells[y][x] && rectangles[y][x] == 0) {
        rectCount++;
        var size = Checker.startRect(cells, x, y, rectangles, rectCount);
        if (!size) {
          return {status: "Black cells should form rectangles", errors: [util.coord(x,y)]};
        }
        if(size.width < 2 || size.height < 2) {
          return {status: "Sides of a rectangle should be at least 2", errors: [util.coord(x,y)]};
        }
      }
    }
  }
  for (var x = 0; x < cells.cols; x++) {
    for (var y = 0; y < cells.rows; y++) {
      if (rectangles[y][x] != 0) {
        if (x>0 && rectangles[y][x-1] != 0 && rectangles[y][x-1] != rectangles[y][x]) {
          return {status: "Rectangles shouldn't touch", errors: [util.coord(x,y), util.coord(x-1,y)]};
        }
        if (y>0 && rectangles[y-1][x] != 0 && rectangles[y-1][x] != rectangles[y][x]) {
          return {status: "Rectangles shouldn't touch", errors: [util.coord(x,y), util.coord(x,y-1)]};
        }
        if (x>0 && y>0 && rectangles[y-1][x-1] != 0 && rectangles[y-1][x-1] != rectangles[y][x]) {
          return {status: "Rectangles shouldn't touch", errors: [util.coord(x,y), util.coord(x-1,y-1)]};
        }
        if (x>0 && y<cells.rows-1 && rectangles[y+1][x-1] != 0 && rectangles[y+1][x-1] != rectangles[y][x]) {
          return {status: "Rectangles shouldn't touch", errors: [util.coord(x,y), util.coord(x-1,y+1)]};
        }
      }
    }
  }
  return {status: "OK"};
},
startRect: function(cells, x, y, rectangles, rectNum) {
  var width = 0;
  for (var i=0; i < cells.cols - x; i++){
    if (cells[y][x+i]) {
      width = i+1;
    } else {
      break;
    }
  }
  var height = 0;
  for (var j=0; j < cells.rows - y; j++){
    if (cells[y+j][x]) {
      height = j+1;
    } else {
      break;
    }
  }
  for (var i=0; i < width; i++){
    for (var j=0; j < height; j++){
      if (cells[y+j][x+i]) {
        rectangles[y+j][x+i]=rectNum;
      } else {
        return null;
      }
    }
  }
  return {width:width, height:height};
}
};

module.exports = Checker;
