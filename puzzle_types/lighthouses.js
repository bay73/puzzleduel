const util = require('./util');

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, false)
  var boats = util.create2DArray(dim.rows, dim.cols, false)
  var cluecells = util.create2DArray(dim.rows, dim.cols, "")

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (cells[pos.y]){
      cells[pos.y][pos.x] = (value=="boat");
      boats[pos.y][pos.x] = (value=="boat");
    }
  }
  // Parse clues.
  for (var [key, value] of Object.entries(clues)) {
    var pos = util.parseCoord(key);
    if (cluecells[pos.y]){
      boats[pos.y][pos.x] = false;
      if (value != "cross") {
        cluecells[pos.y][pos.x] = value;
        cells[pos.y][pos.x] = true;
      } else {
        cells[pos.y][pos.x] = false;
      }
    }
  }
  var res = Checker.checkTouch(cells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkClues(cluecells, boats);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkTouch: function(cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cells[y][x]) {
        var touch = null;
        if(y>0 && cells[y-1][x]) touch = util.coord(x,y-1);
        if(x>0 && cells[y][x-1]) touch = util.coord(x-1,y);
        if(y>0 && x>0 && cells[y-1][x-1]) touch = util.coord(x-1,y-1);
        if(y>0 && x<cells.cols-1 && cells[y-1][x+1]) touch = util.coord(x+1,y-1);
        if(y<cells.rows-1 && x>0 && cells[y+1][x-1]) touch = util.coord(x-1,y+1);
      }
      if (touch!=null) {
        return {status: "Cells with boats shouldn't touch each other and lighthouses", errors: [touch, util.coord(x,y)]}
      }
    }
  }
  return {status: "OK"};
},
checkClues: function(cluecells, cells) {
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cluecells[y][x]!="" && cluecells[y][x]!="cross"){
        if (!Checker.checkClue(cluecells[y][x], {x:x, y:y}, cells)) {
          return {status: "The clue is not correct" , errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},

checkClue: function(clue, position, cells) {
  var boatCount = 0;
  for (var y = 0; y < cells.rows; y++) {
    if (y!=position.y && cells[y][position.x]) boatCount++;
  }
  for (var x = 0; x < cells.cols; x++) {
    if (x!=position.x && cells[position.y][x]) boatCount++;
  }
  return (clue == boatCount.toString())
}
};

module.exports = Checker;
