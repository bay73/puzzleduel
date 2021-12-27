if (typeof util=="undefined") {
  var util = require('./util');
}

const Checker = {
check:function(dimension, clues, data){
  // Create array
  var dim = util.parseDimension(dimension);
  var boats = util.create2DArray(dim.rows, dim.cols, false)
  var cluecells = util.create2DArray(dim.rows, dim.cols, "")

  // Parse data.
  for (var [key, value] of Object.entries(data)) {
    var pos = util.parseCoord(key);
    if (boats[pos.y]){
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
      }
    }
  }
  var res = Checker.checkTouch(boats, cluecells);
  if (res.status != "OK") {
    return res;
  }
  var res = Checker.checkClues(cluecells, boats);
  if (res.status != "OK") {
    return res;
  }
  return {status: "OK"};
},

checkTouch: function(boats, cluecells) {
  for (var y = 0; y < boats.rows; y++) {
    for (var x = 0; x < boats.cols; x++) {
      if (boats[y][x]) {
        var touch = Checker.getTouch(boats, cluecells, x, y);
        if (touch!=null) {
          return {status: "Cells with boats shouldn't touch each other and lighthouses", errors: [touch, util.coord(x,y)]}
        }
      }
    }
  }
  return {status: "OK"};
},
getTouch: function(boats, cluecells, x, y) {
  var neighbour = [{x:-1, y:-1}, {x:0, y:-1}, {x:1, y:-1}, {x:1, y:0}, {x:1, y:1}, {x:0, y:1}, {x:-1, y:1}, {x:-1, y:0}];
  for (var i=0; i<8; i++) {
    if (x+neighbour[i].x >= 0 && x+neighbour[i].x < boats.cols && y+neighbour[i].y >= 0 && y+neighbour[i].y < boats.rows) {
      if (boats[y+neighbour[i].y][x+neighbour[i].x] || cluecells[y+neighbour[i].y][x+neighbour[i].x]!="") {
        return util.coord(x+neighbour[i].x, y+neighbour[i].y);
      }
    }
  }
  return null;
},
checkClues: function(cluecells, boats) {
  for (var y = 0; y < boats.rows; y++) {
    for (var x = 0; x < boats.cols; x++) {
      if (cluecells[y][x]!="" && cluecells[y][x]!="cross"){
        if (!Checker.checkClue(cluecells[y][x], {x:x, y:y}, boats)) {
          return {status: "The clue is not correct" , errors: [util.coord(x,y)]};
        }
      }
    }
  }
  return {status: "OK"};
},

checkClue: function(clue, position, boats) {
  var boatCount = 0;
  for (var y = 0; y < boats.rows; y++) {
    if (y!=position.y && boats[y][position.x]) boatCount++;
  }
  for (var x = 0; x < boats.cols; x++) {
    if (x!=position.x && boats[position.y][x]) boatCount++;
  }
  return (clue == boatCount.toString())
}
};

module.exports = Checker;
