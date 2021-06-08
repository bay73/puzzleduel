const util = require('./util');

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var part = dimension.split("-");
  var maxValue = parseInt(part[1]);
  var dim = util.parseDimension(part[0]);
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
  var colors = [];
  for (var i=1;i<=maxValue;i++) {
    colors.push(i.toString());
  }
  var res = Checker.checkNoBottomHeavy(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkColumnMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkRowMagic(cells, colors);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkNoBottomHeavy: function(cells, colors) {
  var res = Checker.findBottomHeavy(cells, colors);
  if (res){
    return {status: "Bigger number can't be in the below adjacent cell", errors: res};
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
findBottomHeavy: function(cells, colors) {
  for (var y = 0; y < cells.rows - 1; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (colors.includes(cells[y][x]) && colors.includes(cells[y+1][x])){
        if (parseInt(cells[y][x]) < parseInt(cells[y+1][x])) {
          return [util.coord(x,y), util.coord(x,y+1)];
        }
      }
    }
  }
  return null;
},
};

module.exports = Checker;
