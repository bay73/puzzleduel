if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var cells = util.create2DArray(dim.rows, dim.cols, "white")
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
  return Checker.checkNurikabeClues(cluecells, cells);
},

checkNo2x2: function(cells, color) {
  var res = util.find2x2(cells, ["black"]);
  if (res){
    return {status: "No 2x2 black squares are allowed", errors: res};
  }
  return {status: "OK"};
},

checkConnected: function(cells) {
  if (!util.checkConnected(cells, ["black"])) {
    return {status: "Black area should be connected"};
  }
  return {status: "OK"};
},

checkNurikabeClues: function(cluecells, cells) {
  var filled = util.create2DArray(cells.rows, cells.cols, false)
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (cluecells[y][x] != ""){
        if (!Checker.checkNurikabeClue(cluecells[y][x], {x:x, y:y}, cells)) {
          return {status: "The clue is not correct" , errors: [util.coord(x,y)]};
        }
        if (!Checker.checkSingleClue(cluecells[y][x], {x:x, y:y}, cluecells, cells)) {
          return {status: "Each island should contain single" , errors: [util.coord(x,y)]};
        }
        Checker.fillIslind(filled, {x:x, y:y}, cells);
      }
    }
  }
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (!filled[y][x] && ["white", "cross"].includes(cells[y][x])){
        return {status: "All white cells should be connected to numbers" , errors: [util.coord(x,y)]};
      }
    }
  }
  return {status: "OK"};
},

checkNurikabeClue: function(clue, position, cells) {
  var connected = util.findConnected(cells, position, ["white", "cross"]);
  var connectedCount = 0;
  var clueCount = 0;
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (connected[y][x]){
        connectedCount++;
      }
    }
  }
  return connectedCount.toString() == clue;
},

checkSingleClue: function(clue, position, cluecells, cells) {
  var connected = util.findConnected(cells, position, ["white", "cross"]);
  var connectedCount = 0;
  var clueCount = 0;
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (connected[y][x]){
        connectedCount++;
        if (cluecells[y][x] != ""){
          clueCount++;
        }
      }
    }
  }
  return clueCount == 1;
},

fillIslind: function(filled, position, cells) {
  var connected = util.findConnected(cells, position, ["white", "cross"]);
  for (var y = 0; y < cells.rows; y++) {
    for (var x = 0; x < cells.cols; x++) {
      if (connected[y][x]){
        filled[y][x]=true;
      }
    }
  }
}
};

module.exports = Checker;
