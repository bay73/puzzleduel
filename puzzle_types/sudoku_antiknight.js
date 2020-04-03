const util = require('./util');

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
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  colors = [];
  for (var i=1;i<=parseInt(dim.rows);i++) {
    colors.push(i.toString());
  }
  var res = Checker.checkColumnMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRowMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkAreaMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkAntiknight(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkRowMagic: function(cells, colors) {
  var res = util.checkOnceInRows(cells, colors);
  if (res){
    return {status: "All digits should be exactly once in every row", errors: res};
  }
  return {status: "OK"};
},
checkColumnMagic: function(cells, colors) {
  var res = util.checkOnceInColumns(cells, colors);
  if (res){
    return {status: "All digits should be exactly once in every column", errors: res};
  }
  return {status: "OK"};
},
checkAreaMagic: function(cells, colors) {
  if (this.rows == 9) {
    for (var j = 0; j < 3; j++) {
      for (var i = 0; i < 3; i++) {
        var res = Checker.checkOnceInArea(cells, i*3, i*3 + 3, j*3, j*3 + 3, colors);
        if (res){
          return {status: "All digits should be exactly once in every area", errors: res};
        }
        return {status: "OK"};
      }
    }
  } else {
    for (var j = 0; j < 3; j++) {
      for (var i = 0; i < 2; i++) {
        var res = Checker.checkOnceInArea(cells, i*3, i*3 + 3, j*2, j*2 + 2, colors);
        if (res){
          return {status: "All digits should be exactly once in every area", errors: res};
        }
        return {status: "OK"};
      }
    }
  }
},
checkOnceInArea: function(cells, xFrom, xTo, yFrom, yTo, colors) {
  var positionsToCheck = [];
  for (var x = xFrom; x < xTo; x++) {
    for (var y = yFrom; y < yTo; y++) {
      positionsToCheck.push({x:x, y:y});
    }
  }
  return util.checkOnceInList(cells, positionsToCheck, colors);
},
checkAntiknight: function(cells) {
  var res = Checker.findKnightOfSameColor(cells);
  if (res){
    return {status: "Two cells konnected by knight move should contain different digits", errors: res};
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
}
};

module.exports = Checker;
