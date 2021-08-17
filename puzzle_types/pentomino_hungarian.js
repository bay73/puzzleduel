const util = require('./util');
const pentomino_util = require('./pentomino_util');

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
  var clue = util.create2DArray(dim.rows, dim.cols, false)

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
    if (value=="1"){
      cells[pos.y][pos.x] = true;
      clue[pos.y][pos.x] = true;
    }
  }
  var res = pentomino_util.checkPento(cells, requiredLetters);
  if (res.status != "OK") {
    return res;
  }
  res = Checker.checkNoTouch(cells);
  if (res.status != "OK") {
    return res;
  }
  res = Checker.checkClues(cells, clue);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkNoTouch: function(cells) {
  for (var x = 0; x < cells.cols-1; x++) {
    for (var y = 0; y < cells.rows-1; y++) {
      if (cells[y][x] && cells[y+1][x+1] && !cells[y][x+1]  && !cells[y+1][x]) {
        return {status: "Elements shouldn't touch", errors: [util.coord(x,y), util.coord(x+1,y+1)]};
      }
      if (!cells[y][x] && !cells[y+1][x+1] && cells[y][x+1]  && cells[y+1][x]) {
        return {status: "Elements shouldn't touch", errors: [util.coord(x+1,y), util.coord(x,y+1)]};
      }
    }
  }
  return {status: "OK"};
},
checkClues: function(cells, clue) {
  cellCount = 0;
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cells[y][x]) {
        cellCount++;
        if (cellCount%3==0 && !clue[y][x] || cellCount%3!=0 && clue[y][x]) {
          return {status: "Each third cell used by pentomino should be marked", errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},
};

module.exports = Checker;
