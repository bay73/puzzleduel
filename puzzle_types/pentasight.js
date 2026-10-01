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
  var cluecells = util.create2DArray(dim.rows, dim.cols, "")

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = (value == "black");
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    var pos = util.parseCoord(key);
    if (cluecells[pos.y]){
      if (value=="cross") {
        cells[pos.y][pos.x] = false;
      } else if (value=="black") {
        cells[pos.y][pos.x] = true;
      } else {
        cluecells[pos.y][pos.x] = value;
        cells[pos.y][pos.x] = false;
      }
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
  res = Checker.checkCaveClues(cluecells, cells);
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
checkCaveClues: function(cluecells, cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cluecells[y][x]!=""){
        if (!Checker.checkCaveClue(cluecells[y][x], {x:x, y:y}, cells)) {
          return {status: "The clue is not correct" , errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},

checkCaveClue: function(clue, position, cells) {
  var directions = [{y:1,x:0}, {y:0,x:1}, {y:-1,x:0}, {y:0,x:-1}]
  var count = 0;
  for (var d=0;d<directions.length;d++) {
    count = count + Checker.countDirection(position, cells, directions[d]);
  }
  return (clue == (count+1).toString())
},
countDirection: function(start, cells, direction) {
  var prev = start;
  var count = 0;
  for(;;) {
    next = {x:prev.x + direction.x, y:prev.y + direction.y};
    if (next.x < 0 || next.x >= cells.cols || next.y < 0 || next.y >= cells.rows) {
      return count;
    }
    if (cells[next.y][next.x]) {
      return count;
    }
    count++;
    prev = next;
  }
},
};

module.exports = Checker;
