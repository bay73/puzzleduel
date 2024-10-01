if (typeof util=="undefined") {
  var util = require('./util');
}
if (typeof sudoku_util=="undefined") {
  var sudoku_util = require('./sudoku_util');
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
  var res = Checker.checkNoEmptyCells(cells, colors.concat(["black"]) );
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkAreaMagic(cells, colors);
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
  return {status: "OK"};
},
checkNoEmptyCells: function(cells, colors) {
  var coord = util.findWrongValue(cells, colors);
  if (coord){
    return {
      status: "All cells should be filled",
      errors: [coord]
    };
  }
  return {status: "OK"};
},
checkRowMagic: function(cells, colors) {
  var res = util.checkOnceInRows(cells, colors, true);
  if (res){
    return {status: "All digits should be at most once in every row", errors: res};
  }
  return {status: "OK"};
},
checkColumnMagic: function(cells, colors) {
  var res = util.checkOnceInColumns(cells, colors, true);
  if (res){
    return {status: "All digits should be at most once in every column", errors: res};
  }
  return {status: "OK"};
},
checkAreaMagic: function(cells, colors, areas) {
  if (typeof areas != "undefined") {
    for (var a=0; a<areas.length; a++) {
      var res = sudoku_util.checkOnceInArea(cells, areas[a], colors, true);
      if (res){
        return {status: "All digits should be at most once in every area", errors: res};
      }
    }
    return {status: "OK"};
  }
  if (cells.rows == 9) {
    for (var j = 0; j < 3; j++) {
      for (var i = 0; i < 3; i++) {
        var res = sudoku_util.checkOnceInRectangle(cells, i*3, i*3 + 3, j*3, j*3 + 3, colors, true);
        if (res){
          return {status: "All digits should be at most once in every area", errors: res};
        }
      }
    }
    return {status: "OK"};
  }
  if (cells.rows == 8) {
    for (var j = 0; j < 4; j++) {
      for (var i = 0; i < 2; i++) {
        var res = sudoku_util.checkOnceInRectangle(cells, i*4, i*4 + 4, j*2, j*2 + 2, colors, true);
        if (res){
          return {status: "All digits should be at most once in every area", errors: res};
        }
      }
    }
    return {status: "OK"};
  }
  if (cells.rows == 6) {
    for (var j = 0; j < 3; j++) {
      for (var i = 0; i < 2; i++) {
        var res = sudoku_util.checkOnceInRectangle(cells, i*3, i*3 + 3, j*2, j*2 + 2, colors, true);
        if (res){
          return {status: "All digits should be at most once in every area", errors: res};
        }
      }
    }
    return {status: "OK"};
  }
  if (cells.rows == 4) {
    for (var j = 0; j < 2; j++) {
      for (var i = 0; i < 2; i++) {
        var res = sudoku_util.checkOnceInRectangle(cells, i*2, i*2 + 2, j*2, j*2 + 2, colors, true);
        if (res){
          return {status: "All digits should be at most once in every area", errors: res};
        }
      }
    }
    return {status: "OK"};
  }
  return {status: "OK"};
},
};

module.exports = Checker;
