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
  res = Checker.checkNo2x2(cells);
  if (res.status != "OK") {
    return res;
  }
  return Checker.checkCanalClues(cluecells, cells);
},

checkConnected: function(cells) {
  if (!util.checkConnected(cells, [true])) {
    return {status: "Black area should be connected"};
  }
  return {status: "OK"};
},

checkNo2x2: function(cells, color) {
  var res = util.find2x2(cells, [true]);
  if (res){
    return {status: "No 2x2 black squares are allowed", errors: res};
  }
  return {status: "OK"};
},

checkCanalClues: function(cluecells, cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cluecells[y][x]!=""){
        if (!Checker.checkCanalClue(cluecells[y][x], {x:x, y:y}, cells)) {
          return {status: "The clue is not correct" , errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},

checkCanalClue: function(clue, position, cells) {
  var directions = [{y:1,x:0}, {y:0,x:1}, {y:-1,x:0}, {y:0,x:-1}]
  var count = 0;
  for (var d=0;d<directions.length;d++) {
    count = count + Checker.countDirection(position, cells, directions[d]);
  }
  return (clue == count.toString())
},
countDirection: function(start, cells, direction) {
  var prev = start;
  var count = 0;
  for(;;) {
    next = {x:prev.x + direction.x, y:prev.y + direction.y};
    if (next.x < 0 || next.x >= cells.cols || next.y < 0 || next.y >= cells.rows) {
      return count;
    }
    if (!cells[next.y][next.x]) {
      return count;
    }
    count++;
    prev = next;
  }
}
};

module.exports = Checker;
