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
      cells[pos.y][pos.x] = (value=="queen");
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    var pos = util.parseCoord(key);
    if (cluecells[pos.y]){
      cluecells[pos.y][pos.x] = value;
      cells[pos.y][pos.x] = false;
    }
  }
  return Checker.checkQueensClues(cluecells, cells);
},

checkQueensClues: function(cluecells, cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cluecells[y][x]!="" && cluecells[y][x]!="cross"){
        if (!Checker.checkQueensClue(cluecells[y][x], {x:x, y:y}, cells)) {
          return {status: "The clue is not correct" , errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},

checkQueensClue: function(clue, position, cells) {
  var directions = [{y:1,x:0}, {y:1,x:1}, {y:0,x:1}, {y:-1,x:1}, {y:-1,x:0}, {y:-1,x:-1}, {y:0,x:-1}, {y:1,x:-1}]
  var queenCount = 0;
  for (var i=0;i<8;i++) {
    var d = 1;
    var hasQueen = false;
    while (true) {
      var newX = position.x + directions[i].x * d;
      var newY = position.y + directions[i].y * d;
      if (newY >=0 && newY < cells.rows && newX >=0 && newX < cells.cols) {
        if (cells[newY][newX]) hasQueen = true;;
      } else {
        break;
      }
      d++;
    }
    if (hasQueen) {
      queenCount++;
    }
  }
  return (clue == queenCount.toString())
}
};

module.exports = Checker;
