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
    if (key=="nodes") {
      for (const [nkey, nvalue] of Object.entries(value)) {
        var part = nkey.split("-");
        var coord = util.parseCoord(part[0]);
        if (typeof part[1]!="undefined") {
          var side = parseInt(part[1]);
          if (side==0) {
            coord.y--;
            coord.x--;
          } else if (side==1) {
            coord.y--;
          } else if (side==3) {
            coord.x--;
          }
        }
        clue[coord.y][coord.x] = (nvalue==1);
      }
    } else {
      var pos = util.parseCoord(key);
      if (value=="cross"){
        cells[pos.y][pos.x] = false;
      }
    }
  }
  var res = pentomino_util.checkPento(cells, requiredLetters);
  if (res.status != "OK") {
    return res;
  }
  res = Checker.checkClues(cells, clue);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkClues: function(cells, clue) {
  for (var x = 0; x < clue.cols-1; x++) {
    for (var y = 0; y < clue.rows-1; y++) {
      var isBattenberg = cells[y][x] == cells[y+1][x+1] && cells[y][x+1] == cells[y+1][x] && cells[y][x] != cells[y][x+1];
      if (isBattenberg && !clue[y][x]) {
        return {status: "Elements should touch at marked nodes",
                errors: [util.coord(x,y), util.coord(x+1,y), util.coord(x,y+1), util.coord(x+1,y+1)]};
      }
      if (!isBattenberg && clue[y][x]) {
        return {status: "Elements should touch at marked nodes",
                errors: [util.coord(x,y), util.coord(x+1,y), util.coord(x,y+1), util.coord(x+1,y+1)]};
      }
    }
  }
  return {status: "OK"};
},
};

module.exports = Checker;
