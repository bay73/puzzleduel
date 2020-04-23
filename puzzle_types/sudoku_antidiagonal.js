const util = require('./util');
const sudoku_util = require('./sudoku_util');

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
  var res = Checker.checkTopLeftBottomRight(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkTopRightBottomLeft(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkTopLeftBottomRight: function(cells, colors) {
  var cellList = [];
  var values = [];
  for (var i = 0; i < cells.rows; i++) {
    if (!values.includes(cells[i][i])) {
      values.push(cells[i][i]);
    }
    cellList.push(util.coord(i, i));
  }
  if (values.length != 3){ 
    return {status: "The diagonal should contain exactly three different digits", errors: res};
  }
  return {status: "OK"};
},
checkTopRightBottomLeft: function(cells, colors) {
  var cellList = [];
  var values = [];
  for (var i = 0; i < cells.rows; i++) {
    if (!values.includes(cells[cells.rows-i-1][i])) {
      values.push(cells[cells.rows-i-1][i]);
    }
    cellList.push(util.coord(i, cells.rows-i-1));
  }
  if (values.length != 3){ 
    return {status: "The diagonal should contain exactly three different digits", errors: res};
  }
  return {status: "OK"};
}
};

module.exports = Checker;
