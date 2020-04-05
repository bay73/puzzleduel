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
  var res = sudoku_util.checkColumnMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = sudoku_util.checkRowMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = sudoku_util.checkAreaMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkAntiknight(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkAntiknight: function(cells) {
  var res = Checker.findKnightOfSameColor(cells);
  if (res){
    return {status: "Two cells connected by the knight move should contain different digits", errors: res};
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
