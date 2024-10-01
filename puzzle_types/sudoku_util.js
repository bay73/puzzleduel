if (typeof util=="undefined") {
  var util = require('./util');
}

const SudokuUtil = {
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
checkAreaMagic: function(cells, colors, areas) {
  if (typeof areas != "undefined") {
    for (var a=0; a<areas.length; a++) {
      var res = SudokuUtil.checkOnceInArea(cells, areas[a], colors);
      if (res){
        return {status: "All digits should be exactly once in every area", errors: res};
      }
    }
    return {status: "OK"};
  }
  if (cells.rows == 9) {
    for (var j = 0; j < 3; j++) {
      for (var i = 0; i < 3; i++) {
        var res = SudokuUtil.checkOnceInRectangle(cells, i*3, i*3 + 3, j*3, j*3 + 3, colors);
        if (res){
          return {status: "All digits should be exactly once in every area", errors: res};
        }
      }
    }
    return {status: "OK"};
  }
  if (cells.rows == 8) {
    for (var j = 0; j < 4; j++) {
      for (var i = 0; i < 2; i++) {
        var res = SudokuUtil.checkOnceInRectangle(cells, i*4, i*4 + 4, j*2, j*2 + 2, colors);
        if (res){
          return {status: "All digits should be exactly once in every area", errors: res};
        }
      }
    }
    return {status: "OK"};
  }
  if (cells.rows == 6) {
    for (var j = 0; j < 3; j++) {
      for (var i = 0; i < 2; i++) {
        var res = SudokuUtil.checkOnceInRectangle(cells, i*3, i*3 + 3, j*2, j*2 + 2, colors);
        if (res){
          return {status: "All digits should be exactly once in every area", errors: res};
        }
      }
    }
    return {status: "OK"};
  }
  if (cells.rows == 4) {
    for (var j = 0; j < 2; j++) {
      for (var i = 0; i < 2; i++) {
        var res = SudokuUtil.checkOnceInRectangle(cells, i*2, i*2 + 2, j*2, j*2 + 2, colors);
        if (res){
          return {status: "All digits should be exactly once in every area", errors: res};
        }
      }
    }
    return {status: "OK"};
  }
  return {status: "OK"};
},
checkOnceInRectangle: function(cells, xFrom, xTo, yFrom, yTo, colors, allowMissing) {
  var positionsToCheck = [];
  for (var x = xFrom; x < xTo; x++) {
    for (var y = yFrom; y < yTo; y++) {
      positionsToCheck.push({x:x, y:y});
    }
  }
  return util.checkOnceInList(cells, positionsToCheck, colors, allowMissing);
},
checkOnceInArea: function(cells, area, colors, allowMissing) {
  var positionsToCheck = [];
  for (var a=0;a<area.length;a++) {
    positionsToCheck.push(util.parseCoord(area[a]));
  }
  return util.checkOnceInList(cells, positionsToCheck, colors, allowMissing);
}
};

module.exports = SudokuUtil;
