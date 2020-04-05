const util = require('./util');

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
checkAreaMagic: function(cells, colors) {
  if (this.rows == 9) {
    for (var j = 0; j < 3; j++) {
      for (var i = 0; i < 3; i++) {
        var res = SudokuUtil.checkOnceInArea(cells, i*3, i*3 + 3, j*3, j*3 + 3, colors);
        if (res){
          return {status: "All digits should be exactly once in every area", errors: res};
        }
        return {status: "OK"};
      }
    }
  } else {
    for (var j = 0; j < 3; j++) {
      for (var i = 0; i < 2; i++) {
        var res = SudokuUtil.checkOnceInArea(cells, i*3, i*3 + 3, j*2, j*2 + 2, colors);
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
}
};

module.exports = SudokuUtil;
