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
    if (key=="areas") {
      areas = value;
    } else {
      var pos = util.parseCoord(key);
      if (cells[pos.y]){
        cells[pos.y][pos.x] = value;
      }
    }
  }
  colors = [];
  for (var i=1;i<=parseInt(dim.rows/2);i++) {
    colors.push(i.toString());
  }
  var res = Checker.checkAreaMagic(cells, colors, areas);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRowMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkColumnMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkNoTouch(cells);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkRowMagic: function(cells, colors) {
  var res = Checker.checkTwiceInRows(cells, colors);
  if (res){
    return {status: "All digits should be exactly two times in every row", errors: res};
  }
  return {status: "OK"};
},
checkColumnMagic: function(cells, colors) {
  var res = Checker.checkTwiceInColumns(cells, colors);
  if (res){
    return {status: "All digits should be exactly two times in every column", errors: res};
  }
  return {status: "OK"};
},
checkAreaMagic: function(cells, colors, areas) {
  if (typeof areas != "undefined") {
    for (var a=0; a<areas.length; a++) {
      var res = Checker.checkTwiceInArea(cells, areas[a], colors);
      if (res){
        return {status: "All digits should be exactly two times in every area", errors: res};
      }
    }
  }
  return {status: "OK"};
},
checkTwiceInArea: function(cells, area, colors) {
  var positionsToCheck = [];
  for (var a=0;a<area.length;a++) {
    positionsToCheck.push(util.parseCoord(area[a]));
  }
  return Checker.checkTwiceInList(cells, positionsToCheck, colors);
},
checkTwiceInRows: function(cells, colors) {
  // Returns list of cells in row which is wring.
  for (var y = 0; y < cells.rows; y++) {
    var positionsToCheck = [];
    for (var x = 0; x < cells.cols; x++) {
      positionsToCheck.push({x:x, y:y});
    }
    var result = Checker.checkTwiceInList(cells, positionsToCheck, colors);
    if (result) {
      return result;
    }
  }
  return null;
},
checkTwiceInColumns: function(cells, colors) {
  // Returns list of cells in column which is wring.
  for (var x = 0; x < cells.cols; x++) {
    var positionsToCheck = [];
    for (var y = 0; y < cells.rows; y++) {
      positionsToCheck.push({x:x, y:y});
    }
    var result = Checker.checkTwiceInList(cells, positionsToCheck, colors);
    if (result) {
      return result;
    }
  }
  return null;
},
checkTwiceInList: function(cells, positionsToCheck, colorsToCheck) {
  // Returns list of cells if something is wrong
  // or null if everything is Ok
  var colorsPresent = {};
  var repeat = 0;
  var cellList = [];
  for (var i = 0; i < positionsToCheck.length; i++) {
    cellList.push(util.coord(positionsToCheck[i].x,positionsToCheck[i].y));
    var color = cells[positionsToCheck[i].y][positionsToCheck[i].x];
    if (colorsToCheck.includes(color)) {
      if (colorsPresent[color] > 0) {
        colorsPresent[color]++;
      } else {
        colorsPresent[color]=1;
      }
    }
  }
  var all = true;
  for (var i=0;i<colorsToCheck.length;i++) {
    if (colorsPresent[colorsToCheck[i]] != 2) {
      all = false;
    }
  }
  if (!all) {
    return cellList;
  }
  return null;
},
checkNoTouch: function(cells) {
  var res = Checker.findTouch(cells);
  if (res){
    return {status: "Two cells sharing an edge should contain different digits", errors: res};
  }
  return {status: "OK"};
},
findTouch: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (y<cells.rows-1&&cells[y][x]==cells[y+1][x]){
        return [util.coord(x,y), util.coord(x,y+1)];
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
