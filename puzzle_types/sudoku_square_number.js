const util = require('./util');
const sudoku_util = require('./sudoku_util');

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, "")
  var bottomDots = util.create2DArray(dim.rows, dim.cols, false)
  var rightDots = util.create2DArray(dim.rows, dim.cols, false)

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = value;
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    if (key=="edges"){
      for (var [edgeKey, edgeValue] of Object.entries(value)) {
        var part = edgeKey.split("-");
        var pos = util.parseCoord(part[0]);
        if (part[1]=="b" || part[1]=="2") {
          if (bottomDots[pos.y]){
            bottomDots[pos.y][pos.x] = (edgeValue=="black_circle");
          }
        }
        if (part[1]=="r" || part[1]=="1") {
          if (rightDots[pos.y]){
            rightDots[pos.y][pos.x] = (edgeValue=="black_circle");
          }
        }
      }
    } else {
      var pos = util.parseCoord(key);
      if (cells[pos.y]){
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
  var res = Checker.checkRightDots(cells, rightDots);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkBottomDots(cells, bottomDots);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkRightDots: function(cells, dots){
  var squares = ["16","25","36","49","64","81"];
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols - 1; x++) {
      var isSquare = squares.includes(cells[y][x] + cells[y][x+1]);
      if (isSquare && !dots[y][x]) {
        return {status: "The two digit number shouldn't be a perfect square", errors: [util.coord(x,y), util.coord(x+1,y)]};
      }
      if (!isSquare && dots[y][x]) {
        return {status: "The two digit number should be a perfect square", errors: [util.coord(x,y), util.coord(x+1,y)]};
      }
    }
  }
  return {status: "OK"};
},
checkBottomDots: function(cells, dots){
  var squares = ["16","25","36","49","64","81"];
  for (var y = 0; y < cells.rows - 1; y++) {
    for (var x = 0; x < cells.cols; x++) {
      var isSquare = squares.includes(cells[y][x] + cells[y+1][x]);
      if (isSquare && !dots[y][x]) {
        return {status: "The two digit number shouldn't be a perfect square", errors: [util.coord(x,y), util.coord(x,y+1)]};
      }
      if (!isSquare && dots[y][x]) {
        return {status: "The two digit number should be a perfect square", errors: [util.coord(x,y), util.coord(x,y+1)]};
      }
    }
  }
  return {status: "OK"};
}
};

module.exports = Checker;
