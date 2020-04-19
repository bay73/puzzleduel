const util = require('./util');

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false)
  var cluesCells = util.create2DArray(dim.rows, dim.cols, "")

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = (value=="bulb");
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    var pos = util.parseCoord(key);
    if (cluesCells[pos.y]){
      cluesCells[pos.y][pos.x] = value;
      cells[pos.y][pos.x] = false;
    }
  }
  res = Checker.illuminate(cluesCells, cells);
  if (res.status != "OK") {
    return res;
  }
  res = Checker.checkAllIlluminated(cluesCells, res.illuminated);
  if (res.status != "OK") {
    return res;
  }
  res = Checker.checkAkariClues(cluesCells, cells);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkAkariClues: function(clues, cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (clues[y][x] && clues[y][x]!="white" && clues[y][x]!="black"){
        if (!Checker.checkAkariClue(clues[y][x], {x:x, y:y}, cells)) {
          return {status: "The clue is not correct" , errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},

checkAkariClue: function(clue, position, cells) {
  var neighbour = [{y:1,x:0}, {y:0,x:1}, {y:-1,x:0}, {y:0,x:-1}]
  var bulbCount = 0;
  for (var i=0;i<neighbour.length;i++) {
    var newX = position.x + neighbour[i].x;
    var newY = position.y + neighbour[i].y;
    if (newY >=0 && newY < cells.rows && newX >=0 && newX < cells.cols) {
      if (cells[newY][newX]) bulbCount++;
    }
  }
  return (clue.substring(0,1) == bulbCount.toString())
},

illuminate: function(clues, cells) {
  var directions = [{x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1}]
  var illuminated = util.create2DArray(cells.rows, cells.cols, false);
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cells[y][x]){
        for (var d=0;d<directions.length;d++) {
          res = Checker.illuminateDirection(clues, cells, {x:x, y:y}, directions[d],illuminated);
          if (res.status != "OK") {
            return res;
          }
        }
      }
    }
  }
  return {status: "OK", illuminated: illuminated};
},

illuminateDirection: function(clues, cells, start, direction, illuminated) {
  illuminated[start.y][start.x] = true;
  var prev = start;
  for(;;) {
    next = {x:prev.x + direction.x, y:prev.y + direction.y};
    if (next.x < 0 || next.x >= cells.cols || next.y < 0 || next.y >= cells.rows) {
      return {status: "OK"};
    }
    if (clues[next.y][next.x] && clues[next.y][next.x] != "white") {
      return {status: "OK"};
    }
    if (cells[next.y][next.x]) {
      return {status: "Bulbs shouldn't illuminate each other", errors: [util.coord(start.x,start.y), util.coord(next.x,next.y)]};
    }
    illuminated[next.y][next.x] = true;
    prev = next;
  }
},

checkAllIlluminated: function(clues, illuminated) {
  for (var y = 0; y < clues.rows; y++) {
    for (var x = 0; x < clues.cols; x++) {
      if (!clues[y][x] || clues[y][x]=="white"){
        if (!illuminated[y][x]) {
          return {status: "All white cells should be illuminated" , errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
}
};

module.exports = Checker;
