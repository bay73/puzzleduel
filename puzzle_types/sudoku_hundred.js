if (typeof util=="undefined") {
  var util = require('./util');
}
if (typeof sudoku_util=="undefined") {
  var sudoku_util = require('./sudoku_util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var part = dimension.split("-");
  var rowSum = parseInt(part[1]);
  var dim = util.parseDimension(part[0]);
  var cells = util.create2DArray(dim.rows, dim.cols, "")
  var shades = util.create2DArray(dim.rows, dim.cols, false)

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
      if (value.startsWith("-")) {
        shades[pos.y][pos.x] = true;
        if (value.length > 1) {
          cells[pos.y][pos.x] = value.substring(1);
        }
      } else {
        cells[pos.y][pos.x] = value;
      }
    }
  }
  colors = [];
  for (var i=1;i<=parseInt(dim.rows);i++) {
    colors.push(i.toString());
  }
  var res = sudoku_util.checkAreaMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = sudoku_util.checkRowMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = sudoku_util.checkColumnMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRowsSums(cells, shades, colors, rowSum);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkRowsSums: function(cells, shades, colors, rowSum) {
  for (var y = 0; y < cells.rows; y++) {
    var res = Checker.checkRowSum(y, cells, shades, colors, rowSum);
    if (res.status != "OK") {
      return res;
    }
  }
  return {status: "OK"};
},
checkRowSum: function(row, cells, shades, colors, rowSum) {
  var currentNumber = 0;
  var sum = 0;
  var cellList = [];
  for (var x = 0; x < cells.cols; x++) {
    if (shades[row][x]) {
      cellList.push(util.coord(x,row));
      currentNumber = currentNumber * 10 + parseInt(cells[row][x])
    } else {
      sum += currentNumber;
      currentNumber = 0;
    }
  }  
  sum += currentNumber;
  if (cellList.length > 0 && sum != rowSum) {
    return {status: "Sum of the numbers in the row in not correct", errors: cellList};
  }
  return {status: "OK"};
},
ifCell: function(shades, x, y) {
  return x>=0 && x<shades.cols && y>=0 && y<shades.rows && shades[y][x];
},
};

module.exports = Checker;
