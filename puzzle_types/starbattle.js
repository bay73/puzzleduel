if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false)
  var areas = [];

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value=="star";
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    if (key=="areas") {
      areas = value;
    } else {
      var pos = util.parseCoord(key);
      if (cells[pos.y]){
        cells[pos.y][pos.x] = false;
      }
    }
  }
  var res = Checker.checkTouch(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRows(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkColumns(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkAreas(areas, cells);
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
        return {status: "Cells with stars shouldn't touch", errors: [touch, util.coord(x,y)]}
      }
    }
  }
  return {status: "OK"};
},
checkRows: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    var starCount = 0;
    var cellList = [];
    for (var x = 0; x < cells.cols; x++) {
      cellList.push(util.coord(x, y));
      if (cells[y][x]) {
        starCount++;
      }
    }
    if (starCount!=2) {
      return {status: "Each row should have exactly two stars", errors: cellList}
    }
  }
  return {status: "OK"};
},
checkColumns: function(cells) {
  for (var x = 0; x < cells.cols; x++) {
    var starCount = 0;
    var cellList = [];
    for (var y = 0; y < cells.rows; y++) {
      cellList.push(util.coord(x, y));
      if (cells[y][x]) {
        starCount++;
      }
    }
    if (starCount!=2) {
      return {status: "Each column should have exactly two stars", errors: cellList}
    }
  }
  return {status: "OK"};
},
checkAreas: function(areas, cells) {
  for (var i = 0; i < areas.length; i++) {
    var area = areas[i];
    var starCount = 0;
    var cellList = [];
    for (var j = 0; j < area.length; j++) {
      var pos = util.parseCoord(area[j]);
      cellList.push(util.coord(pos.x, pos.y));
      if (cells[pos.y][pos.x]) {
        starCount++;
      }
    }
    if (starCount!=2) {
      return {status: "Each outlined area should have exactly two stars", errors: cellList}
    }
  }
  return {status: "OK"};
}
};

module.exports = Checker;
