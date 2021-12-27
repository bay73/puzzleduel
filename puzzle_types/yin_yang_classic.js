if (typeof util=="undefined") {
  var util = require('./util');
}

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
  var res = Checker.checkNoEmptyCells(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkNo2x2(cells, ["white_circle"]);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkNo2x2(cells, ["black_circle"]);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkConnected(cells, "white_circle");
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkConnected(cells, "black_circle");
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkNo2x2: function(cells, color) {
  var res = util.find2x2(cells, color);
  if (res){
    return {status: "No 2x2 squares are allowed", errors: res};
  }
  return {status: "OK"};
},

checkNoEmptyCells: function(cells) {
  var coord = util.findWrongValue(cells, ["white_circle", "black_circle"]);
  if (coord){
    return {
      status: "All cells should be filled",
      errors: [coord]
    };
  }
  return {status: "OK"};
},

checkConnected: function(cells, color) {
  if (!util.checkConnected(cells, color)) {
    return {status: "Area of one color should be connected"};
  }
  return {status: "OK"};
}
};

module.exports = Checker;
