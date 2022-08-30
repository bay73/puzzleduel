if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
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
  var res = Checker.checkConnected(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkBlackConnectedToEdge(cells);
  if (res.status != "OK") {
    return res;
  }
  return Checker.checkCaveClues(cluecells, cells);
},

checkConnected: function(cells) {
  if (!util.checkConnected(cells, [false])) {
    return {status: "White area should be connected"};
  }
  return {status: "OK"};
},

checkBlackConnectedToEdge: function(cells) {
  var filled = util.create2DArray(cells.rows, cells.cols, false)
  for (var i=0; i<cells.cols; i++) {
    util.fillConnected(cells, {x:i, y:0}, [true], filled);
    util.fillConnected(cells, {x:i, y:cells.rows - 1}, [true], filled);
  }
  for (var j=0; j<cells.rows; j++) {
    util.fillConnected(cells, {x:0, y:j}, [true], filled);
    util.fillConnected(cells, {x:cells.cols - 1, y:j}, [true], filled);
  }
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cells[y][x] && !filled[y][x]){
        return {status: "All black cells should be connected to the edge of the grid", errors: [util.coord(x, y)]};
      };
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
  var paintedCount = -1;
  var prevCell = null;
  var firstCell = null;
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
}
};

module.exports = Checker;
