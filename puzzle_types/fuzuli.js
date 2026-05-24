if (typeof util=="undefined") {
  var util = require('./util');
}

var Checker = {
check:function(dimension, clues, data){
  // Create array
  var part = dimension.split("-");
  var dim = util.parseDimension(part[0]);
  if (part[1]) {
    var maxValue = parseInt(part[1]);
  } else {
    var maxValue = parseInt(dim.rows) - 2
  }
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
  var res = Checker.checkNo2x2(cells, colors);
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

checkNo2x2: function(cells, colors) {
  var res = util.find2x2(cells, colors);
  if (res){
    return {status: "No 2x2 squares fully occupied with digits are allowed", errors: res};
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
}
};

module.exports = Checker;
