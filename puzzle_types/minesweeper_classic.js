const util = require('./util');

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, "")
  var cluecells = util.create2DArray(dim.rows, dim.cols, "")

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
    if (cluecells[pos.y]){
      cluecells[pos.y][pos.x] = value;
      cells[pos.y][pos.x] = "white";
    }
  }
  return Checker.checkMinesClues(cluecells, cells);
},

checkMinesClues: function(cluecells, cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cluecells[y][x]!=""){
        if (!Checker.checkMinesClue(cluecells[y][x], {x:x, y:y}, cells)) {
          return {status: "The clue is not correct" , errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},

checkMinesClue: function(clue, position, cells) {
  var neighbour = [{y:1,x:0}, {y:1,x:1}, {y:0,x:1}, {y:-1,x:1}, {y:-1,x:0}, {y:-1,x:-1}, {y:0,x:-1}, {y:1,x:-1}]
  var mineCount = 0;
  for (var i=0;i<8;i++) {
    var newX = position.x + neighbour[i].x;
    var newY = position.y + neighbour[i].y;
    var cell = null;
    if (newY >=0 && newY < cells.rows && newX >=0 && newX < cells.cols) {
      if (cells[newY][newX] == "mine") mineCount++;
    }
  }
  return (clue == mineCount.toString())
}
};

module.exports = Checker;
