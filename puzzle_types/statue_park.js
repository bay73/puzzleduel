if (typeof util=="undefined") {
  var util = require('./util');
}
if (typeof pentomino_util=="undefined") {
  var pentomino_util = require('./pentomino_util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var part = dimension.split("-");
  var requiredLetters = part[1];
  if (requiredLetters=="pento12") {
    requiredLetters = "FILNPTUVWXYZ"
  }
  var dim = util.parseDimension(part[0]);
  var cells = util.create2DArray(dim.rows, dim.cols, false)

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = (value == "1");
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    var pos = util.parseCoord(key);
    if (value=="black_circle"){
      cells[pos.y][pos.x] = true;
    }
    if (value=="white_circle"){
      cells[pos.y][pos.x] = false;
    }
  }
  var res = pentomino_util.checkPento(cells, requiredLetters);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkConnected(cells);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},
checkConnected: function(cells) {
  if (!util.checkConnected(cells, [false])) {
    return {status: "White area should be connected"};
  }
  return {status: "OK"};
},
};

module.exports = Checker;
