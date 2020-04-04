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
  var res = Checker.checkNo2x2(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkConnected(cells);
  if (res.status != "OK") {
    return res;
  }
  return Checker.checkTapaClues(cluecells, cells);
},

checkNo2x2: function(cells, color) {
  var res = util.find2x2(cells, ["black"]);
  if (res){
    return {status: "No 2x2 black squares are allowed", errors: res};
  }
  return {status: "OK"};
},

checkConnected: function(cells) {
  if (!util.checkConnected(cells, "black")) {
    return {status: "Black area should be connected"};
  }
  return {status: "OK"};
},

checkTapaClues: function(cluecells, cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cluecells[y][x]!=""){
        if (!Checker.checkTapaClue(cluecells[y][x], {x:x, y:y}, cells)) {
          return {status: "The clue is not correct" , errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},

checkTapaClue: function(clue, position, cells) {
  var neighbour = [{y:1,x:0}, {y:1,x:1}, {y:0,x:1}, {y:-1,x:1}, {y:-1,x:0}, {y:-1,x:-1}, {y:0,x:-1}, {y:1,x:-1}]
  var painted = [];
  var paintedCount = -1;
  var prevCell = null;
  var firstCell = null;
  for (var i=0;i<8;i++) {
    var newX = position.x + neighbour[i].x;
    var newY = position.y + neighbour[i].y;
    var cell = null;
    if (newY >=0 && newY < cells.rows && newX >=0 && newX < cells.cols) {
      var cell = cells[newY][newX];
    }
    if (cell && !firstCell) {
      firstCell = cell;
    }
    if (cell == 'black') {
      if (prevCell == 'black') {
        painted[paintedCount]++;
      } else {
        paintedCount++;
        painted[paintedCount] = 1;
      }
    }
    prevCell = cell;
  }
  if (prevCell == 'black' && firstCell == 'black') {
    painted[0]+=painted[paintedCount];
    painted.pop();
  }
  painted.sort();
  return (clue == painted.join("_"))
}
};

module.exports = Checker;
