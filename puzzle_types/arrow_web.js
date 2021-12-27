if (typeof util=="undefined") {
  var util = require('./util');
}

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
      cells[pos.y][pos.x]= (value == "1");
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    var pos = util.parseCoord(key);
    if (cluesCells[pos.y]){
      cluesCells[pos.y][pos.x] = value;
    }
  }
  var res = Checker.checkArrows(cluesCells, cells);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkArrows: function(clues, cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (clues[y][x] && clues[y][x]!="white"){
        if (!Checker.checkArrow(clues[y][x], {x:x, y:y}, cells)) {
          return {status: "The arrow should point to exactly one black cell" , errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},
checkArrow: function(clue, position, cells) {
  var directions = {
    "arrow_u": {y:-1,x:0},
    "arrow_ur": {y:-1,x:1},
    "arrow_r": {y:0,x:1},
    "arrow_dr": {y:1,x:1},
    "arrow_d": {y:1,x:0},
    "arrow_dl": {y:1,x:-1},
    "arrow_l": {y:0,x:-1},
    "arrow_ul": {y:-1,x:-1},
  }
  var blackCount = 0;
  var direction = directions[clue];
  for (var i=1;i<Math.max(cells.rows, cells.cols);i++) {
    var newX = position.x + direction.x * i;
    var newY = position.y + direction.y * i;
    if (newY >=0 && newY < cells.rows && newX >=0 && newX < cells.cols) {
      if (cells[newY][newX]) blackCount++;
    }
  }
  return (blackCount==1)
},
};

module.exports = Checker;
